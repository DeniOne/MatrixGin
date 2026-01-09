import { Transaction, Wallet } from '@prisma/client';
import { CreateTransactionRequestDto, TransactionResponseDto } from '../dto/economy/economy.dto';
import { TransactionType, Currency } from '../dto/common/common.enums';

import { prisma } from '../config/prisma';

export class TransactionService {
    async createTransaction(dto: CreateTransactionRequestDto, senderId?: string): Promise<TransactionResponseDto> {
        // Start a transaction to ensure atomicity
        return await prisma.$transaction(async (tx) => {
            // 1. Validate Sender Balance (if spending or transferring)
            if (senderId && (dto.type === TransactionType.SPEND || dto.type === TransactionType.TRANSFER)) {
                const senderWallet = await tx.wallet.findUnique({ where: { user_id: senderId } });
                if (!senderWallet) throw new Error('Sender wallet not found');

                const balance = dto.currency === Currency.MC ? Number(senderWallet.mc_balance) : Number(senderWallet.gmc_balance);
                if (balance < dto.amount) {
                    throw new Error('Insufficient funds');
                }

                // Deduct from sender
                await tx.wallet.update({
                    where: { user_id: senderId },
                    data: {
                        mc_balance: dto.currency === Currency.MC ? { decrement: dto.amount } : undefined,
                        gmc_balance: dto.currency === Currency.GMC ? { decrement: dto.amount } : undefined,
                    }
                });
            }

            // 2. Add to Recipient (if earning or transferring)
            if (dto.recipientId && (dto.type === TransactionType.EARN || dto.type === TransactionType.TRANSFER || dto.type === TransactionType.REWARD)) {
                // Ensure recipient wallet exists
                let recipientWallet = await tx.wallet.findUnique({ where: { user_id: dto.recipientId } });
                if (!recipientWallet) {
                    recipientWallet = await tx.wallet.create({
                        data: { user_id: dto.recipientId, mc_balance: 0, gmc_balance: 0 }
                    });
                }

                // Add to recipient
                await tx.wallet.update({
                    where: { user_id: dto.recipientId },
                    data: {
                        mc_balance: dto.currency === Currency.MC ? { increment: dto.amount } : undefined,
                        gmc_balance: dto.currency === Currency.GMC ? { increment: dto.amount } : undefined,
                    }
                });
            }

            // 3. Create Transaction Record
            const transaction = await tx.transaction.create({
                data: {
                    type: dto.type as any,
                    currency: dto.currency as any,
                    amount: dto.amount,
                    sender_id: senderId,
                    recipient_id: dto.recipientId,
                    description: dto.description,
                }
            });

            return this.mapToResponse(transaction);
        });
    }

    async getTransactions(userId: string): Promise<TransactionResponseDto[]> {
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { sender_id: userId },
                    { recipient_id: userId }
                ]
            },
            orderBy: { created_at: 'desc' }
        });

        return transactions.map(this.mapToResponse);
    }

    private mapToResponse(tx: Transaction): TransactionResponseDto {
        return {
            id: tx.id,
            type: tx.type as unknown as TransactionType,
            currency: tx.currency as unknown as Currency,
            amount: Number(tx.amount),
            senderId: tx.sender_id || undefined,
            recipientId: tx.recipient_id || undefined,
            description: tx.description || undefined,
            metadata: tx.metadata as Record<string, any> || undefined,
            createdAt: tx.created_at.toISOString()
        };
    }
}

