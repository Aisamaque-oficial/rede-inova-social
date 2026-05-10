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
  const [periodType, setPeriodType] = useState<'semanal' | 'quinzenal' | 'mensal'>('semanal');
  const [content, setContent] = useState("");
  const [members, setMembers] = useState<MemberActivityEntry[]>([{ memberName: "", description: "" }]);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const user = dataService.getCurrentUser();

  const getPeriodDates = () => {
    const now = new Date();
    switch (periodType) {
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

    const sealText = `Documento assinado eletronicamente por ${user?.name || 'Coordenador'}, ${user?.cargo || 'Coordenador de Setor'}, em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}, no sistema do projeto Rede Inova Social.`;

    const report: SectorReport = {
      id: `report-${Date.now()}`,
      sectorId,
      sectorSigla,
      sectorName,
      periodType,
      periodStart: period.start.toISOString(),
      periodEnd: period.end.toISOString(),
      content,
      memberActivities: members.filter(m => m.memberName.trim()),
      signedBy: user?.name || 'Coordenador',
      signedByCargo: user?.cargo || 'Coordenador de Setor',
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
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;
      let y = 25;

      // Header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("PROJETO REDE INOVA SOCIAL", pageWidth / 2, y, { align: "center" });
      y += 6;
      doc.setFontSize(8);
      doc.text("Universidade Estadual do Sudoeste da Bahia — UESB", pageWidth / 2, y, { align: "center" });
      y += 12;

      // Title
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      const typeLabel = periodType === 'semanal' ? 'SEMANAL' : periodType === 'quinzenal' ? 'QUINZENAL' : 'MENSAL';
      doc.text(`RELATÓRIO ${typeLabel}`, pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Setor: ${sectorName} (${sectorSigla})`, pageWidth / 2, y, { align: "center" });
      y += 6;
      doc.text(`Período: ${periodLabel}`, pageWidth / 2, y, { align: "center" });
      y += 12;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Content
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ATIVIDADES REALIZADAS NO PERÍODO", margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(content, usableWidth);
      for (const line of contentLines) {
        if (y > 270) { doc.addPage(); y = 25; }
        doc.text(line, margin, y);
        y += 5.5;
      }
      y += 8;

      // Member Activities
      const validMembers = members.filter(m => m.memberName.trim());
      if (validMembers.length > 0) {
        if (y > 240) { doc.addPage(); y = 25; }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PARTICIPAÇÃO DOS MEMBROS", margin, y);
        y += 8;

        for (const member of validMembers) {
          if (y > 260) { doc.addPage(); y = 25; }
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`• ${member.memberName}`, margin + 4, y);
          y += 5.5;
          doc.setFont("helvetica", "normal");
          const memberLines = doc.splitTextToSize(member.description, usableWidth - 10);
          for (const line of memberLines) {
            if (y > 270) { doc.addPage(); y = 25; }
            doc.text(line, margin + 8, y);
            y += 5.5;
          }
          y += 4;
        }
      }

      // Signature Block
      y += 10;
      if (y > 230) { doc.addPage(); y = 25; }

      doc.setDrawColor(60, 130, 80);
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(margin, y, usableWidth, 40, 3, 3, 'FD');
      y += 10;

      doc.setFontSize(9);
      doc.setTextColor(60, 130, 80);
      doc.setFont("helvetica", "bold");
      doc.text("ASSINATURA ELETRÔNICA", pageWidth / 2, y, { align: "center" });
      y += 7;

      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      const sealText = `Documento assinado eletronicamente por ${user?.name || 'Coordenador'}, ${user?.cargo || 'Coordenador de Setor'}, em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}, no sistema do projeto Rede Inova Social.`;
      const sealLines = doc.splitTextToSize(sealText, usableWidth - 16);
      for (const line of sealLines) {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 4.5;
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text(`Rede Inova Social — Relatório ${typeLabel} — ${sectorSigla} — Página ${i}/${totalPages}`, pageWidth / 2, 290, { align: "center" });
      }

      const fileName = `Relatorio_${typeLabel}_${sectorSigla}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Period Selection */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Tipo de Relatório
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(['semanal', 'quinzenal', 'mensal'] as const).map(type => (
            <button
              key={type}
              onClick={() => { if (!isSigned) setPeriodType(type); }}
              disabled={isSigned}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all text-center",
                periodType === type
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-100 hover:border-slate-200 bg-white",
                isSigned && "opacity-60 cursor-not-allowed"
              )}
            >
              <span className="text-lg font-black italic uppercase tracking-tighter text-slate-800">
                {type === 'semanal' ? 'Semanal' : type === 'quinzenal' ? 'Quinzenal' : 'Mensal'}
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {type === 'semanal' ? '7 dias' : type === 'quinzenal' ? '15 dias' : '30 dias'}
              </p>
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
