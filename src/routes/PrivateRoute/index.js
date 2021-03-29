import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'routes';
import {
  makeSelectCurrentUser,
  makeSelectIsAuthenticated,
  makeSelectIsForceClinicRequired,
  maskeSelectIsPasswordCreateRequired,
} from '../../redux/selectors/Users';
import Loading from 'components/shared-components/Loading';

export function PrivateRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());
  const user = useSelector(makeSelectCurrentUser());
  const isPasswordCreateRequired = useSelector(
    maskeSelectIsPasswordCreateRequired()
  );

  const isForceClinicRequired = useSelector(makeSelectIsForceClinicRequired());

  const getComponentByPasswordAndClinicUpdateStatus = (props) => {
    if (isPasswordCreateRequired) {
      return <Redirect to={ROUTES.CREATE_PASSWORD} />;
    } else if (isForceClinicRequired) {
      return <Redirect to={ROUTES.FIRST_CLINIC_UPDATE} />;
    }

    return <Component {...props} />;
  };

  const getComponent = (props) =>
    !user ? <Loading /> : getComponentByPasswordAndClinicUpdateStatus(props);

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
