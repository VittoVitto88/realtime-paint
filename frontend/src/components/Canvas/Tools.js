import { useContext, useState } from 'react';
import { SocketContext } from '../../store/SocketContext';
import Undo from '../../assets/undo.png';
import Redo from '../../assets/redo.png';

const Tools = (props) => {
  const socketState = useContext(SocketContext).socketState;
  const [selectedColor, setSelectedColor] = useState(0);
  const [size, setSize] = useState(1);

  const onSelectColor = (index) => {
    setSelectedColor(index);
    props.onSelectColor(index);
  };

  const onChangeSize = (e) => {
    setSize(e.target.value);
    props.onChangeSize(e.target.value);
  };

  const undo = () => {
    socketState.socket.emit('undo', socketState.user.room);
  };

  const redo = () => {
    socketState.socket.emit('redo', socketState.user.room);
  };

  return (
    <div className="tools">
      <div className="tools-container">
        <div className="undo-redo">
          <img className="undo" src={Undo} alt="" onClick={undo} />
          <img className="redo" src={Redo} alt="" onClick={redo} />
        </div>
        <div className="vertical-separator" />
        <div className="colors">
          <div
            className={
              selectedColor === 0
                ? 'colors__color color-black selected'
                : 'colors__color color-black'
            }
            onClick={() => onSelectColor(0)}
          ></div>
          <div
            className={
              selectedColor === 1
                ? 'colors__color color-red selected'
                : 'colors__color color-red'
            }
            onClick={() => onSelectColor(1)}
          ></div>
          <div
            className={
              selectedColor === 2
                ? 'colors__color color-green selected'
                : 'colors__color color-green'
            }
            onClick={() => onSelectColor(2)}
          ></div>
          <div
            className={
              selectedColor === 3
                ? 'colors__color color-yellow selected'
                : 'colors__color color-yellow'
            }
            onClick={() => onSelectColor(3)}
          ></div>
          <div
            className={
              selectedColor === 4
                ? 'colors__color color-blue selected'
                : 'colors__color color-blue'
            }
            onClick={() => onSelectColor(4)}
          ></div>
        </div>
        <div className="vertical-separator" />
        <div className="others">
          <div className="thin-sketch" />
          <input
            className="size"
            type="range"
            min="1"
            max="5"
            value={size}
            onInput={(e) => onChangeSize(e)}
          />
          <div className="thick-sketch" />
        </div>
      </div>
    </div>
  );
};

export default Tools;
