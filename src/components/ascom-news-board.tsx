"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { News } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pin, 
  Play, 
  Archive, 
  Image as ImageIcon, 
  Pencil,
  Loader2,
  Plus
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export function ASCOMNewsBoard() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNews, setNewNews] = useState<any>({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString('pt-BR'),
    tag: "Notícia",
    tagColor: "blue",
    image: "",
    publishedAt: new Date().toISOString(),
    status: 'active'
  });
  const { toast } = useToast();

  const fetchNews = () => {
    const unsubscribe = dataService.subscribeToNews((data) => {
      setNews([...data]);
      setIsLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchNews();
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (newsId: string, newStatus: 'fixed' | 'active' | 'archived') => {
    try {
      await dataService.updateNewsStatus(newsId, newStatus);
      // O subscribe já deve atualizar a lista
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao atualizar status", variant: "destructive" });
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.addNews(newNews);
      setIsAddingNews(false);
      setNewNews({
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toLocaleDateString('pt-BR'),
        tag: "Notícia",
        tagColor: "blue",
        image: "",
        publishedAt: new Date().toISOString(),
        status: 'active' as any
      });
      // O subscribe já deve atualizar a lista, mas forçamos um fetch se necessário
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao publicar notícia", variant: "destructive" });
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Deseja realmente excluir esta notícia?")) {
      await dataService.deleteNews(id);
    }
  };

  const columns = [
    { id: 'fixed', label: 'Fixadas / Destaque', icon: Pin, color: 'text-amber-500', bg: 'bg-amber-50/30' },
    { id: 'active', label: 'Notícias Ativas', icon: Play, color: 'text-emerald-500', bg: 'bg-emerald-50/30' },
    { id: 'archived', label: 'Arquivo / Histórico', icon: Archive, color: 'text-slate-500', bg: 'bg-slate-50/30' }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Carregando quadro de notícias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-primary">Gestão de Conteúdo</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Fluxo de publicações no portal</p>
        </div>
        <Button 
            onClick={() => setIsAddingNews(true)}
            size="sm" 
            className="rounded-full font-bold uppercase tracking-tighter gap-2 shadow-lg hover:shadow-primary/20 transition-all"
        >
            <Plus className="h-4 w-4" /> Notícia para o Portal
        </Button>
      </div>

      {/* Modal de Criação de Notícia */}
      <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-primary">Publicar no Portal</DialogTitle>
            <DialogDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
               Crie um novo conteúdo institucional para a página principal.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateNews} className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest ml-1">Título da Notícia</Label>
                <Input 
                    id="title" 
                    placeholder="Ex: Novo laboratório é inaugurado..." 
                    className="rounded-2xl border-slate-100"
                    required
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-widest ml-1">Resumo (Chamada)</Label>
                <Input 
                    id="excerpt" 
                    placeholder="Breve descrição que aparece no card..." 
                    className="rounded-2xl border-slate-100"
                    required
                    value={newNews.excerpt}
                    onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest ml-1">Conteúdo Completo</Label>
                <Textarea 
                    id="content" 
                    placeholder="Texto completo da notícia..." 
                    className="rounded-2xl border-slate-100 min-h-[150px]"
                    required
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="librasVideoUrl" className="text-[10px] font-black uppercase tracking-widest ml-1">Link do Vídeo / Libras (YouTube/Vimeo)</Label>
                <Input 
                    id="librasVideoUrl" 
                    placeholder="Cole o link do vídeo aqui..." 
                    className="rounded-2xl border-slate-100"
                    value={newNews.librasVideoUrl || ""}
                    onChange={(e) => setNewNews({ ...newNews, librasVideoUrl: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Categoria (Tag)</Label>
                   <Select onValueChange={(val) => setNewNews({ ...newNews, tag: val })} defaultValue="Notícia">
                      <SelectTrigger className="rounded-2xl border-slate-100">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Notícia">Notícia Geral</SelectItem>
                        <SelectItem value="Evento">Evento</SelectItem>
                        <SelectItem value="Destaque">Destaque</SelectItem>
                        <SelectItem value="Científico">Científico</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Prioridade Visual</Label>
                   <Select onValueChange={(val) => setNewNews({ ...newNews, status: val as any })} defaultValue="active">
                      <SelectTrigger className="rounded-2xl border-slate-100">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Normal (Ativa)</SelectItem>
                        <SelectItem value="fixed">Fixada (Destaque Topo)</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddingNews(false)} className="rounded-2xl uppercase text-[10px] font-black">Cancelar</Button>
              <Button type="submit" className="rounded-2xl bg-primary hover:bg-primary/90 uppercase text-[10px] font-black tracking-widest">Publicar Agora</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnNews = news.filter(n => n.status === column.id || (!n.status && column.id === 'active'));
          
          return (
            <div key={column.id} className={cn(
              "flex flex-col min-w-[280px] min-h-[500px] rounded-[2.5rem] p-4 ring-1 ring-slate-100",
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
                    {columnNews.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {columnNews.map((item) => (
                  <Card key={item.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                    <div className="aspect-[21/9] relative overflow-hidden bg-slate-100">
                      {item.thumbnailUrl || item.imagePlaceholderId ? (
                        <Image 
                          src={item.thumbnailUrl || PlaceHolderImages.find(p => p.id === item.imagePlaceholderId)?.imageUrl || ""} 
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">
                           <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg bg-white/90 backdrop-blur">
                            <Pencil className="h-3 w-3 text-primary" />
                         </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                         <Badge className="text-[8px] font-black uppercase tracking-widest px-2 py-0 h-4 bg-slate-100 text-slate-500 border-none">
                            {item.tag || "Notícia"}
                         </Badge>
                         {item.librasVideoUrl && (
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <div className="flex items-center gap-1 text-primary animate-pulse">
                                   <Zap size={10} className="fill-primary" />
                                   <span className="text-[8px] font-black uppercase tracking-tighter">Libras</span>
                                 </div>
                               </TooltipTrigger>
                               <TooltipContent>Conteúdo com tradução em Libras disponível</TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                         )}
                      </div>
                      <h4 className="font-black text-[11px] leading-tight text-slate-800 uppercase italic line-clamp-2 min-h-[2rem]">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-400 line-clamp-3 italic leading-relaxed">
                        {item.excerpt || item.content}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Mover Para:</span>
                        <div className="flex gap-1">
                           {column.id !== 'fixed' && (
                             <Button 
                                variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-amber-500 hover:bg-amber-50"
                                onClick={() => handleStatusChange(item.id, 'fixed')}
                                title="Fixar Notícia"
                             >
                               <Pin className="h-3 w-3" />
                             </Button>
                           )}
                           {column.id !== 'active' && (
                             <Button 
                                variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-emerald-500 hover:bg-emerald-50"
                                onClick={() => handleStatusChange(item.id, 'active')}
                                title="Ativar"
                             >
                                <Play className="h-3 w-3" />
                             </Button>
                           )}
                           {column.id !== 'archived' && (
                             <Button 
                                variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-slate-400 hover:bg-slate-50"
                                onClick={() => handleStatusChange(item.id, 'archived')}
                                title="Arquivar"
                             >
                                <Archive className="h-3 w-3" />
                             </Button>
                           )}
                           <Button 
                               variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
                               onClick={() => handleDeleteNews(item.id)}
                               title="Excluir Permanentemente"
                           >
                               <Plus className="h-3 w-3 rotate-45" />
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnNews.length === 0 && (
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
