"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Calendar, 
  User, 
  ImageIcon, 
  FileText, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Eye,
  X,
  ZoomIn,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExtraActivitiesBoardProps {
  sectorId: string;
}

export function ExtraActivitiesBoard({ sectorId }: ExtraActivitiesBoardProps) {
  const [activities, setActivities] = useState<ProjectTask[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ProjectTask | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = () => {
      const allTasks = dataService.getProcessedTasks();
      const extras = allTasks.filter(t => 
        t.isExtra === true && 
        (t.sectorId === sectorId || t.sector?.toLowerCase() === sectorId?.toLowerCase())
      );
      setActivities(extras);
    };

    loadActivities();

    const unsubscribe = dataService.subscribeToTasks(() => {
      loadActivities();
    });

    return () => unsubscribe();
  }, [sectorId]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-20 space-y-6 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm mx-auto">
          <Sparkles className="w-10 h-10 text-slate-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400">
            Nenhuma atividade extra
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
            Atividades realizadas fora do planejamento serão exibidas aqui no formato de cards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => {
            const attachments: string[] = (activity as any).attachmentUrls || [];
            const hasImages = attachments.length > 0;

            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedActivity(activity)}
                >
                  {/* Image Preview Strip */}
                  {hasImages && (
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img 
                        src={attachments[0]} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {attachments.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          +{attachments.length - 1}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 text-white text-[8px] font-black uppercase tracking-widest border-none shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Extra
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardContent className={cn("p-6 space-y-4", !hasImages && "pt-6")}>
                    {/* Header */}
                    {!hasImages && (
                      <Badge className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Atividade Extra
                      </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-black italic tracking-tighter uppercase text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {activity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed italic">
                      "{activity.description}"
                    </p>

                    {/* Meta */}
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <User className="w-3 h-3" />
                        <span className="uppercase tracking-wider">{activity.assignedByName || 'Membro'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{activity.createdAt ? format(new Date(activity.createdAt), "dd/MM/yy") : '-'}</span>
                      </div>
                    </div>

                    {/* Impact Indicator */}
                    {(activity as any).extraQuantity && (
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-black italic">{(activity as any).extraQuantity}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {(activity as any).extraImpact || 'Impacto registrado'}
                        </span>
                      </div>
                    )}

                    {/* Action hint */}
                    <div className="flex items-center justify-end gap-1 text-primary font-black uppercase italic text-[10px] tracking-tighter group-hover:translate-x-1 transition-transform pt-1">
                      Ver Detalhes
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <Badge className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Atividade Extra
                  </Badge>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800 leading-tight">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {selectedActivity.assignedByName || 'Membro'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedActivity.createdAt ? format(new Date(selectedActivity.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Concluída
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setSelectedActivity(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Descrição do Impacto
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {selectedActivity.description || "Sem descrição adicional."}
                  </p>
                </div>

                {/* Impact Metrics */}
                {(selectedActivity as any).extraQuantity && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 text-center">
                      <span className="text-3xl font-black italic text-primary">{(selectedActivity as any).extraQuantity}</span>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Unidades / Impacto</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-600 italic">
                        {(selectedActivity as any).extraImpact || "Impacto qualitativo"}
                      </span>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Tipo de Impacto</p>
                    </div>
                  </div>
                )}

                {/* Photo Gallery */}
                {((selectedActivity as any).attachmentUrls || []).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Registro Fotográfico ({((selectedActivity as any).attachmentUrls || []).length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {((selectedActivity as any).attachmentUrls || []).map((url: string, i: number) => (
                        <div 
                          key={i} 
                          className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group"
                          onClick={(e) => { e.stopPropagation(); setImagePreview(url); }}
                        >
                          <img 
                            src={url} 
                            alt={`Registro ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Fullscreen Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setImagePreview(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full"
              onClick={() => setImagePreview(null)}
            >
              <X className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
