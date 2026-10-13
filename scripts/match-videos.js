const fs = require('fs');

function normalize(s) {
  return s
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

const axis5 = data.find(e => e.numericId === 5);
const axis6 = data.find(e => e.numericId === 6);

const files5 = fs.readdirSync('public/videos/glossario/EIXO 5');
const files6 = fs.readdirSync('public/videos/glossario/EIXO 6');

console.log('=== EIXO 5 MATCHING ===');
const matched5 = [];
const unmatched5 = [];

files5.forEach(file => {
  const base = file.replace(/\.mp4$/i, '');
  const normBase = normalize(base);
  const exact = axis5.terms.find(t => normalize(t.term) === normBase);
  if (exact) {
    matched5.push({ file, term: exact.term });
  } else {
    // Check in axis 5 terms
    const partial5 = axis5.terms.find(t => normalize(t.term).includes(normBase) || normBase.includes(normalize(t.term)));
    // Check in all eixos terms
    let inAny = null;
    data.forEach(e => {
      const f = e.terms.find(t => normalize(t.term) === normBase);
      if (f) inAny = { axis: e.numericId, term: f.term };
    });
    unmatched5.push({ file, partial5: partial5 ? partial5.term : null, inAny });
  }
});

console.log('Exact Matches Eixo 5:', matched5.length, 'of', files5.length);
matched5.forEach(m => console.log('  OK:', m.file, '-->', m.term));
console.log('Unmatched Eixo 5:', unmatched5.length);
unmatched5.forEach(u => console.log('  DIFF:', u.file, '| partial:', u.partial5, '| in other axis:', u.inAny));

console.log('\n=== EIXO 6 MATCHING ===');
const matched6 = [];
const unmatched6 = [];

files6.forEach(file => {
  const base = file.replace(/\.mp4$/i, '');
  const normBase = normalize(base);
  const exact = axis6.terms.find(t => normalize(t.term) === normBase);
  if (exact) {
    matched6.push({ file, term: exact.term });
  } else {
    const partial6 = axis6.terms.find(t => normalize(t.term).includes(normBase) || normBase.includes(normalize(t.term)));
    let inAny = null;
    data.forEach(e => {
      const f = e.terms.find(t => normalize(t.term) === normBase);
      if (f) inAny = { axis: e.numericId, term: f.term };
    });
    unmatched6.push({ file, partial6: partial6 ? partial6.term : null, inAny });
  }
});

console.log('Exact Matches Eixo 6:', matched6.length, 'of', files6.length);
matched6.forEach(m => console.log('  OK:', m.file, '-->', m.term));
console.log('Unmatched Eixo 6:', unmatched6.length);
unmatched6.forEach(u => console.log('  DIFF:', u.file, '| partial:', u.partial6, '| in other axis:', u.inAny));
