import fs from 'fs';

const content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Simple parser to find unclosed divs
const lines = content.split('\n');
let balance = 0;
lines.forEach((line, i) => {
    const opens = (line.match(/<div(\b[^>]*>)/g) || []).length;
    const selfClosing = (line.match(/<div\b[^>]*\/>/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    
    const diff = (opens - selfClosing) - closes;
    balance += diff;
    if (diff !== 0) {
        console.log(`Line ${i + 1}: ${line.trim()} | Balance: ${balance} (Diff: ${diff})`);
    }
});
