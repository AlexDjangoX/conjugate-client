import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LoginButton from '../auth/LoginButton';
import LogOutButton from '../auth/LogOutButton';

const NavbarListItems = () => {
  const { user } = useAuth0();

  return (
    <>
      <li className='navbar-list-item'>
        <Link to='/' className='navbar-link'>
          Home
        </Link>
      </li>

      <li className='navbar-list-item'>
        <Link to={`/profile`} className='navbar-link'>
          Profile
        </Link>
      </li>

      <li className='navbar-list-item'>
        <Link to='/nouns' className='navbar-link'>
          Nouns
        </Link>
      </li>

      <li className='navbar-list-item'>
        <Link to='/kanban' className='navbar-link'>
          Conjugate
        </Link>
      </li>
      <li className='navbar-list-item'>
        {!user ? <LoginButton /> : <LogOutButton />}
      </li>
    </>
  );
};

export default NavbarListItems;
