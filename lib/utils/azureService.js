const azure = require('azure-storage');

const blobSvc = azure.createBlobService();

const timeoutMs = 5 * 60 * 10000;
const options = {
  clientRequestTimeoutInMs: timeoutMs,
};

function uploadToAzure(containerName, filePath, name) {
  return new Promise((resolve, reject) => {
    blobSvc.createBlockBlobFromLocalFile(
      containerName, name, filePath, options,
      (error, result) => {
        if (!error) {
          resolve(result);
        }
        reject(error);
      });
  });
}

module.exports = {
  uploadToAzure,
};
