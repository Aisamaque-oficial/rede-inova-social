"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StudioToolbar } from "@/components/studio-toolbar";
import LandingPage from "@/app/page";
import LaboratorioPage from "@/app/laboratorio/page";
import TeamPage from "@/app/equipe/page";
import TransparencyPage from "@/app/transparencia/page";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudioMirrorPage() {
    const params = useParams();
    const pageName = params?.pageName as string;
    const [renderKey, setRenderKey] = useState(0); // To force re-render after publish

    const renderPage = () => {
        const studioParams = { params: { estudio: "true" } };
        
        switch (pageName) {
            case "inicio":
                return <LandingPage {...studioParams} />;
            case "lissa":
                return <LaboratorioPage {...studioParams} />;
            case "equipe":
                return <TeamPage {...studioParams} />;
            case "transparencia":
                return <TransparencyPage {...studioParams} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                        <AlertCircle className="h-12 w-12 mb-4" />
                        <h2 className="text-xl font-bold uppercase tracking-widest">Página não mapeada no Estúdio</h2>
                    </div>
                );
        }
    };

    const handlePublishSuccess = () => {
        // Refresh the page or force re-render
        setRenderKey(prev => prev + 1);
    };

    return (
        <div className="bg-white min-h-screen">
            <StudioToolbar pageName={pageName} onPublishSuccess={handlePublishSuccess} />
            <main className="pt-16" key={renderKey}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pageName + renderKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
