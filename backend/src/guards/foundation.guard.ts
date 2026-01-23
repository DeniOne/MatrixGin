import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

/**
 * FoundationGuard
 * CANON v2.2: Hard Block for Foundation Admission
 * 
 * Enforces:
 * 1. User must have a FoundationAcceptance record.
 * 2. Decision must be ACCEPTED.
 * 3. Version must match system active version.
 * 4. All violations are audit-logged.
 */
@Injectable()
export class FoundationGuard implements CanActivate {
    private readonly logger = new Logger(FoundationGuard.name);
    // TODO: Move to config/env
    private readonly ACTIVE_FOUNDATION_VERSION = 'v1.0';

    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes AuthGuard has run

        if (!user || !user.id) {
            // If no user context, let AuthGuard handle it or block
            // FoundationGuard only cares about "Authenticated but not Accepted"
            return true;
        }

        // 1. Fetch Acceptance
        const acceptance = await this.prisma.foundationAcceptance.findUnique({
            where: { person_id: user.id }
        });

        // 2. Check Decision
        if (!acceptance || acceptance.decision !== 'ACCEPTED') {
            await this.logBlock(user.id, request.path, 'FOUNDATION_NOT_ACCEPTED', null);
            throw new ForbiddenException({
                code: 'FOUNDATION_REQUIRED',
                message: 'You must accept the Corporate University Foundation to proceed.',
                action: 'REDIRECT_TO_IMMERSION'
            });
        }

        // 3. Check Version Mismatch
        if (acceptance.version !== this.ACTIVE_FOUNDATION_VERSION) {
            await this.logBlock(user.id, request.path, 'VERSION_MISMATCH', {
                userVersion: acceptance.version,
                requiredVersion: this.ACTIVE_FOUNDATION_VERSION
            });
            throw new ForbiddenException({
                code: 'FOUNDATION_VERSION_MISMATCH',
                message: 'New Foundation version available. Re-immersion required.',
                action: 'REDIRECT_TO_IMMERSION'
            });
        }

        return true;
    }

    private async logBlock(userId: string, endpoint: string, reason: string, meta: any) {
        try {
            await this.prisma.foundationAuditLog.create({
                data: {
                    user_id: userId,
                    event_type: 'BLOCKED_ACCESS',
                    metadata: {
                        endpoint,
                        reason,
                        ...meta
                    }
                }
            });
            this.logger.warn(`Foundation Check BLOXKED user ${userId} at ${endpoint}: ${reason}`);
        } catch (e) {
            this.logger.error(`Failed to write Audit Log for user ${userId}`, e);
            // Hard Fail Pattern: If audit fails, should we block? 
            // Canon: Audit is critical. Proceeding without audit is risky. 
            // Current: Log error but block user anyway (via the throw above).
        }
    }
}
