import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { librasGlossary, librasPills as mockPills, librasTracks as mockTracks } from "@/lib/mock-data";
import { librasService, GlossaryTerm, MinutePill, LearningTrack } from "@/lib/libras-service";

export type LibrasTab = 'glossary' | 'pills' | 'tracks';

interface LibrasContextType {
  activeTab: LibrasTab;
  setActiveTab: (tab: LibrasTab) => void;
  activeModuleId: string | number;
  setActiveModuleId: (id: string | number) => void;
  activeTermKey: string | null;
  setActiveTermKey: (key: string | null) => void;
  termSearch: string;
  setTermSearch: (search: string) => void;
  
  // Data State
  glossaryTerms: GlossaryTerm[];
  minutes: MinutePill[];
  tracks: LearningTrack[];
  isLoading: boolean;
  isGlossaryLoading: boolean;
  currentModule: any;
  
  activeTermObj: any;
  activeTrackId: string | null;
  setActiveTrackId: (id: string | null) => void;
}

const LibrasContext = createContext<LibrasContextType | undefined>(undefined);

export function LibrasProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<LibrasTab>('glossary');
  const [activeModuleId, setActiveModuleId] = useState<string | number>('todos');
  const [activeTermKey, setActiveTermKey] = useState<string | null>(null);
  const [termSearch, setTermSearch] = useState<string>('');
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  // Database Data
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [minutes, setMinutes] = useState<MinutePill[]>([]);
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGlossaryLoading, setIsGlossaryLoading] = useState(false);

  // Initial Load for Minutes and Tracks
  useEffect(() => {
    async function loadStaticData() {
      try {
        const [mData, tData] = await Promise.all([
          librasService.getMinutes(),
          librasService.getTracks()
        ]);
        setMinutes(mData.length > 0 ? mData : mockPills);
        setTracks(tData.length > 0 ? tData : mockTracks);
      } catch (e) {
        console.error("Erro ao carregar dados estáticos:", e);
      }
    }
    loadStaticData();
  }, []);

  // Dynamic Load for Glossary (Reactive to activeModuleId)
  useEffect(() => {
    async function loadGlossary() {
      setIsGlossaryLoading(true);
      try {
        const data = await librasService.getGlossaryByAxis(
          activeModuleId === 'todos' ? 'todos' : Number(activeModuleId)
        );
        setGlossaryTerms(data);
        
        // Auto-select first term of the axis
        if (data.length > 0) {
          setActiveTermKey(data[0].term);
        } else {
          setActiveTermKey(null);
        }
      } catch (e) {
        console.error("Erro ao filtrar glossário:", e);
      } finally {
        setIsGlossaryLoading(false);
        setIsLoading(false);
      }
    }
    loadGlossary();
  }, [activeModuleId]);

  const currentModule = activeModuleId === 'todos' 
    ? { id: 'todos', title: 'Todos os Termos' }
    : librasGlossary.find(m => m.id === activeModuleId);

  const activeTermObj = glossaryTerms.find(t => t.term === activeTermKey) || null;

  return (
    <LibrasContext.Provider value={{
      activeTab,
      setActiveTab,
      activeModuleId,
      setActiveModuleId,
      activeTermKey,
      setActiveTermKey,
      termSearch,
      setTermSearch,
      glossaryTerms,
      minutes,
      tracks,
      isLoading,
      isGlossaryLoading,
      currentModule,
      activeTermObj,
      activeTrackId,
      setActiveTrackId
    }}>
      {children}
    </LibrasContext.Provider>
  );
}

export function useLibras() {
  const context = useContext(LibrasContext);
  if (context === undefined) {
    throw new Error("useLibras must be used within a LibrasProvider");
  }
  return context;
}
