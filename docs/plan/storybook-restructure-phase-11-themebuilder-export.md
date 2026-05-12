# Phase 11 — ThemeBuilder Export JSON (V1 § 25.2)

**상위 문서**: [storybook_architecture_restructure.md § 17.4, § 24.2](../storybook_architecture_restructure.md)
**위험도**: 낮음 (helper + ThemeBuilder UI 만 변경)
**선행 조건**: Phase 5 (ThemeBuilder 활성화)
**후속 단계**: Save as Draft Preset (V2)

---

## 1. 목적

디자이너가 ThemeBuilder 에서 만든 preset 조합을 JSON / TypeScript 파일로 다운로드. UI 개발자가 받아서 `src/tokens/presets/{service}/{version}/preset.ts` 에 반영.

§ 17.4 의 고도화 단계 중 첫 번째: "Export Token JSON".

## 2. 동작

```
ThemeBuilder 에서 theme/brand/density 선택
→ "Export Preset" 버튼 클릭
→ 선택지:
   - Download JSON (Preset object as .json)
   - Copy as TS (Preset object as .ts code in clipboard)
```

## 3. 작업 항목

### 3.1 Export helper
- [ ] `stories/builders/ThemeBuilder/export-preset.ts`
  - `exportPresetJson(preset)` → JSON 문자열 (pretty-print)
  - `exportPresetTs(preset)` → TS code 문자열 (Preset 타입 import + export const)
  - `downloadFile(filename, content, mimeType)` 헬퍼
  - `copyToClipboard(text)` 헬퍼

### 3.2 ThemeBuilder UI
- [ ] 우측에 "Export" 섹션 추가
- [ ] 두 버튼: Download JSON / Copy TypeScript
- [ ] 클릭 시 즉시 동작
- [ ] (선택) toast 또는 inline 피드백

### 3.3 Preset id 입력
- [ ] 사용자가 export 전 preset id 변경 가능 (예: "platform-custom-1")

## 4. 검증
- [ ] typecheck 통과
- [ ] Download JSON 클릭 시 브라우저 파일 다운로드
- [ ] Copy TS 클릭 시 clipboard 에 TS code 복사
- [ ] 다운로드된 JSON 을 `import {} from './my-preset.json'` 으로 import 가능한 형태

## 5. 산출물
- `stories/builders/ThemeBuilder/export-preset.ts`
- 확장된 `ThemeBuilder.stories.tsx`
- 본 plan 문서

## 6. 제외 (V2+)
- "Save as Draft" — server 저장
- "Create PR" — GitHub 연동
- PageComposer / LayoutComposer 의 동일 export 기능
