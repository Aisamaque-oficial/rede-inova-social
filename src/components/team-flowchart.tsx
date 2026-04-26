
"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

import { getTeamMembers, type User } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CustomNode = ({ data }: NodeProps<{ label: string | string[], subLabel?: string }>) => {
    const labels = Array.isArray(data.label) ? data.label : [data.label];
    return (
        <div className="flex flex-col items-center gap-1 rounded-lg border bg-card p-3 shadow-sm w-64 hover:shadow-md transition-shadow text-center">
             {labels.map((label, index) => (
                <p key={index} className="font-bold text-card-foreground">{label}</p>
             ))}
            {data.subLabel && <p className="text-sm text-muted-foreground">{data.subLabel}</p>}
        </div>
    );
};


const TeamMemberNode = ({ data }: NodeProps<{ user: User }>) => {
  const { user } = data;
  const avatar = PlaceHolderImages.find(img => img.id === user.avatarId);
  const initials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3 shadow-sm w-64 hover:shadow-md transition-shadow text-center">
      <Avatar>
        {avatar && <AvatarImage src={avatar.imageUrl} alt={user.name} data-ai-hint={avatar.imageHint || 'person portrait'} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-bold text-card-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.role}</p>
      </div>
    </div>
  );
};

const nodeTypes = {
  teamMember: TeamMemberNode,
  custom: CustomNode,
};

