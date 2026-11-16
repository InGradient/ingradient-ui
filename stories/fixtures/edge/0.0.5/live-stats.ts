// Statics "Live status" — 0.0.6 stories only (WorkspaceSceneArgs.staticsLive), mirroring the real app
// (ingradient-edge features/stats/LiveStatsSection, labels from locales/en.json statics.live.*).
// Numbers are synthetic and fixed so screenshots and the 4px check stay deterministic.
import type { LiveRange, LiveStats, LiveStatsLabels } from '@ingradient/edge-pages'

export const LIVE_STATS_LABELS: LiveStatsLabels = {
  section: 'Live status',
  loading: 'Loading...',
  note: (time) => `Refreshes every 10 s · last ${time} · times, PLC and charts cover the selected range; counts and failures are today`,
  range: { hour: '1 hour', day: '1 day', week: '1 week' },
  rangeAriaLabel: 'Live status range',
  todayAuto: 'Auto-inspect captures today',
  todayManual: 'Manual captures today',
  totalSub: (seq, img) => `Total ${seq} · ${img} images`,
  errorsToday: 'Failed captures today',
  autoCapture: 'Auto capture time (median, s)',
  manualCapture: 'Manual capture time (median, s)',
  durationSub: (avg, p95, n) => `avg ${avg} · p95 ${p95} · ${n} runs`,
  plc: (limit) => `PLC response p95 (s, limit ${limit})`,
  plcSub: (avg, over, n) => `avg ${avg} · over limit ${over} / ${n}`,
  memory: 'Memory total (MB)',
  memorySub: (main, renderer, backend) => `main ${main} · renderer ${renderer} · backend ${backend}`,
  disk: 'Disk free (GB)',
  diskSub: (perDay, days) => `${perDay} GB/day · about ${days} days left`,
  autoChart: 'Auto-inspect — capture time · PLC response (s)',
  manualChart: 'Manual capture time (s)',
  memoryChart: 'Memory (MB)',
  seriesAuto: 'Auto',
  seriesManual: 'Manual',
  seriesPlc: 'PLC response',
  seriesMain: 'Main',
  seriesRenderer: 'Renderer',
  seriesBackend: 'Backend',
}

const BASE = Date.UTC(2026, 10, 2, 9, 0, 0)
const BUCKETS: Record<LiveRange, { count: number; stepMs: number }> = {
  hour: { count: 12, stepMs: 5 * 60_000 },
  day: { count: 24, stepMs: 3_600_000 },
  week: { count: 28, stepMs: 6 * 3_600_000 },
}
const wave = (i: number, base: number, amp: number) => Math.round((base + amp * Math.sin(i / 2)) * 100) / 100

/** Story axis text in UTC, so local and CI screenshots match. */
export function liveAxisUtc(iso: string, range: LiveRange): string {
  const t = iso.slice(11, 16)
  return range === 'week' ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))} ${iso.slice(11, 13)}h` : t
}

/** Deterministic live sample for a range; gaps (null) appear where a line should break. */
export function sampleLiveStats(range: LiveRange): LiveStats {
  const { count, stepMs } = BUCKETS[range]
  const at = (i: number) => new Date(BASE + (i - count + 1) * stepMs).toISOString()
  const gap = (i: number) => i % 7 === 3
  return {
    generated_at: new Date(BASE).toISOString(),
    range_ms: count * stepMs,
    today: { auto: { sequences: 412, images: 13596 }, manual: { sequences: 23, images: 759 }, unknown: { sequences: 0, images: 0 } },
    total: { auto: { sequences: 8214, images: 271062 }, manual: { sequences: 1503, images: 49599 }, unknown: { sequences: 4, images: 132 } },
    errors_today: 2,
    capture: {
      auto: { count: 412, avg_ms: 2140, median_ms: 2080, p95_ms: 2610 },
      manual: { count: 23, avg_ms: 31200, median_ms: 28900, p95_ms: 44100 },
    },
    plc: { count: 412, avg_s: 2.31, p95_s: 2.48, over_limit: 3, limit_s: 2.5 },
    recent: Array.from({ length: count }, (_, i) => ({
      at: at(i),
      auto_s: gap(i) ? null : wave(i, 2.1, 0.25),
      plc_s: gap(i) ? null : wave(i + 1, 2.3, 0.2),
      manual_s: gap(i) ? null : wave(i, 30, 6),
    })),
    samples: Array.from({ length: count }, (_, i) => ({
      at: at(i),
      main_mb: Math.round(wave(i, 180, 10)),
      renderer_mb: Math.round(wave(i + 2, 420, 30)),
      backend_mb: Math.round(wave(i + 4, 610, 25)),
      sys_mem_pct: 62,
      disk_free_gb: 214,
    })),
    disk: { free_gb: 214, used_per_day_gb: 9.6, days_left: 22 },
  }
}
