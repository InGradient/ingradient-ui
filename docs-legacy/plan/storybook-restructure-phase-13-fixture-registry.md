# Phase 13 — Fixture 자동 연결 (V1 § 25.2)

**상위 문서**: [storybook_architecture_restructure.md § 14.2/14.3, § 25.2](../storybook_architecture_restructure.md)
**위험도**: 낮음 (helper + 1 story 갱신 예시)
**선행 조건**: Phase 9 (page stories + fixtures), Phase 10 (handoff)
**후속 단계**: V2 — Save as Page Config

---

## 1. 목적

§ 14.2 / § 14.3 의 약속 — "선택값은 stories/fixtures/{service}/{version} 와 연결된다" — 을 구현. 현재는 각 story 가 명시적으로 import (`import { catalogScenarios } from '../../../fixtures/platform/0.0.1/catalog-scenarios'`). 중앙 registry 를 통해 service+version 으로 자동 접근 가능하게 한다.

## 2. 설계

### 2.1 registry

`stories/support/fixtures-registry.ts`:
```ts
export interface ServiceFixtures {
  platform: { '0.0.1': PlatformFixtures }
  edge: { '0.0.1': EdgeFixtures }
  medical: { '0.0.1': MedicalFixtures }
}
export const fixturesRegistry: ServiceFixtures = { ... }
export function getFixtures<S, V>(service: S, version: V): ServiceFixtures[S][V]
```

각 service 마다 `<Service>Fixtures` interface — 그 service 의 모든 fixture 모듈을 묶음:
```ts
export interface PlatformFixtures {
  users: typeof mockUsers
  auth: typeof platformAuthScenarios
  catalog: typeof catalogScenarios
  classes: typeof classScenarios
  createProject: typeof createProjectScenarios
  preset: typeof platformV001Preset
}
```

### 2.2 사용 패턴

기존:
```ts
import { catalogScenarios } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
const scene = catalogScenarios[args.scenario]
```

새 패턴:
```ts
import { getFixtures } from '../../../support/fixtures-registry'
const fixtures = getFixtures('platform', '0.0.1')
const scene = fixtures.catalog[args.scenario]
```

차이:
- import 1 줄로 모든 fixture 접근
- service/version 변경 시 한 곳만 수정
- 타입 자동 추론 (Service union 으로 다른 service 모듈도 IDE autocomplete)

### 2.3 호환성

기존 explicit import 도 그대로 동작 — registry 는 추가 옵션. 점진적 마이그레이션.

## 3. 작업 체크리스트

- [ ] `stories/support/fixtures-registry.ts` — ServiceFixtures interface + fixturesRegistry + getFixtures helper
- [ ] Login.stories 를 registry 사용으로 갱신 (예시)
- [ ] 본 plan 문서

## 4. 검증
- [ ] typecheck 통과 (타입 추론 정상)
- [ ] Login story 가 registry 통해 동일하게 렌더
- [ ] 다른 story 는 영향 없음 (기존 explicit import 그대로)

## 5. 산출물
- 1 helper + 1 예시 + plan

## 6. 제외 (V2+)
- 모든 story 일괄 마이그레이션 (필요 시 점진적으로)
- useFixtures() hook 형태 (Storybook context 기반 자동 해석) — 현재 helper 패턴으로 충분
