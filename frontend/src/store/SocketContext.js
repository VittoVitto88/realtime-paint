import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socketState, setSocketState] = useState({
    socket: undefined,
    joined: false,
    error: '',
    user: {},
    users: [],
    coordinates: [],
  });

  useEffect(() => {
    const socket = io('https://realtime-paint.herokuapp.com/');
    setSocketState((prevState) => {
      return {
        ...prevState,
        socket,
      };
    });
  }, []);

  const join = (username, room) => {
    socketState.socket.emit(
      'join',
      { username, room },
      (error, user, users, coordinates) => {
        if (error)
          setSocketState((prevState) => {
            return {
              ...prevState,
              error,
            };
          });
        if (user) {
          setSocketState((prevState) => {
            return {
              ...prevState,
              joined: true,
              user,
              users,
              coordinates,
            };
          });
        }
      }
    );
  };

  const clearError = () =>
    setSocketState((prevState) => {
      return {
        ...prevState,
        error: '',
      };
    });

  const updateUsers = (users) => {
    setSocketState((prevState) => {
      return {
        ...prevState,
        users,
      };
    });
  };

  return (
    <SocketContext.Provider
      value={{ socketState, join, clearError, updateUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
