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
  Filter, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

export function ReportsArchive() {
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<SectorReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>(searchParams?.get("filter") || "todos");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [viewingReport, setViewingReport] = useState<SectorReport | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const [reportToDelete, setReportToDelete] = useState<SectorReport | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const rawRole = dataService.getUserRole();
  const isGlobalCoordinator = rawRole === 'ADMIN' || rawRole === 'COORDENADOR_GERAL' || rawRole === 'admin';

  // Helper para formatar datas com segurança
  const safeDate = (dateStr: string | undefined | null, formatStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Data Inválida";
      return format(date, formatStr, { locale: ptBR });
    } catch (e) {
      return "Erro Data";
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      try {
        const all = await dataService.getAllReports();
        setReports((all || []).filter(r => r && r.status !== 'rascunho'));
      } catch (err) {
        console.error("Erro ao carregar relatórios no arquivo:", err);
      }
    };
    loadReports();

    // 🚀 REAL-TIME: Assinar mudanças no Supabase para que novos relatórios apareçam na hora
    const unsubscribe = dataService.subscribeToReports(() => {
      console.log("[Realtime] Novo relatório ou atualização detectada.");
      loadReports();
    });
    
    return () => unsubscribe();
  }, []);

  // Agrupamento por setores para a visão de pastas
  const sectorGroups = React.useMemo(() => {
    const groups: Record<string, { sigla: string, name: string, reports: SectorReport[] }> = {};
    
    (reports || []).forEach(r => {
      if (!r) return;
      const key = r.sectorSigla || "OUTROS";
      if (!groups[key]) {
        groups[key] = { sigla: key, name: r.sectorName || key, reports: [] };
      }
      groups[key].reports.push(r);
    });
    
    return Object.values(groups).sort((a, b) => a.sigla.localeCompare(b.sigla));
  }, [reports]);

  const currentUser = dataService.getCurrentUser();

  const filteredReports = (reports || []).filter(r => {
    if (!r) return false;
    
    if (filterStatus === 'minhas-pendencias') {
      const isPendingForMe = r.requestedSignatures?.some(s => s.userId === currentUser?.id && s.status === 'aguardando');
      return !!isPendingForMe;
    }

    const matchSector = !selectedSector || r.sectorSigla === selectedSector;
    const matchSearch = (r.sectorSigla?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (r.sectorName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (r.signedBy?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || r.status === filterStatus;
    return matchSector && matchSearch && matchStatus;
  });

  const handleArchive = async (reportId: string) => {
    try {
      await dataService.archiveReport(reportId);
      const all = await dataService.getAllReports();
      setReports((all || []).filter(r => r && r.status !== 'rascunho'));
    } catch (err) {
      console.error("Erro ao arquivar:", err);
    }
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
            {selectedSector ? `Pastas Institucionais > ${selectedSector}` : "Pastas Institucionais por Setor"}
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <Badge variant="outline" className="px-4 py-2 rounded-xl font-black">{reports.filter(r => r.status === 'enviado').length} Pendentes</Badge>
          <Badge className="px-4 py-2 rounded-xl font-black bg-green-100 text-green-700 border-green-200">{reports.filter(r => r.status === 'arquivado').length} Arquivados</Badge>
        </div>
      </div>

      {/* Navigation & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {selectedSector && (
          <Button 
            variant="ghost" 
            onClick={() => setSelectedSector(null)}
            className="rounded-2xl h-12 px-6 font-black uppercase text-xs gap-2 border border-slate-100 hover:bg-slate-50"
          >
            <X className="w-4 h-4" /> Voltar às Pastas
          </Button>
        )}
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={selectedSector ? `Buscar em ${selectedSector}...` : "Buscar por setor, nome..."}
            className="pl-11 h-12 rounded-2xl border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['todos', 'minhas-pendencias', 'enviado', 'arquivado'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={cn("rounded-xl text-[10px] font-black uppercase tracking-widest h-12 flex-1 md:flex-none",
                filterStatus === status ? "bg-slate-900 text-white shadow-lg" : "",
                status === 'minhas-pendencias' && filterStatus !== status && "text-amber-600 border-amber-200 bg-amber-50"
              )}
            >
              {status === 'minhas-pendencias' ? 'Assinaturas Pendentes' : status === 'todos' ? 'Ver Tudo' : status === 'enviado' ? 'Pendentes' : 'Arquivados'}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content: Folders or List */}
      <AnimatePresence mode="wait">
        {!selectedSector && !searchTerm ? (
          <motion.div
            key="folders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {sectorGroups.map((group, idx) => (
              <motion.div
                key={group.sigla}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedSector(group.sigla)}
                className="cursor-pointer group"
              >
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6">
                    <FolderArchive className="w-8 h-8 text-slate-100 group-hover:text-primary/20 transition-colors" />
                  </div>
                  <CardContent className="p-8 pt-12 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-inner">
                      <ShieldCheck className="w-8 h-8 text-slate-300 group-hover:text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 group-hover:text-primary transition-colors">
                        {group.sigla}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                        {group.name}
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-800">{group.reports.length}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-amber-500">{group.reports.filter(r => r.status === 'enviado').length}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Novos</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-green-600">{group.reports.filter(r => r.status === 'arquivado').length}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Arquivados</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {filteredReports.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-400">Nenhum relatório nesta pasta</h3>
                <p className="text-xs text-slate-400 mt-1">Os relatórios filtrados aparecerão aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {report.reportScope === 'individual' ? (
                              <Badge variant="outline" className="text-[8px] font-black uppercase text-purple-600 border-purple-200 bg-purple-50">Individual</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[8px] font-black uppercase text-blue-600 border-blue-200 bg-blue-50">Global</Badge>
                            )}
                            <Calendar className="w-3.5 h-3.5 ml-1" />
                            <span className="font-bold">
                              {report.periodType === 'diaria' ? 'Diário' : report.periodType === 'semanal' ? 'Semanal' : report.periodType === 'quinzenal' ? 'Quinzenal' : 'Mensal'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span>{safeDate(report.periodStart, "dd/MM")} — {safeDate(report.periodEnd, "dd/MM/yy")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User className="w-3.5 h-3.5" />
                            <span>{report.signedBy}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{safeDate(report.signedAt, "dd/MM/yyyy 'às' HH:mm")}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">
                          "{report.content?.substring(0, 120)}..."
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-slate-50 flex-wrap">
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
                          {isGlobalCoordinator && (
                            <Button size="sm" variant="outline" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest h-9 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setReportToDelete(report)}>
                              <Trash2 className="w-3 h-3 mr-1" /> Excluir
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="flex gap-2">
                    {viewingReport.reportScope === 'individual' && (
                      <Badge className="bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-widest border-purple-200">Individual</Badge>
                    )}
                    <Badge className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border-primary/20">
                      <FileText className="w-3 h-3 mr-1" />
                      Relatório {viewingReport.periodType === 'diaria' ? 'Diário' : viewingReport.periodType}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">
                    {viewingReport.sectorName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {viewingReport.reportScope === 'individual' ? `Membro: ${viewingReport.signedBy} | ` : ''}
                    {safeDate(viewingReport.periodStart, "dd/MM/yyyy")} — {safeDate(viewingReport.periodEnd, "dd/MM/yyyy")}
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

                {viewingReport.requestedSignatures && viewingReport.requestedSignatures.length > 0 && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Situação do Documento
                    </h4>
                    <div className="mb-4">
                      {viewingReport.requestedSignatures.some(s => s.status === 'aguardando') ? (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">Aguardando assinatura</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Totalmente Assinado</Badge>
                      )}
                    </div>
                    
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      Solicitação das Assinaturas ({viewingReport.requestedSignatures.filter(s => s.status === 'deferida').length}/{viewingReport.requestedSignatures.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] mb-2 border border-slate-100 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest">
                          <tr>
                            <th className="px-3 py-2 border-b border-slate-100">#</th>
                            <th className="px-3 py-2 border-b border-slate-100">Solicitado a</th>
                            <th className="px-3 py-2 border-b border-slate-100">Situação</th>
                            <th className="px-3 py-2 border-b border-slate-100">Data de Resposta</th>
                            <th className="px-3 py-2 border-b border-slate-100">Solicitante</th>
                            <th className="px-3 py-2 border-b border-slate-100">Opções</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {viewingReport.requestedSignatures.map((req, i) => (
                            <tr key={req.id} className="border-b border-slate-50">
                              <td className="px-3 py-2 text-slate-400 font-bold">{i + 1}</td>
                              <td className="px-3 py-2 font-bold text-primary">{req.userName}</td>
                              <td className="px-3 py-2">
                                {req.status === 'deferida' ? (
                                  <Badge className="bg-green-100 text-green-700 text-[9px] border-green-200">Deferida</Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700 text-[9px] border-amber-200">Aguardando</Badge>
                                )}
                              </td>
                              <td className="px-3 py-2 font-medium text-slate-500">
                                {req.signedAt ? safeDate(req.signedAt, "dd/MM/yyyy HH:mm") : '-'}
                              </td>
                              <td className="px-3 py-2 font-medium text-slate-500">{req.requesterName}</td>
                              <td className="px-3 py-2 text-right">
                                {req.status === 'aguardando' && currentUser && currentUser.id === req.userId && (
                                  <Button 
                                    size="sm" 
                                    onClick={async () => {
                                      const seal = `Documento assinado eletronicamente por ${currentUser.name}, em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`;
                                      await dataService.signRequestedReport(viewingReport.id, req.id, seal);
                                      const all = await dataService.getAllReports();
                                      setReports((all || []).filter(r => r && r.status !== 'rascunho'));
                                      setViewingReport(null);
                                    }}
                                    className="bg-primary text-white text-[9px] h-6 px-2 rounded hover:bg-primary/90 shadow-sm"
                                  >
                                    Assinar
                                  </Button>
                                )}
                                {req.status === 'aguardando' && (isGlobalCoordinator || (currentUser && currentUser.id === req.requesterId)) && (
                                  <Button
                                    size="sm" variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 ml-1 rounded-full"
                                    onClick={async () => {
                                      await dataService.deleteSignatureRequest(viewingReport.id, req.id);
                                      const all = await dataService.getAllReports();
                                      setReports((all || []).filter(r => r && r.status !== 'rascunho'));
                                      setViewingReport(null);
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

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
      <AnimatePresence>
        {reportToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setReportToDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center text-red-500">
                 <ShieldCheck size={48} />
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-xl font-black uppercase italic text-slate-800">Excluir Relatório?</h2>
                 <p className="text-xs font-medium text-slate-500">
                    Você está prestes a excluir permanentemente o relatório de <strong className="text-slate-800">{reportToDelete.sectorSigla}</strong> do período de <strong className="text-slate-800">{safeDate(reportToDelete.periodStart, "dd/MM")} a {safeDate(reportToDelete.periodEnd, "dd/MM/yy")}</strong>.
                 </p>
              </div>
              <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Senha de Coordenação Geral</label>
                    <Input 
                       type="password" 
                       placeholder="Digite sua senha administrativa..."
                       className="h-12 rounded-2xl bg-slate-50 border-slate-200 text-center font-black tracking-widest"
                       value={deletePassword}
                       onChange={(e) => setDeletePassword(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-3">
                    <Button 
                       variant="ghost" 
                       className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                       onClick={() => {
                          setReportToDelete(null);
                          setDeletePassword("");
                       }}
                    >
                       Cancelar
                    </Button>
                    <Button 
                       disabled={isDeleting || !deletePassword}
                       className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
                       onClick={async () => {
                          setIsDeleting(true);
                          try {
                             const isValid = await dataService.validateActionPassword(deletePassword);
                             if (!isValid) throw new Error("Senha incorreta.");
                             
                             // Adicionamos o método deleteReport depois em data-service.ts
                             await dataService.deleteReport(reportToDelete.id);
                             const all = await dataService.getAllReports();
                             setReports((all || []).filter(r => r && r.status !== 'rascunho'));
                             
                             toast({
                                title: "Relatório Excluído",
                                description: "O documento foi removido com sucesso."
                             });
                             
                             setReportToDelete(null);
                             setDeletePassword("");
                          } catch (e: any) {
                             toast({
                                title: "Erro",
                                description: e.message || "Não foi possível excluir.",
                                variant: "destructive"
                             });
                          } finally {
                             setIsDeleting(false);
                          }
                       }}
                    >
                       {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
