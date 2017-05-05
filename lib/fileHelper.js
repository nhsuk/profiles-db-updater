const http = require('http');
const fs = require('fs');

const log = require('./logger');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    log.info(`retrieving file from ${url}...`);
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        log.info(`file written to ${dest}...`);
        resolve(dest);
      });
    }).on('error', (err) => { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(err.message);
    });
  });
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source);
    rd.on('error', reject);
    const wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('close', resolve);
    rd.pipe(wr);
  });
}

function loadJson(path) {
  const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
  return jsonString ? JSON.parse(jsonString) : undefined;
}


module.exports = {
  downloadFile,
  copyFile,
  deleteFile,
  loadJson,
};
