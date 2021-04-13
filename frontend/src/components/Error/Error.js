const Error = (props) => {
  return (
    <div className="error">
      <div className="error-modal">
        <div className="error-modal__message">{props.errorMessage}</div>
        <button className="error-modal__button" onClick={props.onClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Error;
