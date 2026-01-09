import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

export const useAuth = () => {
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return useMemo(() => ({ user, isAuthenticated }), [user, isAuthenticated]);
};
