"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X, AlertCircle, Download } from "lucide-react";
import { dataService } from "@/lib/data-service";
import type { ArquivoRastreado } from "@/lib/responsabilidades";
import { AREA_LABELS, RESPONSABILIDADES_PADRAO } from "@/lib/responsabilidades";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function UploadsPendentesPage() {
  const [uploadsPendentes, setUploadsPendentes] = useState<ArquivoRastreado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroArea, setFiltroArea] = useState<string | null>(null);
  const [uploadEmAnalise, setUploadEmAnalise] = useState<ArquivoRastreado | null>(null);
  const [motivo, setMotivo] = useState("");
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    carregarUploadsPendentes();
  }, []);

  const carregarUploadsPendentes = () => {
    setIsLoading(true);
    const pendentes = dataService.obterUploadsPendentes();
    setUploadsPendentes(pendentes);
    setIsLoading(false);
  };

  const handleAprovar = (arquivo: ArquivoRastreado) => {
    setUploadEmAnalise(arquivo);
    setAcao("aprovar");
    setMotivo("");
  };

  const handleRejeitar = (arquivo: ArquivoRastreado) => {
    setUploadEmAnalise(arquivo);
    setAcao("rejeitar");
    setMotivo("");
  };

  const confirmarAcao = async () => {
    if (!uploadEmAnalise) return;

    setIsProcessing(true);
    const userId = dataService.getCurrentUserId();

    try {
      if (acao === "aprovar") {
        const resultado = dataService.aprovarUpload(uploadEmAnalise.id, userId || "sistema");
        if (resultado.sucesso) {
          setUploadsPendentes(prev =>
            prev.map(u =>
              u.id === uploadEmAnalise.id
                ? {
                    ...u,
                    aprovacao: {
                      status: "aprovado",
                      aprovadoPor: userId || "sistema",
                      dataAprovacao: new Date().toISOString(),
                    },
                  }
                : u
            )
          );
        }
      } else if (acao === "rejeitar") {
        const resultado = dataService.rejeitarUpload(
          uploadEmAnalise.id,
          userId || "sistema",
          motivo || "Sem motivo especificado"
        );
        if (resultado.sucesso) {
          setUploadsPendentes(prev =>
            prev.map(u =>
              u.id === uploadEmAnalise.id
                ? {
                    ...u,
                    aprovacao: {
                      status: "rejeitado",
                      aprovadoPor: userId || "sistema",
                      dataAprovacao: new Date().toISOString(),
                      motivo: motivo || "Sem motivo especificado",
                    },
                  }
                : u
            )
          );
        }
      }

      setUploadEmAnalise(null);
      setAcao(null);
      setMotivo("");
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadsFiltrados =
    filtroArea === null
      ? uploadsPendentes
      : uploadsPendentes.filter(u => u.area === filtroArea);

  const uploaderInfo = (usuarioId: string) => {
    const resp = dataService.obterResponsabilidades(usuarioId);
    return resp?.nomeCompleto || "Usuário desconhecido";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">📋 Uploads Pendentes de Aprovação</h1>
        <p className="text-muted-foreground mt-2">
          Revise e aprove os uploads que necessitam de validação
        </p>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{uploadsPendentes.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando revisão</p>
          </CardContent>
        </Card>
      </div>

      {uploadsPendentes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum upload pendente de aprovação. Ótimo trabalho! ✅
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* FILTRO POR ÁREA */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filtroArea === null ? "default" : "outline"}
              onClick={() => setFiltroArea(null)}
              size="sm"
            >
              Todas as Áreas ({uploadsPendentes.length})
            </Button>
            {Array.from(new Set(uploadsPendentes.map(u => u.area))).map(area => (
              <Button
                key={area}
                variant={filtroArea === area ? "default" : "outline"}
                onClick={() => setFiltroArea(area)}
                size="sm"
              >
                {AREA_LABELS[area] || area} (
                {uploadsPendentes.filter(u => u.area === area).length})
              </Button>
            ))}
          </div>

          {/* LISTA DE UPLOADS */}
          <div className="space-y-4">
            {uploadsFiltrados.map(arquivo => (
              <Card key={arquivo.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg truncate">{arquivo.nome}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {arquivo.tipo}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          ⏳ Pendente
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>🔼 Por: {uploaderInfo(arquivo.uploadadoPor)}</span>
                        <span>📂 Área: {AREA_LABELS[arquivo.area] || arquivo.area}</span>
                        <span>👁️ Visibilidade: {arquivo.visibilidade}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejeitar(arquivo)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAprovar(arquivo)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      <Dialog open={!!uploadEmAnalise} onOpenChange={() => setUploadEmAnalise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {acao === "aprovar" ? "✅ Aprovar Upload" : "❌ Rejeitar Upload"}
            </DialogTitle>
            <DialogDescription>{uploadEmAnalise?.nome}</DialogDescription>
          </DialogHeader>

          {acao === "rejeitar" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo da Rejeição (opcional)</label>
              <Textarea
                placeholder="Descreva por que está rejeitando este upload..."
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadEmAnalise(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmarAcao}
              disabled={isProcessing}
              className={acao === "aprovar" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isProcessing
                ? "Processando..."
                : acao === "aprovar"
                  ? "Confirmar Aprovação"
                  : "Confirmar Rejeição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
