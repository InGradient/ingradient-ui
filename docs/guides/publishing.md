# @ingradient/ui 배포 가이드

## 배포 방식

GitHub Releases에 npm tarball(`.tgz`)로 배포됩니다.
`v*` 태그를 push하면 GitHub Actions가 자동으로 빌드 → pack → Release 업로드를 수행합니다.

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

## CI 워크플로우 (.github/workflows/publish.yml)

태그 push 시 자동으로 실행:
1. `npm install --ignore-scripts` — 의존성 설치
2. `npm run build:package` — tsup 빌드
3. `npm pack` — tarball 생성
4. `softprops/action-gh-release` — GitHub Release에 `.tgz` 업로드

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
