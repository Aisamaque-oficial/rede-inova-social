"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { productsService, Product } from "@/lib/products-service";
import { TERRITORY_CITIES } from "@/lib/territory-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MyProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    citySlug: "",
    farmerPhone: ""
  });

  const loadProducts = async () => {
    setIsLoading(true);
    const userId = dataService.getCurrentUserId();
    if (userId) {
      const myProducts = await productsService.getProductsByFarmer(userId);
      setProducts(myProducts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = dataService.getCurrentUserId();
    const user = dataService.getCurrentUser();
    
    if (!userId || !user) return;

    if (!formData.name || !formData.price || !formData.citySlug || !formData.farmerPhone) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }

    try {
      if (formData.id) {
        await productsService.updateProduct(formData.id, formData);
        toast({ title: "Sucesso", description: "Produto atualizado!" });
      } else {
        await productsService.addProduct({
          name: formData.name,
          description: formData.description || "",
          price: Number(formData.price),
          imageUrl: formData.imageUrl || "",
          citySlug: formData.citySlug,
          farmerPhone: formData.farmerPhone,
          farmerId: userId,
          farmerName: user.name
        });
        toast({ title: "Sucesso", description: "Produto adicionado à sua vitrine!" });
      }
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", price: 0, imageUrl: "", citySlug: "", farmerPhone: "" });
      loadProducts();
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao salvar produto.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este produto da vitrine?")) {
      await productsService.deleteProduct(id);
      toast({ title: "Removido", description: "Produto excluído com sucesso." });
      loadProducts();
    }
  };

  const openEdit = (p: Product) => {
    setFormData(p);
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setFormData({ name: "", description: "", price: 0, imageUrl: "", citySlug: "", farmerPhone: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Meus Produtos</h1>
          <p className="text-slate-500">Gerencie a sua vitrine territorial.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formData.id ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Nome do Produto/Serviço *</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Mel Orgânico 500g" required />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes do seu produto..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Preço (R$) *</label>
                  <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Seu Celular (WhatsApp) *</label>
                  <Input value={formData.farmerPhone} onChange={e => setFormData({...formData, farmerPhone: e.target.value})} placeholder="77999999999" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Sua Cidade *</label>
                <Select value={formData.citySlug} onValueChange={v => setFormData({...formData, citySlug: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERRITORY_CITIES.map(c => (
                      <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">URL da Imagem (Opcional)</label>
                <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Salvar Produto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">Carregando seus produtos...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Sua vitrine está vazia</h3>
          <p className="text-slate-500 mb-4">Adicione produtos para que clientes do território encontrem você.</p>
          <Button onClick={openNew} variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            Adicionar Primeiro Produto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                  R$ {Number(p.price).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{p.description}</p>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="text-slate-500 hover:text-blue-600">
                  <Edit2 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id!)} className="text-slate-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
