/**
 * MatrixCoin Economy Module Definition
 * Module 08 — MatrixCoin-Economy
 * STEP 5 — PERSISTENCE & API
 * STEP 6 — INTEGRATION BOUNDARIES
 * 
 * Registers:
 * - Controllers
 * - Adapter Services
 * - Core Services (Pure)
 * - Repositories
 * - Integration Services (Read-Only)
 */

// @ts-ignore
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Controllers
import { EconomyController } from './controllers/economy.controller';
import { StoreController } from './controllers/store.controller';
import { EconomyAnalyticsController } from './controllers/analytics.controller';

// Adapters
import {
    StoreAccessAdapterService,
    AuctionAdapterService,
    GovernanceAdapterService
} from './services/economy.adapters';

// Core Services (Pure Logic Wrappers)
import { StoreEligibilityService } from './services/store-eligibility.service';
import { StorePurchaseService } from './services/store-purchase.service';
import { AuctionEventService } from './services/auction.service';
import { GMCRecognitionBridgeService } from './services/gmc-recognition.service';
import { EconomyGovernanceService } from './services/governance.service';
import { EconomyAnalyticsService } from './services/analytics.service';

// Repositories
import { AuditEventRepository } from './services/audit-event.repository';
import {
    MCSnapshotRepository,
    AuctionEventRepository,
    GovernanceFlagRepository
} from './services/persistence.repositories';

// Integration Services
import { EconomyIntegrationReadService } from './integration/services';

// Prisma Provider (Simple Factory)
const PrismaProvider = {
    provide: PrismaClient,
    useValue: new PrismaClient()
};

@Module({
    controllers: [EconomyController, StoreController, EconomyAnalyticsController],
    providers: [
        // Infrastructure
        PrismaProvider,
        AuditEventRepository,
        MCSnapshotRepository,
        AuctionEventRepository,
        GovernanceFlagRepository,

        // Core Services (Pure)
        StoreEligibilityService,
        StorePurchaseService,
        AuctionEventService,
        GMCRecognitionBridgeService,
        EconomyGovernanceService,
        EconomyAnalyticsService,

        // Adapters (Orchestration)
        StoreAccessAdapterService,
        AuctionAdapterService,
        GovernanceAdapterService,

        // Integration Boundary (Read-Only)
        EconomyIntegrationReadService
    ],
    exports: [
        // Export Adapters for other modules integration
        StoreAccessAdapterService,
        AuctionAdapterService,
        GovernanceAdapterService,

        // Export Read-Only Integration
        EconomyIntegrationReadService
    ]
})
export class MatrixCoinEconomyModule { }
