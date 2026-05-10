"use client";

import React, { useState, useEffect } from "react";
import { dataService, SectorReport } from "@/lib/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FolderArchive, Download, Search, FileText, Calendar,
  User, CheckCircle2, Clock, Send, Archive, Eye, X, ShieldCheck,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ReportsArchive() {
  const [reports, setReports] = useState<SectorReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [viewingReport, setViewingReport] = useState<SectorReport | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const loadReports = () => {
      const all = dataService.getAllReports();
      setReports(all.filter(r => r.status !== 'rascunho'));
    };
    loadReports();

    const unsubscribe = dataService.subscribeToTasks(() => loadReports());
    return () => unsubscribe();
  }, []);

  const filteredReports = reports.filter(r => {
    const matchSearch = r.sectorSigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sectorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.signedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleArchive = (reportId: string) => {
    dataService.archiveReport(reportId);
    setReports(dataService.getAllReports().filter(r => r.status !== 'rascunho'));
  };

  const handleDownloadPdf = async (report: SectorReport) => {
    setIsGeneratingPdf(true);
    try {
      const { generateReportPdf } = await import('@/lib/pdf-generator');
      await generateReportPdf(report);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assinado': return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[8px] font-black uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 mr-1" />Assinado</Badge>;
      case 'enviado': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[8px] font-black uppercase tracking-widest"><Send className="w-3 h-3 mr-1" />Recebido</Badge>;
      case 'arquivado': return <Badge className="bg-green-100 text-green-700 border-green-200 text-[8px] font-black uppercase tracking-widest"><Archive className="w-3 h-3 mr-1" />Arquivado</Badge>;
      default: return <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest">Rascunho</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
            Arquivo de <span className="text-primary">Relatórios</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <FolderArchive className="w-3.5 h-3.5" />
            Relatórios setoriais recebidos para análise e arquivamento
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <Badge variant="outline" className="px-4 py-2 rounded-xl font-black">{reports.filter(r => r.status === 'enviado').length} Pendentes</Badge>
          <Badge className="px-4 py-2 rounded-xl font-black bg-green-100 text-green-700 border-green-200">{reports.filter(r => r.status === 'arquivado').length} Arquivados</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por setor, nome..."
            className="pl-11 h-12 rounded-2xl border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['todos', 'enviado', 'arquivado'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={cn("rounded-xl text-[10px] font-black uppercase tracking-widest h-12",
                filterStatus === status ? "bg-slate-900 text-white" : ""
              )}
            >
              {status === 'todos' ? 'Todos' : status === 'enviado' ? 'Pendentes' : 'Arquivados'}
            </Button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
          <FolderArchive className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-400">Nenhum relatório encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Os relatórios enviados pelos setores aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
                  {/* Color Strip */}
                  <div className={cn(
                    "h-2",
                    report.status === 'arquivado' ? 'bg-green-500' :
                    report.status === 'enviado' ? 'bg-amber-500' : 'bg-blue-500'
                  )} />

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-800">
                          {report.sectorSigla}
                        </h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {report.sectorName}
                        </p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-bold">
                          {report.periodType === 'semanal' ? 'Semanal' : report.periodType === 'quinzenal' ? 'Quinzenal' : 'Mensal'}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{format(new Date(report.periodStart), "dd/MM")} — {format(new Date(report.periodEnd), "dd/MM/yy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{report.signedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(new Date(report.signedAt), "dd/MM/yyyy 'às' HH:mm")}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">
                      "{report.content?.substring(0, 120)}..."
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <Button variant="ghost" size="sm" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest h-9" onClick={() => setViewingReport(report)}>
                        <Eye className="w-3 h-3 mr-1" /> Ver
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest h-9" onClick={() => handleDownloadPdf(report)} disabled={isGeneratingPdf}>
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      {report.status === 'enviado' && (
                        <Button size="sm" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest h-9 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleArchive(report.id)}>
                          <Archive className="w-3 h-3 mr-1" /> Arquivar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {viewingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewingReport(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border-primary/20">
                    <FileText className="w-3 h-3 mr-1" />
                    Relatório {viewingReport.periodType}
                  </Badge>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">
                    {viewingReport.sectorName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {format(new Date(viewingReport.periodStart), "dd/MM/yyyy")} — {format(new Date(viewingReport.periodEnd), "dd/MM/yyyy")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setViewingReport(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atividades Realizadas</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl whitespace-pre-wrap">{viewingReport.content}</p>
                </div>

                {viewingReport.memberActivities?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Participação dos Membros</h4>
                    {viewingReport.memberActivities.map((m, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl space-y-1">
                        <span className="text-sm font-bold text-slate-700">{m.memberName}</span>
                        <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="rounded-2xl border-primary/30 bg-primary/5 overflow-hidden">
                  <CardContent className="p-6 text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-xs text-slate-500 leading-relaxed">{viewingReport.signatureSeal}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
