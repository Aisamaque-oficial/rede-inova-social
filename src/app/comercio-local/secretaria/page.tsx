"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { infraestruturaService } from "@/lib/infraestrutura-service";
import { LogOut, BarChart3, Users, Store, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function SecretariaDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth(true);
  const [metricas, setMetricas] = useState({ totalProdutores: 0, totalProdutosAtivos: 0, totalCliques: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '', email: '', senha: '', telefone: '', nome_propriedade: '', comunidade_distrito: ''
  });

  useEffect(() => {
    if (profile && profile.tipo_perfil === "secretaria") {
      const fetchMetricas = async () => {
        const data = await infraestruturaService.getMetricasSecretaria(profile.cidade_slug);
        setMetricas(data);
        setLoading(false);
      };
      fetchMetricas();
    } else if (profile && profile.tipo_perfil !== "secretaria") {
      router.push("/");
    }
  }, [profile, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/comercio-local/login");
  };

  const handleCadastrarProdutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        cidade_slug: profile.cidade_slug,
        coordenadas: {}
      };
      
      const res = await fetch('/api/admin/produtores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      alert('Produtor cadastrado com sucesso!');
      setIsModalOpen(false);
      setFormData({ nome_completo: '', email: '', senha: '', telefone: '', nome_propriedade: '', comunidade_distrito: '' });
      // Atualizar métricas (simples)
      setMetricas(prev => ({ ...prev, totalProdutores: prev.totalProdutores + 1 }));
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !profile) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Painel da Secretaria</h1>
            <p className="text-xs font-medium text-slate-500">Município: {profile.cidade_slug.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-full">
              {profile.nome_completo}
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
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} className="rounded-full gap-2 bg-primary text-white font-bold hover:bg-primary/90 shadow-sm">
              <Plus className="w-4 h-4" /> Cadastrar Produtor
            </Button>
            <Button asChild variant="outline" className="rounded-full gap-2 border-slate-200 shadow-sm text-slate-600 font-bold">
              <Link href={`/territorio/${profile.cidade_slug}/agricultores`} target="_blank">
                Ver Vitrine Pública <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
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

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Novo Produtor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <form onSubmit={handleCadastrarProdutor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Nome Completo</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2 font-medium" value={formData.nome_completo} onChange={e => setFormData({...formData, nome_completo: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Nome da Propriedade (Opcional)</label>
                <input type="text" className="w-full border rounded-xl px-4 py-2 font-medium" value={formData.nome_propriedade} onChange={e => setFormData({...formData, nome_propriedade: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Comunidade/Distrito</label>
                  <input type="text" className="w-full border rounded-xl px-4 py-2 font-medium" value={formData.comunidade_distrito} onChange={e => setFormData({...formData, comunidade_distrito: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">WhatsApp (apenas números)</label>
                  <input required type="text" className="w-full border rounded-xl px-4 py-2 font-medium" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">E-mail de Acesso</label>
                  <input required type="email" className="w-full border rounded-xl px-4 py-2 font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Senha Inicial</label>
                  <input required type="text" className="w-full border rounded-xl px-4 py-2 font-medium" placeholder="Ex: Mudar123" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase">
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Perfil'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
