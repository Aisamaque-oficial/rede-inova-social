"use client";

import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  BookOpen, 
  Bookmark,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InstitutionalBook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  coverColor: string;
  accentColor: string;
  url: string;
}

const books: InstitutionalBook[] = [
  {
    id: 'cnpq-proj',
    title: 'Projeto Estruturante Rede Inova',
    subtitle: 'Submissão Oficial CNPQ 2026',
    description: 'Documento base que detalha a fundamentação teórica, metodológica e orçamentária do projeto de inovação social.',
    category: 'Oficial / Executivo',
    coverColor: 'bg-slate-900',
    accentColor: 'text-primary',
    url: '#'
  },
  {
    id: 'orientacao-ind',
    title: 'Manual de Orientação Individual',
    subtitle: 'Protocolo de Conduta e Atuação',
    description: 'Diretrizes formais para os membros vinculados às coordenações, garantindo alinhamento técnico e institucional.',
    category: 'Governança / RH',
    coverColor: 'bg-primary',
    accentColor: 'text-white',
    url: '#'
  }
];

export function InstitutionalLibrary() {
  return (
    <section className="space-y-10 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary mb-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Acervo Institucional</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-800">
            Biblioteca de <span className="text-primary italic">Governança</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xl">
            Acesso centralizado aos documentos oficiais, termos de referência e manuais técnicos da Rede Inova.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {books.map((book, idx) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            {/* Sombra de profundidade (Book Shadow) */}
            <div className="absolute -inset-4 bg-slate-900/5 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <Card className="relative border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white hover:shadow-primary/5 transition-all duration-700 p-0">
              <div className="flex flex-col md:flex-row min-h-[300px]">
                {/* CAPA DO LIVRO (VISUAL) */}
                <div className={cn(
                  "w-full md:w-48 shrink-0 relative flex flex-col justify-between p-8 border-r border-slate-100/10",
                  book.coverColor
                )}>
                  {/* Textura de lombada */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <Bookmark className={cn("h-8 w-8 mb-4", book.accentColor)} />
                    <div className="w-12 h-1 bg-white/10 rounded-full" />
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <span className="block text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">REDE INOVA</span>
                    <FileText className="h-10 w-10 text-white/20 mx-auto" />
                  </div>
                </div>

                {/* CONTEÚDO TÉCNICO */}
                <CardContent className="flex-1 p-10 flex flex-col justify-between space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-3 bg-primary/5">
                        {book.category}
                      </Badge>
                      <div className="flex -space-x-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[6px] font-black text-slate-400">
                             PDF
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-slate-800 leading-tight group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{book.subtitle}</p>
                    </div>
                    
                    <p className="text-xs font-medium text-slate-500 italic leading-relaxed line-clamp-3">
                      "{book.description}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Button 
                      className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200"
                      onClick={() => window.open(book.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" /> Baixar Documento
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-14 w-14 rounded-2xl border-slate-100 hover:bg-slate-50 group/eye"
                      title="Visualizar no Navegador"
                    >
                      <Eye className="h-5 w-5 text-slate-400 group-hover/eye:text-primary transition-colors" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
