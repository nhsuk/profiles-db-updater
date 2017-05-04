const log = require('./logger');
const MongoClient = require('mongodb').MongoClient;

class MongoWrapper {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  openConnection() {
    return MongoClient.connect(this.connectionString)
      .then((db) => {
        log.info('mongo connection opened');
        this.db = db;
        return db;
      });
  }

  closeConnection() {
    if (this.db) {
      log.info('mongo connection closed');
      this.db.close();
    } else {
      log.info('mongo connection already closed');
    }
  }

  getCollection(collection) {
    return this.db.collection(collection);
  }

  async dropCollection(collection) {
    return this.getCollection(collection).drop();
  }

  async renameCollection(origName, newName) {
    return this.getCollection(origName).rename(newName);
  }

  async insertMany(collection, data) {
    return this.getCollection(collection).insert(data);
  }

  async find(collection, params) {
    return this.getCollection(collection).find(params).toArray();
  }

  findOne(collection, params) {
    return this.getCollection(collection).findOne(params);
  }

  getTotalCount(collection) {
    return this.getCollection(collection).count();
  }
}

module.exports = MongoWrapper;
