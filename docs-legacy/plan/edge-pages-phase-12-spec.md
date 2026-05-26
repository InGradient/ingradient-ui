---
title: Phase 12 — Story 정리 + 문서 동기화
purpose: Phase 0~11 의 edge view 추출 완료 후 storybook 정합성 점검, package-plan 갱신, ingradient-edge 측 마이그레이션 가이드 작성
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-11-spec.md
  - ./platform-pages-phase-6-spec.md
---

# Phase 12 — Story 정리 + 문서 동기화

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 12
> Phase 11 까지 50+ view 추출 완료. **본 phase 는 추출 완성도 검증 + 문서 sync 만** — 코드 변경 거의 없음. Phase 13 (ingradient-edge 마이그레이션) 직전 정리 단계.

---

## 1. 목적

Phase 0~11 의 edge view 추출 후 다음 정합성 검증 및 문서 작업:

1. storybook story 가 모두 `@ingradient/edge-pages` import 만 사용하는지 grep
2. 모든 view file < 200 줄 재확인
3. 빌드 / typecheck / lint 회귀 점검
4. `packages/edge-pages/src/index.ts` re-export 정합성 점검
5. [edge-pages-package-plan.md](./edge-pages-package-plan.md) §11 의 phase 진행 현황 갱신
6. 신규 `docs/plan/edge-pages-usage.md` 작성 — ingradient-edge 측 마이그레이션 가이드

---

## 2. 작업 항목

### 2.1 Story import 정합성 점검 (grep)

모든 edge story 가 `@ingradient/edge-pages` import 만 사용하는지 확인:

```bash
find stories/pages/edge -name "*.stories.tsx" -exec grep -L "@ingradient/edge-pages" {} \;
```

기대: 매칭 0 (모든 story 가 edge-pages import 함).

storybook 안에 inline scene mockup 잔재 0:

```bash
grep -rnE "function.*Scene.*\(.*\).*\{|const.*Scene.*=.*\(.*\).*=>" stories/pages/edge/0.0.1/
```

기대: 0 match — Phase 1~11 에서 모든 inline scene 제거.

ui pattern 직접 조립 잔재 0:

```bash
grep -rnE "<(SectionPanel|Stack|Grid|Inline|Card)" stories/pages/edge/0.0.1/*.stories.tsx
```

기대: 0 match — story 가 직접 ui pattern 을 조립하지 않고 view 만 사용.

### 2.2 view 줄 수 재점검

```bash
find packages/edge-pages/src -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 200 { print }'
```

기대: 0 match. Phase 별로 분해했으나 11 phase 누적되며 누락 가능.

### 2.3 view 의 금지 import 재점검

```bash
grep -rE "useTranslation|window\.electron|i18next|useAuthStore|useDeviceStore|useCameraStore|useDatasetStore|useCaptureStore|useWorkspaceUIStore|useSequencePanelStore|useSamRoiStore|useCaptureLogStore|useSystemStatsStore|useSyncStore|useImageActions|useImages|useConnectionWorkflow|useNicOperations|fetch\(|localStorage|sessionStorage" packages/edge-pages/src/
```

기대: 0 match.

선택적 허용:
- `useEffect` / `useCallback` / `useRef` — visual-only state 한정 (Phase 5 의 grep 정책 참조)
- `useToast` (`@ingradient/ui` 의 UI infra) — Phase 6 에서 container 로 이동했으나 잔재 확인

### 2.4 빌드 / 회귀 점검

```bash
cd packages/edge-pages && npx tsc --noEmit
cd packages/edge-pages && npm run build
cd ../.. && npx tsc --noEmit -p tsconfig.json
npm run build:package    # workspace 둘 다 빌드
npm run build:storybook
npm run lint
```

모두 통과해야 함.

### 2.5 `packages/edge-pages/src/index.ts` re-export 정합성

```ts
// 12 phase 누적 export 확인
export * from './login'                     // Phase 1
export * from './license'                   // Phase 2
export * from './dataset-select'            // Phase 3
export * from './dataset-modals'            // Phase 3
export * from './chrome'                    // Phase 4
export * from './workspace'                 // Phase 5
export * from './capture'                   // Phase 6
export * from './images'                    // Phase 7
export * from './labeling'                  // Phase 7
export * from './statics'                   // Phase 8
export * from './settings'                  // Phase 9
export * from './connection'                // Phase 10
export * from './labeling-panel'            // Phase 11
export * from './log'                       // Phase 11
export * from './system'                    // Phase 11
```

각 sub-folder 의 `index.ts` 도 모든 view + types 가 export 되는지 점검:

```bash
for d in packages/edge-pages/src/*/; do
  echo "=== $d ==="
  ls "$d"*.tsx 2>/dev/null | xargs -I {} basename {} .tsx
  echo "--- exports in index.ts ---"
  cat "$d/index.ts"
done
```

누락된 view 또는 type 있으면 추가.

### 2.6 sub-export 별 size 점검

```bash
du -sb packages/edge-pages/lib/index.js
```

기대: recharts / @ingradient/ui 가 external 처리되어 lib 자체는 수십 KB 수준 (실제 view JSX 만).

