"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  ChevronDown,
  Search,
  Ear,
  Sparkles,
  BookOpen,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSignedWords, setWordLibrasVideo, LibrasWord } from "@/lib/libras-words-database";

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

const EIXOS = [
  { id: "todos", label: "Todos os Eixos" },
  { id: 1, label: "Fundamentação", emoji: "🤟" },
  { id: 2, label: "Imunológico-Digestivo", emoji: "🧬" },
  { id: 3, label: "Rotulagem Técnica", emoji: "🏷️" },
  { id: 4, label: "Análise Crítica", emoji: "⚖️" },
  { id: 5, label: "Soberania Alimentar", emoji: "🌽" },
  { id: 6, label: "Produção no Campo", emoji: "🌱" },
];

export default function AcessibilidadeSitePage() {
  const [activeTab, setActiveTab] = useState<"words" | "cms">("words");
  const [data, setData] = useState<Record<string, { content: string, librasVideoUrl: string, librasStatus?: string, history?: any[] }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  
  // Signed Words State
  const [words, setWords] = useState<LibrasWord[]>([]);
  const [wordSearch, setWordSearch] = useState("");
  const [activeAxis, setActiveAxis] = useState<string | number>("todos");
  const [wordVideoDrafts, setWordVideoDrafts] = useState<Record<string, string>>({});
  const [savedWordFeedback, setSavedWordFeedback] = useState<string | null>(null);

  const { toast } = useToast();

  const loadWords = () => {
    const list = getAllSignedWords();
    setWords(list);
    const drafts: Record<string, string> = {};
    list.forEach(w => {
      drafts[w.term] = w.videoUrl || "";
    });
    setWordVideoDrafts(drafts);
  };

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
      loadWords();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveCMS = async (fieldId: string) => {
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

  const handleSaveWordVideo = (term: string) => {
    const url = (wordVideoDrafts[term] || "").trim();
    setWordLibrasVideo(term, url);
    setWords(prev => prev.map(w => w.term === term ? { ...w, videoUrl: url } : w));
    setSavedWordFeedback(term);
    setTimeout(() => setSavedWordFeedback(null), 3000);
    toast({
      title: "🤟 Vídeo de Libras Vinculado!",
      description: `O termo "${term}" foi atualizado com o vídeo informado.`,
    });
  };

  // Filter words
  const filteredWords = words.filter(w => {
    const matchesSearch = !wordSearch || 
      w.term.toLowerCase().includes(wordSearch.toLowerCase()) ||
      w.definition.toLowerCase().includes(wordSearch.toLowerCase());
    const matchesAxis = activeAxis === "todos" || Number(w.axisId) === Number(activeAxis);
    return matchesSearch && matchesAxis;
  });

  const totalWords = words.length;
  const wordsWithVideo = words.filter(w => Boolean(w.videoUrl && w.videoUrl.trim() !== "")).length;

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
            Visualizar Portal Público
        </Button>
      </header>

      {/* Tabs de Seleção */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("words")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            activeTab === "words" 
              ? "bg-white text-primary shadow-sm" 
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Ear className="h-4 w-4" />
          <span>Palavras em Libras ({totalWords})</span>
        </button>
        <button
          onClick={() => setActiveTab("cms")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            activeTab === "cms" 
              ? "bg-white text-primary shadow-sm" 
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Frases do Portal ({CMS_ACCESSIBILITY_FIELDS.length})</span>
        </button>
      </div>

      {/* TAB 1: PALAVRAS SINALIZADAS EM LIBRAS */}
      {activeTab === "words" && (
        <div className="space-y-6">
          {/* Card Resumo e Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Total de Termos</span>
              <p className="text-3xl font-black text-blue-900">{totalWords}</p>
              <p className="text-xs text-blue-700/80 mt-1 font-medium">Termos cadastrados com estratégia visual</p>
            </div>
            <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Com Vídeo Ativo</span>
              <p className="text-3xl font-black text-emerald-900">{wordsWithVideo}</p>
              <p className="text-xs text-emerald-700/80 mt-1 font-medium">Prontos para reprodução no portal</p>
            </div>
            <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">Aguardando Vídeo</span>
              <p className="text-3xl font-black text-amber-900">{totalWords - wordsWithVideo}</p>
              <p className="text-xs text-amber-700/80 mt-1 font-medium">Disponíveis para inserção de link</p>
            </div>
          </div>

          {/* Filtros e Barra de Pesquisa */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Pesquisar termo (ex: segurança, contaminação, higiene, agroecologia)..."
                value={wordSearch}
                onChange={(e) => setWordSearch(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white"
              />
            </div>

            {/* Eixos */}
            <div className="flex flex-wrap gap-2 pt-1">
              {EIXOS.map(eixo => (
                <button
                  key={eixo.id}
                  onClick={() => setActiveAxis(eixo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeAxis === eixo.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {eixo.emoji && <span>{eixo.emoji}</span>}
                  <span>{eixo.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Termos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Mostrando {filteredWords.length} termos
              </span>
            </div>

            {filteredWords.slice(0, 100).map((word) => {
              const currentDraft = wordVideoDrafts[word.term] ?? (word.videoUrl || "");
              const hasVideo = Boolean(word.videoUrl && word.videoUrl.trim() !== "");
              const isSaved = savedWordFeedback === word.term;

              return (
                <Card key={word.id} className="rounded-3xl border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50/60 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{word.axisEmoji || "🤟"}</span>
                          <Badge variant="outline" className="text-[10px] border-slate-200 font-bold">
                            {word.axisTitle || `Eixo ${word.axisId}`}
                          </Badge>
                          {hasVideo ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">
                              Vídeo Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[9px] font-bold text-slate-500">
                              Sem Vídeo
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
                          {word.term}
                        </CardTitle>
                      </div>

                      {hasVideo && (
                        <a
                          href={word.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-all shadow-sm shrink-0 self-start sm:self-auto"
                        >
                          <Video className="h-3 w-3" />
                          <span>Testar Vídeo</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4">
                    {/* Estratégia do Sinal */}
                    {word.signStrategy && (
                      <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200/50 text-xs">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1 mb-0.5">
                          <Sparkles className="h-3 w-3 text-blue-500" /> Estratégia de Sinalização
                        </span>
                        <p className="text-blue-900 font-medium italic leading-relaxed">
                          "{word.signStrategy}"
                        </p>
                      </div>
                    )}

                    {/* Definição */}
                    {word.definition && (
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {word.definition}
                      </p>
                    )}

                    {/* Input do Vídeo */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          placeholder="Cole o link do YouTube (watch, shorts, embed) ou arquivo .mp4..."
                          value={currentDraft}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWordVideoDrafts(prev => ({ ...prev, [word.term]: val }));
                          }}
                          className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200 font-medium"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSaveWordVideo(word.term)}
                        className={`rounded-xl px-4 h-10 font-black text-xs uppercase tracking-wider shrink-0 transition-all ${
                          isSaved ? "bg-emerald-600 text-white" : "bg-primary text-white hover:bg-primary/90"
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1.5" /> Salvo!
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5 mr-1.5" /> Salvar Vídeo
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredWords.length > 100 && (
              <p className="text-center text-xs text-slate-400 py-4 font-bold">
                Mostrando os primeiros 100 termos. Use o campo de busca acima para refinar.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FRASES INSTITUCIONAIS DO CMS */}
      {activeTab === "cms" && (
        <div className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200 rounded-3xl p-6">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div className="ml-3">
              <AlertTitle className="text-amber-800 font-bold text-sm uppercase tracking-wide">
                Instruções de Mediação Libras
              </AlertTitle>
              <AlertDescription className="text-amber-700/80 text-xs mt-1 leading-relaxed">
                Insira o link oficial do vídeo do YouTube para a interpretação de cada bloco do portal. 
                Os vídeos inseridos aqui aparecem quando o usuário clica sobre as seções institucionais.
              </AlertDescription>
            </div>
          </Alert>

          <div className="grid gap-6">
            {CMS_ACCESSIBILITY_FIELDS.map((field) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {field.id}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-black text-slate-800 tracking-tight">
                          {field.label}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 font-medium">
                          {field.description}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        {data[field.id]?.history && data[field.id].history!.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setExpandedHistory(expandedHistory === field.id ? null : field.id)}
                            className="rounded-full text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600"
                          >
                            <History className="h-3 w-3 mr-1" />
                            {data[field.id].history!.length} versões
                            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${expandedHistory === field.id ? 'rotate-180' : ''}`} />
                          </Button>
                        )}

                        <Badge 
                          className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                            data[field.id]?.librasVideoUrl 
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-200" 
                              : "bg-amber-500/10 text-amber-700 border-amber-200"
                          }`}
                          variant="outline"
                        >
                          {data[field.id]?.librasVideoUrl ? "Tradução Vinculada" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Texto em Português (Exibido no Site)
                      </Label>
                      <p className="text-sm font-medium text-slate-700 italic">
                        "{data[field.id]?.content}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-8 space-y-2">
                        <Label htmlFor={`video-${field.id}`} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          <Video className="h-4 w-4 text-primary" />
                          Link do Vídeo em Libras (YouTube ou Embed)
                        </Label>
                        <Input
                          id={`video-${field.id}`}
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={data[field.id]?.librasVideoUrl || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData(prev => ({
                              ...prev,
                              [field.id]: { ...prev[field.id], librasVideoUrl: val }
                            }));
                          }}
                          className="rounded-xl border-slate-200 bg-white"
                        />
                      </div>

                      <div className="md:col-span-4 flex gap-2">
                        <Button
                          onClick={() => handleSaveCMS(field.id)}
                          disabled={isSaving === field.id}
                          className="flex-1 rounded-xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-wider"
                        >
                          {isSaving === field.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" /> Salvar
                            </>
                          )}
                        </Button>

                        {data[field.id]?.librasVideoUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(data[field.id].librasVideoUrl, '_blank')}
                            className="rounded-xl border-slate-200 shrink-0"
                            title="Testar Link Externo"
                          >
                            <ExternalLink className="h-4 w-4 text-slate-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

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
