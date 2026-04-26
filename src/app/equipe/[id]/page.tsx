"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import MainHeader from "@/components/main-header";
import { 
  news, 
  scientificFragments, 
  communityEvents,
  User 
} from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  Newspaper, 
  Calendar, 
  ExternalLink,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MemberProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const member = useMemo(() => {
    const members = dataService.listarMembrosEquipe();
    return members.find(m => m.id === id);
  }, [id]);

  const productions = useMemo(() => {
    if (!member) return { news: [], fragments: [], events: [] };
    
    return {
      news: news.filter((n: any) => n.authorId === member.id),
      fragments: scientificFragments.filter((p: any) => p.authorId === member.id),
      events: communityEvents.filter((e: any) => e.coordinatorId === member.id)
    };
  }, [member]);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-slate-800">Membro não encontrado</h1>
          <Button onClick={() => router.push('/equipe')}>Voltar para Equipe</Button>
        </div>
      </div>
    );
  }

  const avatar = PlaceHolderImages.find(img => img.id === member.avatarId);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] selection:bg-primary/20 selection:text-primary">
      <MainHeader />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container px-4 md:px-6">
          {/* Breadcrumbs & Back Button */}
          <div className="mb-12 flex items-center justify-between">
            <Link 
              href="/equipe" 
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                <ArrowLeft size={14} />
              </div>
              Voltar para Equipe
            </Link>

            {member.lattesUrl && member.lattesUrl !== '#' && (
               <Button variant="outline" className="rounded-2xl border-slate-200 gap-2 h-10 px-6 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all shadow-sm" asChild>
                  <a href={member.lattesUrl} target="_blank">
                    <BookOpen size={14} /> Currículo Lattes <ExternalLink size={10} className="text-slate-300" />
                  </a>
               </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/70 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[3rem] p-8 relative overflow-hidden"
              >
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                   {member.avatarUrl ? (
                      <Image 
                         src={member.avatarUrl} 
                         alt={member.name}
                         fill
                         className="object-cover"
                         priority
                      />
                   ) : avatar ? (
                      <Image 
                         src={avatar.imageUrl} 
                         alt={member.name}
                         fill
                         className="object-cover"
                         priority
                      />
                   ) : (
                      <div className="flex items-center justify-center h-full bg-slate-50 text-slate-200">
                         <Award size={80} strokeWidth={0.5} />
                      </div>
                   )}
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-tight text-slate-900">
                        {member.name}
                      </h1>
                      <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">
                        {member.department || 'RedeInova'}
                      </div>
                   </div>
                   
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      {member.role}
                   </p>

                   {member.isCoordinator && (
                     <div className="pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest italic">
                          <Sparkles size={14} /> Coordenação do Projeto
                        </div>
                     </div>
                   )}
                </div>
              </motion.div>

              {/* Status/Impact Small Cards */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="text-2xl font-black text-slate-800 mb-1 leading-none">{productions.news.length + productions.fragments.length}</div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Contribuições Ativas</div>
                 </div>
                 <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="text-2xl font-black text-slate-800 mb-1 leading-none">Bolsista</div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Fomento CNPq</div>
                 </div>
              </div>
            </div>

            {/* Right Column: Bio & Portfolio */}
            <div className="lg:col-span-8 space-y-12">
               {/* Biography */}
               <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
               >
                  <div className="flex items-center gap-4">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Trajetória e Atuação</h2>
                     <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                  <div className="prose prose-slate max-w-none">
                     <p className="text-xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8 py-2">
                        {member.bio}
                     </p>
                  </div>
               </motion.section>

               {/* Productions Section */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Produções no Projeto</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scientific Fragments */}
                    {productions.fragments.length > 0 && productions.fragments.map((fragment, idx) => (
                      <motion.div
                        key={fragment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                        className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden"
                      >
                         <div className="aspect-video relative overflow-hidden bg-slate-100">
                            <Image 
                              src={fragment.thumbnail} 
                              alt={fragment.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors" />
                            <div className="absolute bottom-4 left-4 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-white/50">
                               <Video size={16} className="text-primary" />
                            </div>
                         </div>
                         <div className="p-6">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{fragment.category}</span>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight text-slate-800 mt-2 mb-3">
                               {fragment.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium italic line-clamp-2 leading-relaxed">
                               {fragment.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                               <Link href="/laboratorio" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                                  Ver no laboratório <ChevronRight size={12} />
                               </Link>
                            </div>
                         </div>
                      </motion.div>
                    ))}

                    {/* News Articles */}
                    {productions.news.length > 0 && productions.news.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-citrus/20 transition-all p-6 flex flex-col gap-4"
                      >
                         <div className="flex items-start justify-between">
                            <div className="h-10 w-10 rounded-2xl bg-citrus/10 flex items-center justify-center text-citrus">
                               <Newspaper size={20} />
                            </div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                               {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                            </span>
                         </div>
                         <div>
                            <span className="text-[9px] font-black text-citrus uppercase tracking-widest">{item.category}</span>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight text-slate-800 mt-2">
                               {item.title}
                            </h3>
                         </div>
                         <div className="mt-auto pt-4 flex justify-end">
                            <Link href="/comunicacao" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-citrus transition-colors flex items-center gap-1">
                               Ler matéria <ChevronRight size={12} />
                            </Link>
                         </div>
                      </motion.div>
                    ))}

                    {/* Empty State for Productions */}
                    {productions.news.length === 0 && productions.fragments.length === 0 && (
                      <div className="col-span-full py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                         <Award size={48} className="text-slate-200 mb-4" />
                         <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Produções em Andamento</h4>
                         <p className="text-[10px] font-medium italic text-slate-300">Em breve, as contribuições de {member.name.split(' ')[0]} estarão listadas aqui.</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-8">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              © 2026. Rede de Inovação Social | IF Baiano/CNPq
           </p>
           <nav className="flex gap-10">
              <Link href="/equipe" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Equipe</Link>
              <Link href="/glossario" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Pesquisa</Link>
           </nav>
        </div>
      </footer>
    </div>
  );
}
