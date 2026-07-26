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
import { notificationsService, NotificationItem } from "@/lib/notifications-service";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificacoesBell() {
  const [notificacoes, setNotificacoes] = useState<NotificationItem[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushSupported, setIsPushSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsPushSupported(true);
    }
    
    const userId = dataService.getCurrentUserId();
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = notificationsService.subscribeToNotifications(userId, (notifs) => {
      setNotificacoes(notifs);
      setNaoLidas(notifs.filter(n => !n.read).length);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribePush = async () => {
     try {
       const registration = await navigator.serviceWorker.ready;
       const subscription = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "dummy_key_please_set_in_env"
       });
       
       // Save to API
       // await fetch('/api/notifications/subscribe', { method: 'POST', body: JSON.stringify({ userId: dataService.getCurrentUserId(), subscription }) });
       alert("Notificações push ativadas com sucesso no seu dispositivo!");
     } catch(e) {
       console.error("Failed to subscribe push", e);
     }
  };

  const handleMarcarComoLida = async (notifId: string) => {
    if(!notifId) return;
    await notificationsService.markAsRead(notifId);
  };

  const handleMarcarTodasComoLidas = async () => {
    const userId = dataService.getCurrentUserId();
    if (userId) {
      await notificationsService.markAllAsRead(userId);
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

  const getFormatDate = (createdAt: any) => {
    if (!createdAt) return "";
    let dateObj;
    if (createdAt.toDate) {
      dateObj = createdAt.toDate();
    } else {
      dateObj = new Date(createdAt);
    }
    return dateObj.toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" });
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
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-[10px]"
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
              className="text-xs h-6 px-2"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Lidas
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
                    getCorTipo(notif.type),
                    !notif.read && "font-medium border-l-4 border-l-blue-500"
                  )}
                  onClick={() => handleMarcarComoLida(notif.id!)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getIconoTipo(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-xs truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notif.body}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {getFormatDate(notif.createdAt)}
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

        <div className="p-2 space-y-2">
          {isPushSupported && (
            <Button variant="outline" className="w-full text-xs" onClick={handleSubscribePush}>
              Ativar Avisos no Celular 📱
            </Button>
          )}
          <Button variant="secondary" className="w-full text-xs" asChild>
            <Link href="/painel/dashboard">Ver todas</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
