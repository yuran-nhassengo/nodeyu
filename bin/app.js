#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Arquivo ou diretório passado como argumento
const file = process.argv[2];

// Verifica se o arquivo ou diretório foi passado
if (!file) {
  console.error('Erro: Nenhum arquivo ou diretório fornecido.');
  process.exit(1);
}

// Caminho absoluto para o arquivo ou diretório a ser monitorado
const filePath = path.resolve(__dirname, file);

// Função para monitorar e fazer algo quando o arquivo mudar
function handleFileChange(filePath) {
  console.log(`${filePath} foi alterado!`);

  // Exibir conteúdo do arquivo caso seja um arquivo de texto
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Erro ao ler o arquivo: ${err.message}`);
        return;
      }
      console.log('Conteúdo do arquivo:', data);  // Exibindo o conteúdo do arquivo alterado
    });
  }

  // Verifica a extensão e age de acordo
  const ext = path.extname(file);
  if (ext === '.txt') {
    console.log('Este é um arquivo de texto.');
  } else if (ext === '.json') {
    console.log('Este é um arquivo JSON.');
  } else {
    console.log(`Tipo de arquivo desconhecido (${ext})`);
  }
}

// Função para monitorar alterações no arquivo ou diretório
function watchFile(filePath) {
  // Verificando se é um diretório ou um arquivo
  const stats = fs.lstatSync(filePath);

  if (stats.isDirectory()) {
    // Monitorando arquivos dentro de um diretório
    fs.watch(filePath, { recursive: true }, (eventType, filename) => {
      if (filename) {
        console.log(`Arquivo ${filename} foi alterado no diretório ${filePath}`);
        handleFileChange(path.join(filePath, filename));
      }
    });
    console.log(`Monitorando alterações no diretório: ${filePath}`);
  } else if (stats.isFile()) {
    // Monitorando um único arquivo
    fs.watchFile(filePath, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        handleFileChange(filePath);
      }
    });
    console.log(`Monitorando o arquivo: ${filePath}`);
  } else {
    console.error('O caminho fornecido não é válido para monitoramento.');
  }
}

// Inicia o monitoramento
watchFile(filePath);

console.log('Observando o arquivo/diretório... Qualquer tipo de arquivo será monitorado.');
console.log('Desenvolvido por Yuran Nhassengo...');
