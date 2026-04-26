"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type StudioMode = 'draft' | 'preview' | 'live';
export type StudioDevice = 'desktop' | 'tablet' | 'mobile';

interface StudioContextType {
    mode: StudioMode;
    setMode: (mode: StudioMode) => void;
    device: StudioDevice;
    setDevice: (device: StudioDevice) => void;
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (has: boolean) => void;
    lastSaved: string | null;
    setLastSaved: (date: string | null) => void;
    saveTrigger: number;
    triggerSave: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<StudioMode>('draft');
    const [device, setDevice] = useState<StudioDevice>('desktop');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [saveTrigger, setSaveTrigger] = useState(0);

    const triggerSave = () => setSaveTrigger(prev => prev + 1);

    // Proteção contra perda de dados: Avisar usuário se houver mudanças não salvas ao fechar aba
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    return (
        <StudioContext.Provider value={{
            mode,
            setMode,
            device,
            setDevice,
            hasUnsavedChanges,
            setHasUnsavedChanges,
            lastSaved,
            setLastSaved,
            saveTrigger,
            triggerSave
        }}>
            {children}
        </StudioContext.Provider>
    );
};

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (context === undefined) {
        throw new Error('useStudio must be used within a StudioProvider');
    }
    return context;
};
