
"use client";

import * as React from "react";
import { dataService } from "@/lib/data-service";
import { 
  Users, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Search, 
  History,
  Activity,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

export default function RelatorioAcessosPage() {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const isAuthorized = dataService.canManageTeam();
    setAuthorized(isAuthorized);

    // 🚀 OTIMIZAÇÃO: Se não estiver autorizado ou se o Firebase não estiver configurado corretamente, 
    // pula o carregamento pesado e vai para o fallback/erro imediatamente.
    const isConfigValid = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (isAuthorized) {
      if (!isConfigValid) {
          console.warn("Monitor de Acesso: Configuração do Firebase ausente. Ativando modo local.");
          loadLocalData();
      } else {
          loadData();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadLocalData = async () => {
      setLoading(true);
      try {
          // Usa o método de listagem que já tem fallback mock
          const data = await dataService.listarMembrosEquipe();
          setUsers(data);
      } finally {
          setLoading(false);
      }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getUserActivityReport();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const displayName = (u.nomeCompleto || u.name || "").toLowerCase();
    const displaySector = (u.department || u.sector || "").toLowerCase();
    const query = search.toLowerCase();
    return displayName.includes(query) || displaySector.includes(query);
  });

  const formatDistance = (timestamp: any) => {
    if (!timestamp) return "Nunca acessou";
    
    // Handle Firestore Timestamp or ISO string
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    try {
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <ShieldCheck className="h-16 w-16 text-slate-200" />
        <h2 className="text-xl font-black uppercase text-slate-400 tracking-widest">Acesso Restrito</h2>
        <p className="text-slate-500 text-sm italic">Esta área é reservada exclusivamente para a coordenação geral e executiva.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20 w-fit">
          <Activity className="h-3 w-3" />
          Monitoramento de Presença
        </div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Relatório de Acessos
        </h1>
        <p className="text-slate-500 italic max-w-2xl">
          Acompanhamento em tempo real da atividade dos membros e tempo de permanência no sistema institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden border-b-4 border-b-primary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="h-3 w-3" /> Membros Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{users.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden border-b-4 border-b-emerald-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Média de Permanência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
                {Math.round(users.reduce((acc, u) => acc + (u.session_duration || 0), 0) / (users.length || 1))} min
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden border-b-4 border-b-orange-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <History className="h-3 w-3" /> Útimas 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
                {users.filter(u => {
                    const last = u.last_online?.toDate ? u.last_online.toDate() : new Date(u.last_online);
                    return Date.now() - last.getTime() < 24 * 60 * 60 * 1000;
                }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[3rem] border-slate-200 shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl">
        <CardHeader className="px-8 pt-10 pb-6 border-b border-slate-100 flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Registro de Atividade</CardTitle>
            <CardDescription className="italic text-slate-500">Listagem detalhada por membro da Rede Inova.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="PESQUISAR MEMBRO..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-slate-200 rounded-2xl pl-12 h-11 text-[10px] font-black tracking-widest"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Membro</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Setor/Cargo</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Último Acesso</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Permanência</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => {
                  const lastDate = u.last_online?.toDate ? u.last_online.toDate() : u.last_online ? new Date(u.last_online) : null;
                  const isOnline = lastDate && (Date.now() - lastDate.getTime() < 5 * 60 * 1000); // Online nos últimos 5 min

                  // Normalização de Dados (Firestore vs Mock)
                  const displayName = u.nomeCompleto || u.name || "Membro Indefinido";
                  const displaySector = u.department || u.sector || "GERAL";
                  const displayCargo = u.cargo || (u.role === 'admin' ? 'Administrador' : 'Membro');

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black overflow-hidden shadow-sm">
                                {u.avatarUrl ? (
                                    <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    displayName.charAt(0)
                                )}
                            </div>
                            {isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{displayName}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-all">ID: {u.id || u.institutionalId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit rounded-lg bg-slate-50 uppercase text-[9px] font-black tracking-widest text-slate-500 border-slate-200">
                            {dataService.getSectorSigla(displaySector)}
                          </Badge>
                          <span className="text-[11px] text-slate-400 italic">{displayCargo}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          <span className="text-sm">{formatDistance(u.last_online)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-emerald-500" 
                                style={{ width: `${Math.min((u.session_duration || 0) / 60 * 100, 100)}%` }} 
                             />
                          </div>
                          <span className="text-slate-900 font-black text-sm">{u.session_duration || 0} min</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {isOnline ? (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 py-1 px-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                            Online Agora
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-200 py-1 px-3 rounded-full text-[9px] font-black uppercase tracking-widest bg-white">
                            Desconectado
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="bg-slate-50 p-6 rounded-full">
                <Search className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400 italic">Nenhum membro encontrado com este termo.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-slate-950 rounded-[2.5rem] p-10 flex items-center justify-between text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-xl">
               <ShieldCheck className="h-6 w-6 text-primary" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tighter">Governança Transparente</h3>
          </div>
          <p className="text-slate-400 max-w-xl italic leading-relaxed">
            Este relatório integra a política de segurança e produtividade da Rede Inova Social, permitindo que as coordenações identifiquem gargalos de comunicação e otimizem o tempo de resposta institucional.
          </p>
        </div>
        <button 
            onClick={loadData}
            className="h-16 px-8 bg-primary rounded-2xl flex items-center gap-3 text-slate-950 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10"
        >
            Atualizar Dados <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
