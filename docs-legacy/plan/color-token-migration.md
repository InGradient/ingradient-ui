---
plan: ingradient-ui color token 확장 + edge/platform raw rgba 마이그레이션
date: 2026-05-09
related:
  - ../../../ingradient-edge/docs/plan/frontend_styles_phase3.md
  - ../../../ingradient-platform/docs/plans/frontend_styles_phase3.md
  - ./toast-enhancement.md
---

# Color Token 확장 + 소비자 마이그레이션

## 배경

**소비자 측 raw rgba 누적**:
- edge: `rgba(...)` 262 곳
- platform: `rgba(...)` 242 곳

**핵심 문제는 token 부족 아님** — `@ingradient/ui/tokens/foundations/colors.ts` 에 이미:
- `white04, white06, white07, white08, white12, white18, white96`
- `blueTint12, blueTint14, blueTint16, blueTint18, blueTint28, blueTint38, blueTint42`
- `overlayBackdrop: 'rgba(4, 8, 14, 0.72)'`

→ **소비자가 token 안 쓰고 raw rgba 인라인** 이 진짜 문제.

추가로 다음 두 가지 정합 이슈 발견:

### Issue A: Brand blue 두 개 혼재

```
rgba(77, 136, 255, X)  ← ui 표준 (blue500 의 alpha)
rgba(74, 158, 255, X)  ← legacy / 다른 색
```

자주 쓰이는 변형:
- `rgba(77, 136, 255, 0.16)` 27 곳 (platform)
- `rgba(74, 158, 255, 0.2)` 15 곳 (platform)
- `rgba(74, 158, 255, 0.14)` 15 곳 (platform)

→ **`74,158,255` 사용처를 `77,136,255` 로 통일** 필요. 디자이너 합의 후 진행.

### Issue B: whitespace 불일치

같은 alpha 가 두 표기로 존재:
- `rgba(255, 255, 255, 0.08)` (with spaces)
- `rgba(255,255,255,0.08)` (no spaces)

→ token 으로 교체 시 자연 해소.

## 1. 기존 token 으로 매핑 (token 추가 안 함)

**원칙**: token 늘리면 관리 부담. 기존 token 으로 **가장 가까운 값** 매핑, 약간의 색/크기 차이 허용. 실행 후 시각 검증으로 이상 발견 시 그때 token 추가 검토.

### Mapping table (raw → 기존 token)

| raw rgba | 기존 token (CSS var) | 차이 |
|---|---|---|
| `rgba(255,255,255, 0.02)` | `var(--ig-color-white-04)` | +0.02 |
| `rgba(255,255,255, 0.03)` | `var(--ig-color-white-04)` | +0.01 |
| `rgba(255,255,255, 0.04)` | `var(--ig-color-white-04)` | 0 |
| `rgba(255,255,255, 0.05)` | `var(--ig-color-white-06)` | +0.01 |
| `rgba(255,255,255, 0.06)` | `var(--ig-color-white-06)` | 0 |
| `rgba(255,255,255, 0.07)` | `var(--ig-color-white-07)` | 0 |
| `rgba(255,255,255, 0.08)` | `var(--ig-color-white-08)` | 0 |
| `rgba(255,255,255, 0.10~0.11)` | `var(--ig-color-white-12)` | +0.02 |
| `rgba(255,255,255, 0.12)` | `var(--ig-color-white-12)` | 0 |
| `rgba(255,255,255, 0.18)` | `var(--ig-color-white-18)` | 0 |
| `rgba(0,0,0, 0.12~0.35)` | `var(--ig-color-modal-backdrop)` 또는 raw 유지 | semantic 검토 |
| `rgba(0,0,0, 0.5~0.72)` | `var(--ig-color-modal-backdrop)` (0.72) | 가까운 곳만 |
| `rgba(77,136,255, 0.12)` | `var(--ig-color-blue-tint-12)` | 0 |
| `rgba(77,136,255, 0.14)` | `var(--ig-color-blue-tint-14)` | 0 |
| `rgba(77,136,255, 0.16)` | `var(--ig-color-blue-tint-16)` | 0 |
| `rgba(77,136,255, 0.18)` | `var(--ig-color-blue-tint-18)` | 0 |
| `rgba(77,136,255, 0.28)` | `var(--ig-color-blue-tint-28)` | 0 |
| `rgba(74,158,255, X)` | 통일 → `rgba(77,136,255, X)` 후 token | brand blue 통일 |

### 매핑 안 함 (raw 유지)

