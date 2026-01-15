import { StageHistory } from '../domain';
import { BottleneckReport, StageDuration } from './types';

export interface BottleneckDetectorInput {
    readonly history: StageHistory[];
}

/**
 * Detects bottlenecks by analyzing stage durations.
 *
 * Pure function. No side effects.
 * No heuristics — only sorting and math.
 */
export function detectBottlenecks(input: BottleneckDetectorInput): BottleneckReport {
    const { history } = input;

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

    // Calculate total duration
    const totalDuration = Object.values(durationByStatus).reduce(
        (sum, d) => sum + d,
        0
    );

    // Build stage durations array
    const stagesByDuration: StageDuration[] = Object.entries(durationByStatus)
        .map(([status, durationSec]) => ({
            status,
            durationSec,
            percentOfTotal: totalDuration > 0
                ? Math.round((durationSec / totalDuration) * 100)
                : 0,
        }))
        .sort((a, b) => b.durationSec - a.durationSec);

    return { stagesByDuration };
}
