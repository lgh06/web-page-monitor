'use strict';
import { createServer } from "http";
import { SocketAddress } from "net";
import { Server } from "socket.io";



function socketio() {
  // https://socket.io/docs/v4/server-installation/
  // https://socket.io/docs/v4/handling-cors/#configuration
  // https://socket.io/docs/v4/server-socket-instance/#socketrooms
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {
    const userInfo = socket.handshake.auth.userInfo;
    if (!userInfo.email) {
      return next(new Error("invalid userInfo"));
    }
    socket.userInfo = userInfo;
    next();
  });
  let tmpSocket;
  setInterval(() => {
    if (tmpSocket !== undefined && tmpSocket.connected) {
      const { email } = tmpSocket.userInfo;

      io.to('room' + email) .emit('room' + email,
        {
          msg: `Welcome user ${email} from server`,
          time: new Date().toLocaleString(),
        }
      );
    }
  }, 2000);
  io.on('connection',(socket) => {
    console.log('a user connected');
    console.log(socket.userInfo.email)
    const { email } = socket.userInfo;
    socket.join('room' + email);
    tmpSocket = socket;

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  httpServer.listen(3003);

}

socketio();

export { socketio, socketio as default }