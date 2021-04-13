import { useContext } from 'react';
import { SocketContext } from '../../store/SocketContext';
import JoinedItems from './JoinedItems';

const Header = () => {
  const socketState = useContext(SocketContext).socketState;

  return (
    <div className="header">
      <nav className="navigation">
        <ul className="list list-left">
          <li className="list__element">DRAWING APP</li>
        </ul>
      </nav>
      <nav className="navigation">
        {socketState.joined && (
          <JoinedItems
            users={socketState.users}
            username={socketState.user.username}
            room={socketState.user.room}
          />
        )}
      </nav>
    </div>
  );
};

export default Header;
