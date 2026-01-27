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
        const status = error.response?.status;

        // Global 401 Unauthorized handling
        if (status === 401) {
            console.warn('Unauthorized: Token might be invalid or expired. Logging out...');
            localStorage.removeItem('token');
            // Prevent redirect loop if already on login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Global Foundation Guard
        if (status === 403) {
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
