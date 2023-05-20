import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../button/Button';

const LogOutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      buttonStyle='btn-login-logout'
      buttonSize='btn--medium'
      onClick={() => logout()}
    >
      Log out
    </Button>
  );
};

export default LogOutButton;
