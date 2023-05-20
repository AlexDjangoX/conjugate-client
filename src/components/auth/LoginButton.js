import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../button/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      buttonStyle='btn-login-logout'
      buttonSize='btn--medium'
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
