/**
 * AI Ops Types (Step 12 Canonical)
 * 
 * Contracts for Registry-Driven AI Operations.
 * Enforces strictly typed inputs (Registry derived) and outputs (Advisory).
 */

import { GraphResponseDto } from '../graph/graph.service';
import { ImpactReportDto } from '../impact/impact.service';

// =============================================================================
// INPUT CONTRACT
// =============================================================================

export interface AIOpsInput {
    root: {
        entityType: string;
        id: string;
    };
    graph: GraphResponseDto;        // Step 10 Output
    impact: ImpactReportDto;        // Step 11 Output
    // snapshot?: MetricsSnapshot;  // Future extensibility
}

// =============================================================================
// OUTPUT CONTRACT
// =============================================================================

export type AIRecommendationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AIRecommendationCategory = 'risk' | 'stability' | 'optimization' | 'compliance';

export interface AIOpsRecommendation {
    id: string; // Deterministic Hash
    category: AIRecommendationCategory;
    severity: AIRecommendationSeverity;
    title: string;
    reasoning: string;        // Human-readable explanation
    basedOn: {
        relations?: string[]; // Names of relations involved
        impacts?: string[];   // Types of impacts involved
        nodes?: string[];     // IDs of nodes involved (optional trace)
    };
    disclaimer: 'advisory-only';
}

export interface AIOpsResponse {
    recommendations: AIOpsRecommendation[];
    metadata: {
        analyzedAt: string;
        model: string;
        determinism: boolean;
    };
}
