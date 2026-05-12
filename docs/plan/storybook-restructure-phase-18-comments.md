# Phase 18 — Designer Comment Panel (V2 § 25.3)

**상위 문서**: [storybook_architecture_restructure.md § 25.3](../storybook_architecture_restructure.md)
**위험도**: 낮음
**선행 조건**: Phase 15 (ReviewWidget — fixed widget 패턴 정착)
**후속 단계**: V2+ (multi-user / 서버 동기화)

---

## 1. 목적

§ 25.3 V2 의 마지막 항목. 디자이너가 페이지 story 마다 코멘트를 남겨 다른 검토자와 공유. 외부 도구 (Slack, Figma) 없이 storybook 안에서 의견 교환.

## 2. 동작

```
페이지 story 좌하단 collapsible 패널
→ 펼치면 댓글 목록 + author/body input + Add 버튼
→ Add → localStorage 저장
→ 다른 사람의 댓글도 같은 브라우저에서 확인
→ 개별 댓글 Delete 가능
```

storyId 별로 댓글 list. author 는 브라우저별 localStorage 에 별도 저장 (한 번 입력 후 기억).

## 3. 작업 항목
- [ ] `stories/support/comments.ts` — listComments / addComment / deleteComment + author persistence
- [ ] `stories/support/CommentPanel.tsx` — fixed 좌하단 collapsible 패널
- [ ] preview.tsx — ReviewWidget 옆에 조건부 렌더 (page story 만)
- [ ] 본 plan

## 4. 검증
- [ ] typecheck / lint
- [ ] storyId 별 분리 (다른 story 의 코멘트 안 보임)
- [ ] 새로고침 시 코멘트 + author 유지
- [ ] 빈 body 는 add 안 됨

## 5. 한계 (V2+)
- localStorage 만 — 다른 사람 브라우저의 댓글 안 보임
- multi-user / 서버 동기화는 별도 인프라 필요
- @mention 미지원
