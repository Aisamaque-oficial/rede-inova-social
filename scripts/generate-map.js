const fs = require('fs');

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const content = fs.readFileSync('src/lib/mock-data.ts', 'utf8');
const startIdx = content.indexOf('export const librasGlossary');
const endIdx = content.indexOf('export const librasPills');
const jsonStr = content.substring(startIdx + 'export const librasGlossary: any[] = '.length, endIdx).trim().replace(/;$/, '');
const data = eval(jsonStr);

const terms5 = data.find(e => e.numericId === 5).terms;
const terms6 = data.find(e => e.numericId === 6).terms;

const files5 = fs.readdirSync('public/videos/glossario/EIXO 5');
const files6 = fs.readdirSync('public/videos/glossario/EIXO 6');

console.log('=== MAP FOR EIXO 5 ===');
const map5 = {};

files5.forEach(file => {
  const base = file.replace(/\.mp4$/i, '');
  const nBase = norm(base);

  // 1. Direct match
  let t = terms5.find(x => norm(x.term) === nBase);
  if (t) {
    map5[t.term] = `/videos/glossario/EIXO 5/${file}`;
    return;
  }

  // 2. Custom semantic mappings
  if (base === 'DIREITO HUMANO À ALIMENTAÇÃO ADEQUADA') {
    map5['Direito Humano à Alimentação Adequada (DHAA)'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'DISPONIBILIDADE DOS ALIMENTOS') {
    map5['Disponibilidade de alimentos'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'DIREITO ALIMENTAR') {
    map5['Direito à alimentação'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'FEIRA DE AGRICULTURA FAMILIAR') {
    map5['Feira da agricultura familiar'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'FEIRA') {
    map5['Feira livre'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'SUSTENTÁVEL') {
    map5['Agricultura sustentável'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'COMPRA CONSCIENTE') {
    map5['Consumo consciente'] = `/videos/glossario/EIXO 5/${file}`; // or companion
  } else if (base === 'ALIMENTO SUSTENTÁVEL') {
    map5['Sistema alimentar sustentável'] = `/videos/glossario/EIXO 5/${file}`;
  } else if (base === 'VENDAS') {
    map5['Venda direta'] = `/videos/glossario/EIXO 5/${file}`;
  } else {
    console.log('Extra / Unassigned in Eixo 5:', file);
  }
});

console.log('Mapped terms count in Eixo 5:', Object.keys(map5).length);
Object.entries(map5).forEach(([k, v]) => console.log(' ', k, '-->', v));

console.log('\n=== MAP FOR EIXO 6 ===');
const map6 = {};
files6.forEach(file => {
  const base = file.replace(/\.mp4$/i, '');
  const nBase = norm(base);
  let t = terms6.find(x => norm(x.term) === nBase);
  if (t) {
    map6[t.term] = `/videos/glossario/EIXO 6/${file}`;
    return;
  }

  if (base === 'Contaminação das águas') {
    map6['Contaminação da água'] = `/videos/glossario/EIXO 6/${file}`;
  } else if (base === 'Embalagem dos alimentos') {
    map6['Embalagem para alimentos'] = `/videos/glossario/EIXO 6/${file}`;
  } else if (base === 'Temperatura') {
    map6['Temperatura'] = `/videos/glossario/EIXO 6/${file}`;
  } else {
    console.log('Extra / Unassigned in Eixo 6:', file);
  }
});

console.log('Mapped terms count in Eixo 6:', Object.keys(map6).length);
Object.entries(map6).forEach(([k, v]) => console.log(' ', k, '-->', v));
