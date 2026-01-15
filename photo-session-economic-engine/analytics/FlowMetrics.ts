import { Session, StageHistory } from '../domain';
import { FlowMetricsResult } from './types';

export interface FlowMetricsInput {
    readonly session: Session;
    readonly history: StageHistory[];
    readonly now: Date;
}

/**
 * Calculates flow metrics for a session.
 *
 * Pure function. No side effects.
 */
export function calculateFlowMetrics(input: FlowMetricsInput): FlowMetricsResult {
    const { session, history, now } = input;

    // Time in current status (from last update to now)
    const timeInCurrentStatusSec = Math.floor(
        (now.getTime() - session.updatedAt.getTime()) / 1000
    );

    // Total cycle time (from creation to now)
    const totalCycleTimeSec = Math.floor(
        (now.getTime() - session.createdAt.getTime()) / 1000
    );

    // Duration by status from history
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

    // Count unique role changes (handoffs)
    const roleChanges = new Set<string>();
    for (const record of history) {
        roleChanges.add(record.role);
    }
    const handoffCount = Math.max(0, roleChanges.size - 1);

    return {
        timeInCurrentStatusSec,
        totalCycleTimeSec,
        durationByStatus,
        handoffCount,
    };
}
