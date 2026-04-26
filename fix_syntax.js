const fs = require('fs');
const path = 'c:/dev/REDEINOVA/src/lib/data-service.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the line before MONITOR DE ATIVIDADE and add a comma if it's a closing brace
content = content.replace(/}\s+\/\/ 🕒 MONITOR DE ATIVIDADE/, "},\n\n  // 🕒 MONITOR DE ATIVIDADE");

fs.writeFileSync(path, content);
console.log('File fixed');
