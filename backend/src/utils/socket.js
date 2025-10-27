let io;
function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, { cors: { origin: '*' }});
  io.on('connection', socket => {
    console.log('client connected', socket.id);
    socket.on('joinDoc', docId => socket.join(docId));
  });
}
function getIo(){ return io; }

module.exports = { initSocket, getIo };
