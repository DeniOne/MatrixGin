import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

interface FoundationGuardProps {
    children: React.ReactNode;
}

export const FoundationGuard: React.FC<FoundationGuardProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const admissionStatus = user?.admissionStatus || 'PENDING_BASE';

    // 1. If user is completely admitted, allow access
    if (admissionStatus === 'ADMITTED') {
        return <>{children}</>;
    }

    // 2. If user hasn't accepted the Base yet, force redirect to Foundation
    if (admissionStatus === 'PENDING_BASE') {
        // Prevent infinite redirect if already on /foundation
        if (location.pathname.startsWith('/foundation')) {
            return <>{children}</>;
        }
        return <Navigate to="/foundation/start" replace state={{ from: location }} />;
    }

    // 3. If user accepted the Base but hasn't completed enrollment (Personal Data), force to Registration
    if (admissionStatus === 'BASE_ACCEPTED') {
        // If we have a dedicated registration completion page, redirect there.
        // For now, redirecting to a placeholder or specific onboarding route.
        if (location.pathname.startsWith('/registration')) {
            return <>{children}</>;
        }
        return <Navigate to="/registration" replace state={{ from: location }} />;
    }

    // Default: allow children but with restricted scopes (enforced by backend)
    return <>{children}</>;

    return <>{children}</>;
};
