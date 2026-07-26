"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
    TrendingUp, 
    Map, 
    PackageOpen, 
    Store,
    Users,
    MapPin,
    ArrowUpRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { productsService } from "@/lib/products-service";
import { findNearestCities } from "@/lib/territory-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function MetricasTerritorioClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await productsService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products for metrics", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    
    // Calcula potencial economico (Soma do valor de todos os produtos)
    const totalValue = products.reduce((acc, product) => {
        const price = parseFloat(product.price) || 0;
        return acc + price;
    }, 0);

    const uniqueFarmers = new Set(products.map(p => p.farmerId)).size;

    // Agrupa por cidade para o gráfico
    const cityMap: Record<string, number> = {};
    products.forEach(p => {
        cityMap[p.citySlug] = (cityMap[p.citySlug] || 0) + 1;
    });

    const chartData = Object.entries(cityMap)
        .map(([city, count]) => ({
            name: city.charAt(0).toUpperCase() + city.slice(1),
            uv: count
        }))
        .sort((a, b) => b.uv - a.uv);

    return { totalProducts, totalValue, uniqueFarmers, chartData };
  }, [products]);

  const COLORS = ['#84cc16', '#a3e635', '#bef264', '#d9f99d'];

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin text-primary">
                <TrendingUp className="w-12 h-12" />
            </div>
        </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
             <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-800 flex items-center gap-3">
                Métricas do <span className="text-primary">Território</span>
             </h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Inteligência de Dados • Vitrine Solidária
             </p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                <PackageOpen className="w-32 h-32 text-primary" />
             </div>
             <div className="relative z-10 flex flex-col gap-4">
                 <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary">
                     <PackageOpen className="w-6 h-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total de Produtos</p>
                     <h2 className="text-5xl font-black text-slate-800 tracking-tighter mt-1">{metrics.totalProducts}</h2>
                 </div>
             </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-primary to-emerald-500 border-none rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 glass-morphism">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <TrendingUp className="w-32 h-32 text-white" />
             </div>
             <div className="relative z-10 flex flex-col gap-4">
                 <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl w-fit text-white shadow-inner">
                     <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-emerald-50 uppercase tracking-widest">Giro Econômico (R$)</p>
                     <h2 className="text-5xl font-black text-white tracking-tighter mt-1 drop-shadow-md">
                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalValue)}
                     </h2>
                 </div>
             </div>
          </Card>

          <Card className="p-8 bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                <Users className="w-32 h-32 text-blue-500" />
             </div>
             <div className="relative z-10 flex flex-col gap-4">
                 <div className="p-4 bg-blue-500/10 rounded-2xl w-fit text-blue-600">
                     <Users className="w-6 h-6" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Agricultores Ativos</p>
                     <h2 className="text-5xl font-black text-slate-800 tracking-tighter mt-1">{metrics.uniqueFarmers}</h2>
                 </div>
             </div>
          </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-8 bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/50 lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-slate-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">
                      Engajamento por Cidade
                  </h3>
              </div>
              <div className="h-[300px] w-full">
                  {metrics.chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="uv" radius={[6, 6, 0, 0]}>
                                {metrics.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <Store className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-bold">Nenhum produto cadastrado ainda no território.</p>
                      </div>
                  )}
              </div>
          </Card>

          <Card className="p-8 bg-slate-900 border-none rounded-[2rem] shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TrendingUp className="w-40 h-40" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white/10 rounded-xl">
                          <ArrowUpRight className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Top Engajamento</h3>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                      {metrics.chartData.slice(0, 5).map((city, index) => (
                          <div key={city.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                              <div className="flex items-center gap-3">
                                  <span className="text-xl font-black text-slate-500">{index + 1}</span>
                                  <span className="font-bold">{city.name}</span>
                              </div>
                              <span className="font-black text-primary px-3 py-1 bg-primary/10 rounded-full text-sm">
                                  {city.uv} itens
                              </span>
                          </div>
                      ))}
                      
                      {metrics.chartData.length === 0 && (
                          <div className="text-center text-slate-500 font-bold mt-10">
                              Os dados aparecerão aqui em breve.
                          </div>
                      )}
                  </div>
              </div>
          </Card>
      </div>

    </motion.div>
  );
}
