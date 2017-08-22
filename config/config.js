module.exports = {
  app: {
    name: 'profiles-etl-combiner',
  },
  env: process.env.NODE_ENV || 'development',
  CONTAINER_NAME: process.env.CONTAINER_NAME || 'etl-output',
  GP_DATA_URL: process.env.GP_DATA_URL || 'https://nhsukgpdataetl.blob.core.windows.net/etl-output/gp-data.json',
  POMI_BOOKING_URL: process.env.POMI_BOOKING_URL || 'https://nhsukpomidataetl.blob.core.windows.net/etl-output/booking.json',
  POMI_SCRIPTS_URL: process.env.POMI_SCRIPTS_URL || 'https://nhsukpomidataetl.blob.core.windows.net/etl-output/scripts.json',
  POMI_RECORDS_URL: process.env.POMI_RECORDS_URL || 'https://nhsukpomidataetl.blob.core.windows.net/etl-output/records.json',
  OUTPUT_DIR: './data',
  OUTPUT_FILE: 'gp-data-merged.json',
  GP_DATA_FILE: 'gp-data.json',
  POMI_BOOKING_FILE: 'booking.json',
  POMI_SCRIPTS_FILE: 'scripts.json',
  POMI_RECORDS_FILE: 'records.json',
  INPUT_DIR: './input',
  // percentage the records can drop by before erroring
  THRESHOLD: Number(process.env.CHANGE_THRESHOLD) || 0.99,
  // cron style job, default to 7:15am
  UPDATE_SCHEDULE: process.env.UPDATE_SCHEDULE || '15 7 * * *',
};
