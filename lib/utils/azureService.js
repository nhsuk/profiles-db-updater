const azure = require('azure-storage');

const blobSvc = azure.createBlobService();

const AZURE_TIMEOUT_MINUTES = process.env.AZURE_TIMEOUT_MINUTES || 5;
const options = {
  clientRequestTimeoutInMs: AZURE_TIMEOUT_MINUTES * 60 * 1000,
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
      }
    );
  });
}

module.exports = {
  uploadToAzure,
};
