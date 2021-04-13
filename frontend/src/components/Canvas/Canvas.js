import { useEffect, useContext, useRef, useCallback, useState } from 'react';
import { SocketContext } from '../../store/SocketContext';

const Canvas = (props) => {
  const socket = useContext(SocketContext).socketState.socket;
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);

  // scaling the canvas to improve resolution
  const canvasResize = () => {
    const scaleFactor = 2;

    canvasRef.current.width = Math.ceil(canvasRef.current.width * scaleFactor);
    canvasRef.current.height = Math.ceil(
      canvasRef.current.height * scaleFactor
    );

    canvasRef.current.getContext('2d').scale(scaleFactor, scaleFactor);
  };

  const drawCoordinates = (coordinates) => {
    coordinates.forEach((item) => {
      if (item.action) {
        canvasRef.current.getContext('2d').beginPath();
        canvasRef.current.getContext('2d').strokeStyle = item.color;
        canvasRef.current.getContext('2d').lineWidth = item.size;
      } else {
        canvasRef.current.getContext('2d').lineTo(item.x, item.y);
        canvasRef.current.getContext('2d').stroke();
      }
    });
  };

  // drawing the history of the sketch if a user join the room after starting to draw
  const drawHistory = useCallback(() => {
    drawCoordinates(props.coordinates);
  }, [props.coordinates]);

  const onStart = useCallback((tools) => {
    canvasRef.current.getContext('2d').beginPath();
    canvasRef.current.getContext('2d').strokeStyle = tools.color;
    canvasRef.current.getContext('2d').lineWidth = tools.size;
    canvasRef.current.getContext('2d').lineCap = 'round';
  }, []);

  const onDraw = useCallback((coordinates) => {
    canvasRef.current.getContext('2d').lineTo(coordinates.x, coordinates.y);
    canvasRef.current.getContext('2d').stroke();
  }, []);

  const receiveCoordinates = useCallback((coordinates) => {
    canvasRef.current
      .getContext('2d')
      .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    drawCoordinates(coordinates);
  }, []);

  const beginPath = useCallback(() => {
    canvasRef.current.getContext('2d').beginPath();
    canvasRef.current.getContext('2d').strokeStyle = props.color;
    canvasRef.current.getContext('2d').lineWidth = props.size;
    canvasRef.current.getContext('2d').lineCap = 'round';

    socket.emit('start', props.room, { color: props.color, size: props.size });
  }, [socket, props.room, props.color, props.size]);

  const startDrawing = () => {
    setIsDrawing(true);
    beginPath();
  };

  const stroke = useCallback(
    (e) => {
      let x;
      let y;

      if (e.touches) {
        x = e.touches[0].clientX - e.target.getBoundingClientRect().x;
        y = e.touches[0].clientY - e.target.getBoundingClientRect().y;
      } else {
        x = e.clientX - e.target.getBoundingClientRect().x;
        y = e.clientY - e.target.getBoundingClientRect().y;
      }

      canvasRef.current.getContext('2d').lineTo(x, y);
      canvasRef.current.getContext('2d').stroke();

      socket.emit('draw', props.room, { x, y });
    },
    [socket, props.room]
  );

  const drawing = (e) => {
    if (!isDrawing) return;
    stroke(e);
  };

  const endDrawing = () => setIsDrawing(false);

  const touchStart = useCallback(() => {
    beginPath();
  }, [beginPath]);

  const touchMove = useCallback(
    (e) => {
      e.preventDefault();
      stroke(e);
    },
    [stroke]
  );

  useEffect(() => {
    // canvasResize();

    if (!socket) return;

    if (props.coordinates.length > 0) drawHistory();

    socket.on('start', onStart);
    socket.on('draw', onDraw);
    socket.on('sendCoordinates', receiveCoordinates);

    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);

    return () => {
      socket.off('start', onStart);
      socket.off('draw', onDraw);
      socket.off('sendCoordinates', receiveCoordinates);

      canvas.removeEventListener('touchstart', touchStart, false);
      canvas.removeEventListener('touchmove', touchMove, false);
    };
  }, [
    socket,
    props.coordinates.length,
    drawHistory,
    onStart,
    onDraw,
    receiveCoordinates,
    touchStart,
    touchMove,
  ]);

  return (
    <canvas
      className="canvas"
      width="1200"
      height="650"
      ref={canvasRef}
      onMouseDown={(e) => startDrawing(e)}
      onMouseMove={(e) => drawing(e)}
      onMouseUp={endDrawing}
    />
  );
};

export default Canvas;
