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
        const data = await librasService.getGlossaryByAxis(activeModuleId);
        setGlossaryTerms(data);
        
        // Auto-select first term of the axis if none currently matches
        if (data.length > 0) {
          setActiveTermKey(prev => {
            if (prev && data.some(t => t.term === prev)) return prev;
            return data[0].term;
          });
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

  const axisSlugOrId = String(activeModuleId).toLowerCase();
  const currentModule = activeModuleId === 'todos' 
    ? { id: 'todos', title: 'Todos os Termos', emoji: '📚' }
    : {
        id: activeModuleId,
        title: (axisSlugOrId === '1' || axisSlugOrId === 'fundamentacao') ? 'Fundamentação' :
               (axisSlugOrId === '2' || axisSlugOrId === 'imunologico-digestivo') ? 'Imunológico-Digestivo' :
               (axisSlugOrId === '3' || axisSlugOrId === 'rotulagem-tecnica') ? 'Rotulagem Técnica' :
               (axisSlugOrId === '4' || axisSlugOrId === 'analise-critica') ? 'Análise Crítica' :
               (axisSlugOrId === '5' || axisSlugOrId === 'soberania-alimentar') ? 'Soberania Alimentar' :
               (axisSlugOrId === '6' || axisSlugOrId === 'producao-campo') ? 'Produção e Segurança no Campo' :
               'Conceito Técnico',
        emoji: (axisSlugOrId === '1' || axisSlugOrId === 'fundamentacao') ? '🤟' :
               (axisSlugOrId === '2' || axisSlugOrId === 'imunologico-digestivo') ? '🧬' :
               (axisSlugOrId === '3' || axisSlugOrId === 'rotulagem-tecnica') ? '🏷️' :
               (axisSlugOrId === '4' || axisSlugOrId === 'analise-critica') ? '⚖️' :
               (axisSlugOrId === '5' || axisSlugOrId === 'soberania-alimentar') ? '🌽' :
               (axisSlugOrId === '6' || axisSlugOrId === 'producao-campo') ? '🌱' :
               '🔖'
      };

  // Filter terms according to termSearch if present
  const filteredGlossaryTerms = glossaryTerms.filter(t => {
    if (!termSearch || termSearch.trim() === '') return true;
    const query = termSearch.toLowerCase().trim();
    return (t.term || '').toLowerCase().includes(query) ||
           (t.description || '').toLowerCase().includes(query) ||
           (t.definition || '').toLowerCase().includes(query) ||
           (t.context || '').toLowerCase().includes(query) ||
           (t.tags || []).some((tag: string) => tag.toLowerCase().includes(query));
  });

  const activeTermObj = filteredGlossaryTerms.find(t => t.term === activeTermKey) || filteredGlossaryTerms[0] || null;

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
      glossaryTerms: filteredGlossaryTerms,
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
