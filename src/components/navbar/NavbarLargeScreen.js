import React from 'react';

import NavbarListItems from './NavbarListItems';

const NavbarLargeScreen = ({ screenWidth }) => {
  return (
    <>
      <ul
        className={
          screenWidth <= 960 ? 'nav-menu-active' : 'nav-menu-inactive links'
        }
      >
        <NavbarListItems />
      </ul>
    </>
  );
};

export default NavbarLargeScreen;
