import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from '../features/auth/authSlice';
import { ofsApi } from '../features/ofs/api/ofsApi';
import { registrationApi } from '../features/ofs/api/registrationApi';
import { universityApi } from '../features/university/api/universityApi';
import { registryApi } from '../registry/api/registryApi';
import { aiApi } from '../features/ai/aiApi';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        [ofsApi.reducerPath]: ofsApi.reducer,
        [registrationApi.reducerPath]: registrationApi.reducer,
        [universityApi.reducerPath]: universityApi.reducer,
        [registryApi.reducerPath]: registryApi.reducer,
        [aiApi.reducerPath]: aiApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(api.middleware)
            .concat(ofsApi.middleware)
            .concat(registrationApi.middleware)
            .concat(universityApi.middleware)
            .concat(registryApi.middleware)
            .concat(aiApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
