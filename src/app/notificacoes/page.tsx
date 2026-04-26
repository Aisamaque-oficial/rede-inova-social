"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck, Trash2, AlertCircle } from "lucide-react";

interface NotificacaoItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
  origemUsuarioNome: string;
  metadata?: any;
}

export default function NotificacoesPage() {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todas" | "nao_lidas" | "lidas">("todas");

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = () => {
    setIsLoading(true);
    const userId = dataService.getCurrentUserId();
    
    if (!userId) {
      router.push("/login");
      return;
    }

    const notifs = dataService.obterNotificacoes(userId);
    setNotificacoes(notifs);
    setIsLoading(false);
  };

  const handleMarcarComoLida = (notifId: string) => {
    dataService.marcarComoLida(notifId);
    setNotificacoes(prev =>
      prev.map(n =>
        n.id === notifId ? { ...n, lida: true } : n
      )
    );
  };

  const handleMarcarTodasComoLidas = () => {
    const userId = dataService.getCurrentUserId();
    if (userId) {
      dataService.marcarTodasComoLidas(userId);
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    }
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "responsabilidade_atribuida":
        return "🎯";
      case "upload_aprovado":
        return "✅";
      case "upload_rejeitado":
        return "❌";
      case "responsabilidade_modificada":
        return "📝";
      default:
        return "📢";
    }
  };

  const getCorFundo = (tipo: string) => {
    switch (tipo) {
      case "responsabilidade_atribuida":
        return "bg-blue-50 border-l-4 border-l-blue-500";
      case "upload_aprovado":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "upload_rejeitado":
        return "bg-red-50 border-l-4 border-l-red-500";
      case "responsabilidade_modificada":
        return "bg-amber-50 border-l-4 border-l-amber-500";
      default:
        return "bg-gray-50 border-l-4 border-l-gray-500";
    }
  };

  const obterTituloFiltro = (tipo: string) => {
    switch (tipo) {
      case "responsabilidade_atribuida":
        return "Responsabilidades";
      case "upload_aprovado":
        return "Uploads Aprovados";
      case "upload_rejeitado":
        return "Uploads Rejeitados";
      case "responsabilidade_modificada":
        return "Modificações";
      default:
        return tipo;
    }
  };

  const notificacoesFiltradasLista =
    filtro === "todas"
      ? notificacoes
      : filtro === "nao_lidas"
        ? notificacoes.filter(n => !n.lida)
        : notificacoes.filter(n => n.lida);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔔 Notificações</h1>
          <p className="text-muted-foreground mt-2">
            Todas as suas notificações do sistema
          </p>
        </div>
        {naoLidas > 0 && (
          <Button
            onClick={handleMarcarTodasComoLidas}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar tudo como lido ({naoLidas})
          </Button>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você não tem notificações. Quando receberalexandrções de responsabilidades ou atualizações de uploads, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Abas de filtro */}
          <Tabs value={filtro} onValueChange={(v) => setFiltro(v as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="todas" className="flex-1">
                Todas ({notificacoes.length})
              </TabsTrigger>
              <TabsTrigger value="nao_lidas" className="flex-1">
                Não lidas ({naoLidas})
              </TabsTrigger>
              <TabsTrigger value="lidas" className="flex-1">
                Lidas ({notificacoes.length - naoLidas})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filtro} className="space-y-4 mt-6">
              {notificacoesFiltradasLista.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    {filtro === "nao_lidas" && "Parabéns! Você leu todas as notificações"}
                    {filtro === "lidas" && "Nenhuma notificação lida ainda"}
                    {filtro === "todas" && "Nenhuma notificação"}
                  </CardContent>
                </Card>
              ) : (
                notificacoesFiltradasLista.map(notif => (
                  <Card
                    key={notif.id}
                    className={cn(getCorFundo(notif.tipo), "cursor-pointer transition-all hover:shadow-md")}
                    onClick={() => handleMarcarComoLida(notif.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl flex-shrink-0">
                          {getIconoTipo(notif.tipo)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                              "font-semibold text-lg",
                              !notif.lida && "text-blue-900"
                            )}>
                              {notif.titulo}
                            </h3>
                            <Badge
                              variant={notif.lida ? "outline" : "default"}
                              className={notif.lida ? "" : "bg-blue-600"}
                            >
                              {notif.lida ? "Lida" : "Não lida"}
                            </Badge>
                            <Badge variant="outline">
                              {obterTituloFiltro(notif.tipo)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {notif.descricao}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>📤 {notif.origemUsuarioNome}</span>
                            <span>
                              {new Date(notif.dataCriacao).toLocaleDateString(
                                "pt-BR",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>

                          {notif.metadata?.motivo && (
                            <div className="mt-3 p-2 bg-red-100 rounded text-sm">
                              <strong>Motivo:</strong> {notif.metadata.motivo}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
