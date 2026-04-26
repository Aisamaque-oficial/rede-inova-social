"use client";

import React, { useState } from "react";
import { 
  Home, 
  ChevronRight, 
  Folder, 
  FileText, 
  ShieldCheck, 
  Search, 
  Download, 
  Filter,
  ArrowLeft,
  Info,
  ExternalLink,
  Lock,
  FileBadge,
  BadgeCheck,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GlobalActivityTable from "@/components/global-activity-table";

type DocCategory = {
  id: string;
  name: string;
  icon: any;
  description: string;
  count: number;
  color: string;
};

const CATEGORIES: DocCategory[] = [
  { id: 'institucional', name: 'Institucional', icon: ShieldCheck, description: 'Projeto submetido ao CNPQ, regimentos e normas.', count: 5, color: 'text-slate-600' },
  { id: 'orientacao', name: 'Orientação Individual', icon: UserCheck, description: 'Documentos de orientação vinculados aos setores.', count: 18, color: 'text-amber-500' },
  { id: 'pma', name: 'Relatórios PMA', icon: FileBadge, description: 'Monitoramento estratégico e avaliação setorial.', count: 24, color: 'text-indigo-500' },
  { id: 'comunicacao', name: 'Comunicação', icon: Image, description: 'Identidade visual, logos e modelos de posts.', count: 45, color: 'text-blue-500' },
];

// Fallback for missing icons
import { Image, UserCheck } from "lucide-react";

const MOCK_DOCS = [
  { id: '1', name: 'Projeto Consolidado - Submissão CNPQ.pdf', category: 'institucional', size: '4.2 MB', date: '12/01/2026', type: 'PDF' },
  { id: '2', name: 'Regimento Interno Rede Inova 2026.pdf', category: 'institucional', size: '2.4 MB', date: '15/01/2026', type: 'PDF' },
  { id: '3', name: 'Relatório Trimestral ASCOM - Q1.pdf', category: 'pma', size: '5.8 MB', date: '10/03/2026', type: 'PDF' },
  { id: '4', name: 'Manual de Identidade Visual.zip', category: 'comunicacao', size: '15 MB', date: '20/02/2026', type: 'ZIP' },
  { id: '5', name: 'Orientação Individual - Setor ASCOM.pdf', category: 'orientacao', size: '1.1 MB', date: '01/04/2026', type: 'PDF' },
  { id: '6', name: 'Ficha de Acompanhamento - ACESSIBILIDADE.pdf', category: 'orientacao', size: '0.9 MB', date: '02/04/2026', type: 'PDF' },
];

export default function DocumentosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);
  
  const filteredDocs = MOCK_DOCS.filter(doc => 
    (!selectedCategory || doc.category === selectedCategory) &&
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Breadcrumb e Ações Rápidas */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors italic">
            <Home className="w-3 h-3" /> Início
          </Link>
          <span className="opacity-30">/</span>
          {selectedCategory ? (
            <>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="hover:text-primary transition-colors italic"
              >
                Central de Documentos
              </button>
              <span className="opacity-30">/</span>
              <span className="text-primary italic uppercase">{activeCategory?.name}</span>
            </>
          ) : (
            <span className="text-primary italic">Central de Documentos</span>
          )}
        </nav>

        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-9">
                <Download className="w-3 h-3 mr-2" /> Backup Total
            </Button>
            <Button size="sm" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-9 bg-slate-900 border-none">
                <Lock className="w-3 h-3 mr-2" /> Acesso restrito
            </Button>
        </div>
      </div>

      {/* Header Estilizado */}
      {!selectedCategory && (
        <section className="relative overflow-hidden p-12 rounded-[4rem] bg-slate-50 border border-slate-100 shadow-inner">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center text-primary shrink-0">
                 <Folder size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-2 text-center md:text-left flex-1">
                 <h1 className="text-4xl font-headline uppercase italic tracking-tighter text-slate-900 leading-none">
                    Repositório de <span className="text-primary">Ativos Institucionais</span>
                 </h1>
                 <p className="text-xs font-medium text-slate-400 italic max-w-2xl leading-relaxed">
                    Central de normas, editais, manuais e memórias do projeto Rede Inova Social. 
                    Todos os arquivos são auditados e protegidos por criptografia de acesso setorial.
                 </p>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="BUSCAR DOCUMENTO..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 bg-white border-slate-100 rounded-2xl pl-11 pr-4 text-[10px] font-black placeholder:text-slate-400 focus:ring-primary/10 transition-all uppercase tracking-widest"
                />
              </div>
           </div>
        </section>
      )}

      {/* Grid de Categorias (Pastas) */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {CATEGORIES.map((cat) => (
             <Card 
               key={cat.id}
               onClick={() => setSelectedCategory(cat.id)}
               className="group relative h-72 rounded-[3.5rem] border-none shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 cursor-pointer overflow-hidden bg-white"
             >
                <div className={cn("absolute top-0 right-0 w-20 h-20 blur-3xl rounded-full opacity-10 group-hover:opacity-30 transition-opacity", cat.color.replace('text-', 'bg-'))} />
                <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                   <div className={cn("h-16 w-16 rounded-[2rem] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white", cat.color)}>
                      <cat.icon size={32} />
                   </div>
                   <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-headline uppercase italic tracking-tighter text-slate-800 leading-none group-hover:text-primary transition-colors">{cat.name}</h4>
                        <p className="text-[10px] font-medium text-slate-400 line-clamp-2 italic mt-2 leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-4 border-t border-slate-50">
                          <span className="text-slate-300">{cat.count} Arquivos</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* Cabeçalho da Pasta Aberta */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => setSelectedCategory(null)}
                   className="h-12 w-12 rounded-2xl hover:bg-slate-100"
                 >
                    <ArrowLeft size={24} />
                 </Button>
                 <div>
                    <h2 className="text-3xl font-headline uppercase italic tracking-tighter text-slate-900 leading-none">{activeCategory?.name}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1 opacity-70">Diretório Oficial / Rede Inova</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    <Filter className="w-4 h-4 mr-2" /> Filtrar Data
                 </Button>
              </div>
           </div>

           {/* Lista de Arquivos Estilizada */}
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white ring-1 ring-slate-100 italic">
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                       <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-100">
                             <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Nome do Arquivo</th>
                             <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Data Modificação</th>
                             <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Tamanho</th>
                             <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                             <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc) => (
                              <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                                 <td className="p-6">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                          <FileText size={20} />
                                       </div>
                                       <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{doc.name}</span>
                                    </div>
                                 </td>
                                 <td className="p-6">
                                    <span className="text-xs font-medium text-slate-400">{doc.date}</span>
                                 </td>
                                 <td className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {doc.size}
                                 </td>
                                 <td className="p-6">
                                    <Badge variant="outline" className="bg-slate-50 border-slate-200 text-[8px] font-black uppercase tracking-widest">
                                       {doc.type}
                                    </Badge>
                                 </td>
                                 <td className="p-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/5">
                                          <Download size={16} />
                                       </Button>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300">
                                          <MoreVertical size={16} />
                                       </Button>
                                    </div>
                                 </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                               <td colSpan={5} className="p-20 text-center">
                                  <Info className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                  <p className="text-sm font-black uppercase italic text-slate-400">Nenhum arquivo nesta categoria</p>
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}

      {/* Visualização de Legado (Atribuições) */}
      {!selectedCategory && (
        <div className="space-y-8 pt-10 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="space-y-1">
                <h3 className="text-2xl font-headline uppercase italic tracking-tighter text-slate-800">
                   Central de <span className="text-primary">Atribuições</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Histórico de demandas por setor e fluxos operacionais.</p>
             </div>
             <Link href="/registro-publico">
               <Button variant="ghost" className="rounded-xl text-[10px] font-black uppercase tracking-widest italic group">
                  Ver Registro Público <ExternalLink className="ml-2 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Button>
             </Link>
          </div>
          <div className="bg-slate-50/50 rounded-[4rem] p-1 border border-slate-100 shadow-inner">
            <GlobalActivityTable />
          </div>
        </div>
      )}
    </div>
  );
}
