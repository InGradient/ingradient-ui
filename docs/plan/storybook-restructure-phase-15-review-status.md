# Phase 15 — Story Review Status (V2 § 25.3)

**상위 문서**: [storybook_architecture_restructure.md § 23, § 25.3](../storybook_architecture_restructure.md)
**위험도**: 낮음 (helper + widget + decorator)
**선행 조건**: Phase 10 (handoff)
**후속 단계**: Phase 16 (Visual Regression)

---

## 1. 목적

§ 23 Scenario Matrix 의 정적 markdown checklist 를 동적 UI 로 보완. 디자이너가 각 page × scenario 마다 review 상태 (pending / reviewed / needs-work) 를 직접 표시.

## 2. 동작

```
페이지 story 우하단에 ReviewWidget 표시
→ 현재 status pill + 3 버튼 (Pending / Reviewed / Needs work)
→ 클릭 시 localStorage 저장 (storyId 키 기반)
→ 다음 방문 시 status 복원
```

handoff metadata 있는 story (= page stories) 만 widget 표시. components/patterns/sandbox 등에는 미적용.

## 3. 설계

### 3.1 helper

`stories/support/review-status.ts`:
- `ReviewStatus = 'pending' | 'reviewed' | 'needs-work'`
- `getReviewStatus(storyId): ReviewStatus`
- `setReviewStatus(storyId, status): void`
- `clearReviewStatus(storyId): void`
- localStorage key: `ingradient-ui:review-status`

### 3.2 widget

`stories/support/ReviewWidget.tsx`:
- 우하단 fixed 위치 작은 박스
- 현재 status pill
- 3 버튼으로 status 변경
- 변경 시 즉시 localStorage 저장 + visual update

### 3.3 decorator 통합

`.storybook/preview.tsx` decorator 에서 `context.parameters.handoff` 있는 story 만 widget 렌더.

## 4. 작업 체크리스트
- [ ] `stories/support/review-status.ts`
- [ ] `stories/support/ReviewWidget.tsx`
- [ ] preview.tsx decorator 갱신
- [ ] 본 plan

## 5. 검증
- [ ] typecheck 통과
- [ ] page story 에서만 widget 표시
- [ ] status 변경 후 새로고침 시 유지
- [ ] components/patterns story 에는 미표시

## 6. 산출물
- helper + widget + decorator 갱신

## 7. 제외 (V2+)
- Status 통계 dashboard (전체 review 진행률)
- Status 변경 history / audit log
- Multi-user (다른 reviewer 별 status)
