import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBarMenuIcon from './NavBarMenuIcon';
import NavbarLargeScreen from './NavbarLargeScreen';
import NavbarMobileScreen from './NavbarMobileScreen';
import './Navbar.css';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const toggleMenuIcon = () => setToggle(!toggle);
  const closeMobileMenu = () => setToggle(false);

  const screenSize = () => {
    setScreenWidth(window.innerWidth);
  };

  window.addEventListener('resize', screenSize);

  useEffect(() => {
    screenSize();
  }, []);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/home' className='navbar-logo'>
            <div className='navbar-flag-icon'></div>
            <div className='navbar-alphabet-icon'></div>
          </Link>

          <NavbarLargeScreen screenWidth={screenWidth} />

          <NavBarMenuIcon
            screenWidth={screenWidth}
            toggleMenuIcon={toggleMenuIcon}
            toggle={toggle}
          />
        </div>
      </nav>
      {toggle && (
        <NavbarMobileScreen
          screenWidth={screenWidth}
          closeMobileMenu={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
