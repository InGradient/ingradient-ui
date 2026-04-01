# ingradient-ui Deployment

## 실행 형태

`ingradient-ui`는 shared package build와 docs showcase 배포를 가진다.

주요 산출물:

- npm or private registry package
- generated `lib/` build outputs
- docs app

## 배포 흐름

### 개발 모드

- local file dependency로 consuming app에 연결
- docs app에서 시각 확인

### 릴리즈 모드

- package build
- `tokens.css` 생성
- semver version publish
- consuming app이 version update

## build 시 중요한 규칙

- `src/`만 수정한다
- `lib/tokens.css`는 직접 수정하지 않는다
- package build와 docs coverage check를 함께 본다

## 배포 후 검증

- public export surface
- tokens generation
- docs build
- consuming app integration smoke check

## 관련 근거 문서

- `/home/june/workspace/projects/ingradient-ui/README.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/WORKFLOW.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/publishing.md`

