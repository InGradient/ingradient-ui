/**
 * Fixtures registry — § 14.2 / § 14.3 / § 25.2 의 "Fixture 자동 연결".
 *
 * 각 page story 가 explicit import 대신 service + version 으로 fixture 접근.
 * 타입 추론 자동: getFixtures('platform', '0.0.1') 의 결과는 PlatformFixtures.
 *
 * 기존 explicit import 도 그대로 동작 — 점진적 마이그레이션 가능.
 */

import {
  catalogScenarios,
  classScenarios,
  createProjectScenarios,
  mockUsers,
  platformLoginScenarios,
  platformSignupScenarios,
  platformV001Preset,
} from '../fixtures/platform/0.0.1'
import { edgeV001Preset, mockDatasets, mockDevices, mockLicense } from '../fixtures/edge/0.0.1'
import { medicalV001Preset, mockCases, mockClasses } from '../fixtures/medical/0.0.1'

export interface PlatformFixtures {
  users: typeof mockUsers
  auth: {
    login: typeof platformLoginScenarios
    signup: typeof platformSignupScenarios
  }
  catalog: typeof catalogScenarios
  classes: typeof classScenarios
  createProject: typeof createProjectScenarios
  preset: typeof platformV001Preset
}

export interface EdgeFixtures {
  devices: typeof mockDevices
  datasets: typeof mockDatasets
  license: typeof mockLicense
  preset: typeof edgeV001Preset
}

export interface MedicalFixtures {
  cases: typeof mockCases
  classes: typeof mockClasses
  preset: typeof medicalV001Preset
}

export interface FixturesRegistry {
  platform: { '0.0.1': PlatformFixtures }
  edge: { '0.0.1': EdgeFixtures }
  medical: { '0.0.1': MedicalFixtures }
}

export const fixturesRegistry: FixturesRegistry = {
  platform: {
    '0.0.1': {
      users: mockUsers,
      auth: {
        login: platformLoginScenarios,
        signup: platformSignupScenarios,
      },
      catalog: catalogScenarios,
      classes: classScenarios,
      createProject: createProjectScenarios,
      preset: platformV001Preset,
    },
  },
  edge: {
    '0.0.1': {
      devices: mockDevices,
      datasets: mockDatasets,
      license: mockLicense,
      preset: edgeV001Preset,
    },
  },
  medical: {
    '0.0.1': {
      cases: mockCases,
      classes: mockClasses,
      preset: medicalV001Preset,
    },
  },
}

/**
 * service + version → fixture bundle. 타입 추론 자동.
 */
export function getFixtures<S extends keyof FixturesRegistry, V extends keyof FixturesRegistry[S]>(
  service: S,
  version: V,
): FixturesRegistry[S][V] {
  return fixturesRegistry[service][version]
}
