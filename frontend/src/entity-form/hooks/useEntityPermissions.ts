/**
 * useEntityPermissions Hook
 * 
 * Resolves user permissions against Entity Card requirements.
 * Uses current authenticated user from auth state.
 */

import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { EntityCard } from '../types/entity-card.types';

// =============================================================================
// TYPES
// =============================================================================

export interface ResolvedPermissions {
    /** User can create new entities of this type */
    canCreate: boolean;

    /** User can read entities of this type */
    canRead: boolean;

    /** User can update entities of this type */
    canUpdate: boolean;

    /** User can delete entities of this type */
    canDelete: boolean;

    /** User can archive entities of this type */
    canArchive: boolean;

    /** Whether permissions have been resolved (card is loaded) */
    isResolved: boolean;
}

// =============================================================================
// HELPER: Check if user has any of the required permissions
// =============================================================================

const hasPermission = (
    userRole: string | undefined,
    requiredPermissions: string[]
): boolean => {
    if (!userRole) return false;

    // Admin role has access to everything
    if (userRole === 'ADMIN' || userRole === 'admin') return true;

    // Check if user's role matches any required permission
    // In a full implementation, this would check against a list of user permissions
    // For now, we check if the role is mentioned in any permission string
    return requiredPermissions.some(perm => {
        // Check for domain:admin pattern
        if (perm.endsWith(':admin')) {
            const domain = perm.split(':')[0];
            return userRole.toLowerCase().includes(domain);
        }
        // Check for exact match or role-based match
        return perm.includes(userRole.toLowerCase());
    });
};

// =============================================================================
// HOOK
// =============================================================================

export const useEntityPermissions = (card: EntityCard | null): ResolvedPermissions => {
    const user = useAppSelector(selectCurrentUser);

    return useMemo(() => {
        if (!card) {
            return {
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
                canArchive: false,
                isResolved: false,
            };
        }

        const userRole = user?.role;
        const permissions = card.permissions;

        return {
            canCreate: hasPermission(userRole, permissions.create),
            canRead: hasPermission(userRole, permissions.read),
            canUpdate: hasPermission(userRole, permissions.update),
            canDelete: hasPermission(userRole, permissions.delete),
            canArchive: hasPermission(userRole, permissions.archive),
            isResolved: true,
        };
    }, [card, user]);
};

// =============================================================================
// HELPER HOOK: Check specific field permission
// =============================================================================

export interface FieldPermissionCheck {
    /** Field is visible to user */
    isVisible: boolean;

    /** Field is editable by user */
    isEditable: boolean;
}

export const useFieldPermission = (
    card: EntityCard | null,
    fieldName: string,
    mode: 'create' | 'read' | 'update'
): FieldPermissionCheck => {
    const permissions = useEntityPermissions(card);

    return useMemo(() => {
        if (!card || !permissions.isResolved) {
            return { isVisible: false, isEditable: false };
        }

        // Find attribute
        const attr = card.attributes.find(a => a.name === fieldName);
        if (!attr) {
            return { isVisible: false, isEditable: false };
        }

        // Visibility: need read permission
        const isVisible = permissions.canRead;

        // Editability: depends on mode and permissions
        let isEditable = false;
        if (mode === 'create' && permissions.canCreate && !attr.readonly) {
            isEditable = true;
        } else if (mode === 'update' && permissions.canUpdate && !attr.readonly) {
            isEditable = true;
        }

        return { isVisible, isEditable };
    }, [card, fieldName, mode, permissions]);
};
