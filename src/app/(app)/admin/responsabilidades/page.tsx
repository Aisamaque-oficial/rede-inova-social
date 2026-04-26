"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Responsabilidade, MembroResponsabilidades } from "@/lib/responsabilidades";
import { 
  RESPONSABILIDADES_PADRAO,
  AREAS_CONFIGURACAO,
  AREA_LABELS,
  AreasAtuacao,
  VisibilidadeConteudo
} from "@/lib/responsabilidades";

type Responsabilidade_Atribuicao = {
  [key: string]: boolean;
};

export default function AdminResponsabilidadesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [sessao, setSessao] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [membrosComResp, setMembrosComResp] = useState<MembroResponsabilidades[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);
  const [responsabilitadesSelecionadas, setResponsabilitadesSelecionadas] = useState<Responsabilidade_Atribuicao>({});

  // Carregar dados
  useEffect(() => {
    const usuarioSessao = dataService.obterSessaoAtual();

    if (!usuarioSessao) {
      router.push("/login");
      return;
    }

    if (usuarioSessao.role !== "admin" && usuarioSessao.role !== "coordinator") {
      toast({
        title: "Acesso Negado",
        description: "Apenas administrador pode acessar este painel",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    setSessao(usuarioSessao);
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const listaUsuarios = await dataService.listarTodosUsuarios();
    const listaComResp = dataService.listarTodosComResponsabilidades();
    
    setUsuarios(listaUsuarios);
    setMembrosComResp(listaComResp);
    setIsLoading(false);
  };

  const handleSelecionarUsuario = (usuarioId: string) => {
    setUsuarioSelecionado(usuarioId);
    
    // Carregar responsabilidades atual
    const membro = membrosComResp.find(m => m.usuarioId === usuarioId);
    if (membro) {
      const selecionadas: Responsabilidade_Atribuicao = {};
      membro.responsabilidades.forEach(r => {
        selecionadas[r.id] = true;
      });
      setResponsabilitadesSelecionadas(selecionadas);
    } else {
      setResponsabilitadesSelecionadas({});
    }
  };

  const handleToggleResponsabilidade = (respId: string) => {
    setResponsabilitadesSelecionadas(prev => ({
      ...prev,
      [respId]: !prev[respId]
    }));
  };

  const handleSalvarResponsabilidades = async () => {
    if (!usuarioSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um usuário",
        variant: "destructive"
      });
      return;
    }

    const responsabilitadesSelecionadasArray = Object.entries(responsabilitadesSelecionadas)
      .filter(([, selecionado]) => selecionado)
      .map(([respId]) => {
        const resp = Object.values(RESPONSABILIDADES_PADRAO).find(r => r.id === respId);
        return resp!;
      });

    if (responsabilitadesSelecionadasArray.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos uma responsabilidade",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const resultado = await dataService.atribuirResponsabilidade(
        usuarioSelecionado,
        responsabilitadesSelecionadasArray
      );

      if (resultado.sucesso) {
        toast({
          title: "✅ Responsabilidades atribuídas",
          description: resultado.mensagem,
        });
        await carregarDados();
        setUsuarioSelecionado(null);
        setResponsabilitadesSelecionadas({});
      } else {
        toast({
          title: "❌ Erro",
          description: resultado.mensagem,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "❌ Erro",
        description: "Erro ao salvar responsabilidades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📋 Gerenciar Responsabilidades</h1>
          <p className="text-gray-600">Atribua responsabilidades e controle de acesso aos membros</p>
        </div>
        <Button 
          onClick={() => router.push("/admin/uploads-pendentes")}
          className="bg-amber-600 hover:bg-amber-700"
        >
          ⏳ Uploads Pendentes
        </Button>
      </div>

      <Tabs defaultValue="atribuir" className="w-full">
        {/* TAB 1: Atribuir */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atribuir">Atribuir Responsabilidades</TabsTrigger>
          <TabsTrigger value="visualizar">Visualizar Atribuições</TabsTrigger>
        </TabsList>

        {/* ─────────────────────────────── */}
        {/* TAB CONTENT: ATRIBUIR */}
        {/* ─────────────────────────────── */}
        <TabsContent value="atribuir" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUNA 1: Selecionar Usuário */}
            <Card>
              <CardHeader>
                <CardTitle>1️⃣ Selecione o Membro</CardTitle>
                <CardDescription>Escolha qual membro receberá as responsabilidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {usuarios.map((usuario) => (
                  <button
                    key={usuario.id}
                    onClick={() => handleSelecionarUsuario(usuario.id)}
                    className={`w-full text-left p-3 rounded border-2 transition-all ${
                      usuarioSelecionado === usuario.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-semibold">{usuario.nomeCompleto}</h4>
                    <p className="text-xs text-gray-500">{usuario.cpfOuEmail}</p>
                    <Badge className="mt-2">{usuario.role.replace('_', ' ')}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* COLUNA 2: Selecionar Responsabilidades */}
            <Card>
              <CardHeader>
                <CardTitle>2️⃣ Selecione Responsabilidades</CardTitle>
                <CardDescription>
                  {usuarioSelecionado 
                    ? `Responsabilidades para ${usuarios.find(u => u.id === usuarioSelecionado)?.nomeCompleto}`
                    : "Selecione um membro primeiro"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!usuarioSelecionado ? (
                  <Alert>
                    <AlertDescription>Selecione um membro na esquerda</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.values(RESPONSABILIDADES_PADRAO).map((resp) => (
                      <label
                        key={resp.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={responsabilitadesSelecionadas[resp.id] || false}
                          onChange={() => handleToggleResponsabilidade(resp.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{resp.titulo}</div>
                          <p className="text-xs text-gray-600">{resp.descricao}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {resp.podeEditar && (
                              <Badge variant="outline" className="text-xs bg-blue-50">✏️ Editar</Badge>
                            )}
                            {resp.podeUploadInterno && (
                              <Badge variant="outline" className="text-xs bg-green-50">🔒 Upload Interno</Badge>
                            )}
                            {resp.podeUploadExterno && (
                              <Badge variant="outline" className="text-xs bg-purple-50">🌐 Upload Externo</Badge>
                            )}
                            {resp.podeAprovar && (
                              <Badge variant="outline" className="text-xs bg-yellow-50">✅ Aprovar</Badge>
                            )}
                            {resp.podePublicar && (
                              <Badge variant="outline" className="text-xs bg-orange-50">📢 Publicar</Badge>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {usuarioSelecionado && (
                  <Button
                    onClick={handleSalvarResponsabilidades}
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar Responsabilidades"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─────────────────────────────── */}
        {/* TAB CONTENT: VISUALIZAR */}
        {/* ─────────────────────────────── */}
        <TabsContent value="visualizar" className="space-y-4">
          {membrosComResp.length === 0 ? (
            <Alert>
              <AlertDescription>Nenhuma responsabilidade atribuída ainda</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {membrosComResp.map((membro) => (
                <Card key={membro.usuarioId} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{membro.nomeCompleto}</CardTitle>
                        <CardDescription>
                          Ativo desde {new Date(membro.dataAtribuicao).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge className={membro.ativo ? "bg-green-600" : "bg-gray-400"}>
                        {membro.ativo ? "✓ Ativo" : "✗ Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Áreas Principais */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">📍 Áreas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {membro.areasPrincipais.map((area) => (
                          <Badge key={area} variant="secondary">
                            {AREA_LABELS[area as AreasAtuacao]}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Responsabilidades */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">💼 Responsabilidades:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {membro.responsabilidades.map((resp) => (
                          <div key={resp.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="font-medium text-sm">{resp.titulo}</p>
                            <p className="text-xs text-gray-600 mt-1">{resp.descricao}</p>
                            
                            {/* Permissões */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resp.podeEditar && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">✏️ Editar</span>}
                              {resp.podeUploadInterno && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">🔒 Interno</span>}
                              {resp.podeUploadExterno && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">🌐 Externo</span>}
                              {resp.podeAprovar && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">✅ Aprovar</span>}
                              {resp.podePublicar && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">📢 Publicar</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Áreas de Configuração */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">⚙️ Configurações das Áreas:</h4>
                      <div className="space-y-2">
                        {membro.areasPrincipais.map((area) => {
                          const config = AREAS_CONFIGURACAO[area as AreasAtuacao];
                          return (
                            <div key={area} className="p-2 bg-gray-50 rounded text-sm">
                              <p className="font-medium">{config.nome}</p>
                              <div className="flex gap-2 mt-1">
                                {config.requerAprovacao && (
                                  <Badge variant="outline" className="text-xs">🔔 Requer Aprovação</Badge>
                                )}
                                {config.permitirUploadExterno && (
                                  <Badge variant="outline" className="text-xs">🌐 Upload Público</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Informações */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">ℹ️ Sobre Responsabilidades</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>✏️ Editar:</strong> Pode modificar conteúdo e informações
          </p>
          <p>
            <strong>🔒 Upload Interno:</strong> Pode fazer upload de arquivos para uso interno (apenas membros)
          </p>
          <p>
            <strong>🌐 Upload Externo:</strong> Pode fazer upload de arquivos para o público
          </p>
          <p>
            <strong>✅ Aprovar:</strong> Pode revisar e aprovar conteúdo antes da publicação
          </p>
          <p>
            <strong>📢 Publicar:</strong> Pode publicar conteúdo diretamente sem aprovação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
