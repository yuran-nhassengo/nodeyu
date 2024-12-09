#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para monitorar o diretório recursivamente
function watchDirectoryRecursive(directoryPath) {
  // Monitorando alterações no diretório atual
  fs.watch(directoryPath, { persistent: true }, (eventType, filename) => {
    if (filename) {
      const fullPath = path.join(directoryPath, filename);

      // Ignora arquivos temporários (aqueles começando com .)
      if (filename.startsWith('.') || !fs.existsSync(fullPath)) {
        return;
      }

      const stats = fs.lstatSync(fullPath);
      if (stats.isDirectory()) {
        console.log(`Detectado novo diretório: ${fullPath}`);
        // Recursivamente monitorando subdiretórios
        watchDirectoryRecursive(fullPath);
      } else {
        console.log(`${fullPath} foi alterado!`);
        handleFileChange(fullPath);
      }
    }
  });

  // Percorrendo arquivos existentes no diretório e monitorando-os
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.lstatSync(fullPath);
    if (stats.isFile()) {
      console.log(`Monitorando arquivo: ${fullPath}`);
      fs.watchFile(fullPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          handleFileChange(fullPath);
        }
      });
    } else if (stats.isDirectory()) {
      watchDirectoryRecursive(fullPath);  // Monitorando subdiretórios
    }
  });
}

// Função para lidar com mudanças no arquivo
function handleFileChange(filePath) {
  console.log(`${filePath} foi alterado!`);

  // Exibir conteúdo do arquivo se for um arquivo de texto
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Erro ao ler o arquivo: ${err.message}`);
        return;
      }
      console.log('Conteúdo do arquivo alterado:', data);  // Exibindo o conteúdo do arquivo alterado
    });
  }

  // Verifica a extensão e age de acordo
  const ext = path.extname(filePath);
  if (ext === '.txt') {
    console.log('Este é um arquivo de texto.');
  } else if (ext === '.json') {
    console.log('Este é um arquivo JSON.');
  } else {
    console.log(`Tipo de arquivo desconhecido (${ext})`);
  }
}

// Inicia o monitoramento
const filePath = process.argv[2];  // Diretório ou arquivo passado como argumento
watchDirectoryRecursive(filePath);

console.log('Observando o arquivo/diretório... Qualquer tipo de arquivo será monitorado.');
console.log('Desenvolvido por Yuran Nhassengo...');
