"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { ExternalLink, User as UserIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  member: User;
  index: number;
}

export function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const avatar = PlaceHolderImages.find(img => img.id === member.avatarId);
  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.21, 0.45, 0.32, 0.9] 
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Background Decorative Blob (Subtle) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-citrus/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:bg-white/90">
        
        {/* Avatar Container */}
        <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
           {member.avatarUrl ? (
             <Image 
                src={member.avatarUrl} 
                alt={member.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
             />
           ) : avatar ? (
             <Image 
                src={avatar.imageUrl} 
                alt={member.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                data-ai-hint={avatar.imageHint || 'person portrait'}
             />
           ) : (
             <div className="flex items-center justify-center h-full bg-primary/5 text-primary/20">
                <UserIcon size={64} strokeWidth={1} />
             </div>
           )}
           
           {/* Decorative Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
           
           {/* Top Badges */}
           <div className="absolute top-4 left-4 flex flex-col gap-2">
              {member.isCoordinator && (
                 <Badge className="bg-primary text-white border-none text-[8px] font-black tracking-widest px-2 py-1 uppercase italic shadow-lg">
                    COORDENAÇÃO
                 </Badge>
              )}
           </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 p-6 flex flex-col">
           <div className="mb-4">
              <h3 className="text-xl font-black italic tracking-tighter uppercase leading-tight text-slate-800 mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest h-8 line-clamp-2">
                {member.role}
              </p>
           </div>

           <div className="mt-auto space-y-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                 "{member.bio.split(';')[0]}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                 <div className="flex gap-2">
                   {member.lattesUrl && member.lattesUrl !== '#' && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all" asChild>
                        <a href={member.lattesUrl} target="_blank" title="Currículo Lattes">
                           <BookOpen size={14} />
                        </a>
                     </Button>
                   )}
                 </div>
                 
                 <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary-hover group-hover:gap-2 transition-all p-0 h-auto hover:bg-transparent" asChild>
                    <Link href={`/equipe/${member.id}`}>
                       PERFIL COMPLETO <ExternalLink size={10} />
                    </Link>
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
