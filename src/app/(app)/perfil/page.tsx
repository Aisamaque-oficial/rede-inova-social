"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
    User, 
    Lock, 
    CheckCircle2, 
    ShieldCheck, 
    Globe, 
    Briefcase,
    Loader2,
    Eye,
    EyeOff,
    Info,
    AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageUploader } from "@/components/image-uploader";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);
    
    // Profile states
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("");
    const [bio, setBio] = useState("");
    const [lattes, setLattes] = useState("");
    
    // Password states
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [canEdit, setCanEdit] = useState(false);
    const [canChangePhoto, setCanChangePhoto] = useState(false);

    useEffect(() => {
        const sessao = dataService.obterSessaoAtual();
        if (sessao) {
            setSession(sessao);
            setNome(sessao.nomeCompleto || "");
            setCargo(sessao.cargo || "");
            setBio(sessao.bio || "");
            setLattes(sessao.lattesUrl || "");
            setCanEdit(dataService.canEditUserProfile(sessao.userId));
            setCanChangePhoto(dataService.canChangeAvatar());
        }
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        
        setLoading(true);
        try {
            const res = await dataService.updateUserProfile(session.userId, {
                nomeCompleto: nome,
                cargo: cargo,
                bio: bio,
                lattesUrl: lattes
            });

            if (res.sucesso) {
                toast({
                    title: "Perfil Atualizado",
                    description: "Seus dados foram salvos com sucesso.",
                });
                
                // Atualizar sessão local sem reload se possível, ou reload para garantir
                const novaSessao = await dataService.obterSessaoAtual();
                setSession(novaSessao);
            } else {
                toast({
                    title: "Erro ao atualizar",
                    description: res.mensagem,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Erro sistêmico",
                description: "Não foi possível salvar as alterações.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (file: File, previewUrl: string) => {
        if (!session) return;
        
        setLoading(true);
        setUploadProgress(0);
        try {
            const downloadUrl = await dataService.uploadAvatar(
                session.userId, 
                file, 
                (p) => setUploadProgress(p)
            );
            
            // Atualizar estado local
            setSession((prev: any) => ({ ...prev, avatarUrl: downloadUrl }));
            
            toast({
                title: "Foto Atualizada",
                description: "Sua nova foto de perfil foi salva com sucesso.",
            });
            setIsUploaderOpen(false);
            
            // Forçar atualização do menu/sidebar
            const event = new CustomEvent('user-profile-updated', { detail: { avatarUrl: downloadUrl } });
            window.dispatchEvent(event);
        } catch (error: any) {
            toast({
                title: "Erro no Upload",
                description: error.message || "Não foi possível enviar a imagem.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (novaSenha !== confirmSenha) {
            toast({
                title: "Senhas não conferem",
                description: "A nova senha e a confirmação devem ser iguais.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const res = await dataService.alterarMinhaSenha(senhaAtual, novaSenha);
            if (res.sucesso) {
                toast({
                    title: "Senha Alterada",
                    description: "Sua senha foi atualizada com sucesso.",
                });
                setSenhaAtual("");
                setNovaSenha("");
                setConfirmSenha("");
            } else {
                toast({
                    title: "Falha na alteração",
                    description: res.mensagem,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Erro ao processar",
                description: "Verifique sua conexão e tente novamente.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <header className="space-y-2 px-2">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-800">
                    Meu <span className="text-primary">Perfil</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Gerencie suas informações institucionais e segurança
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coluna Lateral: Resumo */}
                <aside className="space-y-6">
                    <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[3rem] overflow-hidden">
                        <div className="p-8 text-center space-y-4">
                             <div className="relative group mx-auto w-24 h-24">
                                <div className="w-full h-full rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl font-black italic text-primary overflow-hidden">
                                    {session?.avatarUrl ? (
                                        <img src={session.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        nome.charAt(0) || "U"
                                    )}
                                </div>
                                <Button
                                    onClick={() => canChangePhoto && setIsUploaderOpen(true)}
                                    size="icon"
                                    className={cn(
                                        "absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary text-white shadow-lg transition-opacity",
                                        canChangePhoto ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
                                    )}
                                >
                                    <Globe className="w-4 h-4" />
                                </Button>
                            </div>
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-tighter italic leading-tight">{nome}</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 opacity-80">{cargo || "Membro Ativo"}</p>
                            </div>
                            {canChangePhoto ? (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setIsUploaderOpen(true)}
                                    className="w-full rounded-xl border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest mt-2"
                                >
                                    Alterar Foto
                                </Button>
                            ) : (
                                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-3 h-3 text-primary animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Identidade Institucional</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                                        Fotos de perfil são gerenciadas exclusivamente pela Coordenação Geral.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white/5 p-6 space-y-3">
                            <div className="flex items-center gap-3 text-xs">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="font-bold opacity-70">Conta Ativa & Verificada</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <Globe className="w-4 h-4 text-blue-400" />
                                <span className="font-bold opacity-70 italic uppercase tracking-widest text-[9px]">Setor: {session?.department || "Geral"}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 italic text-[10px] text-slate-500 font-medium leading-relaxed">
                        "Suas informações biográficas ajudam a transparecer sua jornada e experiência dentro do projeto Rede Inova Social."
                    </div>
                </aside>

                {/* Coluna Principal: Formulários */}
                <div className="md:col-span-2 space-y-8">
                    {/* Dados Pessoais */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <User className="w-5 h-5 text-primary" />
                                Dados Institucionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
                                        <Input 
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="rounded-xl bg-slate-50 border-none h-12 text-sm font-bold focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cargo / Função</Label>
                                        <Input 
                                            value={cargo}
                                            onChange={(e) => setCargo(e.target.value)}
                                            className="rounded-xl bg-slate-50 border-none h-12 text-sm font-bold focus-visible:ring-primary/20"
                                            placeholder="Ex: Coordenador Técnico"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Currículo Lattes (URL)</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input 
                                            value={lattes}
                                            onChange={(e) => setLattes(e.target.value)}
                                            className="rounded-xl bg-slate-50 border-none h-12 pl-10 text-sm font-bold focus-visible:ring-primary/20"
                                            placeholder="http://lattes.cnpq.br/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mini-Biografia</Label>
                                    <Textarea 
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="rounded-[1.5rem] bg-slate-50 border-none min-h-[120px] text-sm font-medium focus-visible:ring-primary/20"
                                        placeholder="Conte um pouco sobre sua atuação no projeto..."
                                    />
                                </div>

                                <div className="pt-4">
                                    {canEdit ? (
                                        <Button 
                                            disabled={loading}
                                            className="w-full sm:w-auto px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                            Salvar Alterações
                                        </Button>
                                    ) : (
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                            A edição de dados institucionais é restrita à coordenação geral.
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Segurança / Senha */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-50/30">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <Lock className="w-5 h-5 text-red-500" />
                                Segurança & Acesso
                            </CardTitle>
                            <CardDescription className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-1">Troque sua senha periodicamente</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha Atual</Label>
                                    <div className="relative">
                                        <Input 
                                            type={showPasswords ? "text" : "password"}
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}
                                            className="rounded-xl bg-white border-slate-100 h-12 text-sm font-bold focus-visible:ring-red-200"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                        >
                                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nova Senha</Label>
                                        <Input 
                                            type={showPasswords ? "text" : "password"}
                                            value={novaSenha}
                                            onChange={(e) => setNovaSenha(e.target.value)}
                                            className="rounded-xl bg-white border-slate-100 h-12 text-sm font-bold focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar Nova Senha</Label>
                                        <Input 
                                            type={showPasswords ? "text" : "password"}
                                            value={confirmSenha}
                                            onChange={(e) => setConfirmSenha(e.target.value)}
                                            className="rounded-xl bg-white border-slate-100 h-12 text-sm font-bold focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        variant="outline"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-slate-200 hover:bg-slate-100"
                                    >
                                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                                        Atualizar Senha
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal de Upload */}
            <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
                    <div className="h-2 bg-gradient-to-r from-primary to-teal-500" />
                    <div className="p-8">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Atualizar Foto de Perfil</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Escolha uma imagem quadrada para melhor visualização na galeria.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <ImageUploader 
                            canEditImages={true}
                            onImageSelect={handleAvatarUpload}
                            isLoading={loading}
                            progress={uploadProgress}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
