import React from 'react'
function Spinner(props) {
    return (
      <div>
      
      <img
        className="spinner"
        width="24"
        height="24"
        src="https://i.pinimg.com/originals/3e/f0/e6/3ef0e69f3c889c1307330c36a501eb12.gif"
      />{props.text}
      </div>
    );
  }
  export default Spinner;