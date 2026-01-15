import { SessionStatus } from '../domain';

/**
 * SLA status for a stage.
 */
export type SLAStatus = 'OK' | 'WARNING' | 'BREACH';

/**
 * SLA thresholds per status.
 * Key: SessionStatus string value
 */
export interface SLAThreshold {
    readonly warnSec: number;
    readonly breachSec: number;
}

export type SLAThresholds = Record<string, SLAThreshold>;

/**
 * SLA result for a single status.
 */
export interface SLAResult {
    readonly durationSec: number;
    readonly status: SLAStatus;
}

/**
 * Output of SLACalculator.
 */
export interface SLAReport {
    readonly statusSLA: Record<string, SLAResult>;
}

/**
 * Output of FlowMetrics.
 */
export interface FlowMetricsResult {
    readonly timeInCurrentStatusSec: number;
    readonly totalCycleTimeSec: number;
    readonly durationByStatus: Record<string, number>;
    readonly handoffCount: number;
}

/**
 * Single stage duration info.
 */
export interface StageDuration {
    readonly status: string;
    readonly durationSec: number;
    readonly percentOfTotal: number;
}

/**
 * Output of BottleneckDetector.
 */
export interface BottleneckReport {
    readonly stagesByDuration: StageDuration[];
}
