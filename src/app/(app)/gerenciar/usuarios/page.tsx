"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { User, Sector, Role } from "@/lib/schema/models";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Mail, Shield, Loader2, Edit3, Image as ImageIcon, BookOpen, Layers, Video, ChevronDown, Plus, X, Activity, RefreshCw, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploader } from "@/components/image-uploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { sectors as sectorsList } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PERMISSION_ICONS: Record<string, React.ReactNode> = {
  canEditContent: <Edit3 className="w-4 h-4 text-blue-600" />,
  canEditImages: <ImageIcon className="w-4 h-4 text-green-600" />,
  canEditGlossary: <BookOpen className="w-4 h-4 text-purple-600" />,
  canEditStation: <Layers className="w-4 h-4 text-orange-600" />,
  canManageMembers: <Users className="w-4 h-4 text-red-600" />,
  canManageTasks: <Edit3 className="w-4 h-4 text-indigo-600" />,
  canUploadMedia: <Video className="w-4 h-4 text-pink-600" />,
};

const INSTITUTIONAL_ROLES = [
  "Coordenação Geral de Projetos (CGP)",
  "Coordenação de Acessibilidade",
  "Coordenação de Parcerias Institucionais",
  "Coordenação Técnico-Científica Extensionista",
  "Coordenação da ASCOM",
  "Colaborador Técnico",
  "Colaborador Bolsista",
  "Estagiário",
  "Apoio Administrativo"
];

