"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { SocialPost } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  Play, 
  CheckCircle2, 
  Clock,
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle,
  Zap,
  MoreVertical,
  Calendar,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PLATFORMS = {
  instagram: { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Instagram' },
  facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Facebook' },
  tiktok: { icon: Zap, color: 'text-slate-900', bg: 'bg-slate-100', label: 'TikTok' },
  youtube: { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' },
  whatsapp: { icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'WhatsApp' },
  geral: { icon: MoreVertical, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Outros' }
};

export function ASCOMSocialBoard() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState<any>({
    title: "",
    caption: "",
    platform: "instagram",
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'planning',
    imagePlaceholderId: 'placeholder_ascom_1'
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = dataService.subscribeToSocialPosts((data) => {
      setPosts([...data]);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (postId: string, newStatus: SocialPost['status']) => {
    await dataService.updateSocialPostStatus(postId, newStatus);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.addSocialPost(newPost);
    setIsAddingPost(false);
    setNewPost({
      title: "",
      caption: "",
      platform: "instagram",
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'planning',
      imagePlaceholderId: 'placeholder_ascom_1'
    });
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Deseja excluir este post?")) {
      await dataService.deleteSocialPost(id);
    }
  };

  const columns = [
    { id: 'planning', label: 'Em Planejamento', icon: Pencil, color: 'text-amber-500', bg: 'bg-amber-50/20' },
    { id: 'scheduled', label: 'Agendados', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50/20' },
    { id: 'published', label: 'Publicados', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/20' }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Carregando Redes Sociais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-primary">Gestão de Redes Sociais</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Calendário e Conteúdo Multicanal</p>
        </div>
        <Button 
            onClick={() => setIsAddingPost(true)}
            size="sm" 
            className="rounded-full font-bold uppercase tracking-tighter gap-2 shadow-lg hover:shadow-primary/20 transition-all"
        >
            <Plus className="h-4 w-4" /> Novo Post
        </Button>
      </div>

      <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-primary">Novo Conteúdo Social</DialogTitle>
            <DialogDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
               Planeje sua próxima postagem nas redes oficiais.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreatePost} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Título Interno (Tema)</Label>
                <Input 
                    placeholder="Ex: Campanha de Agasalho 2026" 
                    className="rounded-2xl border-slate-100"
                    required
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Plataforma</Label>
                   <Select onValueChange={(val) => setNewPost({ ...newPost, platform: val })} defaultValue="instagram">
                      <SelectTrigger className="rounded-2xl border-slate-100 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PLATFORMS).map(([id, info]) => (
                          <SelectItem key={id} value={id} className="font-bold uppercase text-[10px]">
                            {info.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Data Prevista</Label>
                   <Input 
                      type="date"
                      className="rounded-2xl border-slate-100 font-bold text-xs"
                      value={newPost.scheduledDate}
                      onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Legenda / Copy</Label>
                <Textarea 
                    placeholder="O que será escrito no post..." 
                    className="rounded-2xl border-slate-100 min-h-[120px] text-sm"
                    required
                    value={newPost.caption}
                    onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddingPost(false)} className="rounded-2xl uppercase text-[10px] font-black">Cancelar</Button>
              <Button type="submit" className="rounded-2xl bg-primary hover:bg-primary/90 uppercase text-[10px] font-black tracking-widest">Salvar no Mural</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnPosts = posts.filter(p => p.status === column.id);
          
          return (
            <div key={column.id} className={cn(
              "flex flex-col rounded-[2.5rem] p-4 ring-1 ring-slate-100 min-h-[500px]",
              column.bg
            )}>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-xl bg-white shadow-sm", column.color)}>
                    <column.icon className="h-4 w-4" />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-wider text-slate-700">
                    {column.label}
                  </span>
                  <Badge variant="secondary" className="bg-white text-slate-400 border-none font-bold italic">
                    {columnPosts.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {columnPosts.map((post) => {
                  const platformData = PLATFORMS[post.platform as keyof typeof PLATFORMS] || PLATFORMS.geral;
                  const Icon = platformData.icon;

                  return (
                    <Card key={post.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                      <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                        {post.imagePlaceholderId ? (
                          <Image 
                            src={PlaceHolderImages.find(p => p.id === post.imagePlaceholderId)?.imageUrl || ""} 
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-200">
                             <ImageIcon className="h-10 w-10" />
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3">
                           <div className={cn("p-2 rounded-xl shadow-lg backdrop-blur-md bg-white/80", platformData.color)}>
                              <Icon size={16} />
                           </div>
                        </div>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                           <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg bg-white/90" onClick={() => handleDeletePost(post.id)}>
                              <Trash2 className="h-3 w-3 text-red-500" />
                           </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                           <h4 className="font-black text-[11px] text-slate-800 uppercase italic line-clamp-1">
                              {post.title}
                           </h4>
                           <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">
                              {new Date(post.scheduledDate).toLocaleDateString('pt-BR')}
                           </span>
                        </div>
                        
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-2 italic leading-relaxed">
                          {post.caption}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <div className="flex gap-1">
                             {column.id !== 'planning' && (
                               <Button 
                                  variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-amber-500 hover:bg-amber-50"
                                  onClick={() => handleStatusChange(post.id, 'planning')}
                                  title="Mover para Planejamento"
                               >
                                 <Pencil className="h-3.5 w-3.5" />
                               </Button>
                             )}
                             {column.id !== 'scheduled' && (
                               <Button 
                                  variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-blue-500 hover:bg-blue-50"
                                  onClick={() => handleStatusChange(post.id, 'scheduled')}
                                  title="Mover para Agendado"
                               >
                                  <Clock className="h-3.5 w-3.5" />
                               </Button>
                             )}
                             {column.id !== 'published' && (
                               <Button 
                                  variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-emerald-500 hover:bg-emerald-50"
                                  onClick={() => handleStatusChange(post.id, 'published')}
                                  title="Marcar como Publicado"
                               >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                               </Button>
                             )}
                          </div>
                          
                          <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5 rounded-full", platformData.bg, platformData.color)}>
                             {platformData.label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {columnPosts.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-slate-200 rounded-[2rem]">
                      <column.icon className="h-8 w-8 mb-2" />
                      <span className="text-[10px] font-bold uppercase italic">Vazio</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
