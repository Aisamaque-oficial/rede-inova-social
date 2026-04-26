"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
    url: string;
    className?: string;
}

export function VideoEmbed({ url, className }: VideoEmbedProps) {
    if (!url) return null;

    const getEmbedUrl = (url: string) => {
        // YouTube
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Vimeo
        const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return url; // Fallback to raw URL if already an embed link or unknown
    };

    const embedUrl = getEmbedUrl(url);

    if (!embedUrl) return null;

    return (
        <div className={cn("relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5", className)}>
            <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo Incorporado"
            />
        </div>
    );
}
