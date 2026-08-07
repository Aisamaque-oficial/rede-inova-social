"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComercioPerfil, comercioService } from "@/lib/comercio-service";
import { LogOut, BarChart3, Users, Store, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SecretariaDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<ComercioPerfil | null>(null);
  const [metricas, setMetricas] = useState({ totalProdutores: 0, totalProdutosAtivos: 0, totalCliques: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem("comercio_user");
      if (!stored) {
        router.push("/comercio-local/login");
        return;
      }
      
      const parsed = JSON.parse(stored) as ComercioPerfil;
      if (parsed.tipo !== "secretaria") {
        router.push("/comercio-local/dashboard");
        return;
      }

      setUser(parsed);
      const data = await comercioService.getMetricasSecretaria(parsed.cidade_slug);
      setMetricas(data);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("comercio_user");
    router.push("/comercio-local/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Painel da Secretaria</h1>
            <p className="text-xs font-medium text-slate-500">Município: {user.cidade_slug.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-full">
              {user.nome}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Visão Geral</h2>
             <p className="text-slate-500 font-medium mt-2">Acompanhe a movimentação da vitrine digital da sua cidade.</p>
          </div>
          <Button asChild variant="outline" className="rounded-full gap-2 border-slate-200 shadow-sm text-slate-600 font-bold">
            <Link href={`/territorio/${user.cidade_slug}/agricultores`} target="_blank">
              Ver Vitrine Pública <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Carregando métricas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Produtores Cadastrados</p>
              <p className="text-5xl font-black text-slate-800">{metricas.totalProdutores}</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Produtos Ativos na Vitrine</p>
              <p className="text-5xl font-black text-slate-800">{metricas.totalProdutosAtivos}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Interesses (Cliques via Whats)</p>
              <p className="text-5xl font-black text-primary">{metricas.totalCliques}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Relatórios Detalhados</h3>
            <p className="text-slate-500 font-medium mb-6">O módulo de relatórios avançados (exportação PDF/Excel) estará disponível na próxima atualização do sistema.</p>
        </div>
      </main>
    </div>
  );
}
