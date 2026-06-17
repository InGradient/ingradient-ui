# Phase 10 — Design Handoff 메타 + Scenario Matrix

**상위 문서**: [storybook_architecture_restructure.md § 22, § 23](../storybook_architecture_restructure.md)
**위험도**: 낮음 (story 메타만 추가)
**선행 조건**: Phase 9 (page stories 존재)
**후속 단계**: V1+ (Scenario Matrix 자동 검증 / Visual regression)

---

## 1. 목적

§ 22 의 design handoff 정보를 page story 의 메타로 노출. § 23 의 Scenario Matrix (required scenarios 체크리스트) 도 같은 메타에 포함. 디자인 확정 후 platform 개발자가 storybook 문서 보고 implementation 시작 가능.

## 2. Handoff 정보 (§ 22.1)

각 page story 에 다음 정보를 명시:
- 적용 대상 서비스 (service)
- 적용 대상 버전 (version)
- 기준 Story 이름 (referenceStory)
- 사용 Preset (preset id)
- 사용 Fixtures (fixturesPath)
- 필수 검증 Scenario (requiredScenarios) — § 23 의 matrix
- 주요 Interaction (interactions)
- 개발 연결 포인트 (platformIntegration)

## 3. 설계

### 3.1 Helper

`stories/support/handoff.ts`:
```ts
export interface Handoff {
  service: 'platform' | 'edge' | 'medical'
  version: string
  page: string
  referenceStory: string
  preset: string         // 'platform-0.0.1'
  fixturesPath: string   // 'stories/fixtures/platform/0.0.1/...'
  requiredScenarios: string[]
  interactions: string[]
  platformIntegration: string[]
}

export function defineHandoff(handoff: Handoff): Parameters
```

`Parameters` 는 Storybook 의 parameters object — `docs.description.component` 에 markdown 으로 변환된 handoff section 을 추가.

### 3.2 Story 적용

각 page story 의 meta:
```ts
const handoff = defineHandoff({...})
const meta = {
  title: '...',
  parameters: { ...handoff, layout: 'fullscreen' },
}
```

### 3.3 Scenario Matrix

`requiredScenarios` 가 § 23 의 checklist. 현재는 정적 markdown 으로 표시. 추후 (V1+) addon 으로 자동 검증.

## 4. 작업 체크리스트

### 4.1 Helper
- [ ] `stories/support/handoff.ts` — `Handoff` interface + `defineHandoff()` (markdown 생성)

### 4.2 Platform page stories 적용 (5)
- [ ] Login, Signup, Catalog, ClassManage, CreateProject

### 4.3 Edge page stories 적용 (3)
- [ ] Login, License, DatasetSelect

### 4.4 Medical page stories 적용 (3)
- [ ] Auth, ProjectPicker, ClassWorkspace

## 5. 검증
- [ ] typecheck 통과
- [ ] Storybook docs page 에서 각 page story 의 handoff 정보가 markdown 으로 노출
- [ ] Required Scenarios 목록이 명시되어 있음
- [ ] Platform Integration 라인이 platform 개발자가 바로 적용 가능한 수준으로 구체적

## 6. 산출물
- `stories/support/handoff.ts`
- 11개 page story 의 handoff 메타
- 본 plan 문서

## 7. 제외 (V1+)
- Scenario Matrix 자동 Pass/Fail UI
- Visual regression 연동
- Designer Comment Panel
- handoff 정보 별도 export (JSON, PR description)