const generateFlowElements = (members: User[]) => {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const nodeWidth = 256;
  const horizontalSpacing = 50;
  const verticalSpacing = 120;
  
  // Section 1: Equipe Gestora
  const financiadorNode = {
      id: 'financiador', type: 'custom', position: { x: 0, y: 0 },
      data: { label: 'CNPq / PAS Nordeste', subLabel: '(Órgão Financiador)' }
  };
  const proponenteNode = {
      id: 'proponente', type: 'custom', position: { x: 0, y: verticalSpacing },
      data: { label: 'IF Baiano – Campus Itapetinga', subLabel: '(Instituição Proponente)' }
  };
  
  // Encontrar coordenadores de forma segura
  const coordGeralUser = members.find(m => m.role.toLowerCase().includes('coordenador geral'));
  if (!coordGeralUser) return { initialNodes, initialEdges }; // Fallback de segurança

  const coordGeralNode = {
      id: coordGeralUser.id, type: 'teamMember', position: { x: 0, y: verticalSpacing * 2 },
      data: { user: coordGeralUser }
  };

  initialNodes.push(financiadorNode, proponenteNode, coordGeralNode);
  initialEdges.push({ id: `e-financiador-proponente`, source: financiadorNode.id, target: proponenteNode.id, type: 'smoothstep' });
  initialEdges.push({ id: `e-proponente-${coordGeralNode.id}`, source: proponenteNode.id, target: coordGeralNode.id, type: 'smoothstep' });
  
  const coordTecUser = members.find(m => m.role.toLowerCase().includes('técnico-científica'));
  const coordComUser = members.find(m => m.role.toLowerCase().includes('comunicação científica'));
  const coordInovUser = members.find(m => m.role.toLowerCase().includes('tecnológicas e de inovação'));
  const coordLogUser = members.find(m => m.role.toLowerCase().includes('logística e monitoramento'));

  const coords = [coordTecUser, coordComUser, coordInovUser, coordLogUser].filter(Boolean) as User[];
  const totalCoordWidth = (nodeWidth * coords.length) + (horizontalSpacing * (coords.length - 1));
  const startX = -(totalCoordWidth / 2) + (nodeWidth / 2);

  // Coordenadores Individuais (para posicionar os eixos abaixo deles)
  const coordTecNode = coordTecUser ? { id: coordTecUser.id, type: 'teamMember', position: { x: startX, y: verticalSpacing * 3 }, data: { user: coordTecUser } } : null;
  const coordComNode = coordComUser ? { id: coordComUser.id, type: 'teamMember', position: { x: startX + nodeWidth + horizontalSpacing, y: verticalSpacing * 3 }, data: { user: coordComUser } } : null;
  const coordInovNode = coordInovUser ? { id: coordInovUser.id, type: 'teamMember', position: { x: startX + 2 * (nodeWidth + horizontalSpacing), y: verticalSpacing * 3 }, data: { user: coordInovUser } } : null;
  const coordLogNode = coordLogUser ? { id: coordLogUser.id, type: 'teamMember', position: { x: startX + 3 * (nodeWidth + horizontalSpacing), y: verticalSpacing * 3 }, data: { user: coordLogUser } } : null;

  [coordTecNode, coordComNode, coordInovNode, coordLogNode].forEach(node => {
    if (node) {
      initialNodes.push(node);
      initialEdges.push({ id: `e-geral-${node.id}`, source: coordGeralNode.id, target: node.id, type: 'smoothstep' });
    }
  });

  // Eixos (apenas se o coordenador respectivo existir)
  if (coordTecNode) {
    const eixoSegAlimNode = { id: 'eixo-seg-alim', type: 'custom', position: { x: coordTecNode.position.x, y: verticalSpacing * 4 }, data: { label: ['Eixo Segurança Alimentar', 'Ciência dos Alimentos', 'Oficinas e Cursos'] } };
    initialNodes.push(eixoSegAlimNode);
    initialEdges.push({ id: `e-tec-eixo`, source: coordTecNode.id, target: eixoSegAlimNode.id, type: 'smoothstep' });
  }

  if (coordComNode) {
    const eixoFormacaoNode = { id: 'eixo-formacao', type: 'custom', position: { x: coordComNode.position.x, y: verticalSpacing * 4 }, data: { label: ['Eixo Formação Cidadã e Docente', 'Oficinas e Cursos'] } };
    initialNodes.push(eixoFormacaoNode);
    initialEdges.push({ id: `e-com-eixo`, source: coordComNode.id, target: eixoFormacaoNode.id, type: 'smoothstep' });
  }

  if (coordInovNode) {
    const eixoInovacaoNode = { id: 'eixo-inovacao', type: 'custom', position: { x: coordInovNode.position.x, y: verticalSpacing * 4 }, data: { label: ['Eixo de Inovação e Ações', 'Ações Científicas e Tecnológicas', 'Desenvolvimento Local'] } };
    initialNodes.push(eixoInovacaoNode);
    initialEdges.push({ id: `e-inov-eixo`, source: coordInovNode.id, target: eixoInovacaoNode.id, type: 'smoothstep' });
  }

  if (coordLogNode) {
    const eixoLogisticaNode = { id: 'eixo-logistica', type: 'custom', position: { x: coordLogNode.position.x, y: verticalSpacing * 4 }, data: { label: ['Logística de Eventos', 'Planejamento e Suprimentos', 'Monitoramento'] } };
    initialNodes.push(eixoLogisticaNode);
    initialEdges.push({ id: `e-log-eixo`, source: coordLogNode.id, target: eixoLogisticaNode.id, type: 'smoothstep' });
  }

  // Section 2: LABORATÓRIO LISSA
  const lissaYStart = verticalSpacing * 5.5;
  const lissaLabNode = { id: 'lissa-lab', type: 'custom', position: { x: 0, y: lissaYStart }, data: { label: ['LABORATÓRIO LISSA', '(Inovação Social e Segurança Alimentar)']} };
  initialNodes.push(lissaLabNode);
  
  const tecDigitaisNode = { id: 'tec-digitais', type: 'custom', position: { x: -nodeWidth - horizontalSpacing, y: lissaYStart + verticalSpacing }, data: { label: ['Tecnologias Digitais', 'Sistemas de Informação', 'Apps e Jogos'] } };
  const matDidaticosNode = { id: 'mat-didaticos', type: 'custom', position: { x: 0, y: lissaYStart + verticalSpacing }, data: { label: ['Materiais Didáticos', 'Cartilhas e E-books', 'Libras e AD'] } };
  const audiovisualNode = { id: 'audiovisual', type: 'custom', position: { x: nodeWidth + horizontalSpacing, y: lissaYStart + verticalSpacing }, data: { label: ['Audiovisual e Comunicação', 'Vídeos, Podcasts, Docs', 'Acessibilidade'] } };
  
  initialNodes.push(tecDigitaisNode, matDidaticosNode, audiovisualNode);
  initialEdges.push({ id: `e-lissa-tec`, source: lissaLabNode.id, target: tecDigitaisNode.id, type: 'smoothstep' });
  initialEdges.push({ id: `e-lissa-mat`, source: lissaLabNode.id, target: matDidaticosNode.id, type: 'smoothstep' });
  initialEdges.push({ id: `e-lissa-audio`, source: lissaLabNode.id, target: audiovisualNode.id, type: 'smoothstep' });

  // Section 3: EIXO DE PARTICIPAÇÃO SOCIAL E TERRITORIAL
  const participacaoYStart = lissaYStart + verticalSpacing * 2.5;
  const participacaoEixoNode = { id: 'participacao-eixo', type: 'custom', position: { x: 0, y: participacaoYStart }, data: { label: 'EIXO DE PARTICIPAÇÃO SOCIAL E TERRITORIAL' } };
  initialNodes.push(participacaoEixoNode);

  const movSociaisNode = { id: 'mov-sociais', type: 'custom', position: { x: -nodeWidth - horizontalSpacing, y: participacaoYStart + verticalSpacing }, data: { label: ['Movimentos Sociais', 'Papo das Pretas', 'Coletivo Afro', 'Coletivo Mulheres'] } };
  const comunidadesNode = { id: 'comunidades', type: 'custom', position: { x: 0, y: participacaoYStart + verticalSpacing }, data: { label: ['Comunidades Quilombolas', 'Populações Rurais', 'Agricultores Familiares'] } };
  const associacoesNode = { id: 'associacoes', type: 'custom', position: { x: nodeWidth + horizontalSpacing, y: participacaoYStart + verticalSpacing }, data: { label: ['Associações de Pessoas com Def.', 'LGBTQIAPN+'] } };

  initialNodes.push(movSociaisNode, comunidadesNode, associacoesNode);
  initialEdges.push({ id: `e-participacao-mov`, source: participacaoEixoNode.id, target: movSociaisNode.id, type: 'smoothstep' });
  initialEdges.push({ id: `e-participacao-com`, source: participacaoEixoNode.id, target: comunidadesNode.id, type: 'smoothstep' });
  initialEdges.push({ id: `e-participacao-ass`, source: participacaoEixoNode.id, target: associacoesNode.id, type: 'smoothstep' });

  // Section 4: FEIRAS (as result)
  const feirasYStart = participacaoYStart + verticalSpacing * 2.5;
  const feirasNode = { id: 'feiras', type: 'custom', position: { x: 0, y: feirasYStart }, data: { label: ['FEIRAS DE AGRICULTURA FAMILIAR (IF Baiano / UESB)', 'Economia Solidária • Segurança Alimentar • Geração de Renda']} };
  initialNodes.push(feirasNode);
  
  return { initialNodes, initialEdges };
};

