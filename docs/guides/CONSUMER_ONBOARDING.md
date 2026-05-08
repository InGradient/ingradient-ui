# Consumer Onboarding

이 문서는 `@ingradient/ui`를 실제 제품 앱에서 어떻게 가져다 쓰는지 설명한다.

대상:

- `ingradient-platform`
- `ingradient-edge`
- 앞으로 추가될 다른 consumer app

이 문서는 `ingradient-ui` 관점의 공통 원칙을 설명하고, 각 앱의 세부 실행 절차는 해당 레포 문서로 넘긴다.

## 1. 핵심 개념

`ingradient-ui`의 source of truth는 `src/`다.  
하지만 consumer app이 실제로 읽는 것은 build output인 `lib/`다.

즉:

1. `src/`를 수정한다
2. `npm run build:package`로 `lib/`를 다시 만든다
3. consumer app이 그 `lib/`를 읽어서 화면에 반영한다

이 규칙을 놓치면 "코드는 바꿨는데 앱에서 안 보인다" 상태가 된다.

## 2. 어떤 consumer가 어떤 방식으로 쓰는가

### `ingradient-platform`

- `frontend/package.json`은 `@ingradient/ui`를 sibling repo로 참조한다
- `frontend/vite.config.ts`는 `@ingradient/ui/*` import를 `../ingradient-ui/lib/*`로 alias한다
- 따라서 로컬 작업에서는 `ingradient-ui/lib`가 사실상 즉시 소비 표면이다

관련 문서:

- [ingradient-platform 디자이너 온보딩](../../../ingradient-platform/docs/ops/designer_onboarding.md)

### `ingradient-edge`

- `package.json`은 tarball 기반 `@ingradient/ui` dependency를 가진다
- 하지만 로컬에 sibling `../ingradient-ui`가 있으면 `electron.vite.config.ts`가 `../ingradient-ui/lib/*`를 우선 사용한다
- 로컬 협업 중에는 tarball보다 sibling repo `lib/`가 우선인 경우가 많다

관련 문서:

- [ingradient-edge 디자이너 온보딩](../../../ingradient-edge/docs/ops/designer_onboarding.md)

## 3. 로컬 협업 기본 흐름

폴더 구조는 보통 아래처럼 둔다.

```text
/home/june/workspace/projects/
├─ ingradient-ui/
├─ ingradient-platform/
└─ ingradient-edge/
```

### 최초 1회

```bash
cd /home/june/workspace/projects/ingradient-ui
npm install
npm run build:package
```

그 다음 consumer app에서 필요한 의존성을 설치하고 dev 서버를 띄운다.

## 4. UI 수정 후 consumer 반영 방법

가장 기본적인 명령은 이것이다.

```bash
cd /home/june/workspace/projects/ingradient-ui
npm run build:package
```

이 명령은 아래를 갱신한다.

- `lib/index.js`
- `lib/components.js`
- `lib/patterns.js`
- `lib/primitives.js`
- `lib/tokens.js`
- `lib/tokens.css`
- 타입 선언 파일

consumer app은 이 빌드 결과를 사용한다.

### 빠른 작업 루프

터미널 1:

```bash
cd /home/june/workspace/projects/ingradient-ui
npm run dev:lib
```

터미널 2:

```bash
cd /home/june/workspace/projects/ingradient-platform
npm run dev:frontend
```

또는:

```bash
cd /home/june/workspace/projects/ingradient-edge
npm run dev:web
```

`dev:lib`는 `src/` 변경 때마다 `lib/`를 다시 만든다. 그래도 consumer 쪽 HMR이 어긋나면 dev 서버를 한 번 재시작하는 편이 빠르다.

## 5. consumer에서 import하는 방법

대표 import 예시는 아래와 같다.

```ts
import { DefaultErrorFallback } from '@ingradient/ui'
import { Spinner } from '@ingradient/ui/components'
import { BrandMark } from '@ingradient/ui/brand'
import { breakpoints } from '@ingradient/ui/tokens'
import '@ingradient/ui/tokens.css'
```

원칙:

- 새 코드는 가능한 한 루트 `@ingradient/ui` 또는 공식 subpath를 쓴다
- 새 public API가 필요하면 먼저 이 저장소에 export를 추가한 뒤 build한다
- `lib/` 파일은 generated output이므로 직접 수정하지 않는다

## 6. 언제 `build:package`만으로 충분한가

아래 상황이면 `npm run build:package`만으로 충분하다.

- 컴포넌트 구현 수정
- 토큰 수정
- subpath export가 이미 있는 파일 내부 수정
- 타입 변경이 이미 같은 export 표면 안에 머무는 경우

이후 consumer app dev 서버에서 확인하면 된다.

## 7. 언제 `npm pack` 또는 release가 필요한가

아래 상황이면 로컬 build만이 아니라 패키지 배포 흐름을 봐야 한다.

- sibling repo 없이 tarball 소비 환경에서 검증해야 할 때
- `ingradient-edge`처럼 release asset을 내려받는 흐름을 검증할 때
- GitHub Release에 올릴 실제 `.tgz`를 만들어야 할 때

기본 흐름:

```bash
cd /home/june/workspace/projects/ingradient-ui
npm run build:package
npm pack
```

생성된 `.tgz`는 consumer가 tarball로 설치할 수 있다.

관련 문서:

- [publishing.md](./publishing.md)

## 8. `ingradient-edge`에서 tarball 업데이트

`ingradient-edge`는 release tarball을 자동 설치하는 스크립트를 가진다.

```bash
cd /home/june/workspace/projects/ingradient-edge
npm run update-ui
```

특정 태그 설치:

```bash
cd /home/june/workspace/projects/ingradient-edge
node scripts/update-ui.mjs v0.0.3
```

이 경로는 private GitHub release asset 접근 권한이 필요할 수 있다.

## 9. consumer 쪽 `.env`는 어디서 관리하는가

`ingradient-ui`는 consumer app의 `.env`를 직접 소유하지 않는다.

- `ingradient-platform`은 루트 `.env`
- `ingradient-edge`는 `.env.local`

형태를 쓰고 있다. 실제 값과 실행 방법은 각 레포의 온보딩 문서를 본다.

## 10. 자주 생기는 문제

### 변경이 앱에서 안 보인다

대부분 아래 중 하나다.

1. `npm run build:package`를 안 돌렸다
2. consumer dev 서버를 재시작하지 않았다
3. 새 export를 추가했는데 export map을 안 갱신했다
4. `src/`가 아니라 `lib/`를 직접 수정했다

### 토큰 값은 바꿨는데 CSS 반영이 이상하다

`lib/tokens.css`는 generated output이다. 항상 `src/tokens/**`를 수정하고 `npm run build:package`를 다시 돌린다.

### edge가 로컬 repo 대신 tarball을 보는지 헷갈린다

`electron.vite.config.ts`가 sibling `../ingradient-ui` 존재 여부에 따라 경로를 바꾼다. 로컬 repo가 있으면 `lib/`가 우선될 가능성이 크다.

## 11. 빠른 체크리스트

```bash
cd /home/june/workspace/projects/ingradient-ui
npm install
npm run build:package

# platform 확인
cd ../ingradient-platform
npm run dev:frontend

# edge 확인
cd ../ingradient-edge
npm run dev:web
```

consumer app의 상세 `.env` 설정과 backend 준비는 각 레포 문서를 본다.