### 2.7 `lib/` 출력 d.ts 점검

```bash
cat packages/edge-pages/lib/index.d.ts | head -30
```

모든 view 의 props type 이 export 되는지 확인.

### 2.8 package-plan 문서 업데이트

[edge-pages-package-plan.md](./edge-pages-package-plan.md) §11 (마이그레이션 단계) 의 Phase 0~11 상태를 ⏳ → ✅ 로 갱신. 각 phase 의 spec 링크 + 완료 요약 (파일 수, scenario 수, 줄 수) 1~2 줄 추가.

§15 (다음 액션) 을 Phase 13 (ingradient-edge 마이그레이션) 으로 갱신.

### 2.9 `edge-pages-extraction-roadmap.md` §2 갱신

§2 의 "현재 상태 (2026-05-18)" 를 추출 완료 상태로 갱신:

```
| 영역 | 추출 전 | 추출 후 |
|---|---|---|
| Workspace.tsx | 933 줄 | container 잔류 (hook + IPC), view 는 edge-pages/workspace/ 8 파일 |
| ImagesView.tsx | 1223 줄 | edge-pages/images/ 15 파일 |
| BBoxCanvas.tsx | 701 줄 | edge-pages/labeling/ 12 파일 |
| ... |
```

§7 (Verification 기준) 의 grep 룰을 본 phase 의 §2.3 와 일치하게 보강.

### 2.10 신규 사용 가이드 작성

`docs/plan/edge-pages-usage.md` 신규 — ingradient-edge 측 개발자가 view 를 어떻게 import / props 주입 / 마이그레이션하는지 안내.

구성:

#### 1. Quick start
- `package.json` 에 `@ingradient/edge-pages` dependency 추가 (file: 또는 tgz)
- `scripts/update-ui.mjs` 와 `sync-ui.mjs` 확장 (edge-pages 도 sync) — 코드 예시 포함
- 첫 import 예시

#### 2. 50+ view 의 props 시그니처 요약 표
- 영역별 (login / license / dataset / chrome / workspace / capture / images / labeling / statics / settings / connection / labeling-panel / log / system) 묶음
- 각 view 의 1 줄 설명 + props 카테고리 (state / labels / slots / callbacks)

#### 3. 페이지별 마이그레이션 예시
- LoginScreen (가장 단순, Phase 1 의 [package-plan §7.2](./edge-pages-package-plan.md) 예시 재인용)
- DatasetSelectScreen (multi-modal slot)
- Workspace (slot 5개 — capture/images/statics/setup/labeling)
- BBoxCanvas (props group 패턴)

#### 4. Hook → props 변환 패턴
- `useLogin()` → `<LoginView {...hookProps} />` group spread
- `useLoginLabels()` 같은 i18n helper hook 패턴
- store subscribe → props 변환 패턴

#### 5. sync 스크립트 예시
- `scripts/update-ui.mjs` 의 edge-pages 추가 diff
- 또는 npm workspace link 방식

#### 6. 검증 체크리스트
- 각 페이지 마이그레이션 후 수동 검증 항목
- e2e / smoke test 가이드

### 2.11 (옵션) README 업데이트

`README.md` 에 `@ingradient/edge-pages` 의 존재를 한 줄 명시. 필수 아님.

---

## 3. 변경 파일

### 3.1 신규 (1 file)

- `docs/plan/edge-pages-usage.md`

### 3.2 수정 (2~3 file)

- `docs/plan/edge-pages-package-plan.md` — §11 진행 현황 + §15 다음 액션
- `docs/plan/edge-pages-extraction-roadmap.md` — §2 현재 상태 + §7 verification
- (옵션) `README.md`

### 3.3 코드 변경 (최소)

검증 단계에서 발견된 누락 (예: re-export 빠짐) 만 수정. 새 view / sub-view 추가는 본 phase 범위 밖.

### 3.4 건드리지 않음

- `packages/edge-pages/src/*` — 검증만, 변경 없음 (누락 수정 외)
- ingradient-edge repo — Phase 13
- `stories/pages/edge/*` — 검증만, 변경 없음

---

## 4. 실행 순서

1. §2.1 ~ §2.7 의 grep / 빌드 / 회귀 점검 (read-only)
2. 발견된 누락 / 위반 수정
3. §2.8 package-plan 문서 업데이트
4. §2.9 extraction-roadmap 갱신
5. §2.10 신규 usage 가이드 작성
6. 최종 빌드 / typecheck / lint 재실행

---

## 5. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `grep -L "@ingradient/edge-pages" stories/pages/edge/**/*.stories.tsx` | 매칭 0 |
| 2 | `grep -rnE "function.*Scene.*\(" stories/pages/edge/0.0.1/` | 0 match |
| 3 | `find packages/edge-pages/src -type f \| xargs wc -l \| awk '$1>200 {print}'` | 0 match |
| 4 | 금지 import grep (§2.3) | 0 match |
| 5 | `cd packages/edge-pages && npm run build` | exit 0 |
| 6 | `npm run build:package` (root) | exit 0 — platform-pages + edge-pages 둘 다 빌드 |
| 7 | `npm run build:storybook` | exit 0 |
| 8 | `npm run lint` | exit 0 |
| 9 | `docs/plan/edge-pages-usage.md` 존재 | ✅ |
| 10 | `docs/plan/edge-pages-package-plan.md` §11 상태 갱신 | ⏳ 없음 |

