export interface ExecutiveSnapshotDTO {
  meta: {
    timestamp: string; // ISO 8601
    mode: 'LIVE' | 'SCENARIO';
    data_quality: 'COMPLETE' | 'INSUFFICIENT';
  };

  indicators: {
    structural_stability: SignalBlock;
    functional_coverage: SignalBlock;
    cpk_alignment: SignalBlock;
    intellectual_support: SignalBlock;
  };
}

export interface SignalBlock {
  level: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY'; // GRAY = Insufficient Data
  summary: string;
  delta?: 'IMPROVED' | 'WORSENED' | 'UNCHANGED'; // Only in SCENARIO mode
}
