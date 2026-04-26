"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";
import { 
  Users, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";

export default function RelatorioAcessosPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const init = async () => {
      const session = dataService.obterSessaoAtual();
      if (!session || !session.logado) {
        router.push("/login");
        return;
      }

      // Verificação de permissão (Coordenadores)
      const allowedRoles = ["Coordenação Geral", "Coordenação Executiva", "Coordenação de Extensão", "Admin"];
      const userRole = session.role || "Membro";
      
      if (!allowedRoles.includes(userRole)) {
        setLoading(false);
        setUser(session);
        return;
      }

      setUser(session);
      const data = await supabaseActivity.getActivityLogs();
      setLogs(data);
      setLoading(false);
    };

    init();
  }, [router]);

  const filteredLogs = logs.filter(log => 
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && !["Coordenação Geral", "Coordenação Executiva", "Coordenação de Extensão", "Admin"].includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
        <p className="text-muted-foreground mt-2">Você não tem permissão para visualizar este relatório.</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Relatório de Acessos (Supabase)</h1>
          </div>
          <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            MODO HÍBRIDO ATIVO
          </div>
        </div>
      </header>

      <main className="container pt-8 animate-in fade-in duration-500">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Membros Monitorados</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio de Sessão</p>
                <p className="text-2xl font-bold">
                  {logs.length > 0 
                    ? Math.round(logs.reduce((acc, log) => acc + (log.session_duration || 0), 0) / logs.length) 
                    : 0} min
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                <p className="text-2xl font-bold">Hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou setor..."
              className="w-full pl-10 pr-4 h-10 rounded-md border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-md border bg-card hover:bg-accent transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Nome do Membro</th>
                  <th className="px-6 py-4">Setor</th>
                  <th className="px-6 py-4">Último Acesso</th>
                  <th className="px-6 py-4">Tempo na Sessão</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{log.user_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{log.user_id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {log.user_sector}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{new Date(log.last_online).toLocaleDateString('pt-BR')}</span>
                        <span className="text-xs text-muted-foreground">{new Date(log.last_online).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{log.session_duration || 0} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" title="Recentemente Online"></div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                      Nenhum registro de atividade encontrado no Supabase.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="mt-4 text-xs text-muted-foreground text-center">
          * Os dados acima são processados em tempo real via Supabase. A duração reflete o tempo ativo na página atual.
        </p>
      </main>
    </div>
  );
}
