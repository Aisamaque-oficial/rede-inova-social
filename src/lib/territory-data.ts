export interface City {
  id: string;
  name: string;
  slug: string; // Used for URLs e.g. "itapetinga"
  description: string;
  adjacentCities: string[]; // Slugs of nearby cities for the proximity algorithm
  coordinates?: { x: number, y: number }; // For map plotting percentages
}

export const TERRITORY_CITIES: City[] = [
  {
    id: "c1",
    name: "Caatiba",
    slug: "caatiba",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["itapetinga", "macarani", "nova-canaa"],
    coordinates: { x: 30, y: 40 }
  },
  {
    id: "c2",
    name: "Firmino Alves",
    slug: "firmino-alves",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["itapetinga", "santa-cruz-da-vitoria", "ibicui"],
    coordinates: { x: 45, y: 25 }
  },
  {
    id: "c3",
    name: "Ibicuí",
    slug: "ibicui",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["iguai", "nova-canaa", "firmino-alves"],
    coordinates: { x: 60, y: 15 }
  },
  {
    id: "c4",
    name: "Iguaí",
    slug: "iguai",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["ibicui", "nova-canaa"],
    coordinates: { x: 75, y: 10 }
  },
  {
    id: "c5",
    name: "Itambé",
    slug: "itambe",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["itapetinga", "macarani"],
    coordinates: { x: 20, y: 60 }
  },
  {
    id: "c6",
    name: "Itapetinga",
    slug: "itapetinga",
    description: "Polo regional do território Médio Sudoeste da Bahia.",
    adjacentCities: ["caatiba", "itambe", "macarani", "itarantim", "potiragua", "itororo"],
    coordinates: { x: 50, y: 50 }
  },
  {
    id: "c7",
    name: "Itarantim",
    slug: "itarantim",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["maiquinique", "macarani", "itapetinga", "potiragua"],
    coordinates: { x: 65, y: 75 }
  },
  {
    id: "c8",
    name: "Itororó",
    slug: "itororo",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["firmino-alves", "itapetinga"],
    coordinates: { x: 40, y: 35 }
  },
  {
    id: "c9",
    name: "Macarani",
    slug: "macarani",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["maiquinique", "itarantim", "itapetinga", "itambe"],
    coordinates: { x: 45, y: 70 }
  },
  {
    id: "c10",
    name: "Maiquinique",
    slug: "maiquinique",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["macarani", "itarantim"],
    coordinates: { x: 55, y: 85 }
  },
  {
    id: "c11",
    name: "Nova Canaã",
    slug: "nova-canaa",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["iguai", "ibicui", "caatiba"],
    coordinates: { x: 80, y: 25 }
  },
  {
    id: "c12",
    name: "Potiraguá",
    slug: "potiragua",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["itapetinga", "itarantim"],
    coordinates: { x: 75, y: 60 }
  },
  {
    id: "c13",
    name: "Santa Cruz da Vitória",
    slug: "santa-cruz-da-vitoria",
    description: "Município integrante do território Médio Sudoeste da Bahia.",
    adjacentCities: ["firmino-alves"],
    coordinates: { x: 30, y: 20 }
  }
];

export function getCityBySlug(slug: string): City | undefined {
  return TERRITORY_CITIES.find(city => city.slug === slug);
}

// Function to find the nearest city that has a given product (assuming we have a list of cities where product exists)
export function findNearestCities(startCitySlug: string, maxDepth: number = 2): string[] {
  const startCity = getCityBySlug(startCitySlug);
  if (!startCity) return [];

  const visited = new Set<string>();
  const result: string[] = [];
  const queue: { slug: string; depth: number }[] = [{ slug: startCitySlug, depth: 0 }];

  while (queue.length > 0) {
    const { slug, depth } = queue.shift()!;
    
    if (depth > maxDepth) continue;
    if (visited.has(slug)) continue;
    
    visited.add(slug);
    
    if (slug !== startCitySlug) {
      result.push(slug);
    }

    const city = getCityBySlug(slug);
    if (city) {
      for (const adj of city.adjacentCities) {
        if (!visited.has(adj)) {
          queue.push({ slug: adj, depth: depth + 1 });
        }
      }
    }
  }

  return result;
}
