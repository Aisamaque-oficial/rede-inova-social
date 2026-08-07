"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, UserPlus, Lock, Mail, Store, AlertCircle, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { comercioService } from "@/lib/comercio-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCities } from "@/lib/territory-data";

export default function ComercioCadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [senha, setSenha] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const cities = getAllCities();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!cidade) {
        setError("Por favor, selecione sua cidade.");
        setLoading(false);
        return;
      }

      const sucessoCadastro = await comercioService.registrar({
          nome,
          user_email: email,
          telefone,
          cidade_slug: cidade,
          tipo: "produtor",
          senha_hash: senha // MVP simplificado sem hash complexo
      });

      if (sucessoCadastro) {
        setSucesso(true);
        setTimeout(() => {
            router.push("/comercio-local/login");
        }, 3000);
      } else {
        setError("Falha ao realizar cadastro. O e-mail pode já estar em uso.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] relative overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-5xl mx-auto p-4 z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <Link href="/comercio-local/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-4">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Voltar para o Login
          </Link>
          <div className="inline-flex items-center justify-center md:justify-start gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <UserPlus className="w-6 h-6 text-primary" />
            <span className="font-black text-sm uppercase tracking-widest text-slate-700">Seja um Fornecedor</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-800 leading-[0.9]">
            Cadastro de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              Produtor
            </span>
          </h1>
          <p className="text-slate-600 font-medium text-lg max-w-md mx-auto md:mx-0">
            Crie sua conta gratuitamente para expor seus produtos na vitrine digital e receber pedidos direto no seu WhatsApp.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
            
            {sucesso ? (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Store className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-2">Cadastro Realizado!</h2>
                    <p className="text-slate-500 font-medium">Sua conta foi criada com sucesso. Redirecionando para o login...</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Criar Conta</h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Preencha seus dados abaixo</p>
                    </div>

                    <form onSubmit={handleCadastro} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" required />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" required />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="WhatsApp (DDD + Número)" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" required />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                            <select value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium appearance-none focus:ring-2 focus:ring-primary/20 transition-all relative" required>
                                <option value="" disabled>Selecione sua cidade</option>
                                {cities.map(c => (
                                    <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Crie uma senha" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" required />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-6 font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">
                        {loading ? "Cadastrando..." : "Cadastrar Agora"}
                        {!loading && <UserPlus className="w-4 h-4 ml-2" />}
                    </Button>
                    </form>
                </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
