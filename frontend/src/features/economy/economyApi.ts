import { api } from '../../app/api';

// Enums
export enum Currency {
    MC = 'MC',
    GMC = 'GMC'
}

export enum TransactionType {
    REWARD = 'REWARD',
    TRANSFER = 'TRANSFER',
    PURCHASE = 'PURCHASE',
    PENALTY = 'PENALTY',
    REFUND = 'REFUND'
}

// Interfaces
export interface Wallet {
    userId: string;
    mcBalance: number;
    gmcBalance: number;
    mcFrozen?: number;
    safeActivatedAt?: string;
    safeExpiresAt?: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    currency: Currency;
    amount: number;
    senderId?: string;
    recipientId?: string;
    description?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface TransactionFilters {
    type?: TransactionType;
    currency?: Currency;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedTransactionsResponse {
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateTransferRequest {
    recipientId: string;
    amount: number;
    currency: Currency;
    description?: string;
}

export const economyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getWallet: builder.query<Wallet, void>({
            query: () => '/economy/wallet',
            providesTags: ['Wallet'],
        }),
        getTransactions: builder.query<PaginatedTransactionsResponse, TransactionFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters.type) params.append('type', filters.type);
                if (filters.currency) params.append('currency', filters.currency);
                if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
                if (filters.dateTo) params.append('dateTo', filters.dateTo);
                if (filters.page) params.append('page', filters.page.toString());
                if (filters.limit) params.append('limit', filters.limit.toString());

                return `/economy/transactions?${params.toString()}`;
            },
            providesTags: ['Transaction'],
        }),
        createTransfer: builder.mutation<Transaction, CreateTransferRequest>({
            query: (transfer) => ({
                url: '/economy/transfer',
                method: 'POST',
                body: transfer,
            }),
            invalidatesTags: ['Wallet', 'Transaction'],
        }),
    }),
});

export const {
    useGetWalletQuery,
    useGetTransactionsQuery,
    useCreateTransferMutation,
} = economyApi;
