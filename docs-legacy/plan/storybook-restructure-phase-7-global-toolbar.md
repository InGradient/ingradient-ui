# Phase 7 — Global Toolbar 확장

**상위 문서**: [storybook_architecture_restructure.md § 14](../storybook_architecture_restructure.md)
**위험도**: 낮음 (Storybook preview 만 수정 + PresetProvider 에 prop 1~2개 추가)
**선행 조건**: Phase 6 완료
**후속 단계**: Phase 8 (Fixture/Scenario Selector)

---

## 1. 목적

§ 14 의 7개 selector 를 Storybook 상단 toolbar 에 통합한다. 현재 일부 (preset/theme/density) 만 있고, Service/Version/Mode/Viewport/Locale 가 빠짐.

## 2. 현 상태 vs 목표

| Selector | 현재 | 목표 |
|---|---|---|
| Service | preset id 로 간접 표현 | 명시적 selector — Platform / Edge / Medical / None |
| Version | 없음 | 명시적 selector — 0.0.1 (현재 단일) |
| Preset | 직접 선택 | Service + Version 으로 자동 결정 (preset 제거 또는 advanced 옵션) |
| Mode | theme = portalDark/portalLight | inherit / light / dark / high-contrast |
| Density | compact / default / comfortable (padding only) | inherit / comfortable / compact / dense / ultra-dense (실제 토큰 override) |
| Viewport | Storybook native viewport addon | + Factory Monitor (1920×1080 정도) |
| Locale | 없음 | ko / en (placeholder, UI 만) |

## 3. 설계 결정

### 3.1 Service + Version → Preset 자동 결정

`{service}-{version}` 형식으로 preset id 매칭. 예: `platform` + `0.0.1` → `platform-0.0.1`.

매칭 실패 시 (Service=none 등) preset 미적용, IngradientThemeProvider 만 mount.

### 3.2 Mode / Density 의 'inherit'

기본은 `inherit` — preset 의 값을 그대로 사용. 사용자가 명시 선택 시 그것이 preset 보다 우선.

PresetProvider 에 `modeOverride`, `densityOverride` prop 추가. composePreset 결과의 cssVariables 위에 다시 override.

### 3.3 Viewport

Storybook `parameters.viewport.viewports` 에 Factory Monitor 추가. 사용자가 toolbar 의 viewport selector 로 전환.

### 3.4 Locale

현 단계는 UI 만 (state 전환). i18n 구현은 추후.

## 4. 작업 체크리스트

### 4.1 PresetProvider 확장
- [ ] `PresetProviderProps` 에 `modeOverride?: ThemeMode | undefined` 추가
- [ ] `PresetProviderProps` 에 `densityOverride?: string | undefined` 추가 (DensityId)
- [ ] override 적용 시 densityRegistry 에서 해당 cssVars 추가 주입
- [ ] override 적용 시 mode 도 ThemeProvider 에 그대로 전달

### 4.2 preview.tsx globalTypes 갱신
- [ ] `service` 추가 — items: none/platform/edge/medical
- [ ] `version` 추가 — items: 0.0.1 (단일이지만 selector 표시)
- [ ] `mode` — inherit/light/dark/high-contrast (theme 대체)
- [ ] `density` — inherit/comfortable/compact/ultra-dense (현 density 재사용)
- [ ] `locale` 추가 — items: ko/en (placeholder)
- [ ] 기존 `preset` selector 는 advanced 옵션으로 유지 또는 제거 (제거 권장)

### 4.3 decorator 로직 갱신
- [ ] service + version → preset 매칭 (registry lookup)
- [ ] mode/density 가 inherit 이 아니면 override 로 PresetProvider 에 전달
- [ ] preset 매칭 실패 시 IngradientThemeProvider 만 사용 (mode 는 toolbar mode 선택)

### 4.4 Viewport
- [ ] preview.tsx `parameters.viewport.viewports` 에 Factory Monitor (1920×1080) 추가
- [ ] 기본 Storybook viewport (Desktop/Laptop/Tablet/Mobile) 도 명시

### 4.5 cleanup
- [ ] 기존 advisory toolbar (role / dataScale) 는 사용처 없으면 제거 또는 별도 그룹으로 유지

## 5. 검증
- [ ] typecheck 통과
- [ ] Storybook 사이드바 toolbar 에 6개 selector (Service/Version/Mode/Density/Viewport/Locale) 노출
- [ ] Service=Platform + Version=0.0.1 선택 시 platform preset CSS vars 적용 (이전과 동일)
- [ ] Mode=light 선택 시 dark preset 이라도 light 로 표시 (override 동작)
- [ ] Density=ultra-dense 선택 시 control 사이즈 축소 확인
- [ ] Viewport=Factory Monitor 선택 시 1920×1080 frame
- [ ] platform / Phase 2~6 stories 모두 정상 렌더

## 6. 산출물
- 갱신된 `.storybook/preview.tsx`
- 확장된 `PresetProvider`
- plan 문서 (이 파일)

## 7. 제외 (다음 phase)
- Fixture/Scenario Selector — Phase 8
- per-story `controls` (viewMode 등) — Phase 8/9
- Locale 실제 i18n 동작 — V1+
- high-contrast mode 실제 토큰 값 — Phase 11+ (V1)
