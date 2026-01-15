import { StageHistory } from '../domain';
import { SLAThresholds, SLAReport, SLAResult, SLAStatus } from './types';

export interface SLACalculatorInput {
    readonly history: StageHistory[];
    readonly thresholds: SLAThresholds;
}

/**
 * Calculates SLA status per stage.
 *
 * Pure function. No side effects.
 * Returns per-status facts only.
 */
export function calculateSLA(input: SLACalculatorInput): SLAReport {
    const { history, thresholds } = input;

    // Aggregate duration by status
    const durationByStatus: Record<string, number> = {};

    for (const record of history) {
        const status = record.fromStatus;
        const durationSec = Math.floor(
            (record.endedAt.getTime() - record.startedAt.getTime()) / 1000
        );

        if (durationByStatus[status] === undefined) {
            durationByStatus[status] = 0;
        }
        durationByStatus[status] += durationSec;
    }

    // Calculate SLA status per status
    const statusSLA: Record<string, SLAResult> = {};

    for (const [status, durationSec] of Object.entries(durationByStatus)) {
        const threshold = thresholds[status];
        let slaStatus: SLAStatus = 'OK';

        if (threshold) {
            if (durationSec >= threshold.breachSec) {
                slaStatus = 'BREACH';
            } else if (durationSec >= threshold.warnSec) {
                slaStatus = 'WARNING';
            }
        }

        statusSLA[status] = {
            durationSec,
            status: slaStatus,
        };
    }

    return { statusSLA };
}
