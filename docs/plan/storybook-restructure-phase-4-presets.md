# Phase 4 — Preset 시스템 + 첫 Platform 0.0.1 Preset

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: 중 (새 메커니즘 도입 — ThemeProvider 변경 필요)
**선행 조건**: Phase 3 완료 (token 7-카테고리 골격)
**후속 단계**: [Phase 5 — Builders](./storybook-restructure-phase-5-builders.md)

---

## 1. 목적

상위 문서 4 의 preset 시스템을 구현한다. Preset 은 `Theme + Brand + Density + Token Override` 조합을 하나의 제품 디자인 snapshot 으로 묶은 단위.

이번 phase 산출물:
1. `src/tokens/presets/platform/0.0.1/` 첫 preset 작성
2. preset 을 런타임에 적용하는 메커니즘 (ThemeProvider 또는 동등) 구현
3. Storybook 에서 preset 전환 가능 (toolbar)

---

## 2. Preset 데이터 모델

### 2.1 타입 정의 (제안)

`src/tokens/presets/types.ts`:
```ts
export type Preset = {
  id: string                   // 'platform-0.0.1'
  service: 'platform' | 'edge' | 'medical'
  version: string              // '0.0.1'
  theme: ThemeId               // 'industrial-dark' | 'light' | ...
  brand: BrandId               // 'default' | 'finemtech' | 'samsung'
  density: DensityId           // 'comfortable' | 'compact' | 'ultra-dense'
  mode: ModeId                 // 'light' | 'dark' | 'high-contrast'
  overrides?: TokenOverrides   // optional 부분적 토큰 override
}
```

### 2.2 platform/0.0.1 preset 내용
```ts
export const platformV001: Preset = {
  id: 'platform-0.0.1',
  service: 'platform',
  version: '0.0.1',
  theme: 'industrial-dark',
  brand: 'default',
  density: 'compact',
  mode: 'dark',
  overrides: {},
}
```

상위 문서 4.2 에 따라 "초기 MVP UI, compact density, industrial-dark 기반, 기본 sidebar 구조".

---

## 3. Preset 적용 메커니즘

### 3.1 PresetProvider (신규)

`src/tokens/presets/PresetProvider.tsx`:
```tsx
export function PresetProvider({ preset, children }: { preset: Preset; children: ReactNode }) {
  // 1. theme + brand + density + mode 의 토큰을 합성
  // 2. CSS 변수 (--ig-*) 를 root 에 inject
  // 3. context 로 preset 메타데이터 노출
}
```

- [ ] CSS 변수 inject 방식: styled-components ThemeProvider vs raw `<style>` 태그 — 결정
- [ ] 기존 `--ig-*` CSS 변수 호환성 — preset 적용 후에도 동일 변수명 유지
- [ ] preset 미적용 (default) 동작: 현재 토큰 그대로 노출

### 3.2 토큰 합성 함수
`composePreset(preset): Record<string, string>`:
- theme → 기본 토큰 set
- brand → override
- density → control-height, spacing override
- mode → color override
- preset.overrides → 최종 override

---

## 4. 작업 체크리스트

### 4.1 Preset 시스템 코드
- [ ] `src/tokens/presets/types.ts` 작성
- [ ] `src/tokens/presets/compose.ts` — `composePreset()` 구현
- [ ] `src/tokens/presets/PresetProvider.tsx` — Provider 구현
- [ ] `src/tokens/presets/index.ts` — public API export

### 4.2 platform/0.0.1 Preset
- [ ] `src/tokens/presets/platform/0.0.1/preset.ts` — Preset object
- [ ] `src/tokens/presets/platform/0.0.1/index.ts` — re-export
- [ ] `src/tokens/presets/platform/index.ts` — 버전별 re-export
- [ ] `src/tokens/presets/index.ts` 에 platform preset 등록

### 4.3 Storybook 통합
- [ ] `.storybook/preview.ts` 에 `PresetProvider` decorator 추가
- [ ] Storybook toolbar 에 preset selector 추가 (현재는 platform-0.0.1 만)
- [ ] Phase 2 의 4개 story 가 preset 적용된 채로 렌더링되는지 확인

### 4.4 platform consumer 적용
- [ ] ingradient-platform 의 root 에서 `<PresetProvider preset={platformV001}>` 적용 가능 여부 검토
- [ ] 적용 시 시각 변화 없음 확인 (현재 토큰과 동등해야 함)
- [ ] platform 적용은 별도 PR 권장 — Phase 4 의 ui-library 산출물만 우선

### 4.5 Fixtures 의 preset placeholder 채우기
- [ ] `stories/fixtures/platform/0.0.1/preset.ts` 가 실제 preset 을 import 해서 export

---

## 5. 검증 기준

- [ ] `composePreset(platformV001)` 출력이 현재 dark mode 토큰과 동등 (regression 없음)
- [ ] Storybook 의 모든 story 가 preset toolbar 전환 시 정상 작동
- [ ] Phase 2 의 story 들이 preset 적용 후에도 시각적으로 동일
- [ ] `npm run typecheck` 정상

---

## 6. 산출물

- Preset 시스템 코드 4개 파일 (`types`, `compose`, `PresetProvider`, `index`)
- platform/0.0.1 preset 1개
- Storybook preset selector
- platform 적용 가이드 (별도 PR 노트 또는 changelog)

---

## 7. 제외 (다음 phase)

- 실제 brand override (finemtech, samsung 토큰 값) — 디자이너 작업
- platform 0.1.0 preset — 다음 버전 작업 시
- ThemeBuilder UI — Phase 5
- 다른 service preset (edge, medical) — Phase 6

---

## 8. 참고

- 상위 문서 § 3.2 (토큰 카테고리 역할), § 4 (Preset 시스템)
- styled-components ThemeProvider docs (기존 의존성)
