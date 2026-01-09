import React, { useState } from 'react';
import { useGetWalletQuery } from '../../features/economy/economyApi';
import { Coins, Gem, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import TransactionHistoryModal from './TransactionHistoryModal';

const WalletWidget: React.FC = () => {
    const { data: wallet, isLoading, error } = useGetWalletQuery();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">Loading...</span>
            </div>
        );
    }

    if (error || !wallet) {
        return null;
    }

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-semibold text-white">
                            {wallet.mcBalance.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">MC</span>
                    </div>

                    <div className="flex items-center gap-2 border-l border-gray-700 pl-3">
                        <Gem className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-semibold text-white">
                            {wallet.gmcBalance.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">GMC</span>
                    </div>

                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                </button>

                {isExpanded && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                        <div className="p-4 space-y-3">
                            <div>
                                <div className="text-xs text-gray-400 mb-1">MatrixCoin Balance</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-yellow-500">
                                        {wallet.mcBalance.toLocaleString()} MC
                                    </span>
                                </div>
                                {wallet.mcFrozen && wallet.mcFrozen > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Frozen: {wallet.mcFrozen.toLocaleString()} MC
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-700 pt-3">
                                <div className="text-xs text-gray-400 mb-1">GoldenMatrixCoin Balance</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-purple-500">
                                        {wallet.gmcBalance.toLocaleString()} GMC
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowHistory(true);
                                    setIsExpanded(false);
                                }}
                                className="w-full mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                                View Transaction History
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showHistory && (
                <TransactionHistoryModal
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                />
            )}
        </>
    );
};

export default WalletWidget;
