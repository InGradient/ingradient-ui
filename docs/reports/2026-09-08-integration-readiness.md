# 2026-09-08 통합 검증

## 범위

PR15 접근성 변경과 PR16 Linux 화면 기준을 순서대로 포함한다. 기존 디자인과 product view의 controlled 계약을 유지한다.

- ImageCard의 이미지 열기와 메뉴 버튼이 독립된 키보드 대상으로 동작한다.
- Linux 기준 화면 15개를 검토했다. Theme Lab의 제거된 globals 참조와 Token Overview의 긴 글꼴 값 때문에 좁아지던 설명 열을 수정했다.
- 수정된 두 화면은 [Linux 실행 34283818126](https://github.com/InGradient/ingradient-ui/actions/runs/34283818126)의 실제 캡처에서 반영했다. 나머지 13개는 이 실행에서 일치했다. macOS 캡처를 Linux 기준으로 사용하지 않았다.

## 패키지

- `hooks` 진입점과 선언 파일을 빌드한다. 공개 경로의 파일 존재와 주요 실제 named export를 검사한다.
- 오래된 자기 패키지 tarball 의존성을 제거했다. 개발 환경에서만 현재 저장소를 링크한다.
- 공통 코드를 공유해 root 패키지 JS 합계가 1,074.1KB에서 497.1KB로 줄었다. 기존 500KB 제한을 유지했다.
- CSS side effect를 선언하고 두 pages 패키지에 types/import 조건을 명시했다.
- 새 tarball 세 개를 저장소 외부 앱에 설치해 타입 검사와 production build를 통과했다. root 소스 alias를 사용하지 않는다.
- CI와 release workflow에 tarball consumer 검증을 추가했다.

## 직접 확인한 동작

Aside 브라우저를 사용했다. 로컬 unit 검사는 66개 파일 317개 테스트를 통과했다. 타입 검사와 lint는 오류 없이 완료했으며 기존 lint 경고 6개는 남아 있다. style literal 및 문서 coverage 검사도 통과했다. 최종 커밋의 CI 결과는 PR의 Checks를 기준으로 확인한다.

- Token 검색/복사 및 375/768/1280 폭의 줄바꿈 확인.
- Catalog 검색: 17개에서 2개로 필터링 후 복원. 이름 역순 정렬, Enter 키로 이미지 메뉴 열기, 17개 전체 선택, 삭제 확인창 열기와 취소. 실제 삭제는 하지 않았다.
- 독립 설치 앱의 Platform 로그인 입력과 sign-in/sign-up 콜백 확인.
- 독립 설치 앱의 Edge 빈 키 활성화 차단, 키 입력 후 활성화 콜백, 테스트 fingerprint 복사 확인.

## 실제 제품 연결에서 발견한 남은 작업

실제 `ingradient-platform` 프런트엔드를 새 빌드에 연결하자 기존 import 경로 불일치 때문에 dependency scan이 실패했다. 제품 파일은 변경하지 않았다. 이미 main의 공개 API에서도 해당 항목은 예전 components 경로에 없다.

| 기존 components import | 현재 확인할 경로 |
| --- | --- |
| CheckboxGroup, DrawingLayer, CommentThread | `@ingradient/ui/patterns` |
| useSelection, useUndoRedo, useDrawingCanvas | `@ingradient/ui/hooks` |
| LoadingState, ErrorState | 현재 상태 표시 pattern 계약에 맞춰 소비 코드를 마이그레이션 |

다음 제품 작업은 이 import 마이그레이션 후 실제 IAM/API를 연결한 카탈로그 흐름 검증이다. 로컬 callback smoke는 실제 인증 성공을 의미하지 않는다. Edge 실제 앱 저장소는 현재 Projects 경로에서 확인되지 않아 Electron/라이선스 서버 연동은 검증하지 못했다.
