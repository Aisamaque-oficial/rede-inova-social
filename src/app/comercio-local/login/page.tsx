"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, LogIn, Lock, Mail, Store, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { comercioService } from "@/lib/comercio-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ComercioLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { sucesso, perfil, mensagem } = await comercioService.login(email, senha);
      if (sucesso && perfil) {
        // Para o MVP, salvamos no localStorage (em prod deve ser cookie HTTP Only)
        localStorage.setItem("comercio_user", JSON.stringify(perfil));
        if (perfil.tipo === "produtor") {
          router.push("/comercio-local/dashboard");
        } else {
          router.push("/comercio-local/secretaria");
        }
      } else {
        setError(mensagem || "Falha ao realizar login.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-5xl mx-auto p-4 z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: Brand & Context */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-4">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Voltar para o site Principal
          </Link>
          <div className="inline-flex items-center justify-center md:justify-start gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <Store className="w-6 h-6 text-primary" />
            <span className="font-black text-sm uppercase tracking-widest text-slate-700">Comércio Local</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-800 leading-[0.9]">
            Painel do <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              Agricultor
            </span>
          </h1>
          <p className="text-slate-600 font-medium text-lg max-w-md mx-auto md:mx-0">
            Acesse o sistema para expor seus produtos na vitrine digital do seu município e gerenciar seus pedidos.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Acessar Conta</h2>
              <p className="text-sm font-medium text-slate-500 mt-2">Para Produtores e Secretarias</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail cadastrado"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-6 font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                {loading ? "Autenticando..." : "Entrar no Sistema"}
                {!loading && <LogIn className="w-4 h-4 ml-2" />}
              </Button>
              
              <div className="mt-6 text-center border-t border-slate-100 pt-6">
                <p className="text-sm font-medium text-slate-500 mb-2">Ainda não expõe seus produtos?</p>
                <Link href="/comercio-local/cadastro" className="text-primary font-bold text-sm hover:underline flex items-center justify-center gap-2">
                    Criar conta de Produtor gratuitamente
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
