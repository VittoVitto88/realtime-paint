const User = require('../models/user');

const users = [];

exports.addUser = (id, username, room, callback) => {
  // checking if the user provided both the username and the room
  if (!username) return callback('Please provide a username');
  if (!room) return callback('Please provide a room');

  // sanitizing the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // checking if the username is already existent in the same room
  if (users.find((user) => user.username === username && user.room === room))
    return callback('Username already in use...', undefined);

  users.push(new User(id, username, room));
  callback(undefined, users[users.length - 1]);
};

exports.removeUser = (id, callback) => {
  const user = users.find((user) => id === user.id);
  if (!user) return callback('error deleting user', undefined);
  users.splice(users.indexOf(user), 1);
  callback(undefined, user);
};

exports.getUsersInRoom = (room) => users.filter((user) => user.room === room);
