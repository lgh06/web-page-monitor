'use strict';
const { Server } = require("socket.io");


module.exports = socketio;

function socketio() {
  const io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
}
