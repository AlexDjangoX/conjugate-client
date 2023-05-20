import React from 'react';
import './Atom.css';

const Atom = ({ animationDuration, size, color }) => {
  const spinnerStyle = () => {
    return {
      height: `${size}px`,
      width: `${size}px`,
    };
  };

  const circleStyle = () => {
    return {
      color: color,
      fontSize: `${size * 0.24}px`,
    };
  };

  const lineStyle = () => {
    return {
      animationDuration: `${animationDuration}ms`,
      borderLeftWidth: `${size / 25}px`,
      borderTopWidth: `${size / 25}px`,
      borderLeftColor: color,
    };
  };

  return (
    <div className='overlay'>
      <div className='atom-wrapper'>
        <div className='atom-spinner' style={spinnerStyle()}>
          <div className='spinner-inner'>
            <div className='spinner-line' style={lineStyle()} />
            <div className='spinner-line' style={lineStyle()} />
            <div className='spinner-line' style={lineStyle()} />
            <div className='spinner-circle' style={circleStyle()}>
              &#9679;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Atom.defaultProps = {
  animationDuration: 1000,
  size: 60,
  color: '#fff',
};

export default Atom;
