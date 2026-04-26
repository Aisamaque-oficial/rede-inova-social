import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { CMSBlock } from "@/lib/cms-schema";
import { BlockEditor } from "./BlockEditor";
import { ApprovalPanel } from "./ApprovalPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartStudioLink } from "./SmartStudioLink";

interface CMSPageRendererProps {
    pageId: string;
    isStudio?: boolean;
    mode?: 'draft' | 'preview' | 'live';
    device?: 'desktop' | 'tablet' | 'mobile';
    defaultBlocks: Array<Partial<CMSBlock>>;
    className?: string;
}

export function CMSPageRenderer({ 
    pageId, 
    isStudio = false, 
    mode = 'live', 
    device = 'desktop', 
    defaultBlocks, 
    className 
}: CMSPageRendererProps) {
    const [blocks, setBlocks] = useState<CMSBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        if (isStudio) {
            await dataService.initializePageBlocks(pageId, defaultBlocks);
        }
        
        const data = await dataService.getPageBlocks(pageId);
        
        if (data.length === 0 && defaultBlocks.length > 0) {
            setBlocks(defaultBlocks.map((def, i) => ({
                id: def.id || `${pageId}_default_${Math.random()}`,
                pageId: pageId,
                type: def.type || 'text',
                status: 'PUBLICADO',
                order: i,
                content: def.content || '',
                draft: def.content || '',
                data: (def as any).data || {},
                draftData: (def as any).draftData || {},
                accessibility: { librasUrl: '', altText: '', description: '', ...def.accessibility },
                style: { alignment: 'left', preset: 'neutral', ...def.style },
                metadata: { version: 1, lastEditedAt: new Date().toISOString(), lastEditedByName: 'Sistema' }
            } as CMSBlock)));
        } else {
            setBlocks(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setMounted(true);
        loadData();
    }, [pageId]);

    const handleAddBlock = async (type: string, positionStr: number) => {
        setIsLoading(true);
        await dataService.addBlock(pageId, type, positionStr);
        await loadData();
    };

    const deviceWidths = {
        desktop: 'w-full',
        tablet: 'max-w-[768px] mx-auto border-x border-slate-200 shadow-2xl',
        mobile: 'max-w-[390px] mx-auto border-x border-slate-200 shadow-2xl'
    };

    if (!mounted || isLoading) {
        return (
            <div className="space-y-6 container mx-auto">
                <Skeleton className="h-12 w-3/4 rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className={cn(
            "transition-all duration-500 ease-in-out pb-32",
            isStudio ? deviceWidths[device] : "w-full",
            className
        )}>
            {isStudio && mode === 'draft' && (
                <div className="mb-12 container mx-auto px-4">
                    <ApprovalPanel blocks={blocks} onAction={loadData} />
                </div>
            )}

            <div className={cn("space-y-4", !isStudio && "container mx-auto px-4")}>
                {blocks.map((block, index) => {
                    const isDraftMode = isStudio && mode === 'draft';
                    
                    return (
                        <div key={block.id} className="relative group/wrapper">
                            {isDraftMode && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover/wrapper:opacity-100 transition-opacity">
                                    <Button onClick={() => handleAddBlock('text', index)} size="sm" variant="secondary" className="h-6 rounded-full text-[10px] uppercase font-black tracking-widest gap-1 border border-slate-200 shadow-lg">
                                        <PlusCircle size={12} /> Inserir Bloco Aqui
                                    </Button>
                                </div>
                            )}

                            {isDraftMode ? (
                                <BlockEditor block={block} onUpdate={loadData} />
                            ) : (
                                <StaticRenderer block={block} mode={mode} isStudio={isStudio} />
                            )}
                        </div>
                    );
                })}

                {isStudio && mode === 'draft' && (
                    <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors bg-slate-50/50">
                         <p className="text-xs font-black uppercase tracking-widest text-slate-400">Adicionar Estrutura Final</p>
                         <div className="flex gap-2">
                             <Button onClick={() => handleAddBlock('text', blocks.length)} variant="outline" size="sm" className="rounded-xl text-[10px] uppercase tracking-widest font-black text-slate-500">Texto</Button>
                             <Button onClick={() => handleAddBlock('image', blocks.length)} variant="outline" size="sm" className="rounded-xl text-[10px] uppercase tracking-widest font-black text-slate-500">Imagem</Button>
                             <Button onClick={() => handleAddBlock('button', blocks.length)} variant="outline" size="sm" className="rounded-xl text-[10px] uppercase tracking-widest font-black text-slate-500">Botão</Button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StaticRenderer({ block, mode, isStudio }: { block: CMSBlock, mode: string, isStudio: boolean }) {
    const dataSource = mode === 'preview' ? block.draftData : block.data;
    const textSource = mode === 'preview' ? (block.draft || block.content) : block.content;

    return (
        <div 
            className="cms-static-block relative"
            style={{ textAlign: block.style?.alignment || 'left' }}
        >
            {block.type === 'header' && (
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-800 mb-6">
                    {textSource}
                </h2>
            )}
            
            {block.type === 'text' && (
                <p className="text-lg text-slate-500 font-medium italic leading-relaxed">
                    {textSource}
                </p>
            )}

            {block.type === 'image' && (
                <div className="w-full relative rounded-3xl overflow-hidden aspect-video bg-slate-100">
                    {(dataSource as any)?.url ? (
                        <img src={(dataSource as any).url} alt={block.accessibility?.altText || "Mídia institucional"} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 italic font-medium uppercase tracking-widest text-xs">
                            [ Imagem não definida ]
                        </div>
                    )}
                </div>
            )}

            {block.type === 'button' && (
                <div className="pt-4 pb-2">
                    <SmartStudioLink 
                        href={(dataSource as any)?.url || "#"}
                        className="inline-block bg-primary text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        isStudioContext={isStudio}
                    >
                        {textSource || "Acessar Aqui"}
                    </SmartStudioLink>
                </div>
            )}

            {isStudio && mode === 'live' && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-none font-black uppercase text-[8px]">Versão Live</Badge>
                </div>
            )}
        </div>
    );
}
