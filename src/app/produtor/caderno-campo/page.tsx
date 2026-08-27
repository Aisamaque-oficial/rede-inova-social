"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Sprout, Bug, CloudRain, NotebookPen, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { infraestruturaService, InfraUnidadeProdutiva, InfraRegistroProducao } from '@/lib/infraestrutura-service';

// Para fins de teste e piloto, usamos o ID do produtor de Caatiba inserido no Seed
const PERFIL_CAATIBA_ID = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

export default function CadernoCampoPage() {
  const router = useRouter();

  const [unidadesProdutivas, setUnidadesProdutivas] = useState<InfraUnidadeProdutiva[]>([]);
  const [registrosProducao, setRegistrosProducao] = useState<InfraRegistroProducao[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const unidades = await infraestruturaService.getUnidadesProdutivas(PERFIL_CAATIBA_ID);
      const registros = await infraestruturaService.getRegistrosProducao(PERFIL_CAATIBA_ID);
      setUnidadesProdutivas(unidades);
      setRegistrosProducao(registros);
    } catch (error) {
      console.error("Erro ao carregar caderno de campo", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleNovaUnidade = async () => {
    const nome = window.prompt("Qual o nome da nova Unidade Produtiva? (Ex: Horta de Fundo de Quintal)");
    if (nome) {
      const tamanhoStr = window.prompt("Qual o tamanho estimado em hectares? (Ex: 1.5, deixe em branco se não souber)");
      const tamanho = tamanhoStr ? parseFloat(tamanhoStr) : undefined;
      
      const nova = await infraestruturaService.addUnidadeProdutiva({
        perfil_id: PERFIL_CAATIBA_ID,
        nome,
        tamanho_hectares: tamanho
      });

      if (nova) {
        alert("Unidade produtiva cadastrada com sucesso!");
        carregarDados(); // Recarrega os dados do banco
      } else {
        alert("Erro ao cadastrar unidade produtiva.");
      }
    }
  };

  const handleRegistrarManejo = () => {
    alert("Aqui abrirá o formulário detalhado do Caderno de Campo.\n\nNa versão final, você poderá registrar:\n- Uso de Insumos\n- Podas/Adubação\n- Relatórios Fotográficos para a ATER.");
  };

  const handleRegistrarPerda = (id: string) => {
    const motivo = window.prompt("Qual foi o motivo da perda na produção? (Ex: Praga, Seca, Problema na máquina)");
    if (motivo) {
      // Aqui faríamos um UPDATE no supabase para status = 'perdido' e observacoes = motivo
      // Para o teste rápido da UI:
      setRegistrosProducao(prev => prev.map(r => r.id === id ? { ...r, status: 'perdido', observacoes: motivo } : r));
      alert("Perda registrada com sucesso. A Secretaria de Agricultura e a ATER serão notificadas.");
    }
  };

  const handleTransformarLote = (id: string) => {
    const quantidade = window.prompt("Qual quantidade você quer disponibilizar na Vitrine Pública para venda?");
    if (quantidade) {
      // Futuro: UPDATE no supabase
      setRegistrosProducao(prev => prev.map(r => r.id === id ? { ...r, status: 'colhido' } : r));
      alert(`Lote de ${quantidade} gerado com sucesso! Redirecionando para a Vitrine...`);
      router.push('/produtor/ofertas');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">Caderno de Campo</h1>
          <p className="text-slate-500 font-medium mt-1">Gestão da produção, unidades e anotações fitossanitárias.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl" onClick={handleNovaUnidade} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
          </Button>
          <Button variant="outline" className="rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={handleRegistrarManejo} disabled={loading}>
            <NotebookPen className="w-4 h-4 mr-2" />
            Registrar Manejo
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Em Andamento</p>
            <p className="text-2xl font-black text-slate-800">{registrosProducao.filter(r => r.status === 'em_andamento').length} Culturas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clima (Local)</p>
            <p className="text-2xl font-black text-slate-800">Normal</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Alertas Fitossanitários</p>
            <p className="text-2xl font-black text-slate-800">0 Ativos</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-slate-500 font-medium">Sincronizando com o banco de dados...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Registros de Produção */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">O que você está produzindo</h2>
            
            <div className="space-y-4">
              {registrosProducao.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                  <p className="text-slate-500">Nenhum registro de produção ativo.</p>
                </div>
              ) : registrosProducao.map(reg => (
                <div key={reg.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-600">{reg.produto_base?.nome || 'Produto Desconhecido'}</h3>
                      <div className="flex items-center text-sm font-bold text-slate-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                        {reg.unidade_produtiva?.nome || 'Unidade Desconhecida'}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${reg.status === 'em_andamento' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {reg.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mt-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Início/Plantio</p>
                      <p className="text-sm font-black text-slate-700">{reg.data_inicio_ciclo ? new Date(reg.data_inicio_ciclo).toLocaleDateString('pt-BR') : 'Não inf.'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prev. Colheita</p>
                      <p className="text-sm font-black text-slate-700">{reg.data_prevista_colheita ? new Date(reg.data_prevista_colheita).toLocaleDateString('pt-BR') : 'Não inf.'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimativa</p>
                      <p className="text-sm font-black text-slate-700">{reg.quantidade_estimada} {reg.unidade_medida}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                     <Button variant="outline" size="sm" className="rounded-xl text-xs flex-1" onClick={() => handleRegistrarPerda(reg.id)}>Registrar Perda</Button>
                     <Button size="sm" className="rounded-xl text-xs bg-emerald-500 hover:bg-emerald-600 text-white flex-1 shadow-sm" onClick={() => handleTransformarLote(reg.id)}>Transformar em Lote (Vitrine)</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Unidades Produtivas */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Unidades Produtivas</h2>
            
            <div className="space-y-4">
              {unidadesProdutivas.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-500">
                  Nenhuma unidade produtiva.
                </div>
              ) : unidadesProdutivas.map(un => (
                <div key={un.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{un.nome}</h4>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Tamanho: <span className="font-bold text-slate-700">{un.tamanho_hectares ? `${un.tamanho_hectares} hectares` : 'Não informado'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
