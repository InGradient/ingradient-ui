# Phase 16 — Visual Regression baseline 확장 (V2 § 25.3)

**상위 문서**: [storybook_architecture_restructure.md § 23.3, § 25.3](../storybook_architecture_restructure.md)
**위험도**: 낮음 (spec 추가만 — baseline 캡처는 별도 실행)
**선행 조건**: Phase 9-12 (page + sandbox stories)
**후속 단계**: Phase 17 (PageComposer/LayoutComposer drafts)

---

## 1. 목적

기존 Playwright visual regression 인프라 (`tests/visual/storybook-visual.spec.ts`) 가 4개 story 만 다룸. Phase 9-12 에서 추가된 page + sandbox 14개 story 를 visual regression 대상에 추가 → 토큰/컴포넌트 수정 시 시각 회귀 자동 감지.

## 2. 추가 대상 (14)

### Platform pages (5)
- `pages-platform-auth-login--default`
- `pages-platform-auth-signup--default`
- `pages-platform-catalog--default`
- `pages-platform-classmanage--default`
- `pages-platform-createproject--default`

### Edge pages (3)
- `pages-edge-login--online`
- `pages-edge-license--valid`
- `pages-edge-datasetselect--with-datasets`

### Medical pages (3)
- `pages-medical-auth--login`
- `pages-medical-projectpicker--default`
- `pages-medical-classworkspace--default`

### Sandboxes (3)
- `sandboxes-platform-densecatalog--default`
- `sandboxes-edge-mobilecaptureui--default`
- `sandboxes-medical-viewerlightmode--default`

## 3. baseline 생성

Phase 16 은 spec 만 추가. 실제 PNG snapshot 은 다음 명령으로 생성:

```bash
npm run build:storybook
npm run test:visual:update
```

`tests/visual/storybook-visual.spec.ts-snapshots/` 폴더에 새 PNG 14개 추가됨. PR 에 포함시켜 commit.

## 4. 비결정적 요소 처리

- ReviewWidget 은 `data-testid` 로 식별 가능. 현재 localStorage 가 빈 상태면 항상 'pending' 표시 → CI 환경에서 결정적.
- ThemeBuilder Drafts timestamp 는 visual regression 대상 아님 (Builders 는 회귀 검증 제외).
- mockUsers/mockDatasets 등 fixture 는 정적 값.

## 5. 작업 체크리스트
- [ ] `tests/visual/storybook-visual.spec.ts` 에 14 stories 추가
- [ ] 각 readyText 선정 (story 의 헤더 텍스트)
- [ ] 본 plan 문서

## 6. 검증 (Phase 16 commit 후 별도)
- [ ] `npm run build:storybook` 정상
- [ ] `npm run test:visual:update` 로 baseline 생성
- [ ] `npm run test:visual` (no --update) 시 변화 없으면 pass
- [ ] CI 환경에서도 동일 결과

## 7. 산출물
- spec 확장 + plan 문서
- (별도) baseline PNG 14개

## 8. 제외 (V2+)
- CI workflow 통합 (.github/workflows)
- baseline 자동 업데이트 (디자인 의도된 변경 시)
- visual diff dashboard
