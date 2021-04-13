const JoinedItems = (props) => {
  return (
    <ul className="list list-right">
      <li className="list__element" id="users">
        users <span className="triangle">&#9660;</span>
        <ul className="list-users">
          {props.users.map((user) => (
            <li key={user.username} className="list-users__element">
              {user.username}
              {user.username === props.username && ' (me)'}
            </li>
          ))}
        </ul>
      </li>
      <li className="list__element">Room: {props.room}</li>
    </ul>
  );
};

export default JoinedItems;
