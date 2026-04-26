"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { Construction, Lock, ArrowLeft, Sparkles } from "lucide-react";

/**
 * 🔒 ESTÚDIO DIGITAL — MODO STANDBY TÉCNICO
 * 
 * O Estúdio está em desenvolvimento. Apenas ADMIN_MASTER pode acessar.
 * Nenhuma lógica do StudioContext roda aqui — isolamento total.
 */
export default function StudioPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const session = dataService.obterSessaoAtual();
        // Apenas ADMIN_MASTER pode acessar o Studio
        if (session?.role === 'ADMIN_MASTER') {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
        }
    }, []);

    // Loading
    if (isAuthorized === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // 🔒 BLOQUEIO: Tela institucional de standby
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center space-y-8">
                    {/* Ícone de construção */}
                    <div className="relative mx-auto w-28 h-28">
                        <div className="absolute inset-0 bg-orange-100 rounded-3xl rotate-6 animate-pulse" />
                        <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-orange-100 flex items-center justify-center">
                            <Construction className="h-12 w-12 text-orange-500" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Lock className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    {/* Texto institucional */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Área em Desenvolvimento
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                            Estamos desenvolvendo uma nova experiência de edição visual para o portal.
                            Em breve, esta plataforma estará disponível para a equipe editorial.
                        </p>
                    </div>

                    {/* Info badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-5 py-2.5 rounded-full text-sm font-bold border border-orange-100">
                        <Sparkles className="h-4 w-4" />
                        Estúdio Digital — Em Construção
                    </div>

                    {/* Botão de voltar */}
                    <div>
                        <button
                            onClick={() => router.push('/painel/dashboard')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar ao Painel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ ADMIN_MASTER — pode acessar (placeholder para futuro)
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-3xl flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">Estúdio Digital (Admin Master)</h1>
                <p className="text-slate-500">Ambiente reservado para desenvolvimento do CMS visual.</p>
                <button
                    onClick={() => router.push('/painel/dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar ao Painel
                </button>
            </div>
        </div>
    );
}
