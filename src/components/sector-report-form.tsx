"use client";

import React, { useState } from "react";
import { dataService, SectorReport, MemberActivityEntry } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Calendar, User, PenLine, Send, Download,
  CheckCircle2, Plus, Trash2, Loader2, ShieldCheck, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, subWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface SectorReportFormProps {
  sectorId: string;
  sectorSigla: string;
  sectorName: string;
  onReportSaved?: () => void;
}

export function SectorReportForm({ sectorId, sectorSigla, sectorName, onReportSaved }: SectorReportFormProps) {
  const user = dataService.getCurrentUser();
  const isCoordinator = user?.cargo?.toLowerCase().includes('coordenador') || 
                        user?.name?.toLowerCase().includes('aisamaque') || 
                        user?.cargo?.toLowerCase().includes('cgp');

  const [reportScope, setReportScope] = useState<'global' | 'individual'>(isCoordinator ? 'global' : 'individual');
  const [periodType, setPeriodType] = useState<'diaria' | 'semanal' | 'quinzenal' | 'mensal'>(isCoordinator ? 'semanal' : 'diaria');
  const [content, setContent] = useState("");
  const [members, setMembers] = useState<MemberActivityEntry[]>([{ memberName: "", description: "" }]);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const getPeriodDates = () => {
    const now = new Date();
    switch (periodType) {
      case 'diaria': return { start: now, end: now };
      case 'semanal': return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case 'quinzenal': return { start: subDays(now, 14), end: now };
      case 'mensal': return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const period = getPeriodDates();
  const periodLabel = `${format(period.start, "dd/MM/yyyy")} a ${format(period.end, "dd/MM/yyyy")}`;

  const addMember = () => setMembers([...members, { memberName: "", description: "" }]);
  const removeMember = (index: number) => setMembers(members.filter((_, i) => i !== index));
  const updateMember = (index: number, field: keyof MemberActivityEntry, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleSign = () => {
    if (!content.trim()) return;
    setIsSigned(true);
  };

  const handleSave = () => {
    if (!isSigned || !content.trim()) return;
    setIsSaving(true);

    const sealText = `Documento assinado eletronicamente por ${user?.name || 'Membro'}, ${user?.cargo || 'Membro de Setor'}, em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}, no sistema do projeto Rede Inova Social.`;

    const report: SectorReport = {
      id: `report-${Date.now()}`,
      sectorId,
      sectorSigla,
      sectorName,
      reportScope,
      periodType,
      periodStart: period.start.toISOString(),
      periodEnd: period.end.toISOString(),
      content,
      memberActivities: reportScope === 'global' ? members.filter(m => m.memberName.trim()) : [],
      signedBy: user?.name || 'Membro',
      signedByCargo: user?.cargo || 'Membro do Setor',
      signedAt: new Date().toISOString(),
      signatureSeal: sealText,
      status: 'assinado',
      createdAt: new Date().toISOString()
    };

    dataService.saveReport(report);
    setSavedReportId(report.id);
    setIsSaving(false);
    onReportSaved?.();
  };

  const handleSendToCGP = () => {
    if (savedReportId) {
      dataService.sendReportToCGP(savedReportId);
    }
  };

  const handleGeneratePdf = async () => {
    if (!savedReportId) return;
    setIsGeneratingPdf(true);

    try {
      const { generateReportPdf } = await import('@/lib/pdf-generator');
      const reports = dataService.getReportsBySector(sectorId);
      const report = reports.find(r => r.id === savedReportId);
      if (report) {
        await generateReportPdf(report);
      }
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Scope Selection */}
      {isCoordinator && !isSigned && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Escopo do Relatório
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => { setReportScope('global'); setPeriodType('semanal'); }}
              className={cn("flex-1 p-4 rounded-2xl border-2 transition-all text-center", reportScope === 'global' ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-slate-100 bg-white hover:border-slate-200")}
            >
              <span className="text-sm font-black uppercase">Relatório Global do Setor</span>
            </button>
            <button
              onClick={() => { setReportScope('individual'); setPeriodType('diaria'); }}
              className={cn("flex-1 p-4 rounded-2xl border-2 transition-all text-center", reportScope === 'individual' ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-slate-100 bg-white hover:border-slate-200")}
            >
              <span className="text-sm font-black uppercase">Relatório Individual</span>
            </button>
          </div>
        </div>
      )}

      {/* Period Selection */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Período do Relatório
        </h3>
        <div className={cn("grid gap-4", reportScope === 'individual' ? "grid-cols-4" : "grid-cols-3")}>
          {(reportScope === 'individual' ? ['diaria', 'semanal', 'quinzenal', 'mensal'] : ['semanal', 'quinzenal', 'mensal']).map(type => (
            <button
              key={type}
              onClick={() => { if (!isSigned) setPeriodType(type as any); }}
              disabled={isSigned}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center",
                periodType === type
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-100 hover:border-slate-200 bg-white",
                isSigned && "opacity-60 cursor-not-allowed"
              )}
            >
              <span className="text-sm sm:text-base font-black italic uppercase tracking-tighter text-slate-800">
                {type === 'diaria' ? 'Diário' : type === 'semanal' ? 'Semanal' : type === 'quinzenal' ? 'Quinzenal' : 'Mensal'}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl">
          <Clock className="w-4 h-4 text-primary" />
          Período: <span className="text-slate-800 font-black">{periodLabel}</span>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Atividades Realizadas no Período
        </Label>
        <Textarea
          placeholder="Descreva detalhadamente as atividades realizadas pelo setor durante o período selecionado. Inclua marcos, entregas, reuniões, decisões e quaisquer eventos relevantes..."
          className="min-h-[200px] rounded-2xl border-slate-200 text-sm leading-relaxed p-5"
          value={content}
          onChange={(e) => { if (!isSigned) setContent(e.target.value); }}
          disabled={isSigned}
        />
      </div>

      {/* Member Activities */}
      {reportScope === 'global' && (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Participação Individual dos Membros
          </Label>
          {!isSigned && (
            <Button variant="outline" size="sm" onClick={addMember} className="rounded-xl text-[10px] font-black uppercase tracking-widest h-8">
              <Plus className="w-3 h-3 mr-1" /> Adicionar Membro
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {members.map((member, i) => (
            <Card key={i} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                    {i + 1}
                  </div>
                  <Input
                    placeholder="Nome do membro"
                    value={member.memberName}
                    onChange={(e) => updateMember(i, 'memberName', e.target.value)}
                    disabled={isSigned}
                    className="flex-1 h-10 rounded-xl border-slate-200 font-bold text-sm"
                  />
                  {!isSigned && members.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeMember(i)} className="rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 h-10 w-10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Descreva a contribuição deste membro durante o período..."
                  value={member.description}
                  onChange={(e) => updateMember(i, 'description', e.target.value)}
                  disabled={isSigned}
                  className="rounded-xl border-slate-200 text-sm min-h-[80px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      )}

      {/* Signature Block */}
      <AnimatePresence>
        {isSigned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-[2rem] border-2 border-primary/30 bg-primary/5 overflow-hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-800">
                  Assinado Eletronicamente
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                  Documento assinado eletronicamente por <strong>{user?.name}</strong>, {user?.cargo || 'Coordenador de Setor'}, em {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}, no sistema do projeto Rede Inova Social.
                </p>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Autenticidade Verificada
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {!isSigned ? (
          <Button
            onClick={handleSign}
            disabled={!content.trim()}
            className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl transition-all"
          >
            <PenLine className="mr-3 h-5 w-5" />
            Assinar Eletronicamente
          </Button>
        ) : !savedReportId ? (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl"
          >
            {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
            Confirmar e Salvar Relatório
          </Button>
        ) : (
          <>
            <Button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-2"
            >
              {isGeneratingPdf ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-3 h-5 w-5" />}
              Gerar PDF
            </Button>
            <Button
              onClick={handleSendToCGP}
              className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl"
            >
              <Send className="mr-3 h-5 w-5" />
              Enviar para a CGP
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
