import React, { useState } from 'react';
import { useGetTransactionsQuery, Transaction, TransactionType, Currency } from '../../features/economy/economyApi';
import { X, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ isOpen, onClose }) => {
    const [filters, setFilters] = useState({
        type: undefined as TransactionType | undefined,
        currency: undefined as Currency | undefined,
        page: 1,
        limit: 20,
    });

    const { data, isLoading, error } = useGetTransactionsQuery(filters);

    if (!isOpen) return null;

    const getTransactionIcon = (transaction: Transaction) => {
        if (transaction.recipientId) {
            return <ArrowUpRight className="w-5 h-5 text-red-500" />;
        }
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
    };

    const getTransactionColor = (transaction: Transaction) => {
        if (transaction.recipientId) {
            return 'text-red-500';
        }
        return 'text-green-500';
    };

    const formatAmount = (transaction: Transaction) => {
        const prefix = transaction.recipientId ? '-' : '+';
        return `${prefix}${transaction.amount.toLocaleString()} ${transaction.currency}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-700 flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Type
                        </label>
                        <select
                            value={filters.type || ''}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value as TransactionType || undefined })}
                            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Types</option>
                            <option value={TransactionType.REWARD}>Reward</option>
                            <option value={TransactionType.TRANSFER}>Transfer</option>
                            <option value={TransactionType.PURCHASE}>Purchase</option>
                            <option value={TransactionType.PENALTY}>Penalty</option>
                            <option value={TransactionType.REFUND}>Refund</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Currency
                        </label>
                        <select
                            value={filters.currency || ''}
                            onChange={(e) => setFilters({ ...filters, currency: e.target.value as Currency || undefined })}
                            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Currencies</option>
                            <option value={Currency.MC}>MC</option>
                            <option value={Currency.GMC}>GMC</option>
                        </select>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">Failed to load transactions</p>
                        </div>
                    ) : !data || data.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No transactions found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.data.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {getTransactionIcon(transaction)}
                                        <div>
                                            <div className="font-medium text-white">
                                                {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                                            </div>
                                            {transaction.description && (
                                                <div className="text-sm text-gray-400">
                                                    {transaction.description}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(transaction.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${getTransactionColor(transaction)}`}>
                                        {formatAmount(transaction)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {data && data.total > filters.limit && (
                    <div className="p-6 border-t border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, data.total)} of {data.total} transactions
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                disabled={filters.page === 1}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                disabled={filters.page * filters.limit >= data.total}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistoryModal;
