exports.initializeHistory = (history, redoHistory, room) => {
  // checking if there is already a room history
  let roomHistory = history.find((item) => item.room === room);

  // creating a new room history and a new redo room history
  if (!roomHistory) {
    roomHistory = { room, coordinates: [] };
    history.push(roomHistory);
    redoHistory.push({ room, coordinates: [] });
  }

  return roomHistory;
};

const addCoordinates = (array1, array2, i) => {
  for (let index = i; index < array1.coordinates.length; index++) {
    array2.coordinates.push(array1.coordinates[index]);
  }
};

exports.undo = (roomHistory, redoRoomHistory) => {
  for (let i = roomHistory.coordinates.length - 1; i > -1; i--) {
    if (roomHistory.coordinates[i].action) {
      addCoordinates(roomHistory, redoRoomHistory, i);
      roomHistory.coordinates.splice(i, roomHistory.coordinates.length - i);
      break;
    }
  }
};

exports.redo = (roomHistory, redoRoomHistory) => {
  for (let i = redoRoomHistory.coordinates.length - 1; i > -1; i--) {
    if (redoRoomHistory.coordinates[i].action) {
      addCoordinates(redoRoomHistory, roomHistory, i);
      redoRoomHistory.coordinates.splice(
        i,
        redoRoomHistory.coordinates.length - i
      );
      break;
    }
  }
};
