import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'routes';
import {
  makeSelectCurrentUser,
  makeSelectIsAuthenticated,
  maskeSelectIsPasswordCreateRequired,
} from '../../redux/selectors/Users';
import Loading from 'components/shared-components/Loading';

export function PrivateRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());
  const user = useSelector(makeSelectCurrentUser());
  const isPasswordCreateRequired = useSelector(
    maskeSelectIsPasswordCreateRequired()
  );

  const getComponentByPasswordStatus = (props) => {
    if (isPasswordCreateRequired)
      return <Redirect to={ROUTES.CREATE_PASSWORD} />;
    return <Component {...props} />;
  };

  const getComponent = (props) =>
    !user ? <Loading /> : getComponentByPasswordStatus(props);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? getComponent(props) : <Redirect to={ROUTES.LOGIN} />
      }
    />
  );
}

export default PrivateRoute;
