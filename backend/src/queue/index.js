const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const config = require('../config');

const connection = new IORedis(config.REDIS_URL);
const ocrQueue = new Queue('ocr', { connection });

module.exports = { ocrQueue, connection };
