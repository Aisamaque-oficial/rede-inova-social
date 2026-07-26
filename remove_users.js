const fs = require('fs');
const path = require('path');

const placeholdersPath = path.join(__dirname, 'src/lib/placeholder-images.json');
let placeholders = JSON.parse(fs.readFileSync(placeholdersPath, 'utf8'));

placeholders.placeholderImages = placeholders.placeholderImages.filter(img => !['beide', 'thais_bolsista', 'dayane'].includes(img.id));

fs.writeFileSync(placeholdersPath, JSON.stringify(placeholders, null, 2));

console.log("Remoção de imagens concluída com sucesso!");