---

## 6. 성공 기준

- 검증 1~10 통과
- 50+ view 가 모두 `@ingradient/edge-pages` 에 export
- 12 영역 (login / license / dataset-select / dataset-modals / chrome / workspace / capture / images / labeling / statics / settings / connection / labeling-panel / log / system) 모두 검증 완료
- 모든 storybook story 가 edge-pages import only
- 모든 view file < 200 줄
- 모든 view 가 store/IPC/i18n hook/fetch/storage 의존 0
- usage 가이드 + package-plan 진행 현황 갱신 완료
- Phase 13 (ingradient-edge 마이그레이션) 진입 가능 상태

---

## 7. 리스크

### 7.1 누락된 inline scene 발견

위험: 11 phase 누적되며 어느 story 의 inline scene 한 곳이라도 잔재 가능.

대응:
- §2.1 의 grep 으로 즉시 발견
- 해당 story 의 phase spec 참조 → view 추출 + scene 제거
- 단순 누락 (10 줄 이내) 이면 본 phase 안에서 즉시 수정 (예외적 허용)

### 7.2 view file 200줄 초과 발견

위험: phase 별로 200 룰 검증했으나 누적 import / type 추가로 미세 초과 가능.

대응:
- §2.2 의 grep 으로 즉시 발견
- 초과분이 작으면 splitter helper / sub-view 로 즉시 분해
- 본질적으로 큰 view 면 별도 PR (본 phase 범위 밖)

### 7.3 사용 가이드 작성 시 잘못된 예시

위험: usage.md 의 예시 코드가 실제 view shape 와 다를 수 있음.

대응:
- 예시 코드를 실제 storybook story 에서 복사
- 또는 실제 ingradient-edge 의 (Phase 13 후 예상되는) 컨테이너 코드 1:1
- 본 phase 안 코드 review

### 7.4 platform-pages-usage.md 와 중복

위험: 두 usage 가이드가 비슷한 내용 (Quick start, 마이그레이션 패턴) 반복.

대응:
- edge-pages-usage.md 는 edge 특유 내용만 (i18n labels 패턴, electron IPC 추상화, sync 스크립트 확장)
- platform-pages-usage.md 와 공통 부분은 cross-link
- 중복 피하되 self-contained 유지

### 7.5 lib 산출물 size 폭증

위험: 50+ view 가 누적되어 lib/index.js 가 수백 KB 가까이 가면 tree-shaking 영향.

대응:
- §2.6 size 확인
- recharts / @ingradient/ui external 처리 검증 (Phase 8 의 검증 #10 재실행)
- size 가 예상보다 크면 tsup external 점검

### 7.6 `packages/edge-pages/src/index.ts` 의 export 충돌

위험: 12 phase 의 sub-folder 들이 같은 type 이름 (예: `Labels`) export 시 충돌.

대응:
- 각 phase 의 types.ts 가 prefix (예: `LoginLabels` / `LicenseLabels`) 사용 — 충돌 없도록 설계 (이미 본 spec 시리즈 에서 일관 적용)
- 검증 #4 typecheck 에서 즉시 잡힘

### 7.7 ingradient-edge 영향 0 확인

위험: 본 phase 도 ingradient-edge 측 변경 없음을 확인 필요.

대응:
- ingradient-edge `npx tsc --noEmit` 옵션 실행 (검증 표 추가는 안 함 — 본 phase 가 edge repo 건드리지 않으므로 trivially 통과)
- 단 sync 스크립트 사전 점검 (Phase 13 에서 변경 예정)

---

## 8. Rollback

본 phase 는 문서 + 검증만이라 rollback 영향 작음:
- `docs/plan/edge-pages-usage.md` 삭제
- `docs/plan/edge-pages-{package-plan,extraction-roadmap}.md` 갱신 revert
- 검증 단계 발견한 코드 수정 (재export 추가 등) 도 git revert

---

## 9. 종료 후 상태

- `@ingradient/edge-pages` 추출 완성도 100% 검증
- storybook 의 모든 edge page story 가 view import only
- 모든 view < 200 줄, 의존성 0 (store / IPC / i18n hook / fetch / storage)
- 신규 사용 가이드 + 갱신된 package-plan / extraction-roadmap
- Phase 13 (ingradient-edge 측 컨테이너 마이그레이션, 별도 repo) 진입 준비 완료

---

## 10. 다음 액션

1. 본 spec ok
2. 실행 (§4 의 6 step) — 대부분 read-only grep + 문서 작성
3. 검증 (§5 의 10 step)
4. Phase 13 spec 작성 (`edge-pages-phase-13-spec.md`) — ingradient-edge repo 측. 별도 repo 작업이라 시작 시점 결정 필요.
