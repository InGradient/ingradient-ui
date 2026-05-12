# Phase 12 — Sandbox 운영 구조 (V1 § 25.2)

**상위 문서**: [storybook_architecture_restructure.md § 9, § 20](../storybook_architecture_restructure.md)
**위험도**: 낮음 (stories + 문서만 추가)
**선행 조건**: Phase 9 (page stories), Phase 10 (handoff)
**후속 단계**: V1+ (Visual regression / Save as Page Config)

---

## 1. 목적

§ 20 의 sandbox 영역을 *실제 운영 가능한 형태* 로 구현. 현재 `stories/sandboxes/{platform,edge,medical}/` 은 빈 폴더. 디자이너 실험 흐름을 명시하고 service 별 첫 예시 sandbox 작성.

## 2. 운영 흐름 (§ 20.3)

```
sandbox 작성 → 안정화 → 정식 pages/{service}/{version} 으로 승격
```

### 2.1 승격 체크리스트

§ 20.3 의 6 기준:
1. 사용 preset 정리 — handoff 메타에 명시
2. 사용 fixture 정리 — handoff 메타에 명시
3. 상태별 story 정리 — scenarios arg 사용
4. 반응형 확인 — 4+ viewport
5. 접근성 기본 확인 — a11y addon
6. 기존 component/pattern 재사용 가능성 확인

## 3. Sandbox metadata helper

`stories/support/sandbox.ts`:
- `SandboxMeta` interface
  - experimentGoal: 무엇을 실험하는지 (한 문장)
  - hypothesis: 가설
  - basis: 어떤 기존 page/component 위에 변형
  - promotionCriteria: 위 6 체크리스트 + experiment-specific
  - promotionTarget: pages/{service}/{version}/{page} (승격 시 목적지)
- `defineSandbox()` — handoff 와 유사하게 docs.description 에 markdown 주입

## 4. 예시 sandbox (3)

### 4.1 platform/dense-catalog
- 목표: Catalog 를 ultra-dense density 로 운영했을 때 시각 검증
- 가설: 한 화면에 더 많은 dataset 표시. 가독성 vs 정보 밀도 trade-off
- basis: pages/platform/Catalog
- 승격 대상: 추후 platform/0.1.0/Catalog 의 "ultra-dense" preset variant

### 4.2 edge/mobile-capture-ui
- 목표: Edge 의 캡처 UI 를 모바일 viewport 에 적합한 변형으로 실험
- 가설: 모바일 viewport 에서 device 그리드 → 가로 스와이프 list
- basis: pages/edge/DatasetSelect
- 승격 대상: 추후 edge/0.1.0 의 mobile-first UI

### 4.3 medical/viewer-light-mode
- 목표: Medical 환경에서 light mode 가 가능한지 검증 (DICOM 영상 외 영역)
- 가설: 메뉴/툴바는 light, viewer canvas 만 dark — 환경 적응성
- basis: pages/medical/ProjectPicker
- 승격 대상: 추후 medical/0.1.0 의 hybrid theme

## 5. 작업 체크리스트
- [ ] `stories/support/sandbox.ts` — defineSandbox helper
- [ ] `stories/sandboxes/platform/DenseCatalog.stories.tsx`
- [ ] `stories/sandboxes/edge/MobileCaptureUI.stories.tsx`
- [ ] `stories/sandboxes/medical/ViewerLightMode.stories.tsx`
- [ ] 각 sandbox 의 README 갱신 (현 placeholder 에서 실제 운영 안내로)

## 6. 검증
- [ ] typecheck 통과
- [ ] Storybook 사이드바 Sandboxes/{Platform,Edge,Medical}/ 아래 각 story 노출
- [ ] sandbox 의 docs page 에 experiment goal + promotion criteria 표시
- [ ] preset resolution 정상 (handoff.service 패턴 동일)

## 7. 산출물
- 1 helper + 3 sandbox stories + 본 plan 문서

## 8. 제외 (V1+)
- 자동 승격 도구 (sandbox → pages 파일 이동)
- Visual regression 비교
- Designer comment panel
