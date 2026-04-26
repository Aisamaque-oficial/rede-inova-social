"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { StoredUser } from "@/lib/auth";
import { validarForcaSenha, formatarCPF } from "@/lib/auth";

type PermissionKey = keyof StoredUser['permissoes'];

const PERMISSION_LABELS: Record<PermissionKey, { label: string; descricao: string }> = {
  canEditContent: { label: "Editar Conteúdo", descricao: "Modificar textos e CMS" },
  canEditImages: { label: "Editar Imagens", descricao: "Upload e edição de imagens" },
  canEditGlossary: { label: "Editar Glossário", descricao: "Gerenciar termos Libras" },
  canEditStation: { label: "Editar Estações", descricao: "Configurar Lab Lissa" },
  canManageMembers: { label: "Gerenciar Membros", descricao: "Controle de usuários" },
  canManageTasks: { label: "Gerenciar Tarefas", descricao: "Atribuir e gerenciar tarefas" },
  canUploadMedia: { label: "Upload de Mídia", descricao: "Vídeos, áudio e arquivos" },
};

export default function AdminMembrosPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [sessao, setSessao] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEdicao, setUsuarioEdicao] = useState<StoredUser | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    cpfOuEmail: "",
    nomeCompleto: "",
    role: "member" as StoredUser['role'],
    senhaTemporaria: "",
    permissoes: {
      canEditContent: false,
      canEditImages: false,
      canEditGlossary: false,
      canEditStation: false,
      canManageMembers: false,
      canManageTasks: false,
      canUploadMedia: false,
    } as StoredUser['permissoes'],
    bio: "",
    lattesUrl: "",
    department: "ACESSIBILIDADE" as StoredUser['department'],
    cargo: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  // Carregar dados na montagem
  useEffect(() => {
    const usuarioSessao = dataService.obterSessaoAtual();
    
    if (!usuarioSessao) {
      router.push("/login");
      return;
    }

    if (!dataService.canManageTeam()) {
      toast({
        title: "Acesso Restrito",
        description: "Apenas a Coordenação Geral e de Extensão podem gerenciar membros.",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    setSessao(usuarioSessao);
    carregarUsuarios();
    setIsLoading(false);
  }, []);

  const carregarUsuarios = async () => {
    const listaUsuarios = await dataService.listarTodosUsuarios();
    setUsuarios(listaUsuarios);
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!formData.cpfOuEmail.trim()) {
      novosErros.cpfOuEmail = "CPF/Email é obrigatório";
    }

    if (!formData.nomeCompleto.trim()) {
      novosErros.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!formData.senhaTemporaria && !usuarioEdicao) {
      novosErros.senhaTemporaria = "Senha temporária é obrigatória";
    }

    if (formData.senhaTemporaria) {
      const validacao = validarForcaSenha(formData.senhaTemporaria);
      if (validacao.score < 60) {
        novosErros.senhaTemporaria = `Senha fraca: ${validacao.avisos.join(", ")}`;
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmitFormulario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    try {
      if (usuarioEdicao) {
        // Atualizar
        const resultado = await dataService.atualizarUsuario(usuarioEdicao.id, {
          nomeCompleto: formData.nomeCompleto,
          role: formData.role,
          permissoes: formData.permissoes,
          bio: formData.bio,
          lattesUrl: formData.lattesUrl,
          department: formData.department,
          cargo: formData.cargo,
          ativo: true,
        });

        if (resultado.sucesso) {
          toast({
            title: "✅ Usuário atualizado",
            description: formData.nomeCompleto,
          });
          resetarFormulario();
          await carregarUsuarios();
        } else {
          toast({
            title: "❌ Erro",
            description: resultado.mensagem,
            variant: "destructive",
          });
        }
      } else {
        // Criar novo
        const resultado = await dataService.criarNovoUsuario({
          cpfOuEmail: formData.cpfOuEmail,
          nomeCompleto: formData.nomeCompleto,
          role: formData.role as any,
          senhaTemporaria: formData.senhaTemporaria,
          permissoes: formData.permissoes,
          bio: formData.bio,
          lattesUrl: formData.lattesUrl,
          department: formData.department,
          cargo: formData.cargo,
        });

        if (resultado.sucesso) {
          toast({
            title: "✅ Usuário criado com sucesso",
            description: `Senha temporária: ${formData.senhaTemporaria}`,
          });
          resetarFormulario();
          await carregarUsuarios();
        } else {
          toast({
            title: "❌ Erro",
            description: resultado.mensagem,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast({
        title: "❌ Erro",
        description: "Erro ao processar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetarFormulario = () => {
    setFormData({
      cpfOuEmail: "",
      nomeCompleto: "",
      role: "member",
      senhaTemporaria: "",
      permissoes: {
        canEditContent: false,
        canEditImages: false,
        canEditGlossary: false,
        canEditStation: false,
        canManageMembers: false,
        canManageTasks: false,
        canUploadMedia: false,
      },
      bio: "",
      lattesUrl: "",
      department: "ACESSIBILIDADE",
      cargo: "",
    });
    setMostrarFormulario(false);
    setUsuarioEdicao(null);
    setErros({});
  };

  const iniciarEdicao = (usuario: StoredUser) => {
    setUsuarioEdicao(usuario);
    setFormData({
      cpfOuEmail: usuario.cpfOuEmail,
      nomeCompleto: usuario.nomeCompleto,
      role: usuario.role,
      senhaTemporaria: "",
      permissoes: usuario.permissoes,
      bio: usuario.bio || "",
      lattesUrl: usuario.lattesUrl || "",
      department: usuario.department || "ACESSIBILIDADE",
      cargo: usuario.cargo || "",
    });
    setMostrarFormulario(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    const resultado = await dataService.deletarUsuario(userId);
    if (resultado.sucesso) {
      toast({
        title: "✅ Usuário deletado",
        description: resultado.mensagem,
      });
      await carregarUsuarios();
    } else {
      toast({
        title: "❌ Erro",
        description: resultado.mensagem,
        variant: "destructive",
      });
    }
  };

  const handleResetarSenha = async (userId: string) => {
    const usuario = usuarios.find(u => u.id === userId);
    if (!usuario) return;

    const resultado = await dataService.resetarSenhaUsuario(userId);
    if (resultado.sucesso) {
      toast({
        title: "✅ Senha resetada",
        description: `Nova senha: ${resultado.mensagem.split(": ")[1]}`,
      });
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
    <div className="container max-w-6xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔐 Gerenciar Membros</h1>
        <p className="text-gray-600">Crie, edite e gerencie credenciais de acesso do projeto</p>
      </div>

      {/* Botão criar novo */}
      <Button
        onClick={() => {
          if (!mostrarFormulario) {
            setUsuarioEdicao(null);
            setFormData({
              cpfOuEmail: "",
              nomeCompleto: "",
              role: "member",
              senhaTemporaria: "",
              permissoes: {
                canEditContent: false,
                canEditImages: false,
                canEditGlossary: false,
                canEditStation: false,
                canManageMembers: false,
                canManageTasks: false,
                canUploadMedia: false,
              },
              bio: "",
              lattesUrl: "",
              department: "ACESSIBILIDADE",
              cargo: "",
            });
          }
          setMostrarFormulario(!mostrarFormulario);
        }}
        className="bg-green-600 hover:bg-green-700"
      >
        {mostrarFormulario ? "Cancel ar" : "+ Novo Membro"}
      </Button>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>{usuarioEdicao ? "Editar Membro" : "Criar Novo Membro"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFormulario} className="space-y-4">
              {/* CPF/Email */}
              <div>
                <Label>CPF ou Email</Label>
                <Input
                  type="text"
                  placeholder="069.400.574-63 ou email@exemplo.com"
                  value={formData.cpfOuEmail}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (valor.includes(".") || valor.includes("-")) {
                      setFormData({ ...formData, cpfOuEmail: valor });
                    } else if (valor.length === 11) {
                      setFormData({ ...formData, cpfOuEmail: formatarCPF(valor) });
                    } else {
                      setFormData({ ...formData, cpfOuEmail: valor });
                    }
                  }}
                  disabled={!!usuarioEdicao}
                />
                {erros.cpfOuEmail && <p className="text-red-600 text-xs mt-1">{erros.cpfOuEmail}</p>}
              </div>

              {/* Nome Completo */}
              <div>
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  placeholder="João da Silva"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                />
                {erros.nomeCompleto && <p className="text-red-600 text-xs mt-1">{erros.nomeCompleto}</p>}
              </div>

              {/* Role */}
              <div>
                <Label>Papel</Label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StoredUser['role'] })}
                  className="w-full border rounded p-2"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="member">Membro</option>
                  <option value="membro_editor">Editor de Conteúdo</option>
                  <option value="member_specialist">Especialista</option>
                  <option value="coordinator">Coordenador</option>
                  <option value="coordinator_internal">Coord. Interna</option>
                  <option value="coordinator_extension">Coord. Extensão</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <Label>Departamento / Setor</Label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as StoredUser['department'] })}
                    className="w-full border rounded p-2"
                  >
                    <option value="ACESSIBILIDADE">Acessibilidade</option>
                    <option value="ASCOM">ASCOM</option>
                    <option value="CGP">CGP / Coord. Geral</option>
                    <option value="INTERNAL_COORDINATION">Coord. Interna</option>
                    <option value="EXTENSÃO">Extensão</option>
                    <option value="PESQUISA">Pesquisa</option>
                    <option value="SOCIAL">Social</option>
                    <option value="TECH">Tecnologia</option>
                    <option value="LAB-LISSA">Lab LISSA</option>
                    <option value="PLAN">Planejamento</option>
                  </select>
                </div>

                {/* Cargo */}
                <div>
                  <Label>Cargo Institucional</Label>
                  <Input
                    type="text"
                    placeholder="Ex: Coordenador de Mídias"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
              </div>

              {/* Lattes URL */}
              <div>
                <Label>Link do Currículo Lattes</Label>
                <Input
                  type="url"
                  placeholder="http://lattes.cnpq.br/..."
                  value={formData.lattesUrl}
                  onChange={(e) => setFormData({ ...formData, lattesUrl: e.target.value })}
                />
              </div>

              {/* Bio */}
              <div>
                <Label>Bio / Mini-currículo</Label>
                <textarea
                  placeholder="Breve descrição profissional..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded p-2 h-24"
                />
              </div>

              {/* Senha Temporária */}
              {!usuarioEdicao && (
                <div>
                  <Label>Senha Temporária</Label>
                  <Input
                    type="password"
                    placeholder="Senha com números, símbolos, maiúscula..."
                    value={formData.senhaTemporaria}
                    onChange={(e) => setFormData({ ...formData, senhaTemporaria: e.target.value })}
                  />
                  {erros.senhaTemporaria && <p className="text-red-600 text-xs mt-1">{erros.senhaTemporaria}</p>}
                  {formData.senhaTemporaria && (
                    <p className="text-xs mt-1">
                      Força: {validarForcaSenha(formData.senhaTemporaria).nivel.replace('_', ' ').toUpperCase()}
                    </p>
                  )}
                </div>
              )}

              {/* Permissões */}
              <div className="space-y-2">
                <Label className="font-bold">Permissões</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key) => (
                    <label key={key} className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-white/50">
                      <input
                        type="checkbox"
                        checked={formData.permissoes[key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissoes: {
                              ...formData.permissoes,
                              [key]: e.target.checked,
                            },
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{PERMISSION_LABELS[key].label}</p>
                        <p className="text-xs text-gray-600">{PERMISSION_LABELS[key].descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {usuarioEdicao ? "Update" : "Criar Membro"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Usuários */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Usuários Cadastrados ({usuarios.length})</h2>
        <div className="grid gap-3">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold">{usuario.nomeCompleto}</h3>
                  <p className="text-sm text-gray-600">{usuario.cpfOuEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Setor: <span className="font-medium">{usuario.department || "N/A"}</span> | 
                    Papel: <span className="font-medium capitalize">{usuario.role.replace('_', ' ')}</span>
                  </p>
                  {usuario.cargo && (
                    <p className="text-xs font-semibold text-primary mt-1">
                      {usuario.cargo}
                    </p>
                  )}
                  {usuario.lattesUrl && (
                    <p className="text-[10px] text-blue-600 truncate underline mt-1">
                      {usuario.lattesUrl}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key) =>
                      usuario.permissoes[key] ? (
                        <span key={key} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          {PERMISSION_LABELS[key].label}
                        </span>
                      ) : null
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Criado: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => iniciarEdicao(usuario)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleResetarSenha(usuario.id)}>
                    Resetar Senha
                  </Button>
                  {usuario.id !== "admin-001" && (
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(usuario.id)}>
                      Deletar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
