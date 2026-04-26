"use client";

import { useAccessibility, ColorMode } from "@/context/accessibility-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Type, 
  Eye, 
  Settings, 
  Sun, 
  Moon, 
  CloudSun, 
  Leaf,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ConfigsPage() {
  const { 
    colorMode, 
    setColorMode, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize,
    resetAccessibility 
  } = useAccessibility();

  const themes = [
    { 
      id: 'default' as ColorMode, 
      name: 'Rede Inova (Padrão)', 
      desc: 'Cores originais: Verde e Bege institucional.',
      icon: Leaf,
      preview: 'bg-[#90b045]',
      border: 'border-lime-200'
    },
    { 
      id: 'dark' as ColorMode, 
      name: 'Modo Escuro (Dark)', 
      desc: 'Fundo escuro profundo com alto contraste.',
      icon: Moon,
      preview: 'bg-slate-900',
      border: 'border-slate-700'
    },
    { 
      id: 'light' as ColorMode, 
      name: 'Modo Branco (Light)', 
      desc: 'Branco total para clareza máxima de leitura.',
      icon: Sun,
      preview: 'bg-white border',
      border: 'border-slate-200'
    },
    { 
      id: 'dim' as ColorMode, 
      name: 'Meia Luz (Soft)', 
      desc: 'Tons cinzas azulados para reduzir a fadiga.',
      icon: CloudSun,
      preview: 'bg-slate-700',
      border: 'border-slate-500'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-primary mb-2">
              <Settings className="h-6 w-6 animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema de Preferências</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-foreground uppercase">
              Configurações do <span className="text-primary italic">Sistema</span>
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Personalize sua experiência visual e de acessibilidade
          </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna de Temas */}
          <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl shadow-current/5 rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="p-10 pb-4">
                      <div className="flex items-center gap-4 mb-2">
                          <Palette className="h-6 w-6 text-primary" />
                          <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-card-foreground">Temas do Sistema</CardTitle>
                      </div>
                      <CardDescription className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Escolha o ambiente visual que melhor se adapta ao seu conforto
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                          {themes.map((theme) => (
                              <button
                                key={theme.id}
                                onClick={() => setColorMode(theme.id)}
                                className={cn(
                                    "relative flex flex-col p-6 rounded-[2rem] border-2 transition-all duration-500 text-left group overflow-hidden",
                                    colorMode === theme.id 
                                        ? "border-primary bg-primary/10 shadow-xl shadow-primary/5" 
                                        : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg"
                                )}
                              >
                                  {colorMode === theme.id && (
                                      <div className="absolute top-4 right-4 text-primary animate-reveal-up">
                                          <CheckCircle2 className="h-6 w-6 fill-primary/10" />
                                      </div>
                                  )}

                                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg", theme.preview, theme.border)}>
                                      <theme.icon className={cn("h-6 w-6", theme.id === 'light' ? 'text-slate-800' : 'text-white')} />
                                  </div>

                                  <span className="text-sm font-black uppercase tracking-tighter mb-1 select-none text-card-foreground">{theme.name}</span>
                                  <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase select-none">{theme.desc}</p>

                                  {/* Decorative hover effect */}
                                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                          ))}
                      </div>
                  </CardContent>
              </Card>

              {/* Card de Informação de Segurança */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
                   <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                       <ShieldAlert className="h-7 w-7 text-emerald-400" />
                   </div>
                   <div className="space-y-1">
                       <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Persistência Ativa</h4>
                       <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase leading-relaxed">
                           Suas preferências visuais são salvas automaticamente e estarão ativas na sua próxima visita.
                       </p>
                   </div>
              </div>
          </div>

          {/* Coluna de Acessibilidade */}
          <div className="space-y-8">
              <Card className="border-none shadow-2xl shadow-current/5 rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 h-full">
                  <CardHeader className="p-10 pb-4">
                      <div className="flex items-center gap-4 mb-2">
                          <Type className="h-6 w-6 text-primary" />
                          <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-card-foreground">Texto & Escala</CardTitle>
                      </div>
                      <CardDescription className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Ajuste o tamanho global das letras
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-6 space-y-10">
                      <div className="flex flex-col items-center gap-6 p-8 bg-background/50 rounded-[2.5rem] border border-border/50">
                          <span className="text-5xl font-black italic text-primary tracking-tighter">{fontSize}%</span>
                          <div className="flex gap-4">
                              <Button 
                                onClick={decreaseFontSize}
                                className="h-14 w-14 rounded-full bg-card text-card-foreground border-2 border-border/50 hover:bg-primary hover:text-white transition-all shadow-lg"
                              >
                                  <ZoomOut className="h-6 w-6" />
                              </Button>
                              <Button 
                                onClick={increaseFontSize}
                                className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:scale-110 transition-all border-none"
                              >
                                  <ZoomIn className="h-6 w-6" />
                              </Button>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div className="flex items-center gap-3 opacity-50">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ações Rápidas</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            onClick={resetAccessibility}
                            className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-colors gap-3 text-muted-foreground border border-border/10"
                          >
                              <RefreshCw className="h-4 w-4" />
                              Resetar para o Padrão
                          </Button>
                      </div>

                      {/* Exemplo de Escala */}
                      <div className="p-6 border border-dashed border-border rounded-2xl space-y-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Exemplo de Leitura</span>
                          <p className="text-sm font-bold text-card-foreground leading-tight">
                              A Rede Inova Social busca democratizar o acesso à tecnologia e informação.
                          </p>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
