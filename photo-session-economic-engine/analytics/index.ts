/**
 * PSEE Analytics Layer - Barrel Export
 *
 * Pure functions for metrics calculation.
 * Read-only. No side effects.
 */

// Types
export type {
    SLAStatus,
    SLAThreshold,
    SLAThresholds,
    SLAResult,
    SLAReport,
    FlowMetricsResult,
    StageDuration,
    BottleneckReport,
} from './types';

// Functions
export { calculateFlowMetrics } from './FlowMetrics';
export type { FlowMetricsInput } from './FlowMetrics';

export { calculateSLA } from './SLACalculator';
export type { SLACalculatorInput } from './SLACalculator';

export { detectBottlenecks } from './BottleneckDetector';
export type { BottleneckDetectorInput } from './BottleneckDetector';
