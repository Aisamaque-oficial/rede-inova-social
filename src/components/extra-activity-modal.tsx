"use client";

import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dataService } from "@/lib/data-service";
import { Sparkles, Calendar, Target, FileText, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtraActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectorId: string;
  onSuccess?: () => void;
}

export function ExtraActivityModal({ open, onOpenChange, sectorId, onSuccess }: ExtraActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date().toISOString().split('T')[0],
    extraQuantity: 1,
    extraImpact: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 files
    const newFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(newFiles);

    // Generate preview URLs
    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Revoke old URL and regenerate
    URL.revokeObjectURL(previewUrls[index]);
    const newUrls = newFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(newUrls);
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(file => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert files to base64 for storage
      let attachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        attachmentUrls = await convertFilesToBase64(selectedFiles);
      }

      await dataService.addExtraActivity({
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        extraQuantity: formData.extraQuantity,
        extraImpact: formData.extraImpact,
        sectorId: sectorId,
        assignedToId: dataService.getCurrentUserId() || "unassigned",
        assignedToName: dataService.getCurrentUser()?.name || "Membro",
        type: "Atividade Extra",
        typeId: "tt-atividade",
        attachmentUrls: attachmentUrls,
      } as any);

      onOpenChange(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao registrar atividade extra:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deadline: new Date().toISOString().split('T')[0],
      extraQuantity: 1,
      extraImpact: ""
    });
    // Cleanup preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-white/10 backdrop-blur-sm">
                <Sparkles size={24} />
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Registrar Atividade Extra
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Documentar impacto fora do planejamento PMA
            </DialogDescription>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Título da Atividade</Label>
              <div className="relative">
                <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  id="title" 
                  placeholder="Ex: Oficina de Emergência Territorial" 
                  className="pl-10 h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="date" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Data de Realização</Label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="date" 
                      type="date"
                      className="pl-10 h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="qty" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Qtd / Impacto (Numérico)</Label>
                  <Input 
                    id="qty" 
                    type="number"
                    className="h-12 rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20"
                    required
                    value={formData.extraQuantity}
                    onChange={(e) => setFormData({...formData, extraQuantity: parseInt(e.target.value)})}
                  />
               </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Descrição do Impacto</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva brevemente o que foi realizado e qual o impacto gerado..." 
                className="min-h-[100px] rounded-2xl bg-slate-100/50 border-none font-bold text-xs focus-visible:ring-primary/20 py-4"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 flex items-center gap-2">
                <ImagePlus className="w-3.5 h-3.5" />
                Registro Fotográfico (Opcional — máx. 5 fotos)
              </Label>

              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Preview Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group">
                      <img 
                        src={url} 
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedFiles.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 rounded-2xl border-dashed border-2 border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {selectedFiles.length === 0 ? "Adicionar Fotos" : `Adicionar Mais (${selectedFiles.length}/5)`}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => { resetForm(); onOpenChange(false); }}
              className="rounded-xl font-black uppercase text-[10px] tracking-widest h-11"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-xl font-black uppercase text-[10px] tracking-widest h-11 px-8 bg-slate-900 hover:bg-primary shadow-xl shadow-slate-900/10"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando...
                </span>
              ) : "Confirmar Registro Extra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
