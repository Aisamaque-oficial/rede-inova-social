
"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accessibility, 
  Save, 
  RotateCcw, 
  Loader2, 
  Globe, 
  Video, 
  AlertCircle,
  ExternalLink,
  Monitor,
  History,
  CheckCircle2,
  Clock,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

const CMS_ACCESSIBILITY_FIELDS = [
  {
    id: "landing_hero_title",
    label: "Título Principal (Hero)",
    description: "Tradução em Libras para o impacto inicial do portal.",
    defaultText: "Conectando Saberes e Realidades",
  },
  {
    id: "landing_hero_subtitle",
    label: "Subtítulo do Hero",
    description: "Tradução da mensagem de apoio do cabeçalho.",
    defaultText: "Agricultura familiar, tecnologia e inclusão...",
  },
  {
    id: "landing_feed_title",
    label: "Título da Seção de Notícias",
    description: "Tradução para o cabeçalho do feed de atualizações.",
    defaultText: "Últimas do Projeto",
  },
  {
    id: "landing_feed_subtitle",
    label: "Subtítulo da Seção de Notícias",
    description: "Tradução explicativa para o feed.",
    defaultText: "Fique por dentro das transformações...",
  },
  {
    id: "footer_quote",
    label: "Citação do Rodapé",
    description: "Tradução da frase de impacto no fechamento do site.",
    defaultText: "Tecnologia e inovação social combatendo...",
  }
];

export default function AcessibilidadeSitePage() {
  const [data, setData] = useState<Record<string, { content: string, librasVideoUrl: string, librasStatus?: string, history?: any[] }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const results: Record<string, { content: string, librasVideoUrl: string, librasStatus?: string, history?: any[] }> = {};
      for (const field of CMS_ACCESSIBILITY_FIELDS) {
        const fieldData = await dataService.getCMSData(field.id);
        results[field.id] = {
          content: fieldData.content || field.defaultText,
          librasVideoUrl: fieldData.librasVideoUrl || "",
          librasStatus: fieldData.librasStatus || 'UPDATED',
          history: fieldData.history || []
        };
      }
      setData(results);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (fieldId: string) => {
    setIsSaving(fieldId);
    try {
      await dataService.updatePageCMS(fieldId, { 
        librasVideoUrl: data[fieldId].librasVideoUrl 
      });
      toast({
        title: "🛡️ Acessibilidade Atualizada",
        description: "O vídeo de Libras foi vinculado e já está disponível no portal público.",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erro ao Vincular",
        description: error.message || "Falha na comunicação com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Accessibility className="h-6 w-6" />
             </div>
             <div>
                <h1 className="text-3xl font-black font-headline tracking-tight uppercase italic text-slate-800">
                  Estação de Site Acessível
                </h1>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Mediação Comunicacional Libras - Portal Público
                </p>
             </div>
          </div>
        </div>
        <Button 
            variant="outline" 
            onClick={() => window.open('/', '_blank')}
            className="rounded-full shadow-sm hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest"
        >
            <Monitor className="mr-2 h-4 w-4" />
            Visualizar Portal Publico
        </Button>
      </header>

      <Alert className="bg-amber-50 border-amber-200 rounded-3xl p-6">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <div className="ml-2">
            <AlertTitle className="text-amber-800 font-black uppercase tracking-tight text-sm">Diretriz de Mediação</AlertTitle>
            <AlertDescription className="text-amber-700 font-medium text-xs mt-1">
                Vincule o link do YouTube (Embed) para cada seção. Assim que o usuário clicar no texto correspondente no modo acessibilidade, este vídeo será entregue de forma flutuante.
            </AlertDescription>
        </div>
      </Alert>

      <div className="grid gap-6">
        {CMS_ACCESSIBILITY_FIELDS.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-[2.5rem] border-none ring-1 ring-slate-100 shadow-xl overflow-hidden group hover:ring-primary/20 transition-all">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                            0{index + 1}
                        </span>
                        <Label className="text-lg font-black uppercase tracking-tighter text-slate-700 italic">
                            {field.label}
                        </Label>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic text-sm text-slate-500">
                        "{data[field.id]?.content}"
                    </div>
                    <p className="text-xs text-muted-foreground font-medium pl-1">
                        {field.description}
                    </p>
                  </div>

                  <div className="lg:col-span-1 flex justify-center text-slate-200">
                    <ChevronRight className="h-8 w-8 hidden lg:block" />
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Video className="h-3 w-3" />
                            Link do Vídeo Libras (YouTube)
                        </Label>
                        
                        {data[field.id]?.librasStatus === 'OUTDATED' ? (
                            <Badge className="bg-amber-500 text-white border-none animate-pulse text-[8px] font-black px-2">Tradução Pendente</Badge>
                        ) : data[field.id]?.librasVideoUrl ? (
                            <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2">Vigente</Badge>
                        ) : null}
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                value={data[field.id]?.librasVideoUrl || ""}
                                onChange={(e) => setData({
                                    ...data,
                                    [field.id]: { ...data[field.id], librasVideoUrl: e.target.value }
                                })}
                                placeholder="https://www.youtube.com/embed/..."
                                className="rounded-2xl h-12 bg-white border-slate-200 focus:ring-primary font-medium text-sm"
                            />
                            <Button 
                                onClick={() => handleSave(field.id)}
                                disabled={isSaving === field.id}
                                className="h-12 w-12 rounded-2xl shrink-0 shadow-lg"
                            >
                                {isSaving === field.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                        {data[field.id]?.librasVideoUrl ? (
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl w-fit">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Vídeo Vinculado 
                                <a 
                                    href={data[field.id].librasVideoUrl} 
                                    target="_blank" 
                                    className="ml-2 flex items-center gap-1 hover:underline"
                                >
                                    Testar <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl w-fit">
                                Aguardando Mediação
                            </div>
                        )}

                        {data[field.id]?.history && data[field.id].history!.length > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setExpandedHistory(expandedHistory === field.id ? null : field.id)}
                                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                            >
                                <History className="h-3 w-3 mr-2" />
                                {expandedHistory === field.id ? "Ocultar" : "Histórico"}
                            </Button>
                        )}
                    </div>
                  </div>
                </div>

                {/* History Expansion */}
                <AnimatePresence>
                    {expandedHistory === field.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-8 pt-8 border-t border-slate-100 overflow-hidden"
                        >
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Linha do Tempo de Alterações
                            </h4>
                            <div className="space-y-4">
                                {data[field.id].history?.map((ver, vIdx) => (
                                    <div key={vIdx} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col md:flex-row gap-6 relative">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className="text-[8px] border-slate-200">v.{data[field.id].history!.length - vIdx}</Badge>
                                                <span className="text-[10px] font-bold text-slate-400">{new Date(ver.updatedAt).toLocaleString('pt-BR')}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 italic">"{ver.content}"</p>
                                        </div>
                                        {ver.librasVideoUrl && (
                                            <div className="shrink-0 flex items-center">
                                                <a 
                                                    href={ver.librasVideoUrl} 
                                                    target="_blank"
                                                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Video className="h-3 w-3" /> Vídeo da Época
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <footer className="pt-10 flex flex-col items-center gap-4 opacity-50">
          <Globe className="h-8 w-8 text-primary/40" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">
            Módulo de Acessibilidade Governamental <br /> 
            <span className="text-primary italic">Rede de Inovação Social - Conectando Realidades</span>
          </p>
      </footer>
    </div>
  );
}

