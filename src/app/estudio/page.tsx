"use client";

import LandingPage from "../page";
import { StudioProvider, useStudio } from "@/context/StudioContext";
import StudioHeader from "@/components/cms/StudioHeader";
import StudioToolbar from "@/components/cms/StudioToolbar";
import { dataService } from "@/lib/data-service";
import { useState } from "react";

export default function EstudioPage() {
    const [pageId] = useState("landing_page"); // ID base para a home

    return (
        <StudioProvider>
            <EstudioContent />
        </StudioProvider>
    );
}

function EstudioContent() {
    // Agora podemos usar useStudio() com segurança pois estamos dentro do StudioProvider
    const { mode, device } = useStudio();

    const handleSaveAll = async () => {
        console.log("💾 Iniciando salvamento em lote para landing_page");
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handlePublishAll = async () => {
        console.log("🚀 Iniciando publicação da página landing_page");
        await dataService.publishPageToSite("landing_page");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <StudioHeader pageTitle="Página Inicial (Landing)" />
            
            <main className="flex-1 relative overflow-y-auto pt-8">
                {/* Repassa o estado do Estúdio para o renderer da LandingPage */}
                <LandingPage 
                    params={{ estudio: "true" }} 
                    mode={mode}
                    device={device}
                />
            </main>

            <StudioToolbar 
                onSave={handleSaveAll} 
                onPublish={handlePublishAll}
            />
        </div>
    );
}