- 매우 specific 한 곳 (e.g. specific shadow, chart color)
- 가까운 token 차이 0.05 이상 (시각 차이 명확)
- 0.45/0.6/0.7 같은 black overlay — token 없음, raw 유지 또는 일관 정리만 (`rgba(0,0,0,0.5)` 같은 표기 통일)

→ **ui PR 불필요**. 기존 token 으로 충분. 문제 발견 시 그때 추가 검토.

## 2. Brand blue 통일 거리

`74,158,255` 의 출처 확인:

```bash
# 점검 명령
grep -rn "rgba(74,\?\s?158,\?\s?255" frontend/ src/frontend/
```

→ legacy 색상인지, 의도적으로 다른 강조인지 디자이너에게 확인. **`77,136,255` 로 통일** 추천 (ui blue500 기반).

통일 시:
- 자동 방법: codemod 로 `rgba(74, 158, 255` → `rgba(77, 136, 255` 일괄 교체
- 수동 검증: 디자인 비교 (몇 곳은 의도적으로 다른 톤일 가능성)

## 3. 마이그레이션 작업 순서

### Phase A — ~~ui PR~~ (skip)

기존 token 으로 충분. ui 변경 없이 진행. 시각 검증 단계에서 필요 발견 시 그때 추가.

### Phase B — 소비자 audit + codemod 작성

도구:
1. **점검 grep**: 각 rgba 패턴 의 사용처 list
2. **codemod**: 자주 쓰이는 패턴 → token 교체. 예:
   - `rgba(255, 255, 255, 0.08)` → `var(--ig-color-white-08)` 또는 `import { foundationColors } from '@ingradient/ui/tokens'` + `${foundationColors.white08}`
3. **수동 검증**: 일부 raw 가 의도적 미세 변형인 경우 보존

소요: ~1-2시간 (audit + 정규식 codemod 작성 + 실행)

### Phase C — 소비자 마이그레이션

**PR 단위** (각 ~30 곳 수정):
- platform PR 1: `frontend/components/catalog/` styles
- platform PR 2: `frontend/components/gallery/` styles
- platform PR 3: `frontend/components/settings/` styles
- platform PR 4: `frontend/components/classes/, analysis/, dashboard/` styles
- edge PR 1: `src/frontend/components/capture/` styles
- edge PR 2: `src/frontend/components/settings/, log/` styles
- edge PR 3: 잔여 (TopBar, BottomBar, AccountMenu, dataset, system)

각 PR:
- codemod 실행 → 시각 diff 확인
- `npm run build` 또는 `npx tsc --noEmit`
- 수동 검증 (몇 화면 캡처 비교)

소요: 각 PR 30-60분, 총 7 PR ≈ 4-7 시간

### Phase D — Brand blue 통일

별도 PR (Phase C 완료 후):
1. 디자이너 합의: `74,158,255` 사용처를 `77,136,255` 로 통일 (또는 별도 색으로 ui 추가)
2. codemod: `rgba(74, ?158, ?255` → `rgba(77, 136, 255` (소비자만)
3. 시각 검증

소요: 1-2 시간 (디자이너 confirm 시간 별도)

## 4. 효과 추정

- 소비자 raw rgba: 504 → ~50 이하 (90% token 화)
- whitespace 불일치 자연 해소
- 다크모드 / theme switching 가능성 — token 기반 자동 적응 (현재는 raw 라 hardcode)
- 디자이너 한 곳 수정하면 양쪽 적용

## 5. 위험 / 고려사항

- **codemod false positive**: 의도적 미세 변형 (e.g. 특정 chart color, capture overlay specific) 은 별도 token 또는 raw 유지
- **brand blue 통일 거부**: 디자이너가 `74,158,255` 도 별도 의도라 주장 시 → ui 에 `accentAlt` 토큰 추가
- **CSS var vs JS import 선택**: styled-components 에서 `var(--ig-color-X)` 가 가장 호환. JS import 는 type-safe 하지만 dynamic 이 복잡.

## 6. Open Questions

- [ ] **white05, white10 token 추가 여부** — 04/06, 08/12 가까워 통일 가능성. 디자이너 결정.
- [ ] **black opacity 단계** — 12/35/50/60/70 모두 추가 vs 일부 통일 (e.g. modal backdrop 만)
- [ ] **brand blue 통일 합의** — `74,158,255` 폐기 vs `accentAlt` 신설
- [ ] **codemod 범위** — 자동화 가능한 패턴 vs 수동 검증 필요한 곳 분리 기준

## 7. 후속

- semantic token 추가 (surfaceTint, interactiveBorder 등) — 별도 plan
- light mode 도입 시 token 만 swap 으로 가능한지 검증
