# Phase 3 — Token 재구조 (core / themes / brands / density / modes)

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: **높음** (모든 컴포넌트가 토큰을 참조 → consumer 영향 큼)
**선행 조건**: Phase 1 완료. Phase 2 는 병렬 가능하나 Phase 3 충돌 가능성 있음 → 순차 진행 권장
**후속 단계**: [Phase 4 — Preset 시스템](./storybook-restructure-phase-4-presets.md)

---

## 1. 목적

`src/tokens/` 를 상위 문서 3.1 의 7-카테고리 구조로 재구조한다.

```
core / semantic / themes / brands / density / modes / presets
```

`presets/` 는 Phase 4 에서 채우고, Phase 3 은 **나머지 6개 카테고리의 폴더 + 첫 토큰 세트** 까지 완성한다.

---

## 2. 현재 상태 분석 (Step 3.1 — 인벤토리)

작업 시작 전 반드시 수행:

```
src/tokens/
├─ foundations/   # 추정: 절대값 (color, spacing, font)
├─ globals/       # 추정: ?
├─ semantic/      # 의미 기반 토큰
├─ variants/      # 추정: ?
├─ recipes/       # 추정: CSS recipe (mixin)
├─ index.ts
├─ README.md
└─ tokens.stories.tsx
```

**Step 3.1 체크리스트** — 각 폴더의 실제 내용을 인벤토리:
- [ ] `src/tokens/foundations/` 안의 파일 목록 + 각 파일이 export 하는 내용 (4~6개 변수명 샘플)
- [ ] `src/tokens/globals/` 동일
- [ ] `src/tokens/semantic/` 동일
- [ ] `src/tokens/variants/` 동일
- [ ] `src/tokens/recipes/` 동일
- [ ] `src/tokens/index.ts` 가 외부로 export 하는 entry 식별

산출물: `docs/plan/storybook-restructure-phase-3-inventory.md` (인벤토리 표).

---

## 3. 목표 매핑 (Step 3.2)

인벤토리 결과를 바탕으로 매핑 표 작성. 초기 가설:

| 현재 폴더 | 목표 폴더 | 비고 |
|---|---|---|
| `foundations/` | `core/` | 절대값 — 거의 1:1 |
| `globals/` | (조사 필요) | CSS 변수 정의일 가능성 |
| `semantic/` | `semantic/` | 그대로 |
| `variants/` | `themes/` 또는 `modes/` | 내용에 따라 분기 |
| `recipes/` | (별도) — `primitives/` 로 이동 가능성 | 토큰이 아니라 CSS mixin |
| (없음) | `brands/` 신규 | finemtech / samsung / default 골격만 |
| (없음) | `density/` 신규 | comfortable / compact / ultra-dense 골격만 |
| (없음) | `modes/` 신규 | light / dark / high-contrast (variants 일부 흡수 가능) |

**Step 3.2 결정 사항**:
- [ ] `globals/` 의 운명 결정 (흡수 / 폐기 / 유지)
- [ ] `variants/` 가 `themes/` 인지 `modes/` 인지 결정 (또는 분리)
- [ ] `recipes/` 가 tokens 폴더에 남을지 `primitives/` 로 이동할지 결정
- [ ] CSS 변수 (`--ig-*`) 생성 방식 변경 여부

---

## 4. 마이그레이션 실행 (Step 3.3)

### 4.1 폴더 생성 + 신규 카테고리 골격
- [ ] `src/tokens/brands/` + `default.ts` (기본 brand, 빈 override)
- [ ] `src/tokens/brands/index.ts` — `default` re-export
- [ ] `src/tokens/density/` + `comfortable.ts` (default), `compact.ts` (control-height 축소), `ultra-dense.ts` (placeholder)
- [ ] `src/tokens/density/index.ts`
- [ ] `src/tokens/modes/` + `light.ts`, `dark.ts` (기존 variants 흡수), `high-contrast.ts` (placeholder)
- [ ] `src/tokens/modes/index.ts`

### 4.2 기존 폴더 이전
각 항목은 별도 commit 권장 (rollback 용이):
- [ ] `foundations/` → `core/` 로 rename (`git mv`)
- [ ] `core/` index.ts + 모든 import 경로 업데이트
- [ ] `semantic/` 그대로 유지 — import 경로 변화 없음
- [ ] `variants/` 내용 분류 → `themes/` 또는 `modes/` 로 이동, 빈 `variants/` 삭제
- [ ] `globals/` 결정에 따라 처리
- [ ] `recipes/` 결정에 따라 처리 (이동 시 src/primitives 영향 확인)

### 4.3 consumer 업데이트
- [ ] `src/index.ts` export 갱신
- [ ] 패키지 entry (`@ingradient/ui/tokens`) 가 노출하는 API 유지 — 외부 consumer (platform 등) 영향 최소화
- [ ] grep 으로 `from '@ingradient/ui/tokens'` 사용처 전체 파악, breaking change 검토
- [ ] platform / edge / medilabel / auth-service 에서 import 경로 변경 필요한지 확인

### 4.4 CSS 변수 매핑
- [ ] `--ig-*` CSS 변수 이름은 가능한 유지 (외부 consumer 영향 회피)
- [ ] 새 카테고리 (density, brands) 의 CSS 변수 prefix 결정 (예: `--ig-density-*`)

---

## 5. 검증 기준

### 5.1 빌드 / 타입
- [ ] `npm run build` 정상
- [ ] `npm run typecheck` 정상
- [ ] `npm run build-storybook` 정상

### 5.2 시각 회귀
- [ ] tokens.stories.tsx 가 모든 새 카테고리를 노출
- [ ] foundations 페이지 (storybook) 가 깨지지 않음
- [ ] Phase 2 의 4개 story 가 시각적으로 동일 (스크린샷 대조)

### 5.3 외부 consumer
- [ ] platform 빌드 정상 (`cd ../ingradient-platform && npm run build`)
- [ ] medilabel / auth-service / edge 영향 확인
- [ ] @ingradient/ui patch version 올리고 changelog 작성

---

## 6. 산출물

- `src/tokens/` 7-카테고리 트리 (presets 제외 6개 채움)
- 인벤토리 문서 (`storybook-restructure-phase-3-inventory.md`)
- 매핑 결정 문서 (이 파일에 표 추가 또는 별도)
- 외부 consumer migration guide (필요 시)

---

## 7. 롤백 전략

- 각 step 을 별도 commit 으로 분리
- Step 4.2 의 폴더 rename 은 `git mv` 사용 — history 보존
- 빌드 깨지면 직전 commit 으로 revert
- 외부 consumer 영향 발견 시 1) ingradient-ui 에서 호환 alias 추가 또는 2) consumer 측 업데이트 우선

---

## 8. 제외 (다음 phase)

- `presets/` 폴더 내부 — Phase 4
- 실제 brand (finemtech, samsung) 토큰 값 — 디자이너 작업 필요, Phase 4+ 에서 다룸
- ThemeProvider 가 preset 을 적용하는 메커니즘 — Phase 4
- density 의 모든 컴포넌트 적용 — Phase 5 이후 점진적
