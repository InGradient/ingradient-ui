---
title: PR-E11 — AddDatasetModal cross-repo 정렬 (edge → ui 컴포넌트)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-edge (mainly), ingradient-platform (cross-check)
status: planning — 사용자 review 대기
---

# PR-E11 — AddDatasetModal cross-repo 정렬

## 1. 목적

양 repo 의 AddDatasetModal 이 *거의 같은 form 구조* 인데 edge 가 자체 styled 컴포넌트 (`AddDatasetInput / Field / Label / CancelBtn / SubmitBtn`) 로 ui 토큰을 우회. platform 처럼 ui 컴포넌트 (`TextField / Button`) 로 정렬하여 양 repo 일관 + edge styled 정리.

audit plan 의 "ui Pattern 추출" 보다 *가벼운 정렬* — caller 비즈니스 로직 (api 호출 / error handling) 은 도메인 특화라 Pattern 가치 낮음.

## 2. 변경 매핑 (edge)

### 2.1 자체 styled → ui 컴포넌트

[AddDatasetModal.tsx](src/frontend/components/dataset/AddDatasetModal.tsx):
| 현재 | 이후 |
|---|---|
| `<AddDatasetField>` styled.div (gap column) | inline div with flex column gap |
| `<AddDatasetLabel>` styled.label | inline `<label>` with ui token style (또는 platform 의 row label 패턴) |
| `<AddDatasetInput ref>` styled.input | ui `TextField` (ref via inputRef) |
| `<AddDatasetCancelBtn>` styled.button | ui `Button variant="secondary"` |
| `<AddDatasetSubmitBtn type="submit">` styled.button | ui `Button variant="accent" type="submit"` |
| `<InlineError>` styled.div | 유지 (간단 + edge 도메인) 또는 inline `<div style={{color:...}}>` |

[AddDatasetModal.styles.ts](src/frontend/components/dataset/AddDatasetModal.styles.ts): 62줄 → 약 10줄 (Field/Label/Input/CancelBtn/SubmitBtn 제거. InlineError 만 유지)

### 2.2 form layout 정렬

platform 은 `<AddDatasetModalRow>` (margin-bottom 16) 사용. edge 는 `<form>` 안 `<AddDatasetField>` (gap var(--ig-space-7)) 사용.

→ edge 를 platform 패턴으로 정렬: 자체 form 안 `<div>` + flex column gap. ui token 사용 (`var(--ig-space-3)` 같은).

### 2.3 width 통일?

platform: `width="360px"` / edge: `width="320px"`. 작은 차이지만 *cross-app 일관* 측면에서 통일 가치 있음. 어느 쪽으로 통일? — 도메인 결정 필요. 본 PR 에서는 *각자 유지* 가 안전 (각 repo 의 시각 의도 보존).

## 3. 변경 파일

| 파일 | 변경 |
|---|---|
| `edge AddDatasetModal.tsx` | 자체 styled → ui TextField/Button. inputRef → React.useRef + TextField 의 ref forwarding (ui TextField 가 forwardRef 인지 확인 필요) |
| `edge AddDatasetModal.styles.ts` | Field/Label/Input/CancelBtn/SubmitBtn 제거 (-50줄). InlineError 만 유지 |

**합 추정**: **edge -55줄**

## 4. ui TextField ref forwarding 확인 필요

edge 가 `inputRef = useRef<HTMLInputElement>(null)` + `setTimeout(() => inputRef.current?.focus(), 50)` 로 자동 포커스. ui TextField 가 `React.forwardRef` 인지 확인 (없으면 ref 전달 불가).

→ ui TextField 검증 후 진행. 미지원 시 `autoFocus` prop 사용 또는 ui TextField 보강.

## 5. 위험

- 낮음. 시각 동일 (token 기반) + 기능 동일 (props 인터페이스 보존)
- platform 은 변경 0 — cross-check 만

## 6. 검증 절차

1. ui rebuild
2. edge typecheck
3. edge dev → Dataset 추가 modal:
   - input focus (auto)
   - input value 변경
   - taskType radio (object_detection 만 enable)
   - classes checkbox 토글
   - submit (online + offline mode)
   - cancel 동작
   - error 표시 (api 실패 시)

## 7. 후속

- AddDatasetModal 패턴이 다른 form-in-dialog 에도 적용 가능 — 별도 PR (필요 시)
- platform 의 form layout 도 더 ui 정렬 거리 있음 — 별도 sweep
