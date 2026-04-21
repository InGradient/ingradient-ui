# @ingradient/ui 배포 가이드

## 배포 방식

이 저장소는 두 가지 배포 경로를 가진다.

1. package 배포
   - GitHub Releases에 npm tarball(`.tgz`)로 배포된다.
   - `v*` 태그를 push하면 GitHub Actions가 자동으로 빌드 → pack → Release 업로드를 수행한다.
2. Storybook 배포
   - GitHub Pages에 정적 Storybook을 배포한다.
   - `main` push 또는 수동 실행 시 `.github/workflows/deploy-storybook.yml`이 Storybook을 빌드하고 Pages에 배포한다.

## 새 버전 배포

```bash
# 1. package.json의 version 필드 업데이트 (예: 0.0.1 → 0.0.2)
# 2. 커밋 & push
git add package.json
git commit -m "v0.0.2"
git push origin main

# 3. 태그 생성 & push → CI가 자동 배포
git tag v0.0.2
git push origin v0.0.2
```

## Package Publish Workflow

`.github/workflows/publish.yml`은 태그 push 시 자동으로 실행된다.

1. `npm ci --ignore-scripts`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm test`
5. `npm run test-storybook`
6. `npm run build:package`
7. `npm run build:smoke-consumer`
8. `npm run check:style-literals`
9. `npm run check:doc-coverage`
10. `npm run build:storybook`
11. `npm run test:visual`
12. `npm pack`
13. `softprops/action-gh-release`로 `.tgz` 업로드

## Storybook Deploy Workflow

`.github/workflows/deploy-storybook.yml`은 `main` 기준 Storybook 정적 사이트를 배포한다.

1. `npm ci --ignore-scripts`
2. `npx playwright install --with-deps chromium`
3. `npm run test-storybook`
4. `npm run build:package`
5. `npm run build:smoke-consumer`
6. `npm run check:doc-coverage`
7. `npm run build:storybook`
8. `npm run test:visual`
9. `actions/deploy-pages`로 GitHub Pages 배포

중요한 점:

- Pages 배포는 `STORYBOOK_BASE_PATH=/<repo-name>/`를 사용해 repo 하위 경로에서도 asset path가 깨지지 않게 만든다.
- private repository라면 Pages 접근 정책은 저장소 설정에서 별도로 확인해야 한다.
- visual regression은 committed screenshot baseline과 비교한다.
- consumer smoke app은 public export와 `tokens.css` subpath가 실제 앱에서 빌드되는지 검증한다.

## PR Storybook Preview

`.github/workflows/ci.yml`은 PR에서도 Storybook을 빌드하고 artifact를 남긴다.

- PR 이벤트: `storybook-static-pr-<PR 번호>`
- push 이벤트: `storybook-static-<run number>`

리뷰어는 Actions run의 job summary와 artifact를 통해 정적 Storybook을 내려받아 확인한다.

## 소비자 (ingradient-edge)

ingradient-edge에서는 `scripts/update-ui.mjs`로 최신 릴리스를 설치합니다:

```bash
# ingradient-edge 레포에서
npm run update-ui              # 최신 버전
node scripts/update-ui.mjs v0.0.2  # 특정 버전
```

CI에서는 빌드 전 자동으로 최신 버전을 설치합니다.
private 레포이므로 ingradient-edge에 `UI_REPO_TOKEN` secret이 필요합니다.
(상세: ingradient-edge의 `docs/guides/ui-package-update.md` 참고)
