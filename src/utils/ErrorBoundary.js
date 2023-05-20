import React, { Fragment, useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const onError = () => {
      setHasError(true);
    };

    window.addEventListener('error', onError);
    return () => window.removeEventListener('error', onError);
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }
  return (
    <Fragment>
      {React.cloneElement(children, { onError: () => setHasError(true) })}
    </Fragment>
  );
};

export default ErrorBoundary;
