"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dataService } from "@/lib/data-service";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificacaoItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
  origemUsuarioNome: string;
}

export function NotificacoesBell() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
    // Recarregar a cada 30 segundos
    const intervalo = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarNotificacoes = () => {
    const userId = dataService.getCurrentUserId();
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const todasNotifications = dataService.obterNotificacoes(userId);
    setNotificacoes(todasNotifications.slice(0, 10)); // Últimas 10
    setNaoLidas(dataService.obterContagemNaoLidas(userId));
    setIsLoading(false);
  };

  const handleMarcarComoLida = (notifId: string) => {
    dataService.marcarComoLida(notifId);
    setNotificacoes(prev =>
      prev.map(n =>
        n.id === notifId ? { ...n, lida: true } : n
      )
    );
    const userId = dataService.getCurrentUserId();
    if (userId) {
      setNaoLidas(dataService.obterContagemNaoLidas(userId));
    }
  };

  const handleMarcarTodasComoLidas = () => {
    const userId = dataService.getCurrentUserId();
    if (userId) {
      dataService.marcarTodasComoLidas(userId);
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      setNaoLidas(0);
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

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case "responsabilidade_atribuida":
        return "bg-blue-50 border-blue-200";
      case "upload_aprovado":
        return "bg-green-50 border-green-200";
      case "upload_rejeitado":
        return "bg-red-50 border-red-200";
      case "responsabilidade_modificada":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="Notificações"
        >
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="default"
            >
              {naoLidas > 9 ? "9+" : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notificações</h3>
          {naoLidas > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMarcarTodasComoLidas}
              className="text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notificacoes.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Nenhuma notificação ainda 🎉
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2 p-4">
              {notificacoes.map(notif => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-3 rounded-lg border text-sm cursor-pointer hover:shadow-sm transition-all",
                    getCorTipo(notif.tipo),
                    !notif.lida && "font-medium"
                  )}
                  onClick={() => handleMarcarComoLida(notif.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getIconoTipo(notif.tipo)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">
                          {notif.titulo}
                        </h4>
                        {!notif.lida && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notif.descricao}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notif.origemUsuarioNome}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notif.dataCriacao).toLocaleDateString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />

        <div className="p-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            asChild
          >
            <Link href="/notificacoes">
              Ver todas as notificações
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
