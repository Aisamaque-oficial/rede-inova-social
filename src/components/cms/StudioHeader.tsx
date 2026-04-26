import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layout, Globe, Eye, Monitor, Tablet, Smartphone, ChevronDown } from "lucide-react";
import { useStudio } from "@/context/StudioContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface StudioHeaderProps {
    pageTitle: string;
    pageKey?: string;
    availablePages?: { key: string; title: string }[];
}

export default function StudioHeader({ pageTitle, pageKey, availablePages = [] }: StudioHeaderProps) {
    const { mode, device } = useStudio();
    const router = useRouter();

    const statusConfig = {
        draft: { label: "Rascunho", color: "bg-amber-500", icon: Layout },
        preview: { label: "Preview", color: "bg-blue-500", icon: Eye },
        live: { label: "Ao Vivo", color: "bg-emerald-500", icon: Globe }
    };

    const StatusIcon = statusConfig[mode].icon;

    return (
        <header className="h-16 border-b bg-white border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[100] shadow-sm">
            <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" asChild className="rounded-xl gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-primary">
                    <Link href="/painel/dashboard">
                        <ChevronLeft size={16} /> Sair do Estúdio
                    </Link>
                </Button>
                
                <div className="h-6 w-px bg-slate-200" />
                
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:inline">Página Atual</span>
                    
                    {availablePages.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-1 px-2 -ml-2 rounded-xl gap-2 focus-visible:ring-1 focus-visible:ring-primary/50 group">
                                    <h1 className="text-lg font-black italic tracking-tighter uppercase text-primary group-hover:text-primary/80 transition-colors">
                                        {pageTitle}
                                    </h1>
                                    <ChevronDown size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 rounded-2xl border-slate-100 shadow-xl p-2 z-[110]">
                                <div className="px-2 pb-2 mb-2 border-b border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mapemento do Estúdio</p>
                                </div>
                                {availablePages.map((page) => (
                                    <DropdownMenuItem 
                                        key={page.key}
                                        onClick={() => router.push(`/studio?page=${page.key}`)}
                                        className={cn(
                                            "rounded-xl text-sm font-bold cursor-pointer", 
                                            pageKey === page.key ? "bg-primary/10 text-primary" : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        {page.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <h1 className="text-lg font-black italic tracking-tighter uppercase text-primary">
                            {pageTitle}
                        </h1>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <StatusIcon size={14} className={cn("inline-block", mode === 'draft' ? "text-amber-500" : mode === 'preview' ? "text-blue-500" : "text-emerald-500")} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest hidden sm:inline", mode === 'draft' ? "text-amber-600" : mode === 'preview' ? "text-blue-600" : "text-emerald-600")}>
                        {statusConfig[mode].label}
                    </span>
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-tighter border-slate-200">
                        {device === 'desktop' ? <Monitor size={10} className="mr-1 inline" /> : device === 'tablet' ? <Tablet size={10} className="mr-1 inline" /> : <Smartphone size={10} className="mr-1 inline" />}
                        <span className="hidden sm:inline">{device}</span>
                    </Badge>
                </div>
            </div>
        </header>
    );
}
