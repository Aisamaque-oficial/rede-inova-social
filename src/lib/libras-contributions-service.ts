export interface LibrasContribution {
  id: string;
  term: string;
  type: "new_sign" | "regional_variation";
  contributorName: string;
  contributorRole: string;
  territoryOrRegion: string;
  videoUrl?: string;
  signDescription?: string;
  notes?: string;
  createdAt: string;
  status: "pending" | "reviewed" | "approved";
}

const STORAGE_KEY = "redeinova_libras_contributions";

export const librasContributionsService = {
  submitContribution: async (
    data: Omit<LibrasContribution, "id" | "createdAt" | "status">
  ): Promise<{ success: boolean; id: string }> => {
    const id = `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newContribution: LibrasContribution = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const list: LibrasContribution[] = stored ? JSON.parse(stored) : [];
        list.unshift(newContribution);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error("Erro ao salvar contribuição no localStorage:", e);
      }
    }

    return { success: true, id };
  },

  getAllContributions: (): LibrasContribution[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  deleteContribution: (id: string): void => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list: LibrasContribution[] = stored ? JSON.parse(stored) : [];
      const updated = list.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao deletar contribuição:", e);
    }
  },
};
