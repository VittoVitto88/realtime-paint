require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://192.168.1.107:3000',
      'http://192.168.1.148:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.static(path.join('client')));

const { addUser, removeUser, getUsersInRoom } = require('./controllers/user');
const { initializeHistory, undo, redo } = require('./utils/utils');

// array containing the draw history for all rooms: every element is an object containing the room name and an array of coordinates
const history = [];

// array containing the draws deleted for all rooms: every element is an object containing the room name and an array of coordinates
const redoHistory = [];

io.on('connection', (socket) => {
  // test log
  console.log(`New Connection: ${socket.id}`);

  // opening the socket for the join event
  socket.on('join', (options, callback) => {
    // adding the new user
    addUser(socket.id, options.username, options.room, (error, user) => {
      // checking if the user or the room already exist
      if (error) return callback(error, undefined, undefined, undefined);

      // initializing history
      const roomHistory = initializeHistory(history, redoHistory, user.room);

      // joining the room and send a welcome to the other users
      socket.join(user.room);
      socket.to(user.room).emit('welcome', user, getUsersInRoom(user.room));

      // test log
      console.log(`${user.username} joined the room ${user.room}`);

      // sending an akwnoledgement with the current user, the users in the room and the history of coordinates
      callback(
        undefined,
        user,
        getUsersInRoom(user.room),
        roomHistory.coordinates
      );
    });
  });

  // starting to draw (onmousedown)
  socket.on('start', (room, tools) => {
    // searching for the history of coordinates
    const roomHistory = history.find((item) => item.room === room);

    // Inserting a begin path to the coordinates array (maybe remove the if statement as the beginPath can be added at the very top)
    roomHistory.coordinates.push({
      action: 'beginPath',
      color: tools.color,
      size: tools.size,
    });

    socket.to(room).emit('start', { color: tools.color, size: tools.size });
  });

  // drawing (onmousemove)
  socket.on('draw', (room, coordinates) => {
    // searching for the room history and adding the coordinates
    const roomHistory = history.find((item) => item.room === room);
    roomHistory.coordinates.push(coordinates);

    // sending the coordinates to the other users
    socket.to(room).emit('draw', coordinates);
  });

  socket.on('undo', (room) => {
    const roomHistory = history.find((item) => item.room === room);
    const redoRoomHistory = redoHistory.find((item) => item.room === room);

    // only undo if there is already a chunk of coordinates (a draw basically)
    if (roomHistory.coordinates.length > 0) {
      undo(roomHistory, redoRoomHistory);
      io.to(room).emit('sendCoordinates', roomHistory.coordinates);
    }
  });

  socket.on('redo', (room) => {
    const roomHistory = history.find((item) => item.room === room);
    const redoRoomHistory = redoHistory.find((item) => item.room === room);

    // only redo if there is a sketch to resume
    if (redoRoomHistory.coordinates.length > 0) {
      redo(roomHistory, redoRoomHistory);
      io.to(room).emit('sendCoordinates', roomHistory.coordinates);
    }
  });

  // disconnecting
  socket.on('disconnect', (param) => {
    console.log(param);
    // removing the user
    removeUser(socket.id, (error, user) => {
      if (error) return console.log(error);
      console.log(`${user.username} left the room ${user.room}`);

      // send a leave message to the other users
      socket.to(user.room).emit('leave', user, getUsersInRoom(user.room));

      const users = getUsersInRoom(user.room);
      if (users.length === 0) {
        // if there are no more users, delete the history and the redoHistory
        const roomHistory = history.find((item) => item.room === user.room);
        history.splice(history.indexOf(roomHistory), 1);
        const redoRoomHistory = redoHistory.find(
          (item) => item.room === user.room
        );
        redoHistory.splice(redoHistory.indexOf(redoRoomHistory), 1);
      }
    });
  });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// starting the server

httpServer.listen(process.env.PORT, () => {
  console.log(`### server listening on port ${process.env.PORT} ###`);
});
