'use strict';
import { createServer } from "http";
import { SocketAddress } from "net";
import { Server } from "socket.io";
import { CONFIG } from "./CONFIG.mjs";


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

  setInterval(() => {
    let email = "hnnk@qq.com";
    io.to('room' + email).emit('room' + email,
      {
        msg: `Welcome user ${email} from server`,
        time: new Date().toLocaleString(),
      }
    );
  }, 10000);
  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.userInfo.email, socket.userInfo.type)
    const { email, type } = socket.userInfo;
    let roomArr = ['room' + email];

    if(type === "pptr" || type === "worker"){
      roomArr.push("backroom")
    }
    socket.join(roomArr);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('backroom', arg =>{
      // console.log( new Date().toLocaleString(), arg)
      socket.to("backroom").emit("backroom", arg)
    })
    setInterval(() =>{
    }, 5500)
  });

  httpServer.listen(CONFIG.socketioPort);

}

socketio();

export { socketio, socketio as default }