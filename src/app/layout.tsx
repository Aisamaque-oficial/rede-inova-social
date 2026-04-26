
"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SplashScreen from '@/components/splash-screen';
import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { AccessibilityProvider } from '@/context/accessibility-context';
import { AccessibilityToolbar } from '@/components/accessibility-toolbar';
import { LibrasOverlay } from '@/components/libras-overlay';
import { ReadingAids } from '@/components/reading-aids';
import { ContentMagnifier } from '@/components/content-magnifier';
import { LISSAAssistant } from '@/components/lissa-assistant';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { usePathname } from 'next/navigation';

const metadata: Metadata = {
  title: 'RedeInovaSocial',
  description: 'Gerenciador de Projeto da Rede de Inovação Social',
};

// Importar fontes para acessibilidade
const fontLinks = (
    <>
        <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/dist/css/open-dyslexic.min.css" rel="stylesheet" />
    </>
);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showingSplash, setShowingSplash] = useState(true);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('splashShown');
    if (hasBeenShown) {
      setShowingSplash(false);
      return;
    }
    
    const a = setTimeout(() => {
        setShowingSplash(false);
        sessionStorage.setItem('splashShown', 'true');
    }, 3000);
    return () => clearTimeout(a);
  }, []);

    const pathname = usePathname();
    const isInternalArea = 
        pathname?.startsWith('/dashboard') || 
        pathname?.startsWith('/painel') || 
        pathname?.startsWith('/studio') || 
        pathname?.startsWith('/planejamento') || 
        pathname?.startsWith('/gerenciar') || 
        pathname?.startsWith('/documentos') ||
        pathname?.startsWith('/minhas-tarefas') ||
        pathname?.startsWith('/atividades') ||
        pathname?.startsWith('/registro-publico');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {fontLinks}
      </head>
      <body className="font-body antialiased bg-immersive" suppressHydrationWarning>
        <AccessibilityProvider>
                <div className="flex flex-col min-h-screen">
                    {showingSplash ? (
                        <SplashScreen key="splash" />
                    ) : (
                        <div 
                            key="content"
                            className="flex flex-col min-h-screen"
                        >
                            {children}
                        </div>
                    )}
                </div>
                {!isInternalArea && (
                    <>
                        <LibrasOverlay />
                        <AccessibilityToolbar />
                        <LISSAAssistant />
                        <ReadingAids />
                        <ContentMagnifier />
                    </>
                )}
                <Toaster />
            {/* SVG Filters for Daltonismo (Color Blindness) */}
            <svg style={{ display: 'none' }}>
                <defs>
                    <filter id="protanopia-filter">
                        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="deuteranopia-filter">
                        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="tritanopia-filter">
                        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                </defs>
            </svg>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
