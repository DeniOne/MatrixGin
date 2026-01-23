import axios from 'axios';

/**
 * Shared Axios instance for API calls
 */
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for Foundation Guard
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global Foundation Guard
        if (error.response && error.response.status === 403) {
            const message = error.response.data?.message;
            const isFoundationError =
                message?.includes('FOUNDATION_REQUIRED') ||
                message?.includes('Foundation Layer not accepted');

            // Prevent redirect loop if already on foundation pages
            const isFoundationPage = window.location.pathname.startsWith('/foundation');

            if (isFoundationError && !isFoundationPage) {
                console.warn('Access Denied: Foundation Acceptance Required. Redirecting...');
                window.location.href = '/foundation/start';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
