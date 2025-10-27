const http = require('http');
const app = require('./app');
const config = require('./config');
const { initSocket } = require('./utils/socket');
const logger = require('pino')();

const server = http.createServer(app);

initSocket(server); // attaches io on server

server.listen(config.PORT, () => {
  logger.info(`Server listening on ${config.PORT}`);
});
