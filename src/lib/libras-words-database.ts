import { librasGlossary } from "./mock-data";

export interface LibrasWord {
  id: string;
  term: string;
  normalizedTerm: string;
  definition: string;
  context?: string;
  signStrategy?: string;
  videoUrl?: string;
  axisTitle?: string;
  axisEmoji?: string;
  axisId?: number;
  tags?: string[];
}

export interface VideoInfo {
  type: "youtube" | "video" | "empty";
  url: string;
}

const STORAGE_CUSTOM_VIDEOS_KEY = "redeinova_libras_custom_videos";

// Normalize text for fuzzy matching: lowercase, strip accents, strip excess spaces
export function normalizeLibrasText(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim();
}

// Convert term name into local video slug (e.g., "Segurança dos Alimentos" -> "seguranca-dos-alimentos")
export function getTermVideoSlug(term: string): string {
  if (!term) return "";
  return term
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Convert any video link into embeddable / playable info
export function parseLibrasVideoUrl(url: string | undefined | null): VideoInfo {
  if (!url || typeof url !== "string") {
    return { type: "empty", url: "" };
  }

  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "#") {
    return { type: "empty", url: "" };
  }

  // Direct video file (.mp4, .webm, .mov, etc.)
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(trimmed)) {
    return { type: "video", url: trimmed };
  }

  // YouTube Shorts
  if (trimmed.includes("shorts/")) {
    const id = trimmed.split("shorts/")[1]?.split(/[?&#]/)[0];
    return {
      type: "youtube",
      url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1`,
    };
  }

  // YouTube youtu.be
  if (trimmed.includes("youtu.be/")) {
    const id = trimmed.split("youtu.be/")[1]?.split(/[?&#]/)[0];
    return {
      type: "youtube",
      url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1`,
    };
  }

  // YouTube regular watch?v=
  if (trimmed.includes("watch?v=")) {
    const id = trimmed.split("watch?v=")[1]?.split(/[?&#]/)[0];
    return {
      type: "youtube",
      url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1`,
    };
  }

  // YouTube embed
  if (trimmed.includes("youtube.com/embed/")) {
    const sep = trimmed.includes("?") ? "&" : "?";
    return {
      type: "youtube",
      url: `${trimmed}${sep}autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`,
    };
  }

  // Default fallback (assume iframe compatible or direct link)
  return { type: "youtube", url: trimmed };
}

// Load custom user/admin overrides from localStorage
function getCustomVideoOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_VIDEOS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

// Save a custom video URL for a given word
export function setWordLibrasVideo(term: string, videoUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomVideoOverrides();
    const normalized = normalizeLibrasText(term);
    current[normalized] = videoUrl;
    localStorage.setItem(STORAGE_CUSTOM_VIDEOS_KEY, JSON.stringify(current));
    // Dispatch event so active components can reload
    window.dispatchEvent(new CustomEvent("libras-video-updated", { detail: { term, videoUrl } }));
  } catch (err) {
    console.error("Erro ao salvar vídeo personalizado:", err);
  }
}

// Build list of all registered signed words
export function getAllSignedWords(): LibrasWord[] {
  const overrides = getCustomVideoOverrides();
  const wordMap = new Map<string, LibrasWord>();

  librasGlossary.forEach((axis: any, axisIdx: number) => {
    const axisTitle = axis.title || `Eixo ${axisIdx + 1}`;
    const axisEmoji = axis.emoji || "🤟";
    const axisId = axis.numericId || axisIdx + 1;

    (axis.terms || []).forEach((t: any, termIdx: number) => {
      const term = t.term || "";
      if (!term) return;

      const normalized = normalizeLibrasText(term);
      const customVideo = overrides[normalized];
      const video = customVideo || t.videoUrl || t.video_url || "";

      wordMap.set(normalized, {
        id: t.id || `term-${axisId}-${termIdx + 1}`,
        term: term.trim(),
        normalizedTerm: normalized,
        definition: t.definition || t.description || "",
        context: t.context || "",
        signStrategy: t.signStrategy || t.sign_strategy || "",
        videoUrl: video,
        axisTitle,
        axisEmoji,
        axisId,
        tags: t.tags || [],
      });
    });
  });

  return Array.from(wordMap.values()).sort((a, b) => b.term.length - a.term.length);
}

// Find a matching signed word from text or word click
export function findSignedWord(queryText: string): LibrasWord | null {
  if (!queryText) return null;
  const normalizedQuery = normalizeLibrasText(queryText);
  if (!normalizedQuery) return null;

  const words = getAllSignedWords();

  // 1. Exact match on normalized term
  const exact = words.find((w) => w.normalizedTerm === normalizedQuery);
  if (exact) return exact;

  // 2. Starts with / single word match inside compound term or vice-versa
  const subMatch = words.find(
    (w) =>
      normalizedQuery === w.normalizedTerm ||
      normalizedQuery.startsWith(w.normalizedTerm + " ") ||
      normalizedQuery.endsWith(" " + w.normalizedTerm) ||
      normalizedQuery.includes(" " + w.normalizedTerm + " ")
  );
  if (subMatch) return subMatch;

  // 3. Check if query is contained within a word term (if query is long enough, > 4 chars)
  if (normalizedQuery.length >= 4) {
    const contained = words.find(
      (w) =>
        w.normalizedTerm.includes(normalizedQuery) ||
        normalizedQuery.includes(w.normalizedTerm)
    );
    if (contained) return contained;
  }

  return null;
}
