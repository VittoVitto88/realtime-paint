import { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../store/SocketContext';
import Error from '../components/Error/Error';

const Join = (props) => {
  const { socketState, join, clearError } = useContext(SocketContext);
  const [inputs, setInputs] = useState({
    username: {
      name: 'username',
      placeholder: 'Username',
      value: '',
    },
    room: {
      name: 'room',
      placeholder: 'Room',
      value: '',
    },
  });

  useEffect(() => {
    if (socketState.joined)
      props.history.push(`/Main/${socketState.user.room}`);
  }, [socketState.joined, props.history, socketState.user.room]);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => {
      return {
        ...prevInputs,
        [name]: {
          ...prevInputs[name],
          value,
        },
      };
    });
  };

  const onJoin = (e) => {
    e.preventDefault();

    join(inputs.username.value, inputs.room.value);
  };

  const onErrorClear = () => clearError();

  return (
    <div className="join">
      <form className="form-join" onSubmit={(e) => onJoin(e)}>
        <h2 className="title-form">START DRAWING!</h2>
        <label className="label">{inputs.username.placeholder}</label>
        <input
          className="textbox"
          type="text"
          name={inputs.username.name}
          value={inputs.username.value}
          onChange={(e) => onInputChange(e)}
        />
        <label className="label">{inputs.room.placeholder}</label>
        <input
          className="textbox"
          type="text"
          name={inputs.room.name}
          value={inputs.room.value}
          onChange={(e) => onInputChange(e)}
        />
        <button className="button-join">JOIN</button>
      </form>
      {socketState.error && (
        <Error errorMessage={socketState.error} onClick={onErrorClear} />
      )}
    </div>
  );
};

export default Join;
