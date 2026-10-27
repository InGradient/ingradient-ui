# 밤사이 진행 기록 (2026-10-26 밤 ~ 10-27)

Simon이 잠든 동안 진행한 작업의 실시간 기록이다. 최종 정리는 아침에 HTML 리포트
(`docs/reports/2026-10-27-foundations-report.ko.html`)로 따로 만든다.

## 원칙

- 합의한 순서: 표면 깊이 1단계 마무리 → 기초 값을 4px 기준으로 제안 → `DESIGN.md` 재작성 →
  공용 컴포넌트 → Platform 화면별 적용 → Edge.
- 기존 값을 옮겨 적지 않고 4px 기준 새 값을 제안한다.
- 결정이 필요한 곳은 추천값을 채택해 진행하되, "의견이 필요했던 것"으로 따로 기록한다.
- push, PR, 시각 기준선 갱신, 삭제, Edge 화면 변경은 하지 않는다.

## 의견이 필요했던 것 (추천을 채택해 진행)

| # | 질문 | 채택한 추천 | 뒤집을 때 영향 |
|---|---|---|---|

## 진행 기록

- 00:20 시작. 브랜치 `feat/surface-depth`. 1단계(공용 표면 10개 깊이 인식) 코드 완료,
  검사 통과(단위 478, Storybook 28). 전체 스토리 화면 변화 0 확인 중.
- 00:35 1단계 전체 스토리 비교 끝: 안정 875개 중 3개가 다르게 나옴. 각각 양쪽 빌드에서 4~8번 다시 찍어 확인.
  `upload-progress`와 `igp-export-dialog`는 이전 빌드끼리도 진행 막대 위치가 매번 달랐고(이전 빌드 8번 중 5번 차이),
  `customize-widgets-workflow`는 다시 찍으니 차이 0. 포커스도 16번 모두 대화상자에 있었음. → 실제 화면 변화 0.
- 00:45 1단계 커밋. 깊이 인식 공용 표면 10개(떠 있는 7: ModalCard, PopoverCard, Menu, 메뉴 팝오버,
  ContextMenuList, ContextMenuSub, TwoColumnDialog 껍데기 / 일반 4: SectionPanel, ChartCard, 설정 Section, Card).
  `MediaDialogContent`는 좁은 화면에서 모서리 0으로 바꾸는 미디어 쿼리가 있어 화면 적용 단계로 미룸.
  합의한 순서에 따라 표면 깊이 작업은 여기서 멈추고(Platform 적용은 화면별 이전 단계로), 기초 값 제안으로 넘어감.
