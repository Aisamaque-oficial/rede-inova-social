"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { News } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Loader2, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GerenciarNoticiasPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<News> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = dataService.subscribeToNews((data) => {
      setNewsList(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const placeholder = PlaceHolderImages.find(p => p.id === (formData.get("imagePlaceholderId") as string));
    const newsData = {
      title: formData.get("title") as string,
      excerpt: (formData.get("content") as string).substring(0, 120) + "...",
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      date: new Date(formData.get("publishedAt") as string).toISOString(),
      tag: formData.get("category") as string || "Geral",
      tagColor: "bg-primary",
      image: placeholder?.imageUrl || "",
      publishedAt: new Date(formData.get("publishedAt") as string).toISOString(),
      isPinned: formData.get("isPinned") === "on",
      imagePlaceholderId: formData.get("imagePlaceholderId") as string,
      status: (formData.get("isPinned") === "on" ? 'fixed' : 'active') as any,
    };

    try {
      if (editingNews?.id) {
        await dataService.updateNews(editingNews.id, newsData);
        toast({ title: "Notícia atualizada!", description: "As alterações foram salvas com sucesso." });
      } else {
        await dataService.addNews(newsData);
        toast({ title: "Notícia criada!", description: "A nova notícia já está disponível no feed." });
      }
      setIsDialogOpen(false);
      setEditingNews(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Ocorreu um problema ao salvar a notícia." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;
    try {
      await dataService.deleteNews(id);
      toast({ title: "Notícia excluída", description: "A notícia foi removida do sistema." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: "Não foi possível remover a notícia." });
    }
  };

  const openAddDialog = () => {
    setEditingNews(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (news: News) => {
    setEditingNews(news);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/gerenciar">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Gerenciar Notícias</h1>
                <p className="text-muted-foreground">Manipule as informações que aparecem no feed externo.</p>
            </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>{editingNews ? "Editar Notícia" : "Adicionar Notícia"}</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para atualizar as informações do site.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" name="title" defaultValue={editingNews?.title} required />
                </div>
                <div className="flex gap-4">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="author">Autor</Label>
                        <Input id="author" name="author" defaultValue={editingNews?.author || "Coordenação"} required />
                    </div>
                    <div className="grid gap-2 w-1/3">
                        <Label htmlFor="category">Categoria</Label>
                        <Input id="category" name="category" defaultValue={editingNews?.category || "GERAL"} required />
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="publishedAt">Data de Publicação</Label>
                  <Input id="publishedAt" name="publishedAt" type="date" defaultValue={editingNews?.publishedAt ? new Date(editingNews.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} required />
                  <p className="text-[10px] text-muted-foreground uppercase font-black">As notícias saem do feed principal após 30 dias desta data.</p>
                </div>
                <div className="flex items-center space-x-2 py-2">
                    <input 
                        type="checkbox" 
                        id="isPinned" 
                        name="isPinned" 
                        defaultChecked={editingNews?.isPinned} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isPinned" className="text-sm font-bold cursor-pointer">Fixar no Feed Principal (Não expira após 30 dias)</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imagePlaceholderId">Identidade Visual (Imagem)</Label>
                  <div className="grid grid-cols-3 gap-2 p-2 border rounded-md max-h-[200px] overflow-y-auto bg-slate-50">
                    {PlaceHolderImages.map((img) => (
                      <label key={img.id} className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="imagePlaceholderId" 
                          value={img.id} 
                          defaultChecked={editingNews?.imagePlaceholderId === img.id}
                          className="peer sr-only"
                          required
                        />
                        <div className="aspect-video relative rounded border-2 border-transparent peer-checked:border-primary transition-all overflow-hidden bg-white">
                          <Image src={img.imageUrl} alt={img.description} fill className="object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-primary/20 opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus className="text-white h-4 w-4" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 pt-2">
                  <Label htmlFor="content">Conteúdo da Publicação</Label>
                  <Textarea id="content" name="content" defaultValue={editingNews?.content} required className="min-h-[120px] text-sm" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full font-bold">Cancelar</Button>
                <Button type="submit" disabled={isSaving} className="rounded-full font-bold px-8">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingNews ? "Confirmar Mudanças" : "Publicar agora"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {/* Coluna 1: Fixadas */}
        <div className="min-w-[350px] flex-1 snap-start space-y-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">📍 FIXADAS NO TOPO</h2>
            </div>
            <NewsColumn 
                news={newsList.filter(n => n.isPinned)} 
                onEdit={openEditDialog} 
                onDelete={handleDelete} 
            />
        </div>

        {/* Coluna 2: Ativas */}
        <div className="min-w-[350px] flex-1 snap-start space-y-4">
             <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">✨ FEED ATIVO (ATÉ 30 DIAS)</h2>
            </div>
            <NewsColumn 
                news={dataService.filterActiveNews(newsList).filter(n => !n.isPinned)} 
                onEdit={openEditDialog} 
                onDelete={handleDelete} 
            />
        </div>

        {/* Coluna 3: Arquivo */}
        <div className="min-w-[350px] flex-1 snap-start space-y-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">📁 ARQUIVADAS (MAIS DE 30 DIAS)</h2>
            </div>
            <NewsColumn 
                news={newsList.filter(n => !n.isPinned && !dataService.filterActiveNews([n]).length)} 
                onEdit={openEditDialog} 
                onDelete={handleDelete} 
            />
        </div>
      </div>
    </div>
  );
}

// Componente para a Coluna de Notícias (Estilo Trello)
function NewsColumn({ news, onEdit, onDelete }: { news: News[], onEdit: (n: News) => void, onDelete: (id: string) => void }) {
    if (news.length === 0) {
        return (
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Vazio</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {news.map((item) => {
                const img = PlaceHolderImages.find(p => p.id === item.imagePlaceholderId);
                return (
                    <Card key={item.id} className="group relative border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl transition-all duration-300 bg-white ring-1 ring-slate-100 overflow-hidden cursor-default">
                        {img && (
                            <div className="aspect-[21/9] relative w-full overflow-hidden grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 border-b border-slate-100">
                                <Image src={img.imageUrl} alt={item.title} fill className="object-cover" />
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <span className="text-[8px] font-black bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-primary uppercase shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        )}
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase italic">{item.title}</h3>
                                    <p className="text-[10px] font-medium text-slate-500 line-clamp-2 italic">"{item.content}"</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-300 whitespace-nowrap bg-slate-50 px-1 rounded">#{item.id}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <Clock className="h-3 w-3" /> {new Date(item.publishedAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-full border-slate-100 hover:bg-primary/10 hover:text-primary" onClick={() => onEdit(item)}>
                                        <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-full border-slate-100 text-destructive hover:bg-destructive/10" onClick={() => onDelete(item.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
