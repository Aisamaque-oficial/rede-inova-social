"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import MainHeader from "@/components/main-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  History, 
  Search, 
  Calendar, 
  User, 
  ExternalLink, 
  Clock,
  ArrowRight,
  Sparkles,
  PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CMS_FIELDS_KEYS = [
  "landing_hero_title",
  "landing_hero_subtitle",
  "landing_feed_title",
  "landing_feed_subtitle",
  "footer_quote"
];

export default function ArquivoHistoricoPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAllHistory() {
      const results = [];
      for (const key of CMS_FIELDS_KEYS) {
        const data = await dataService.getCMSData(key);
        if (data.history && data.history.length > 0) {
          results.push({
            id: key,
            current: data.content,
            currentVideo: data.librasVideoUrl,
            history: data.history
          });
        }
      }
      setHistoryData(results);
      setIsLoading(false);
    }
    loadAllHistory();
  }, []);

  const filteredData = historyData.filter(item => 
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.current.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900">
      <MainHeader />
      
      <main className="flex-1 container px-4 py-32 max-w-6xl mx-auto">
        <div className="space-y-12">
            <header className="text-center space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 text-[10px] font-black uppercase tracking-[0.3em]"
                >
                    <History className="h-4 w-4" />
                    <span>Transparência Institucional</span>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 uppercase italic leading-none"
                >
                    Arquivo Histórico <br />
                    <span className="text-primary italic">de Informações</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg text-slate-500 font-medium italic"
                >
                    Consulte a evolução cronológica das informações do portal e suas respectivas traduções em Libras. 
                    Nossa governança garante que todas as mudanças sejam registradas publicamente.
                </motion.p>
            </header>

            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                    placeholder="Filtrar por nome de seção ou conteúdo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-xl shadow-slate-200/50 text-slate-800 font-medium focus:ring-primary"
                />
            </div>

            <div className="grid gap-12">
                <AnimatePresence mode="popLayout">
                    {filteredData.map((field, idx) => (
                        <motion.section 
                            key={field.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[4rem] p-4 md:p-12 shadow-2xl shadow-slate-200/40 ring-1 ring-slate-100 overflow-hidden relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100">
                                <div className="space-y-2">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5 px-3 py-1">Seção: {field.id}</Badge>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">{field.id.split('_').join(' ')}</h3>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                    <Sparkles className="h-5 w-5 animate-pulse" />
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Status Atual</p>
                                        <p className="text-sm font-black uppercase tracking-tighter">Informação Vigente</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100/50 shadow-inner">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Conteúdo Atual
                                    </p>
                                    <p className="text-xl font-medium text-slate-700 leading-relaxed italic">
                                        "{field.current}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-slate-100" />
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <History className="h-3 w-3" /> Linha do Tempo de Alterações
                                        </h4>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>

                                    <div className="grid gap-6">
                                        {field.history.map((ver: any, vIdx: number) => (
                                            <div key={vIdx} className="group flex gap-8 items-start relative pb-8">
                                                {/* Vertical line connector */}
                                                {vIdx !== field.history.length - 1 && (
                                                    <div className="absolute left-[23px] top-12 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-transparent" />
                                                )}

                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                                                    <Calendar className="h-5 w-5" />
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black text-slate-800">Versão Anterior</span>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{ver.updatedAt ? new Date(ver.updatedAt).toLocaleString('pt-BR') : 'Data não registrada'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                            <User className="h-3 w-3" /> Editado por: {ver.updatedByName || 'Sistema'}
                                                        </div>
                                                    </div>

                                                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/20 group-hover:border-primary/20 group-hover:shadow-primary/5 transition-all duration-500">
                                                        <p className="text-slate-500 font-medium italic mb-4 leading-relaxed">
                                                            "{ver.content}"
                                                        </p>
                                                        
                                                        {ver.librasVideoUrl && (
                                                            <a 
                                                                href={ver.librasVideoUrl}
                                                                target="_blank"
                                                                className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
                                                            >
                                                                <PlayCircle className="h-4 w-4" />
                                                                Assistir Tradução Libras da Época
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </AnimatePresence>

                {filteredData.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-white rounded-[4rem] shadow-xl italic text-slate-400">
                        Nenhum histórico encontrado para esta busca.
                    </div>
                )}
            </div>
        </div>
      </main>

      <footer className="w-full py-16 bg-slate-900 text-white mt-auto">
        <div className="container px-4 text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Rede de Inovação Social</p>
            <p className="text-slate-400 font-medium text-xs max-w-xl mx-auto">
                Este arquivo é gerado automaticamente pelo nosso sistema de governança digital, garantindo que toda a evolução do projeto seja transparente aos cidadãos.
            </p>
        </div>
      </footer>
    </div>
  );
}
