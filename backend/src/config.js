require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/tmp/uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10),
  WORKER_CONCURRENCY: parseInt(process.env.WORKER_CONCURRENCY || '2', 10),
};
