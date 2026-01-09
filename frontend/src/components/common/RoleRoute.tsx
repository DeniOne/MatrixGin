import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

interface RoleRouteProps {
  roles?: string[];
  allowTrainer?: boolean;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ roles, allowTrainer }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const trainerFlag = localStorage.getItem('isTrainer') === 'true';
  const hasRole =
    !roles || roles.length === 0 ? true : !!user && roles.includes(user.role);

  const isAllowed = hasRole || (!!allowTrainer && trainerFlag);

  if (!isAllowed) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
