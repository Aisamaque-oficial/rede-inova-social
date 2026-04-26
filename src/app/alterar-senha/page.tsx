
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/lib/data-service";
import { Loader2, ShieldCheck, ShieldAlert, KeyRound } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logotransparente.png";

export default function AlterarSenhaPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se existe um temp_user_id ou se o usuário já está logado e precisa trocar senha
    const tempId = localStorage.getItem("temp_user_id");
    const session = dataService.obterSessaoAtual();
    
    if (tempId) {
      setUserId(tempId);
    } else if (session) {
      // Se já está logado mas caiu aqui, ok usar o ID da sessão
      setUserId(session.userId);
    } else {
      // Se não tem nada, volta pro login
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!userId) {
      setErro("Identificação do usuário não encontrada. Tente fazer login novamente.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const resultado = await dataService.trocarSenhaPrimeiroAcesso(userId, senhaAtual, novaSenha);

      if (resultado.sucesso) {
        toast({
          title: "✅ Senha Alterada!",
          description: "Sua senha foi atualizada com sucesso. Redirecionando...",
        });
        
        // Redirecionar para o dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setErro(resultado.mensagem || "Erro ao alterar senha");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErro("Erro interno ao processar sua solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId && !erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
              <Image
                src={logo}
                alt="Rede Inova Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <KeyRound className="w-6 h-6 text-indigo-600" />
              Alterar Senha
            </CardTitle>
            <CardDescription className="mt-2 text-balance">
              Por segurança, você deve alterar sua senha temporária no primeiro acesso.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ALERTAS DE ERRO */}
            {erro && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            {/* SENHA ATUAL */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual (Padrão)</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Ex: 123@Mudar"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <hr className="my-4 border-gray-100" />

            {/* NOVA SENHA */}
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-indigo-500"
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repita a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-lg shadow-md transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atualizando Senha...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Confirmar e Acessar Dashboard
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <div className="px-6 pb-6 text-center">
            <p className="text-xs text-gray-400">
                Sua nova senha deve ser forte e de conhecimento exclusivo seu.
            </p>
        </div>
      </Card>
    </div>
  );
}
