# 오늘 작업 리포트 자료 출처

원본 캡처 11개와 로그·검토 기록을 그대로 복사했다. 아래 SHA-256은 보존 파일과 원본의 바이트 일치를 확인한 값이다. 임시 원본 경로는 추적용이며, 보고서 열람에는 이 폴더의 보존 파일을 사용한다.

## 캡처 구분

- Token·Theme: 오늘 검토에 사용한 수정 전 Linux actual과 수정 후 Linux actual. 과거 expected 기준 이미지를 수정 전 화면으로 사용하지 않았다.
- Edge: 오늘 외부 설치 앱의 빈 키·입력된 키 상태 비교. 실제 라이선스 서버 승인 자료가 아니다.
- Platform: 초기 소비자 연결을 고친 후의 캡처와 최종 main 통합 후 캡처. 최신 원격의 변경도 포함한다.
- 검증 기준: 최종 UI `c210de1e4b510721f54a16a6aced885d7a3d22d4`, Platform `540e2f34962cded9ddbb9dacea19d5e770df5de4`.

## 원본과 보존 파일

### token-before.png
- 보존: [token-before.png](./token-before.png)
- 원본: `/tmp/ingradient-integration-20260908/linux/test-results/storybook-visual-visual-snapshot-foundations-token-overview-chromium/foundations-token-overview-actual.png`
- SHA-256: `a48d526288dc4cb11c9fc64deb8efa80221ed60042af633acd949e8199eae501`

### token-after.png
- 보존: [token-after.png](./token-after.png)
- 원본: `/tmp/ingradient-integration-20260908/linux-fixed/test-results/storybook-visual-visual-snapshot-foundations-token-overview-chromium/foundations-token-overview-actual.png`
- SHA-256: `7903308f897b8aa9d6e4fdaf1362372c69d3b8eae4d3cdabdf09c2678cfb4920`

### theme-before.png
- 보존: [theme-before.png](./theme-before.png)
- 원본: `/tmp/ingradient-integration-20260908/linux/test-results/storybook-visual-visual-snapshot-sandboxes-theme-lab-chromium/sandboxes-theme-lab-actual.png`
- SHA-256: `2b6aa86528de435f31231ae5706e179bed84711b4805c32a639ab34699edcdaf`

### theme-after.png
- 보존: [theme-after.png](./theme-after.png)
- 원본: `/tmp/ingradient-integration-20260908/linux-fixed/test-results/storybook-visual-visual-snapshot-sandboxes-theme-lab-chromium/sandboxes-theme-lab-actual.png`
- SHA-256: `f1735dc829faa5232f5fe4cbcff422882a186c48b01f70c5adbdfcfa2b74d302`

### edge-empty.png
- 보존: [edge-empty.png](./edge-empty.png)
- 원본: `/tmp/ingradient-integration-20260908/final-qa-edge-initial.png`
- SHA-256: `baef8f983395b2d52973ae11cc59f20123754a389b225a6ca0574ab882bb9e85`

### edge-key.png
- 보존: [edge-key.png](./edge-key.png)
- 원본: `/tmp/ingradient-integration-20260908/final-qa-edge-key.png`
- SHA-256: `29d355a8fa376c93a7944785510ea9e05824284d14e11e1b860c2c5f02f2a521`

### catalog-before-merge.png
- 보존: [catalog-before-merge.png](./catalog-before-merge.png)
- 원본: `/tmp/ingradient-platform-integration-20260908/catalog-desktop.png`
- SHA-256: `3b40fd6520f39a24672027c8a4e0b1f221ce0924516cb0a0cba6c2748750516d`

### catalog-after-merge.png
- 보존: [catalog-after-merge.png](./catalog-after-merge.png)
- 원본: `/tmp/ingradient-merge-20260908/catalog-desktop.png`
- SHA-256: `b7f2eb9a9908e4fd6c332360385c0597a7557dc97a0a754c6ebd48bc9aa4b96a`

### image-detail-final.png
- 보존: [image-detail-final.png](./image-detail-final.png)
- 원본: `/tmp/ingradient-merge-20260908/image-detail.png`
- SHA-256: `133fa6e3159fda8865999ec9ec943ccf1db6cd91502492ed1d83c85177d2d51f`

### mobile-before-merge.png
- 보존: [mobile-before-merge.png](./mobile-before-merge.png)
- 원본: `/tmp/ingradient-platform-integration-20260908/catalog-mobile.png`
- SHA-256: `26b8890b74e42be33e5922984fe1a2a881533d56d46ad2b947e1862be8238a22`

### mobile-after-merge.png
- 보존: [mobile-after-merge.png](./mobile-after-merge.png)
- 원본: `/tmp/ingradient-merge-20260908/catalog-mobile.png`
- SHA-256: `3fd82f935bb0d8d154681b26fb91f6d4f36e9feb26a4272cd633b7a8ed729968`

### exports-before.log
- 보존: [exports-before.log](./exports-before.log)
- 원본: `/tmp/ingradient-integration-20260908/exports-before.log`
- SHA-256: `eeeaaa9013b0435d864dccc34c8e7734ce5356c9139a645543a44901a585ac75`

### exports-after.log
- 보존: [exports-after.log](./exports-after.log)
- 원본: `/tmp/ingradient-integration-20260908/exports-split.log`
- SHA-256: `5ceee12ab5817b8fd1989d943b273753c1b6012cc3204ecdbfad5f898ce1f25b`

### package-size.log
- 보존: [package-size.log](./package-size.log)
- 원본: `/tmp/ingradient-integration-20260908/size-split.log`
- SHA-256: `e78b0f08cdd06fb777a184a42e3e5e64ae097b0d2c70f4e6c98530509b340520`

### platform-build-before.log
- 보존: [platform-build-before.log](./platform-build-before.log)
- 원본: `/tmp/ingradient-platform-integration-20260908/build-before.log`
- SHA-256: `b0f9f2b73a2cd0da6ff0db6bc29f06698077d4f5d4607fca97fb619555303464`

### platform-build-after.log
- 보존: [platform-build-after.log](./platform-build-after.log)
- 원본: `/tmp/platform-merge-build-final.log`
- SHA-256: `702a966f92d51deee84f7c9ac3d0a53c34c63d4d7090cc15a3e1f0baf5e76edf`

### browser-regression-final.log
- 보존: [browser-regression-final.log](./browser-regression-final.log)
- 원본: `/tmp/platform-merge-regression-final.log`
- SHA-256: `56a19811aa2108fef27355a04d836df4292fb9ec87a39fce9e88f66a7e7ef09d`

### mobile-integrity-review.md
- 보존: [mobile-integrity-review.md](./mobile-integrity-review.md)
- 원본: `/tmp/ingradient-merge-20260908/integrity-review.md`
- SHA-256: `cd9afdd5edcc073f8602a50e4ee7d631f2ef456945e672192befccc08c149d09`

## 수치 도표

- `package-size.svg`: 9월 8일 UI 통합 리포트의 전 용량 1,074.1KB와 `package-size.log`의 후 용량 497.1KB. 막대 길이는 수치에 비례한다.
- `platform-build.svg`: 전 로그의 TypeScript 오류 25개와 최종 빌드 성공을 비교한 설명 도표.
- SVG 도표는 보고서용으로 새로 작성했으며 화면 캡처를 편집하거나 재현한 이미지가 아니다.
- 보고서에는 SVG를 렌더링한 `package-size.png`, `platform-build.png`를 사용한다. 두 도표의 전체 글자와 수치가 잘리지 않는지 직접 확인했다.
