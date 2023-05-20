import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const NavBarMenuIcon = ({ screenWidth, toggleMenuIcon, toggle }) => {
  return (
    <>
      {screenWidth <= 960 && (
        <div className='navbar-menu-icon' onClick={toggleMenuIcon}>
          {toggle ? (
            <FontAwesomeIcon
              icon={solid('xmark')}
              size='4x'
              style={{ padding: 8, paddingLeft: 17, paddingRight: 17 }}
            />
          ) : (
            <FontAwesomeIcon
              icon={solid('bars')}
              size='3x'
              style={{ padding: 18 }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default NavBarMenuIcon;