const PERMISSION_LABELS: Record<string, { label: string; description: string }> = {
  canEditContent: { 
    label: "Editar Conteúdo", 
    description: "Permite editar textos estáticos do site (CMS)" 
  },
  canEditImages: { 
    label: "Editar Imagens", 
    description: "Pode fazer upload e editar imagens" 
  },
  canEditGlossary: { 
    label: "Editar Glossários", 
    description: "Gerenciar termos e conteúdo do glossário em Libras" 
  },
  canEditStation: { 
    label: "Editar Estações Lab", 
    description: "Configurar estações do Laboratório LISSA" 
  },
  canManageMembers: { 
    label: "Gerenciar Membros", 
    description: "Adicionar, remover e atribuir permissões a membros" 
  },
  canManageTasks: { 
    label: "Gerenciar Tarefas", 
    description: "Atribuir e controlar tarefas do projeto" 
  },
  canUploadMedia: { 
    label: "Upload de Mídia", 
    description: "Fazer upload de vídeos, áudio e outros arquivos" 
  },
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    nomeCompleto: "",
    cpfOuEmail: "",
    cargo: "",
    avatarUrl: ""
  });
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploadingUserId, setUploadingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentUserRole(dataService.getUserRole());
    const fetchUsers = async () => {
      const data = await dataService.getUsers();
      setUsers(data);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const [newUser, setNewUser] = useState({
    nomeCompleto: "",
    cpfOuEmail: "",
    senhaTemporaria: "",
    cargo: "",
    avatarUrl: "",
    role: "COLABORADOR" as Role,
    assignments: [] as { sector: Sector; role: Role }[],
    permissoes: {
      canEditContent: false,
      canEditImages: false,
      canEditGlossary: false,
      canEditStation: false,
      canManageMembers: false,
      canManageTasks: true,
      canUploadMedia: false,
    }
  });

  const handleAddAssignment = (sectorId: Sector) => {
    if (newUser.assignments.length >= 3) {
        toast({ title: "Limite atingido", description: "Um membro pode estar vinculado a no máximo 3 setores.", variant: "warning" });
        return;
    }
    if (newUser.assignments.find(a => a.sector === sectorId)) return;
    
    setNewUser({
        ...newUser,
        assignments: [...newUser.assignments, { sector: sectorId, role: newUser.role }]
    });
  };

  const handleRemoveAssignment = (sectorId: Sector) => {
    setNewUser({
        ...newUser,
        assignments: newUser.assignments.filter(a => a.sector !== sectorId)
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.assignments.length === 0) {
        toast({ title: "Atenção", description: "Selecione pelo menos um setor para o membro.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    try {
      const resp = await dataService.criarNovoUsuario({
        nomeCompleto: newUser.nomeCompleto,
        cpfOuEmail: newUser.cpfOuEmail,
        senhaTemporaria: newUser.senhaTemporaria,
        cargo: newUser.cargo,
        avatarUrl: newUser.avatarUrl,
        role: newUser.role,
        assignments: newUser.assignments,
        permissoes: newUser.permissoes as any
      });
      
      if (resp.sucesso) {
          const freshUsers = await dataService.getUsers();
          setUsers(freshUsers);
          setIsAdding(false);
          toast({ title: "Sucesso", description: "Membro cadastrado com múltiplos vínculos!" });
      } else {
          toast({ title: "Erro", description: resp.mensagem, variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Erro crítico", description: "Não foi possível cadastrar o usuário.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = async (userId: string, permissionKey: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updatedPerms = {
        ...user.permissoes,
        [permissionKey]: !user.permissoes[permissionKey]
    };

    const resp = await dataService.adminUpdateUser(userId, { permissoes: updatedPerms });
    if (resp.sucesso) {
        setUsers(users.map(u => u.id === userId ? { ...u, permissoes: updatedPerms } : u));
        toast({ title: "Permissão atualizada" });
    }
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja resetar a senha de ${userName} para o padrão '123@Mudar'?`)) return;
    
    setIsLoading(true);
    try {
        const resp = await dataService.adminResetPassword(userId);
        if (resp.sucesso) {
            toast({ title: "Senha Resetada", description: `A senha de ${userName} agora é 123@Mudar` });
        } else {
            toast({ title: "Erro", description: resp.mensagem, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao resetar senha", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const startEditing = (user: any) => {
    setEditingUserId(user.id);
    setEditFormData({
      nomeCompleto: user.nomeCompleto || user.name || "",
      cpfOuEmail: user.cpfOuEmail || "",
      cargo: user.cargo || "",
      avatarUrl: user.avatarUrl || ""
    });
  };

  const handleUpdateUser = async (userId: string) => {
    setIsLoading(true);
    try {
        const resp = await dataService.adminUpdateUser(userId, {
          nomeCompleto: editFormData.nomeCompleto,
          cpfOuEmail: editFormData.cpfOuEmail,
          cargo: editFormData.cargo,
          avatarUrl: editFormData.avatarUrl
        } as any);

        if (resp.sucesso) {
            setUsers(users.map(u => u.id === userId ? { 
                ...u, 
                nomeCompleto: editFormData.nomeCompleto, 
                cpfOuEmail: editFormData.cpfOuEmail, 
                cargo: editFormData.cargo 
            } : u));
            setEditingUserId(null);
            toast({ title: "Dados Atualizados", description: "As informações do membro foram salvas." });
        } else {
            toast({ title: "Erro", description: resp.mensagem, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao atualizar dados", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };
  const handleAvatarUpload = async (file: File) => {
    if (!uploadingUserId) return;
    
    setIsLoading(true);
    try {
      const downloadUrl = await dataService.uploadAvatar(uploadingUserId, file);
      
      // Atualizar o formulário se estivermos editando este mesmo usuário
      if (editingUserId === uploadingUserId) {
        setEditFormData(prev => ({ ...prev, avatarUrl: downloadUrl }));
      }
      
      // Atualizar a lista de usuários local para refletir a mudança
      setUsers(users.map(u => u.id === uploadingUserId ? { ...u, avatarUrl: downloadUrl } : u));
      
      setIsUploaderOpen(false);
      setUploadingUserId(null);
    } catch (error: any) {
      toast({ 
        title: "Erro no Upload", 
        description: error.message || "Não foi possível enviar a imagem.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openUploader = (userId: string) => {
    setUploadingUserId(userId);
    setIsUploaderOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic leading-[0.8] mb-2">Membros do Projeto</h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Gestão de acessos, alocação multissetorial e permissões.</p>
        </div>
        {dataService.canManageTeam() && (
          <Button onClick={() => setIsAdding(!isAdding)} className="rounded-full shadow-xl hover:shadow-primary/20 transition-all font-black uppercase tracking-widest text-[10px] h-12 px-8">
            <UserPlus className="mr-2 h-4 w-4" />
            {isAdding ? "Cancelar Cadastro" : "Cadastrar Novo Membro"}
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-slate-50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 rounded-[2.5rem]">
          <div className="h-3 bg-gradient-to-r from-primary via-teal-500 to-indigo-600"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
                <Shield className="h-6 w-6 text-primary" />
                Novo Registro Multissetorial
            </CardTitle>
            <CardDescription className="font-bold text-[10px] uppercase tracking-widest">ALoque o novo integrante em até 3 setores simultâneos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500" htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Maria Rocha" 
                    required 
                    className="rounded-xl border-slate-200 h-12"
                    value={newUser.nomeCompleto}
                    onChange={(e) => setNewUser({...newUser, nomeCompleto: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500" htmlFor="cpf">CPF ou E-mail</Label>
                  <Input 
                    id="cpf" 
                    placeholder="000.000.000-00 ou email" 
                    required 
                    className="rounded-xl border-slate-200 h-12"
                    value={newUser.cpfOuEmail}
                    onChange={(e) => setNewUser({...newUser, cpfOuEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500" htmlFor="role">Cargo Institucional</Label>
                  <select 
                    id="role"
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                    value={newUser.cargo} 
                    onChange={(e) => {
                      try {
                        const val = e.target.value;
                        console.log("[DEBUG] Selecionando cargo (nativo):", val);
                        setNewUser(prev => ({ ...prev, cargo: val }));
                      } catch (err) {
                        console.error("[DEBUG] Erro ao atualizar cargo:", err);
                      }
                    }}
                  >
                    <option value="" disabled>Selecione o cargo</option>
                    {INSTITUTIONAL_ROLES.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 lg:col-span-3">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500" htmlFor="avatar">URL da Foto de Perfil</Label>
                  <Input 
                    id="avatar" 
                    placeholder="https://exemplo.com/foto.jpg" 
                    className="rounded-xl border-slate-200 h-12 text-xs font-bold"
                    value={newUser.avatarUrl}
                    onChange={(e) => setNewUser({...newUser, avatarUrl: e.target.value})}
                  />
                </div>
              </div>

              {/* SELEÇÃO DE SETORES */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-tighter italic">Vínculos Setoriais</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Máximo de 3 setores por membro</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 py-1 font-black text-[10px] border-primary/20 text-primary">
                        {newUser.assignments.length} / 3 SELECIONADOS
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sectorsList.map((s) => {
                        const isSelected = newUser.assignments.some(a => a.sector === s.sigla as Sector);
                        return (
                            <button
                                key={s.id}
                                type="button"
                                disabled={!isSelected && newUser.assignments.length >= 3}
                                onClick={() => isSelected ? handleRemoveAssignment(s.sigla as Sector) : handleAddAssignment(s.sigla as Sector)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all text-[11px] font-black uppercase tracking-widest",
                                    isSelected 
                                        ? "bg-primary border-primary text-white shadow-lg" 
                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/30 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed"
                                )}
                            >
                                <Activity className="h-3 w-3" />
                                {s.sigla}
                                {isSelected ? <X className="h-3 w-3 ml-1" /> : <Plus className="h-3 w-3 ml-1" />}
                            </button>
                        );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Função Global</Label>
                        <select 
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-xs font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                        >
                            <option value="COLABORADOR">Colaborador</option>
                            <option value="COORDENADOR">Coordenador de Área</option>
                            <option value="CONSULTOR">Consultor Externo</option>
                            <option value="VIEWER">Apenas Visualização</option>
                            <option value="ADMIN">Administrador Sistema</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Senha Provisória (Padrão: 123@Mudar)</Label>
                        <Input 
                            type="password" 
                            placeholder="Deixe em branco para usar 123@Mudar"
                            className="rounded-xl h-12 border-slate-200"
                            value={newUser.senhaTemporaria}
                            onChange={(e) => setNewUser({...newUser, senhaTemporaria: e.target.value})}
                        />
                    </div>
                  </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-full font-black uppercase text-[10px] tracking-widest px-8">Descartar</Button>
                 <Button type="submit" disabled={isLoading} className="rounded-full bg-slate-900 border-2 border-slate-900 shadow-xl hover:shadow-primary/20 font-black uppercase text-[10px] tracking-[0.2em] px-10 h-14">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    Confirmar Cadastro Multissetorial
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {isLoading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        ) : (
            users.map((user) => (
                <Card key={user.id} className="group hover:shadow-2xl transition-all duration-300 rounded-[2rem] border-slate-100 overflow-hidden">
                    <Collapsible
                      open={expandedUserId === user.id}
                      onOpenChange={(open) => setExpandedUserId(open ? user.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="cursor-pointer p-8 flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                              <div className="relative">
                                <Avatar className="h-16 w-16 border-4 border-primary/10 shadow-lg shrink-0">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback className="bg-slate-900 text-white font-black text-xl">{user.nomeCompleto?.charAt(0) || user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                {user.role === 'ADMIN' && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg h-6 w-6 flex items-center justify-center border-2 border-white">
                                        <Shield className="h-3 w-3" />
                                    </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-center gap-3">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-800">{user.nomeCompleto || user.name || "Membro sem Nome"}</CardTitle>
                                    <Badge variant="outline" className="rounded-full text-[9px] font-black uppercase border-slate-200 text-slate-500">
                                        {user.role}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {user.assignments?.map((a: any, idx: number) => {
                                        const s = sectorsList.find(s => s.sigla === a.sector);
                                        return (
                                            <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                                                <div className={cn("h-1.5 w-1.5 rounded-full", s?.color ? `bg-${s.color}-500` : "bg-primary")} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{a.sector}</span>
                                            </div>
                                        );
                                    })}
                                    {(!user.assignments || user.assignments.length === 0) && user.department && (
                                         <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{user.department}</span>
                                        </div>
                                    )}
                                  </div>
                              </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-500 ${expandedUserId === user.id ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="border-t bg-slate-50/50 p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dados do Membro</h4>
                                  <div className="space-y-3">
                                      {editingUserId === user.id ? (
                                          <div className="space-y-4">
                                              <div className="space-y-1">
                                                  <Label className="text-[9px] uppercase font-black">Nome Completo</Label>
                                                  <Input 
                                                    value={editFormData.nomeCompleto} 
                                                    onChange={(e) => setEditFormData({...editFormData, nomeCompleto: e.target.value})}
                                                    className="h-10 rounded-xl text-xs font-bold"
                                                  />
                                              </div>
                                              <div className="space-y-1">
                                                  <Label className="text-[9px] uppercase font-black">CPF / E-mail</Label>
                                                  <Input 
                                                    value={editFormData.cpfOuEmail} 
                                                    onChange={(e) => setEditFormData({...editFormData, cpfOuEmail: e.target.value})}
                                                    className="h-10 rounded-xl text-xs font-bold"
                                                  />
                                              </div>
                                              <div className="space-y-1">
                                                  <div className="flex items-center justify-between mb-1">
                                                    <Label className="text-[9px] uppercase font-black">Foto de Perfil</Label>
                                                    <Button 
                                                      variant="link" 
                                                      className="h-auto p-0 text-[9px] font-black uppercase text-primary hover:no-underline"
                                                      onClick={() => openUploader(user.id)}
                                                    >
                                                      <ImageIcon className="w-3 h-3 mr-1" />
                                                      Fazer Upload
                                                    </Button>
                                                  </div>
                                                  <Input 
                                                    value={editFormData.avatarUrl} 
                                                    onChange={(e) => setEditFormData({...editFormData, avatarUrl: e.target.value})}
                                                    className="h-10 rounded-xl text-xs font-bold"
                                                    placeholder="URL da imagem..."
                                                  />
                                              </div>
                                              <div className="space-y-1">
                                                  <Label className="text-[9px] uppercase font-black">Cargo</Label>
                                                  <select 
                                                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                                    value={editFormData.cargo} 
                                                    onChange={(e) => {
                                                      try {
                                                        const val = e.target.value;
                                                        setEditFormData(prev => ({ ...prev, cargo: val }));
                                                      } catch (err) {
                                                        console.error("[DEBUG] Erro ao editar cargo:", err);
                                                      }
                                                    }}
                                                  >
                                                    <option value="" disabled>Selecione o cargo</option>
                                                    {INSTITUTIONAL_ROLES.map(role => (
                                                      <option key={role} value={role}>
                                                        {role}
                                                      </option>
                                                    ))}
                                                  </select>
                                              </div>
                                              <div className="flex gap-2 pt-2">
                                                  <Button 
                                                    size="sm" 
                                                    className="bg-primary rounded-xl font-bold text-[10px] h-9 px-4"
                                                    onClick={() => handleUpdateUser(user.id)}
                                                    disabled={isLoading}
                                                  >
                                                      Salvar
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="rounded-xl font-bold text-[10px] h-9 px-4"
                                                    onClick={() => setEditingUserId(null)}
                                                  >
                                                      Cancelar
                                                  </Button>
                                              </div>
                                          </div>
                                      ) : (
                                          <>
                                              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                  <Mail className="h-4 w-4 text-primary" />
                                                  {user.cpfOuEmail}
                                              </div>
                                              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                  <Users className="h-4 w-4 text-primary" />
                                                  {user.cargo || "Sem cargo definido"}
                                              </div>
                                          </>
                                      )}
                                  </div>

                                  <div className="pt-4 flex flex-col gap-2">
                                      <Button 
                                        variant="outline" 
                                        disabled={isLoading || !dataService.canManageTeam()}
                                        className="rounded-xl font-black uppercase text-[9px] tracking-widest gap-2 h-10 border-slate-200 disabled:opacity-30"
                                        onClick={() => handleResetPassword(user.id, user.nomeCompleto || user.name)}
                                      >
                                          <RefreshCw className="h-3 w-3" />
                                          Resetar Senha para 123@Mudar
                                      </Button>
                                      
                                      {editingUserId !== user.id && (
                                          <Button 
                                            variant="outline" 
                                            disabled={!dataService.canManageTeam()}
                                            className="rounded-xl font-black uppercase text-[9px] tracking-widest gap-2 h-10 border-slate-200 disabled:opacity-30"
                                            onClick={() => dataService.canManageTeam() && startEditing(user)}
                                          >
                                              <Edit2 className="h-3 w-3" />
                                              Editar Dados Cadastrais
                                          </Button>
                                      )}
                                  </div>
                              </div>

                              <div className="col-span-2 space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governança e Permissões</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.keys(PERMISSION_LABELS).map((permKey) => (
                                      <div key={permKey} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-all shadow-sm">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-xs font-black uppercase tracking-tight text-slate-700">
                                            {PERMISSION_LABELS[permKey].label}
                                          </span>
                                          <span className="text-[9px] text-slate-400 uppercase font-bold">
                                            {PERMISSION_LABELS[permKey].description}
                                          </span>
                                        </div>
                                        <Switch 
                                          checked={user.permissoes?.[permKey] || false}
                                          onCheckedChange={() => togglePermission(user.id, permKey)}
                                          disabled={!dataService.canManageTeam()}
                                        />
                                      </div>
                                    ))}
                                  </div>
                              </div>
                          </div>
                      </CollapsibleContent>
                    </Collapsible>
                </Card>
            ))
        )}
      </div>

      {!isLoading && users.length === 0 && (
        <Card className="p-20 text-center rounded-[3rem] border-dashed border-2">
          <Activity className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-400">Vazio Estrutural</h3>
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-2">Nenhum membro ativo foi encontrado na base de dados.</p>
        </Card>
      )}

      {/* DIÁLOGO DE UPLOAD DE AVATAR */}
      <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-primary/20 bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Upload de Avatar</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Selecione e ajuste a imagem para o perfil do membro.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ImageUploader 
              canEditImages={true}
              onImageSelect={handleAvatarUpload}
              onClose={() => setIsUploaderOpen(false)}
            />
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2rem] z-50">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Enviando para o Firebase...</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
