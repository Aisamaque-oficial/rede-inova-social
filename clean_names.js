const fs = require('fs');
const path = require('path');

function replaceInDir(dir, searchRegex, replacement) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, searchRegex, replacement);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (searchRegex.test(content)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src', 'components'), /Dayane Lopes/g, 'Coordenação Executiva');
replaceInDir(path.join(__dirname, 'src', 'components'), /Thaíssa Carvalho/g, 'Equipe ASCOM');
replaceInDir(path.join(__dirname, 'src', 'components'), /Thaís Dutra/g, 'Equipe');
console.log("Remoção de menções em texto concluída.");
