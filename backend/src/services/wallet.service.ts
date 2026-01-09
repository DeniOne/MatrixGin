import { Wallet } from '@prisma/client';
import { WalletResponseDto } from '../dto/economy/economy.dto';

import { prisma } from '../config/prisma';

export class WalletService {
    async getWalletByUserId(userId: string): Promise<WalletResponseDto> {
        let wallet = await prisma.wallet.findUnique({
            where: { user_id: userId }
        });

        if (!wallet) {
            wallet = await this.createWallet(userId);
        }

        return this.mapToResponse(wallet);
    }

    async createWallet(userId: string): Promise<Wallet> {
        return await prisma.wallet.create({
            data: {
                user_id: userId,
                mc_balance: 0,
                gmc_balance: 0,
                mc_frozen: 0
            }
        });
    }

    private mapToResponse(wallet: Wallet): WalletResponseDto {
        return {
            userId: wallet.user_id,
            mcBalance: Number(wallet.mc_balance),
            gmcBalance: Number(wallet.gmc_balance),
            mcFrozen: Number(wallet.mc_frozen),
            safeActivatedAt: wallet.safe_activated_at?.toISOString(),
            safeExpiresAt: wallet.safe_expires_at?.toISOString(),
            updatedAt: wallet.updated_at.toISOString()
        };
    }
}

