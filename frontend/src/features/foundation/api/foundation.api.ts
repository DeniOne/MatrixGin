import axios from 'axios';
import { ImmersionState, BlockViewPayload, DecisionPayload } from '../types/foundation.types';

// Assuming global axios instance or configuring new one
// Ideally use the app's configured api client
import apiClient from '../../../api/apiClient';

const BASE_URL = '/foundation';

export const foundationApi = {
    /**
     * Get current immersion status, block progress, and version.
     * This is the SOURCE OF TRUTH for the UI.
     */
    getStatus: async (): Promise<ImmersionState> => {
        const response = await apiClient.get<ImmersionState>(`${BASE_URL}/status`);
        return response.data;
    },

    /**
     * Register that a block has been strictly viewed/read.
     */
    markBlockViewed: async (payload: BlockViewPayload): Promise<void> => {
        await apiClient.post(`${BASE_URL}/block-viewed`, payload);
    },

    /**
     * Submit final decision (ACCEPT or DECLINE).
     * This is a hard gate.
     */
    submitDecision: async (payload: DecisionPayload): Promise<void> => {
        await apiClient.post(`${BASE_URL}/decision`, payload);
    }
};
