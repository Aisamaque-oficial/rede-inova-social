"use client";

import React, { useState, useEffect, use } from "react";
import { dataService, SectorReport } from "@/lib/data-service";
import { SectorReportForm } from "@/components/sector-report-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, PlusCircle, History, Calendar, CheckCircle2, Send,
  Archive, Clock, User, ChevronRight, ArrowLeft, Download, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SectorReportPage({ params: paramsPromise }: any) {
  const params: any = use(paramsPromise);
  const sectorId = params?.id || "";

  const [sector, setSector] = useState<any>(null);
  const [reports, setReports] = useState<SectorReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("novo");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const init = async () => {
      const allSectors = await dataService.getSectors();
      const found = allSectors.find(s => s.id === sectorId || s.sigla.toLowerCase() === sectorId?.toLowerCase());
      setSector(found);

      if (found) {
        const sectorReports = dataService.getReportsBySector(found.id);
        setReports(sectorReports);
      }
      setIsLoading(false);
    };
    init();
  }, [sectorId]);

  const refreshReports = () => {
    if (sector) {
      setReports(dataService.getReportsBySector(sector.id));
      setActiveTab("historico");
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Carregando...</p>
      </div>
    );
  }

  if (!sector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-slate-800">Setor não encontrado</h1>
        <Link href="/dashboard" className="mt-6 text-indigo-600 hover:underline">Voltar</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assinado': return <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black uppercase"><CheckCircle2 className="w-3 h-3 mr-1" />Assinado</Badge>;
      case 'enviado': return <Badge className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase"><Send className="w-3 h-3 mr-1" />Enviado à CGP</Badge>;
      case 'arquivado': return <Badge className="bg-green-100 text-green-700 text-[8px] font-black uppercase"><Archive className="w-3 h-3 mr-1" />Arquivado</Badge>;
      default: return <Badge variant="outline" className="text-[8px]">Rascunho</Badge>;
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <Link href={`/atividades/setor/${sectorId}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Voltar ao painel do setor
        </Link>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">
            Relatório <span className="text-primary">{sector.sigla}</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            {sector.nome} — Relatórios de Atividades Setoriais
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-slate-100 w-full rounded-none justify-start">
          <TabsTrigger
            value="novo"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-4 h-auto text-sm font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Novo Relatório
          </TabsTrigger>
          <TabsTrigger
            value="historico"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-4 h-auto text-sm font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" /> Histórico ({reports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="novo" className="mt-0 outline-none">
          <SectorReportForm
            sectorId={sector.id}
            sectorSigla={sector.sigla}
            sectorName={sector.nome}
            onReportSaved={refreshReports}
          />
        </TabsContent>

        <TabsContent value="historico" className="mt-0 outline-none">
          {reports.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
              <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-400">Nenhum relatório ainda</h3>
              <p className="text-xs text-slate-400 mt-1">Crie seu primeiro relatório na aba "Novo Relatório".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <Card key={report.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className={cn("h-1", report.status === 'arquivado' ? 'bg-green-500' : report.status === 'enviado' ? 'bg-amber-500' : 'bg-blue-500')} />
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          {report.reportScope === 'individual' ? (
                            <Badge variant="outline" className="text-[8px] font-black uppercase text-purple-600 border-purple-200 bg-purple-50">Individual</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] font-black uppercase text-blue-600 border-blue-200 bg-blue-50">Global</Badge>
                          )}
                          <span className="font-black italic uppercase tracking-tighter text-slate-800">
                            {report.periodType === 'diaria' ? 'Diário' : report.periodType === 'semanal' ? 'Semanal' : report.periodType === 'quinzenal' ? 'Quinzenal' : 'Mensal'}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(report.periodStart), "dd/MM")} — {format(new Date(report.periodEnd), "dd/MM/yy")}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {report.signedBy}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(report.signedAt), "dd/MM/yy HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl text-[9px] font-black uppercase h-9" onClick={() => handleDownloadPdf(report)} disabled={isGeneratingPdf}>
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      {report.status === 'assinado' && (
                        <Button size="sm" className="rounded-xl text-[9px] font-black uppercase h-9 bg-primary text-white" onClick={() => { dataService.sendReportToCGP(report.id); refreshReports(); }}>
                          <Send className="w-3 h-3 mr-1" /> Enviar à CGP
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
