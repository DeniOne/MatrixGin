import apiClient from './apiClient';
import type { ParticipationRank, UserParticipationRank } from '../types/participation';

/**
 * API client for Participation Rank management
 */

/**
 * Get all available participation ranks
 */
export const getAllRanks = async (): Promise<ParticipationRank[]> => {
    const response = await apiClient.get('/rank/all');
    return response.data;
};

/**
 * Get current rank for a user
 */
export const getUserRank = async (userId: string): Promise<UserParticipationRank> => {
    const response = await apiClient.get(`/rank/user/${userId}`);
    return response.data;
};

/**
 * Manually trigger rank recalculation (ADMIN only)
 */
export const recalculateRanks = async (): Promise<any> => {
    const response = await apiClient.post('/rank/recalculate');
    return response.data;
};
