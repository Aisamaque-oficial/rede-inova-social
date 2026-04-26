"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { SectorDefinition } from "@/lib/mock-data";
import { 
  Plus, 
  Settings2, 
  LayoutGrid, 
  Trash2, 
  Save, 
  RefreshCw,
  Layout,
  Layers,
  Palette,
  Type,
  ChevronRight,
  ShieldCheck,
  Megaphone,
  Accessibility,
  BarChart3,
  Users2,
  Network,
  BookOpen,
  Terminal,
  Activity,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { value: 'ShieldCheck', icon: ShieldCheck },
  { value: 'Megaphone', icon: Megaphone },
  { value: 'Accessibility', icon: Accessibility },
  { value: 'BarChart3', icon: BarChart3 },
  { value: 'Users2', icon: Users2 },
  { value: 'Network', icon: Network },
  { value: 'BookOpen', icon: BookOpen },
  { value: 'Terminal', icon: Terminal },
  { value: 'Activity', icon: Activity }
];

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Azul Institucional', class: 'bg-blue-500' },
  { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { value: 'amber', label: 'Âmbar', class: 'bg-amber-500' },
  { value: 'violet', label: 'Violeta', class: 'bg-violet-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'slate', label: 'Slate', class: 'bg-slate-500' }
];

export default function GestaoEstruturaPage() {
  const [sectors, setSectors] = useState<SectorDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sigla: '',
    description: '',
    icon: 'Activity',
    color: 'blue',
    order: 0
  });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToSectors((data) => {
      setSectors(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sigla) {
        toast({ title: "Erro", description: "Nome e Sigla são obrigatórios", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      await dataService.createSector({
        name: formData.name,
        sigla: formData.sigla.toUpperCase(),
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        order: sectors.length // Colocar no fim da lista
      } as any);
      
      toast({ title: "Sucesso", description: "Setor criado com sucesso!" });
      setIsModalOpen(false);
      setFormData({ name: '', sigla: '', description: '', icon: 'Activity', color: 'blue', order: 0 });
    } catch (err: any) {
      toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (iconName: string) => {
      const option = ICON_OPTIONS.find(o => o.value === iconName);
      if (option) {
          const Icon = option.icon;
          return <Icon size={18} />;
      }
      return <Activity size={18} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary mb-1">
                <Layout className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governança Administrativa</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
                Gestão de <span className="text-primary italic">Estrutura</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Crie e organize setores operacionais em tempo real
            </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all gap-3 border-none">
              <Plus size={20} />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-3xl">
            <form onSubmit={handleCreateSector}>
              <DialogHeader className="p-10 bg-slate-900 text-white border-none">
                <div className="flex items-center gap-4 mb-2">
                   <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Layers size={20} />
                   </div>
                   <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">Novo Setor Operacional</DialogTitle>
                </div>
                <DialogDescription className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  Preencha os dados do setor para integrar à plataforma
                </DialogDescription>
              </DialogHeader>

              <div className="p-10 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome do Setor</Label>
                    <Input 
                        placeholder="Ex: Jurídico Central" 
                        className="rounded-xl border-slate-100 bg-slate-50/50"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sigla (ID)</Label>
                    <Input 
                        placeholder="Ex: JUR" 
                        className="rounded-xl border-slate-100 bg-slate-50/50 uppercase"
                        value={formData.sigla}
                        onChange={e => setFormData({...formData, sigla: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descrição/Objetivo</Label>
                  <Input 
                      placeholder="Breve descrição da função do setor..." 
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ícone Visual</Label>
                    <Select value={formData.icon} onValueChange={val => setFormData({...formData, icon: val})}>
                      <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100">
                        {ICON_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                            <div className="flex items-center gap-3">
                              <opt.icon size={16} />
                              <span className="text-[10px] uppercase font-bold tracking-widest">{opt.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cor do Tema</Label>
                    <Select value={formData.color} onValueChange={val => setFormData({...formData, color: val})}>
                      <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50">
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100">
                        {COLOR_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${opt.class}`} />
                              <span className="text-[10px] uppercase font-bold tracking-widest">{opt.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-10 pt-0 bg-white">
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Confirmar e Criar Estrutura"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Setores Atuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {isLoading ? (
            Array(6).fill(0).map((_, i) => (
                <Card key={i} className="rounded-[2.5rem] bg-slate-50 border-none animate-pulse h-40" />
            ))
        ) : (
            sectors.map((sector) => (
                <Card key={sector.id} className="group rounded-[2.5rem] border border-slate-100 hover:border-primary/30 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-500",
                                sector.color === 'slate' ? 'bg-slate-500/10 text-slate-600 border-slate-500/20' :
                                sector.color === 'blue' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                sector.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                sector.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                                sector.color === 'rose' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                                sector.color === 'amber' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                sector.color === 'violet' ? 'bg-violet-500/10 text-violet-600 border-violet-500/20' :
                                sector.color === 'teal' ? 'bg-teal-500/10 text-teal-600 border-teal-500/20' :
                                'bg-slate-500/10 text-slate-600 border-slate-500/20'
                            )}>
                                {getIcon(sector.icon)}
                            </div>
                            <Badge variant="outline" className="rounded-lg border-slate-100 text-[9px] font-black tracking-widest text-slate-400">
                                /{sector.id}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black uppercase tracking-tight italic text-slate-900 group-hover:text-primary transition-colors">
                                {sector.sigla}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {sector.name}
                            </p>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                            {sector.description}
                        </p>
                        <div className="pt-4 flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="rounded-xl h-9 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 text-slate-400">
                                <Settings2 size={12} className="mr-2" />
                                Configurar
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl h-9 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>

      {/* Info Card */}
      <div className="mx-4 bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10 flex flex-col md:flex-row items-center gap-8">
          <div className="h-16 w-16 bg-white rounded-[2rem] shadow-xl flex items-center justify-center shrink-0 border border-primary/20">
              <RefreshCw className="h-8 w-8 text-primary animate-spin-slow" />
          </div>
          <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">Sincronização em Tempo Real</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Qualquer setor criado aqui será refletido imediatamente no **Menu Lateral** de todos os membros e terá uma URL dedicada dinâmica.
              </p>
          </div>
      </div>
    </div>
  );
}
