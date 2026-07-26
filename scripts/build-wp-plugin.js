const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pluginDir = path.join(__dirname, '../wordpress-plugin/mtacess-acessibilidade');
const assetsDir = path.join(pluginDir, 'assets');
const builtWidget = path.join(__dirname, '../public/widget/acessibilidade.js');
const zipOut = path.join(__dirname, '../mtacess-acessibilidade.zip');

console.log('1. Compilando o Widget do React...');
try {
  execSync('npm run build:widget', { stdio: 'inherit' });
} catch (err) {
  console.error('Erro ao compilar o widget. Abortando.', err);
  process.exit(1);
}

console.log('2. Copiando o script para o diretório do plugin...');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
fs.copyFileSync(builtWidget, path.join(assetsDir, 'acessibilidade.js'));

console.log('3. Gerando o arquivo ZIP final...');
if (fs.existsSync(zipOut)) {
  fs.unlinkSync(zipOut);
}

try {
  // Usando PowerShell nativo para comprimir a pasta
  const psCommand = `powershell -Command "Compress-Archive -Path '${pluginDir}/*' -DestinationPath '${zipOut}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  console.log(`\nSUCESSO! O plugin WordPress foi gerado com sucesso em: ${zipOut}`);
} catch (err) {
  console.error('Erro ao gerar o ZIP.', err);
}
