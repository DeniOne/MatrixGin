/**
 * Economy Module DTOs
 */

export interface StoreItemDto {
    id: string;
    urn: string;
    label: string;
    description: string;
    price_mc: number;
    status: 'ACTIVE' | 'INACTIVE' | 'LIMIT_REACHED' | 'UNAVAILABLE';
    availability_reason?: string;
}

export interface PurchaseRequestDto {
    item_urn: string;
    quantity: number;
}

export interface BalanceDto {
    mc_balance: number;
    gmc_balance: number;
    last_updated: string;
}

export interface TransactionDto {
    id: string;
    type: 'CREDIT' | 'DEBIT';
    currency: 'MC' | 'GMC';
    amount: number;
    purpose: string;
    timestamp: string;
}

export enum StorePurchaseError {
    INSUFFICIENT_FUNDS = 402,
    IDEMPOTENCY_CONFLICT = 409,
    BUSINESS_RESTRICTION = 422,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
}
