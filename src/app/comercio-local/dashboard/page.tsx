"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComercioPerfil, ComercioProduto, comercioService } from "@/lib/comercio-service";
import { LogOut, Plus, Package, Edit, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProducerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<ComercioPerfil | null>(null);
  const [produtos, setProdutos] = useState<ComercioProduto[]>([]);
  const [loading, setLoading] = useState(true);

  // States for new product modal/form
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem("comercio_user");
      if (!stored) {
        router.push("/comercio-local/login");
        return;
      }
      
      const parsed = JSON.parse(stored) as ComercioPerfil;
      if (parsed.tipo !== "produtor") {
        router.push("/comercio-local/secretaria");
        return;
      }

      setUser(parsed);
      await carregarProdutos(parsed.id);
    };
    checkAuth();
  }, []);

  const carregarProdutos = async (id: string) => {
    setLoading(true);
    const data = await comercioService.getProdutosPorProdutor(id);
    setProdutos(data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("comercio_user");
    router.push("/comercio-local/login");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await comercioService.adicionarProduto({
      produtor_id: user.id,
      cidade_slug: user.cidade_slug,
      nome,
      preco: parseFloat(preco),
      unidade,
      descricao,
      imagem_url: imagemUrl,
      ativo: true
    });
    
    setShowForm(false);
    setNome(""); setPreco(""); setUnidade("un"); setDescricao(""); setImagemUrl("");
    await carregarProdutos(user.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este produto?")) {
      await comercioService.deletarProduto(id);
      if (user) await carregarProdutos(user.id);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Painel do Produtor</h1>
            <p className="text-xs font-medium text-slate-500">Vitrine: {user.cidade_slug.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
              Olá, {user.nome}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Top metrics/actions */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Meus Produtos</p>
                <p className="text-3xl font-black text-slate-800">{produtos.length}</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
          >
            {showForm ? "Cancelar" : "Adicionar Produto"}
            {!showForm && <Plus className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Formulário (Conditional) */}
        {showForm && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl mb-12 animate-in slide-in-from-top-4">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Novo Produto</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Nome do Produto</label>
                <input required type="text" value={nome} onChange={e=>setNome(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-700 font-medium" placeholder="Ex: Alface Crespa" />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Preço (R$)</label>
                  <input required type="number" step="0.01" value={preco} onChange={e=>setPreco(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-700 font-medium" placeholder="0.00" />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Unidade</label>
                  <select value={unidade} onChange={e=>setUnidade(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-700 font-medium">
                    <option value="un">Unidade</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="maço">Maço</option>
                    <option value="caixa">Caixa</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">URL da Imagem (Opcional)</label>
                <input type="url" value={imagemUrl} onChange={e=>setImagemUrl(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-700 font-medium" placeholder="https://..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Descrição Breve</label>
                <textarea value={descricao} onChange={e=>setDescricao(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-700 font-medium" rows={3} placeholder="Detalhes do produto..."></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 font-bold">Salvar Produto</Button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Produtos */}
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Seus Produtos na Vitrine</h2>
        
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">Carregando...</div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 border-dashed">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map(p => (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.ativo ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {p.ativo ? "Online" : "Inativo"}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => p.id && handleDelete(p.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {p.imagem_url && (
                  <div className="w-full h-40 rounded-2xl mb-4 bg-slate-100 overflow-hidden">
                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{p.nome}</h3>
                <p className="text-2xl font-black text-primary mb-4">R$ {p.preco.toFixed(2)} <span className="text-sm text-slate-400 font-medium">/{p.unidade}</span></p>
                {p.descricao && <p className="text-sm text-slate-500 line-clamp-2">{p.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
