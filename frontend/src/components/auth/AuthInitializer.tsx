import React, { useEffect } from 'react';
import { useGetMeQuery } from '../../features/auth/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';

/**
 * AuthInitializer component
 * Responsible for fetching the current user profile if a token exists in localStorage
 */
export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');

    const { data: user, isSuccess } = useGetMeQuery(undefined, {
        skip: !token
    });

    useEffect(() => {
        if (isSuccess && user && token) {
            dispatch(setCredentials({ user, accessToken: token }));
        }
    }, [isSuccess, user, token, dispatch]);

    return <>{children}</>;
};
