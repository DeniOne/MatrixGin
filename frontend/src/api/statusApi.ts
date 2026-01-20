import apiClient from './apiClient';
import type {
    ParticipationStatus,
    UserParticipationStatus,
    StatusHistoryEntry,
    AssignStatusRequest
} from '../types/participation';

/**
 * API client for Participation Status management
 */

/**
 * Get all available participation statuses
 */
export const getAllStatuses = async (): Promise<ParticipationStatus[]> => {
    const response = await apiClient.get('/status/all');
    return response.data;
};

/**
 * Get current status for a user
 */
export const getUserStatus = async (userId: string): Promise<UserParticipationStatus> => {
    const response = await apiClient.get(`/status/user/${userId}`);
    return response.data;
};

/**
 * Assign a status to a user (ADMIN only)
 */
export const assignStatus = async (data: AssignStatusRequest): Promise<UserParticipationStatus> => {
    const response = await apiClient.post('/status/assign', data);
    return response.data;
};

/**
 * Get status history for a user
 */
export const getStatusHistory = async (userId: string): Promise<StatusHistoryEntry[]> => {
    const response = await apiClient.get(`/status/history/${userId}`);
    return response.data;
};

/**
 * Get all users with their current participation status (ADMIN only)
 */
export const getUsersWithStatuses = async (): Promise<any[]> => {
    const response = await apiClient.get('/status/users');
    return response.data;
};
