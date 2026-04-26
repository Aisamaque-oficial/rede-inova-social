
"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, RotateCcw, Loader2, Globe, Layout, Type } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ASCOMNewsBoard } from "@/components/ascom-news-board";

const CMS_FIELDS = [
  {
    id: "landing_hero_title",
    label: "Título Principal (Hero)",
    description: "O texto grande que aparece no topo da página inicial.",
    default: "Conectando Saberes e Realidades",
    type: "text",
  },
  {
    id: "landing_hero_subtitle",
    label: "Subtítulo do Hero",
    description: "O texto de apoio abaixo do título principal.",
    default: "Agricultura familiar, tecnologia e inclusão unidos para transformar o Médio Sudoeste Baiano.",
    type: "textarea",
  },
  {
    id: "landing_feed_title",
    label: "Título da Seção de Notícias",
    description: "Título da seção que exibe os posts do projeto.",
    default: "Últimas do Projeto",
    type: "text",
  },
  {
    id: "landing_feed_subtitle",
    label: "Subtítulo da Seção de Notícias",
    description: "Texto explicativo abaixo das notícias.",
    default: "Fique por dentro das transformações e conquistas da nossa rede.",
    type: "textarea",
  },
  {
    id: "footer_quote",
    label: "Citação do Rodapé",
    description: "Frase em destaque no rodapé do site.",
    default: "Tecnologia e inovação social combatendo as desigualdades através da alimentação saudável.",
    type: "textarea",
  }
];

export default function CMSPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCMS = async () => {
      const data: Record<string, string> = {};
      for (const field of CMS_FIELDS) {
        data[field.id] = await dataService.getPageContent(field.id, field.default);
      }
      setContent(data);
      setIsLoading(false);
    };
    fetchCMS();
  }, []);

  const handleSave = async (fieldId: string) => {
    setIsSaving(true);
    try {
      await dataService.updatePageContent(fieldId, content[fieldId]);
      toast({
        title: "✅ Conteúdo Atualizado",
        description: "As alterações foram salvas e já estão públicas.",
      });
    } catch (error) {
      console.error("Erro ao salvar CMS:", error);
      toast({
        title: "❌ Erro ao Salvar",
        description: "Não foi possível persistir as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const fieldId of Object.keys(content)) {
        await dataService.updatePageContent(fieldId, content[fieldId]);
      }
      toast({
        title: "🚀 Tudo Atualizado!",
        description: "Todos os textos foram sincronizados com o banco de dados.",
      });
    } catch (error) {
       toast({
        title: "❌ Erro Parcial",
        description: "Alguns campos podem não ter sido salvos.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <Layout className="h-8 w-8 text-primary" />
            Gerenciamento de Conteúdo (CMS)
          </h1>
          <p className="text-muted-foreground">
            Altere os textos publicos do site em tempo real.
          </p>
        </div>
        <Button 
            onClick={handleSaveAll} 
            disabled={isSaving}
            className="rounded-full shadow-lg hover:scale-105 transition-transform"
        >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Todas as Alterações
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Globe className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
            As alterações feitas aqui refletem imediatamente na Landing Page pública e em outras seções do portal.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Textos da Página Inicial
            </CardTitle>
            <CardDescription>
                Controle os títulos e mensagens principais que os visitantes visualizam primeiro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {CMS_FIELDS.map((field) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-xl bg-slate-50/50 relative group">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <Label htmlFor={field.id} className="text-base font-bold">{field.label}</Label>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleSave(field.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar este
                    </Button>
                </div>
                
                {field.type === "text" ? (
                  <Input
                    id={field.id}
                    value={content[field.id] || ""}
                    onChange={(e) => setContent({ ...content, [field.id]: e.target.value })}
                    className="bg-white border-slate-200 focus:ring-primary"
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={content[field.id] || ""}
                    onChange={(e) => setContent({ ...content, [field.id]: e.target.value })}
                    className="bg-white border-slate-200 focus:ring-primary min-h-[100px]"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mural da ASCOM integrado ao CMS */}
        <Card className="rounded-[3.5rem] border-none ring-1 ring-slate-100 shadow-xl overflow-hidden">
           <CardHeader className="p-10 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Layout className="h-6 w-6" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">Mural de Notícias do Portal</CardTitle>
                    <CardDescription className="text-xs font-black uppercase tracking-widest text-slate-400">Gerencie a visibilidade e o destaque das notícias institucionais</CardDescription>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-10">
              <ASCOMNewsBoard />
           </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Descartar Alterações (Recarregar)
          </Button>
      </div>
    </div>
  );
}