export default function TeamFlowchart() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Carregamento dinâmico
  useEffect(() => {
    const members = dataService.listarMembrosEquipe();
    const { initialNodes, initialEdges } = generateFlowElements(members);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'teamMember' && node.data.user) {
      setSelectedUser(node.data.user);
    }
  }, []);

  const avatar = selectedUser ? PlaceHolderImages.find(img => img.id === selectedUser.avatarId) : null;

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
      </ReactFlow>

      <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md p-0">
          {selectedUser && (
            <>
              <div className="relative h-48 w-full">
                  {avatar && (
                    <Image 
                      src={avatar.imageUrl} 
                      alt={selectedUser.name}
                      fill
                      className="rounded-t-lg object-cover"
                      data-ai-hint={avatar.imageHint || 'person portrait'}
                    />
                  )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                   <div className="absolute bottom-4 left-4">
                      <DialogTitle className="text-2xl font-headline text-white">{selectedUser.name}</DialogTitle>
                      <DialogDescription className="text-primary-foreground/80">{selectedUser.role}</DialogDescription>
                   </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-foreground/80 text-justify">
                    {selectedUser.bio.split(';').map((item, index) => (
                      <span key={index} className="block mb-2">{item.trim()}{item.trim() && ';'}</span>
                    ))}
                </p>
              </div>

              {selectedUser.lattesUrl && selectedUser.lattesUrl !== '#' && (
                <DialogFooter className="px-6 pb-6 pt-0 sm:justify-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={selectedUser.lattesUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Currículo Lattes
                    </Link>
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
