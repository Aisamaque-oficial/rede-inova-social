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
  CheckCircle2, Plus, Trash2, Loader2, ShieldCheck, Clock, X
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

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [requestedSigners, setRequestedSigners] = useState<any[]>([]);

  React.useEffect(() => {
    dataService.getUsers().then(users => {
      setAllUsers(users.filter(u => u.id !== user?.id));
    });
  }, [user?.id]);

  const [activityDate, setActivityDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customPeriodStart, setCustomPeriodStart] = useState('');
  const [customPeriodEnd, setCustomPeriodEnd] = useState('');

  const getPeriodDates = () => {
    // If user set custom dates, use them
    if (customPeriodStart && customPeriodEnd) {
      return { start: new Date(customPeriodStart + 'T00:00:00'), end: new Date(customPeriodEnd + 'T23:59:59') };
    }
    const ref = new Date(activityDate + 'T12:00:00');
    switch (periodType) {
      case 'diaria': return { start: ref, end: ref };
      case 'semanal': return { start: startOfWeek(ref, { weekStartsOn: 1 }), end: endOfWeek(ref, { weekStartsOn: 1 }) };
      case 'quinzenal': return { start: subDays(ref, 14), end: ref };
      case 'mensal': return { start: startOfMonth(ref), end: endOfMonth(ref) };
    }
  };

  // Auto-fill period when periodType or activityDate changes
  React.useEffect(() => {
    const ref = new Date(activityDate + 'T12:00:00');
    switch (periodType) {
      case 'diaria':
        setCustomPeriodStart('');
        setCustomPeriodEnd('');
        break;
      case 'semanal':
        setCustomPeriodStart(format(startOfWeek(ref, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
        setCustomPeriodEnd(format(endOfWeek(ref, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
        break;
      case 'quinzenal':
        setCustomPeriodStart(format(subDays(ref, 14), 'yyyy-MM-dd'));
        setCustomPeriodEnd(format(ref, 'yyyy-MM-dd'));
        break;
      case 'mensal':
        setCustomPeriodStart(format(startOfMonth(ref), 'yyyy-MM-dd'));
        setCustomPeriodEnd(format(endOfMonth(ref), 'yyyy-MM-dd'));
        break;
    }
  }, [periodType, activityDate]);

  const period = getPeriodDates();
  const periodLabel = periodType === 'diaria'
    ? format(period.start, "dd/MM/yyyy")
    : `${format(period.start, "dd/MM/yyyy")} a ${format(period.end, "dd/MM/yyyy")}`;

  // Validation warnings
  const daysDiff = Math.floor((new Date().getTime() - new Date(activityDate + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24));
  const isRetroactive = daysDiff > 7;
  const isActivityOutsidePeriod = periodType !== 'diaria' && customPeriodStart && customPeriodEnd &&
    (new Date(activityDate) < new Date(customPeriodStart) || new Date(activityDate) > new Date(customPeriodEnd));

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

  const handleSave = async () => {
    if (!isSigned || !content.trim()) return;
    setIsSaving(true);

    try {
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
        createdAt: new Date().toISOString(),
        requestedSignatures: requestedSigners.map(s => ({
          id: `req-${Date.now()}-${s.id}`,
          userId: s.id,
          userName: s.nomeCompleto || s.name,
          requesterId: user?.id || 'unknown',
          requesterName: (user as any)?.nomeCompleto || user?.name || 'Sistema',
          status: 'aguardando',
          requestedAt: new Date().toISOString()
        }))
      };

      await dataService.saveReport(report);
      setSavedReportId(report.id);
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
    } finally {
      setIsSaving(false);
      onReportSaved?.();
    }
  };

  const handleSendToCGP = async () => {
    if (savedReportId) {
      setIsSaving(true);
      try {
        await dataService.sendReportToCGP(savedReportId);
      } catch (error) {
        console.error("Erro ao enviar relatório para CGP:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleGeneratePdf = async () => {
    if (!savedReportId) return;
    setIsGeneratingPdf(true);

    try {
      const { generateReportPdf } = await import('@/lib/pdf-generator');
      const reports = await dataService.getReportsBySector(sectorId);
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
      <div className="space-y-5">
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

        {/* Data de Realização - sempre visível */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Quando realizou a atividade
          </Label>
          <Input
            type="date"
            value={activityDate}
            onChange={(e) => { if (!isSigned) setActivityDate(e.target.value); }}
            disabled={isSigned}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="h-12 rounded-xl border-slate-200 font-bold text-sm"
          />
          {isRetroactive && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-[11px] font-bold">
                Atenção: Esta data é de <strong>{daysDiff} dias atrás</strong>. Considere justificar o atraso no corpo do relatório.
              </span>
            </div>
          )}
        </div>

        {/* Período de Referência - apenas para semanal/quinzenal/mensal */}
        {periodType !== 'diaria' && (
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Período de referência da atividade
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Início</span>
                <Input
                  type="date"
                  value={customPeriodStart}
                  onChange={(e) => { if (!isSigned) setCustomPeriodStart(e.target.value); }}
                  disabled={isSigned}
                  className="h-12 rounded-xl border-slate-200 font-bold text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fim</span>
                <Input
                  type="date"
                  value={customPeriodEnd}
                  onChange={(e) => { if (!isSigned) setCustomPeriodEnd(e.target.value); }}
                  disabled={isSigned}
                  className="h-12 rounded-xl border-slate-200 font-bold text-sm"
                />
              </div>
            </div>
            {isActivityOutsidePeriod && (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-xl">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px] font-bold">
                  A data de realização está fora do período de referência informado. Verifique se as datas estão corretas.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Resumo do período */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl">
          <Clock className="w-4 h-4 text-primary" />
          {periodType === 'diaria' ? 'Data' : 'Período'}: <span className="text-slate-800 font-black">{periodLabel}</span>
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

      {/* Solicitar Assinaturas */}
      {!isSigned && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Solicitar Assinaturas Adicionais (Opcional)
          </Label>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:ring-2 focus:ring-primary/20 outline-none flex-1 min-w-[200px]"
              value=""
              onChange={(e) => {
                const selectedUser = allUsers.find(u => u.id === e.target.value);
                if (selectedUser && !requestedSigners.find(s => s.id === selectedUser.id)) {
                  setRequestedSigners([...requestedSigners, selectedUser]);
                }
              }}
            >
              <option value="" disabled>Selecione um membro para assinar...</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.nomeCompleto || u.name} ({u.cargo || 'Membro'})</option>
              ))}
            </select>
          </div>
          
          {requestedSigners.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {requestedSigners.map(signer => (
                <div key={signer.id} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">{signer.nomeCompleto || signer.name}</span>
                  <button 
                    onClick={() => setRequestedSigners(requestedSigners.filter(s => s.id !== signer.id))}
                    className="text-red-400 hover:text-red-600 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
