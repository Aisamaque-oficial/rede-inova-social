import { SectorReport } from "@/lib/data-service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * 🖨️ GERADOR DE PDF INSTITUCIONAL
 * Gera relatórios em PDF com cabeçalho institucional, logos e assinatura eletrônica.
 */

// Cache de imagens base64 para evitar recarregamento
let logoRedeInovaBase64: string | null = null;
let logoCnpqBase64: string | null = null;

async function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context unavailable");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function ensureLogosLoaded() {
  if (!logoRedeInovaBase64) {
    try {
      logoRedeInovaBase64 = await loadImageAsBase64("/assets/logotransparente.png");
    } catch (e) {
      console.warn("Não foi possível carregar logo Rede Inova:", e);
    }
  }
  if (!logoCnpqBase64) {
    try {
      logoCnpqBase64 = await loadImageAsBase64("/assets/logo_cnpq.png");
    } catch (e) {
      console.warn("Não foi possível carregar logo CNPq:", e);
    }
  }
}

export async function generateReportPdf(report: SectorReport) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const usableWidth = pageWidth - margin * 2;
  let y = 15;

  // Tentar carregar logos
  await ensureLogosLoaded();

  // ═══════════════════════════════════════
  // CABEÇALHO COM LOGOS
  // ═══════════════════════════════════════
  const logoHeight = 20;

  // Logo Rede Inova (esquerda)
  if (logoRedeInovaBase64) {
    try {
      doc.addImage(logoRedeInovaBase64, "PNG", margin, y - 2, 22, 22);
    } catch (e) {}
  }

  // Logo CNPq (direita)
  if (logoCnpqBase64) {
    try {
      // CNPq logo é larga (proporção ~4:1), ajustar
      doc.addImage(logoCnpqBase64, "PNG", pageWidth - margin - 55, y, 55, 14);
    } catch (e) {}
  }

  // Texto centralizado do cabeçalho
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text("PROJETO REDE INOVA SOCIAL", pageWidth / 2, y + 6, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("CNPq — PAS/NORDESTE", pageWidth / 2, y + 12, { align: "center" });

  y += logoHeight + 8;

  // Linha divisória do cabeçalho
  doc.setDrawColor(60, 130, 80);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ═══════════════════════════════════════
  // TÍTULO DO RELATÓRIO
  // ═══════════════════════════════════════
  const typeLabel = report.periodType === "semanal" ? "SEMANAL" : report.periodType === "quinzenal" ? "QUINZENAL" : "MENSAL";

  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(`RELATÓRIO ${typeLabel}`, pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Setor: ${report.sectorName} (${report.sectorSigla})`, pageWidth / 2, y, { align: "center" });
  y += 6;

  const periodStart = format(new Date(report.periodStart), "dd/MM/yyyy");
  const periodEnd = format(new Date(report.periodEnd), "dd/MM/yyyy");
  doc.text(`Período: ${periodStart} a ${periodEnd}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ═══════════════════════════════════════
  // CORPO DO RELATÓRIO
  // ═══════════════════════════════════════
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("ATIVIDADES REALIZADAS NO PERÍODO", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const contentLines = doc.splitTextToSize(report.content, usableWidth);
  for (const line of contentLines) {
    if (y > 270) { doc.addPage(); y = 25; }
    doc.text(line, margin, y);
    y += 5.5;
  }
  y += 8;

  // ═══════════════════════════════════════
  // PARTICIPAÇÃO DOS MEMBROS
  // ═══════════════════════════════════════
  const validMembers = (report.memberActivities || []).filter(m => m.memberName?.trim());
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

  // ═══════════════════════════════════════
  // BLOCO DE ASSINATURA ELETRÔNICA
  // ═══════════════════════════════════════
  y += 10;
  if (y > 230) { doc.addPage(); y = 25; }

  doc.setDrawColor(60, 130, 80);
  doc.setFillColor(245, 250, 245);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, usableWidth, 44, 3, 3, "FD");
  y += 10;

  doc.setFontSize(9);
  doc.setTextColor(60, 130, 80);
  doc.setFont("helvetica", "bold");
  doc.text("ASSINATURA ELETRÔNICA", pageWidth / 2, y, { align: "center" });
  y += 7;

  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const sealText = report.signatureSeal || 
    `Documento assinado eletronicamente por ${report.signedBy}, ${report.signedByCargo}, em ${format(new Date(report.signedAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}, no sistema do projeto Rede Inova Social.`;
  const sealLines = doc.splitTextToSize(sealText, usableWidth - 16);
  for (const line of sealLines) {
    doc.text(line, pageWidth / 2, y, { align: "center" });
    y += 4.5;
  }

  // ═══════════════════════════════════════
  // RODAPÉ EM TODAS AS PÁGINAS
  // ═══════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(
      `Rede Inova Social — CNPq PAS/Nordeste — Relatório ${typeLabel} — ${report.sectorSigla} — Página ${i}/${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  // Salvar
  const fileName = `Relatorio_${typeLabel}_${report.sectorSigla}_${format(new Date(report.createdAt), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
