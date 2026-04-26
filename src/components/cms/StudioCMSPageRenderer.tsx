"use client";

import React from "react";
import { useStudio } from "@/context/StudioContext";
import { CMSPageRenderer } from "./CMSPageRenderer";
import { CMSBlock } from "@/lib/cms-schema";

interface StudioCMSPageRendererProps {
    pageId: string;
    defaultBlocks: Array<Partial<CMSBlock>>;
    className?: string;
}

/**
 * 🎨 StudioCMSPageRenderer (Smart Component)
 * 
 * Este componente é exclusivo para o ambiente do Estúdio Digital.
 * Ele consome o StudioContext e repassa o estado (mode, device) para o 
 * renderizador base inteligente, garantindo que o site público não quebre.
 */
export function StudioCMSPageRenderer({ pageId, defaultBlocks, className }: StudioCMSPageRendererProps) {
    // Consome o contexto do Estúdio com segurança
    const { mode, device } = useStudio();

    return (
        <CMSPageRenderer 
            pageId={pageId}
            isStudio={true}
            mode={mode}
            device={device}
            defaultBlocks={defaultBlocks}
            className={className}
        />
    );
}
