const host = process.env.MONGO_HOST || 'mongo';
const port = process.env.MONGO_PORT || '27017';
const db = process.env.MONGO_DB || 'profiles';
const collection = process.env.MONGO_COLLECTION || 'gps';

module.exports = {
  app: {
    name: 'profiles-db-loader',
  },
  env: process.env.NODE_ENV || 'development',

  OUTPUT_DIR: './data',
  OUTPUT_FILE: 'gp-data-merged.json',
  INPUT_DIR: './input',

  mongodb: {
    collection,
    connectionString: `mongodb://${host}:${port}/${db}`,
  },
};
