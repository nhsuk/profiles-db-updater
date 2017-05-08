const http = require('http');
const fs = require('fs');

const log = require('./logger');

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

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
      deleteFile(dest); // Delete the file async. (But we don't check the result)
      reject(err.message);
    });
  });
}

function renameFile(fromPath, toPath) {
  fs.renameSync(fromPath, toPath);
}

function loadJson(path) {
  const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
  return jsonString ? JSON.parse(jsonString) : undefined;
}


module.exports = {
  downloadFile,
  renameFile,
  deleteFile,
  loadJson,
};
