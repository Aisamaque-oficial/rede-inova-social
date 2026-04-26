import { dataService } from './src/lib/data-service';
import { projectTasks, teamMembers, UserRole } from './src/lib/mock-data';

// Removed jest mock

// Mock localStorage para o ambiente do dataService
global.localStorage = {
  getItem: (key: string) => {
    if (key === 'user_role') return 'coordinator'; // Admin
    if (key === 'dev_bypass') return 'true';
    if (key === 'current_user_id') return '1'; // Aisamaque (Coordenador)
    return null;
  },
  setItem: () => {},
} as any;

// Mock window
(global as any).window = {};

// Mock toast para evitar erro se ele não estiver mockado via config
(global as any).toast = () => {};
dataService.runAccessibilityStressTest = async function(batchSize: number = 15): Promise<void> {
    const stressBatch = Array.from({ length: batchSize }).map((_, i) => {
      const isOverdue = i % 2 === 0;
      const hoursOffset = isOverdue ? -(24 + (i * 2)) : (24 + (i * 2));
      const deadline = new Date(Date.now() + 1000 * 60 * 60 * hoursOffset).toISOString();

      return {
        id: `stress-${Date.now()}-${i}`,
        publicId: `ACESS-STRESS-${i}`,
        title: `Carga de Estresse: Demanda ${isOverdue ? 'Atrasada' : 'Normal'} ${i+1}`,
        description: 'Tarefa injetada sob carga para validação.',
        deadline,
        priority: isOverdue ? 'urgente' : (i % 3 === 0 ? 'alta' : 'media'),
        statusId: isOverdue ? 'st-atrasada' : 'st-andamento',
        status: isOverdue ? 'atrasada' : 'em_andamento',
        typeId: 'tt-atividade',
        sectorId: 'sec-acess',
        sector: 'ACESSIBILIDADE',
        originSectorId: 'sec-ascom',
        impactsPublication: true,
        slaCategory: isOverdue ? 'critico' : 'simples',
        assignedToId: '',
        assignedToName: 'Aguardando Membro',
        category: 'geral',
        visibility: 'Interno',
        approvalStatus: 'pendente',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        workflowStage: 'producao',
        waitingTimeStartedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        history: [{
          timestamp: new Date().toISOString(),
          userId: 'sistema',
          userName: 'PMA Audit',
          action: isOverdue ? 'ALERTA DE SOBRECARGA' : 'TAREFA REGISTRADA',
          status: isOverdue ? 'atrasada' : 'em_andamento',
          comment: "Inserção via teste de estresse de carga. " + (isOverdue ? "SLA rompido." : "")
        }]
      };
    });

    (projectTasks as any[]).push(...stressBatch);
};

