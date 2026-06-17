import type { SystemStats } from '@ingradient/edge-pages'

export const NORMAL_STATS: SystemStats = { cpu: 32, memory: 45, disk: 58 }
export const HIGH_STATS: SystemStats = { cpu: 88, memory: 92, disk: 78 }
export const CRITICAL_STATS: SystemStats = { cpu: 95, memory: 97, disk: 93 }
