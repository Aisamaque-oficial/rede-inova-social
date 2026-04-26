"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { dataService } from "@/lib/data-service";
const logoPath = "/images/redeinova.png";
const logoCnpqPath = "/images/cnpq2.png";
import { formatarCPF, validarCPF } from "@/lib/auth";
import { ShieldCheck, Lock, User, ArrowRight, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [cpfOuEmail, setCpfOuEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  // Máscara de CPF em tempo real
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Se não parece e-mail (não tem @), aplica máscara de CPF
    if (!value.includes("@")) {
      value = value.replace(/\D/g, "");
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
    }
    
    setCpfOuEmail(value);
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setIsLoading(true);

    try {
      if (!cpfOuEmail.trim() || !senha.trim()) {
        setErro("Por favor, informe suas credenciais de acesso.");
        setIsLoading(false);
        return;
      }

      const resultado = await dataService.fazerLogin(cpfOuEmail, senha);

      if (resultado.sucesso && resultado.usuario) {
        setUsuarioLogado(resultado.usuario);
        
        const firstName = resultado.usuario?.nomeCompleto?.split(' ')[0] || "Membro";
        
        toast({
          title: "Acesso Autorizado",
          description: `Bem-vindo de volta, ${firstName}!`,
        });

        setTimeout(() => {
          router.push("/painel/dashboard");
        }, 2000);
      } else {
        setErro(resultado.mensagem || "Credenciais incorretas.");
      }
    } catch (error) {
      setErro("Ocorreu um erro ao processar seu login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
           <div className="relative inline-block">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                 <ShieldCheck className="w-12 h-12 text-emerald-500 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-950">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Credenciais Validadas</h2>
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest leading-none">
                 Sessão segura iniciada para <span className="text-emerald-400">{usuarioLogado.nomeCompleto}</span>
              </p>
           </div>
           <div className="flex justify-center gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Lado Esquerdo - Branding & Info */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]" />
           <div className="grid grid-cols-12 gap-4 w-full h-full p-4">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="aspect-square border border-white/10 rounded-lg" />
              ))}
           </div>
        </div>
        
        <div className="relative z-10 max-w-lg space-y-8">
            <div className="space-y-8 flex flex-col items-center">
               <div className="flex items-center gap-10 justify-center">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform p-3">
                     <Image src={logoPath} alt="Rede Inova Logo" width={160} height={160} className="opacity-90 object-contain w-[90%] h-[90%]" />
                  </div>
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform p-4">
                     <Image src={logoCnpqPath} alt="CNPq Logo" width={130} height={130} className="opacity-90 object-contain w-full h-full" />
                  </div>
               </div>
               <div className="text-center">
                  <h1 className="text-5xl font-black text-white italic tracking-tighter leading-tight uppercase">
                     Portal dos <br /> <span className="text-primary">Membros</span>
                  </h1>
               </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Sistema Unificado de Gestão Integrada da Rede Inova Social. 
                 Gestão transparente, segura e eficiente para todos os membros.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                 <p className="text-[10px] font-black text-white uppercase tracking-wider">Acesso Seguro</p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Criptografia de ponta a ponta</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <Lock className="w-5 h-5 text-amber-400 mb-2" />
                 <p className="text-[10px] font-black text-white uppercase tracking-wider">Privacidade total</p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Seus dados sensíveis protegidos</p>
              </div>
           </div>
        </div>

        <div className="absolute bottom-8 left-12">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2026 REDE INOVA SOCIAL • LABORATÓRIO LISSA</p>
        </div>
      </div>

      {/* Lado Direito - Form de Login */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white md:bg-transparent">
        <div className="w-full max-w-sm space-y-8">
          <div className="md:hidden flex flex-col items-center gap-4 mb-12">
             <div className="flex items-center justify-center gap-8 mb-4">
                <Image src={logoPath} alt="Logo" width={75} height={75} className="object-contain" />
                <Image src={logoCnpqPath} alt="CNPq" width={75} height={75} className="object-contain" />
             </div>
             <div className="text-center">
                <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Portal dos Membros</h1>
             </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Login de Acesso</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informe suas credenciais institucionais</p>
          </div>

          <form onSubmit={handleSubmitLogin} className="space-y-5">
            {erro && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-700 leading-tight">{erro}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">CPF ou E-mail</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpfOuEmail}
                    onChange={handleCpfChange}
                    disabled={isLoading}
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pass" className="text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">Senha de Acesso</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="pass"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading}
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !cpfOuEmail || !senha}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase italic tracking-tighter text-md group transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Validando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                   <span>Entrar no Painel</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>


        </div>
      </div>
    </div>
  );
}
