import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

interface FoundationGuardProps {
    children: React.ReactNode;
}

export const FoundationGuard: React.FC<FoundationGuardProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Safe state default
    const status = user?.foundationStatus || 'NOT_STARTED';

    // Routes that are ALWAYS blocked if Foundation is not accepted
    // Note: Dashboard is allowed but will have restricted content logic inside it
    // Foundation routes are naturally allowed since they are the path to acceptance

    // Simplest logic: If NOT ACCEPTED, block everything except:
    // - /foundation/*
    // - / (Dashboard)
    // - /profile (Maybe allow profile editing?)
    // - /logout (Implicitly allowed by AuthLayout usually)

    // Assuming this Guard wraps specific routes in App.tsx

    if (status !== 'ACCEPTED') {
        return <Navigate to="/foundation" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};