async function runValidations() {
  console.log("=== BATERIA DE VALIDAÇÃO: GOVERNANÇA E RESILIÊNCIA ===");

  console.log("\n[1] TESTE DE PERMISSÕES: REABERTURA DE TAREFAS");
  let task = projectTasks.find(t => t.id === 't-ascom-003'); // Concluída
  if (!task) throw new Error("Tarefa t-ascom-003 não encontrada no mock initial.");
  
  console.log(`Tarefa selecionada: ${task.title} (Status atual: ${task.status})`);
  
  // Tentativa com membro sem permissão
  console.log("-> Tentando reabrir com perfil não-coordenador (Viewer)...");
  global.localStorage.getItem = (key) => {
    if (key === 'user_role') return 'viewer';
    if (key === 'current_user_id') return '15'; 
    if (key === 'dev_bypass') return 'true';
    return null;
  };
  
  try {
    await dataService.reopenTask(task.id, "Justificativa válida.", "em_revisao");
    console.log("FALHOU: Perfil sem permissão conseguiu reabrir a tarefa.");
  } catch (error: any) {
    console.log("SUCESSO (Bloqueio sistêmico): " + error.message);
  }

  // Tentativa sem justificativa
  console.log("-> Tentando reabrir sem justificativa suficiente (Perfil Coordenador)...");
  global.localStorage.getItem = (key) => {
    if (key === 'user_role') return 'coordinator';
    if (key === 'current_user_id') return '1';
    if (key === 'dev_bypass') return 'true';
    return null;
  };

  try {
    await dataService.reopenTask(task.id, "PMA", "em_revisao");
    console.log("FALHOU: Aceitou justificativa menor que 10 caracteres.");
  } catch (error: any) {
    console.log("SUCESSO (Bloqueio sistêmico): " + error.message);
  }

  // Reabertura Correta
  console.log("-> Reabrindo corretamente como Coordenação para 'em_revisao'...");
  await dataService.reopenTask(task.id, "Analise de evidências solicitada internamente PMA.", "em_revisao");
  console.log(`Resultado: Novo status da tarefa é '${task.status}' e approvalStatus: '${task.approvalStatus}'`);
  
  console.log("\n[2] TESTE DE INTEGRIDADE DA TRILHA DE AUDITORIA");
  task.status = 'concluida'; // Simulando fechamento manual para testar 2a reabertura
  console.log("-> Tarefa fechada novamente. Simulando 2ª reabertura apontando para 'em_andamento'...");
  await dataService.reopenTask(task.id, "Segunda reabertura solicitada por falta de revisão de arte final.", "em_andamento");
  
  console.log("-> Verificando Histórico Gravado na Tarefa:");
  task.history?.forEach((h: any, i: number) => {
    if (h.action === 'REABERTURA DE TAREFA') {
      console.log(`  [Registro ${i+1}] Ação: ${h.action} | Status Alvo: ${h.status} | Autor: ${h.userName}`);
      console.log(`      Comentário Exato: ${h.comment}`);
    }
  });

  console.log("\n[3] TESTE DE RESILIÊNCIA E ESTRESSE DA FILA");
  console.log("-> Disparando carga inicial moderada (5 tarefas)...");
  let startTasks = projectTasks.length;
  await dataService.runAccessibilityStressTest(5);
  console.log(`Tarefas geradas no 1º lote. Salto na fila: +${projectTasks.length - startTasks} itens`);
  
  console.log("-> Disparando carga de pico (50 tarefas) para testar estouro de SLA...");
  startTasks = projectTasks.length;
  await dataService.runAccessibilityStressTest(50);
  console.log(`Tarefas geradas no 2º lote. Salto na fila: +${projectTasks.length - startTasks} itens`);
  
  const mockAtrasadas = projectTasks.filter(t => t.status === 'atrasada' && t.publicId?.includes('ACESS-STRESS'));
  console.log(`-> Deste total gerado por estresse, ${mockAtrasadas.length} foram corrompidas com SLA vencido.`);
  
  console.log("-> Verificando impacto no Briefing Institucional (Monitor de Alertas):");
  const briefing = dataService.getExecutiveBriefing();
  console.log(`Total de Pendências no Sistema: ${briefing.totalTasks}`);
  console.log(`Atrasos Críticos (Todas naturezas): ${briefing.totalOverdue}`);
  
  const riskSectors = briefing.sectorHealth.filter(s => s.status === 'crítico' || s.status === 'alerta');
  console.log("Sinalização de Risco por Setor:");
  riskSectors.forEach(s => {
    console.log(`  - Setor: ${s.sigla} | Status Operacional: [${s.status.toUpperCase()}] | Gargalos Críticos: ${s.overdueCount}`);
  });

  if (briefing.recentBottlenecks.length > 0) {
    console.log("\nIntervenções Estratégicas Solicitadas pelo Algoritmo do PMA:");
    briefing.recentBottlenecks.forEach(b => {
      console.log(`  [ALERTA AUTOMÁTICO] ${b.reason} (Grau de Severidade: ${b.severity})`);
    });
  }

  console.log("\n=== FIM DA BATERIA DE TESTES GERAIS ===");
}

runValidations().catch(console.error);
