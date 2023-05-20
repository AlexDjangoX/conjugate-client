import React from 'react';
import NavbarListItems from './NavbarListItems';
import './Navbar.css';

const NavbarMobileScreen = ({ screenWidth, closeMobileMenu }) => {
  return (
    <>
      {screenWidth <= 960 && (
        <div className='drop-down'>
          <div className='navbar-menu-wrapper'>
            <ul className='navbar-menu' onClick={closeMobileMenu}>
              <NavbarListItems />
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMobileScreen;
