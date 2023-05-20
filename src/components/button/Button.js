import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const STYLES = [
  'btn--primary',
  'btn--outline',
  'btn-login-logout',
  'btn--add-new-verb',
  'btn-edit-verb',
  'btn--translation',
  'btn-delete-verb',
  'btn-delete-confirm',
  'btn-cancel-delete',
  'btn-add-noun',
  'btn-delete-noun',
  'btn-cancel-delete-noun',
  'btn-edit-noun',
];

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
  children,
  type,
  onClick,
  buttonSize,
  buttonStyle,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <div className='btn--wrapper'>
      {/* <Link to='/kanban'> */}
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
      {/* </Link> */}
    </div>
  );
};
