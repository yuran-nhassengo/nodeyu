const fs = require('fs');
const path = require('path');

// Arquivo passado como argumento
const file = process.argv[2];

// Caminho absoluto para o arquivo a ser monitorado
const filePath = path.resolve(__dirname, '..', file);

// Função para monitorar e fazer algo quando o arquivo mudar
function handleFileChange() {
  console.log(`${filePath} foi alterado!`);

  // Exemplo de ação: Exibir conteúdo do arquivo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Erro ao ler o arquivo: ${err.message}`);
      return;
    }
    console.log('Conteúdo do arquivo:', data);  // Exibindo o conteúdo do arquivo alterado
  });

  // Se você quiser adicionar outras ações para arquivos de diferentes tipos, pode colocar aqui
  // Por exemplo, realizar algum processamento dependendo da extensão do arquivo.
  const ext = path.extname(file);
  if (ext === '.txt') {
    console.log('Este é um arquivo de texto.');
    // Aqui você pode processar o conteúdo do arquivo de texto de alguma forma
  } else if (ext === '.json') {
    console.log('Este é um arquivo JSON.');
    // Aqui você pode fazer algo com o arquivo JSON
  } else {
    console.log(`Tipo de arquivo desconhecido (${ext})`);
  }
}

// Função para monitorar o arquivo
function watchFile(filePath) {
  // Monitorando mudanças no arquivo
  fs.watchFile(filePath, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      handleFileChange();
    }
  });
}

// Inicia o monitoramento do arquivo
watchFile(filePath);

console.log('Observando o arquivo... Qualquer tipo de arquivo será monitorado.');
console.log('Desenvolvido por Yuran Nhassengo......');
