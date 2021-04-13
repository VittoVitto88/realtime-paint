import { useCallback, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../store/SocketContext';
import Canvas from '../components/Canvas/Canvas';
import Tools from '../components/Canvas/Tools';
import JoinModal from '../components/Modals/JoinModal';
import LeaveModal from '../components/Modals/LeaveModal';

const Main = (props) => {
  const { socketState, updateUsers } = useContext(SocketContext);
  const [userJoined, setUserJoined] = useState(undefined);
  const [userLeft, setUserLeft] = useState(undefined);
  const [color, setColor] = useState('black');
  const [size, setSize] = useState(1);

  const welcome = useCallback(
    (user, users) => {
      updateUsers(users);
      setUserJoined(user.username);
      setInterval(() => {
        setUserJoined(undefined);
      }, 3000);
    },
    [updateUsers]
  );

  const leave = useCallback(
    (user, users) => {
      updateUsers(users);
      setUserLeft(user.username);
      setInterval(() => {
        setUserLeft(undefined);
      }, 3000);
    },
    [updateUsers]
  );

  const onSelectColor = (index) => {
    if (index === 0) setColor('black');
    if (index === 1) setColor('red');
    if (index === 2) setColor('green');
    if (index === 3) setColor('yellow');
    if (index === 4) setColor('blue');
  };

  const onChangeSize = (value) => {
    setSize(value);
  };

  useEffect(() => {
    if (!socketState.socket) return props.history.push('/Join');

    socketState.socket.on('welcome', welcome);
    socketState.socket.on('leave', leave);

    return () => {
      socketState.socket.off('welcome', welcome);
      socketState.socket.off('leave', leave);
    };
  }, [socketState.socket, welcome, leave, props.history]);

  return (
    <div className="main">
      <Canvas
        room={socketState.user.room}
        color={color}
        size={size}
        coordinates={socketState.coordinates}
      />
      <Tools onSelectColor={onSelectColor} onChangeSize={onChangeSize} />
      {userJoined && <JoinModal username={userJoined} />}
      {userLeft && <LeaveModal username={userLeft} />}
    </div>
  );
};

export default Main;
