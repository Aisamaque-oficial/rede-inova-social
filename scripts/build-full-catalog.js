const fs = require('fs');
const path = require('path');

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function walk(d) {
  let r = [];
  if (!fs.existsSync(d)) return r;
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
    else if (/\.mp4$/i.test(f)) r.push({ full: p, dir: path.basename(d), name: f });
  });
  return r;
}

const vids = walk('public/videos');
const map = {};

vids.forEach(v => {
  const rel = v.full.replace(/\\/g, '/').replace(/^public/, '');
  const base = v.name.replace(/\.mp4$/i, '');
  const nKey = norm(base);
  map[nKey] = rel;

  // Aliases for common variations
  if (nKey === 'direito humano a alimentacao adequada') {
    map['direito humano a alimentacao adequada (dhaa)'] = rel;
  }
  if (nKey === 'disponibilidade dos alimentos') {
    map['disponibilidade de alimentos'] = rel;
  }
  if (nKey === 'direito alimentar') {
    map['direito a alimentacao'] = rel;
  }
  if (nKey === 'feira de agricultura familiar') {
    map['feira da agricultura familiar'] = rel;
  }
  if (nKey === 'feira') {
    map['feira livre'] = rel;
  }
  if (nKey === 'sustentavel') {
    map['agricultura sustentavel'] = rel;
  }
  if (nKey === 'alimento sustentavel') {
    map['sistema alimentar sustentavel'] = rel;
  }
  if (nKey === 'vendas') {
    map['venda direta'] = rel;
  }
  if (nKey === 'contaminacao das aguas') {
    map['contaminacao da agua'] = rel;
  }
  if (nKey === 'embalagem dos alimentos') {
    map['embalagem para alimentos'] = rel;
  }
  if (nKey === 'contaminacao da terra') {
    map['contaminacao do solo'] = rel;
  }
});

const fileContent = `/**
 * Mapeamento e Catálogo Central de Vídeos em Libras da Rede Inova Social
 * Contém todos os 169 vídeos em Libras dos Eixos 1 a 6 e botões da plataforma.
 */

export const REGISTERED_VIDEOS_MAP: Record<string, string> = ${JSON.stringify(map, null, 2)};

export function normalizeVideoKey(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, ' ')
    .trim();
}

export function findRegisteredVideo(termOrButton: string): string | null {
  if (!termOrButton) return null;
  const key = normalizeVideoKey(termOrButton);
  if (REGISTERED_VIDEOS_MAP[key]) {
    return REGISTERED_VIDEOS_MAP[key];
  }
  return null;
}
`;

fs.writeFileSync('src/lib/libras-video-catalog.ts', fileContent, 'utf8');
console.log('Successfully wrote src/lib/libras-video-catalog.ts with', Object.keys(map).length, 'mapped entries.');
