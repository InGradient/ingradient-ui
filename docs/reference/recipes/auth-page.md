# Recipe: Auth Page

## Use This When

- 로그인/회원가입/간단한 onboarding form을 빠르게 조립해야 할 때

## Recommended Building Blocks

- `IngradientThemeProvider`
- `IngradientGlobalStyle`
- `AppShell`
- `PageContent`
- `Surface` or `Card`
- `FormSection`
- `FieldGroup`
- `FieldLabel`
- `TextField`
- `PasswordField`
- `Button`
- `BrandLogo`

## Composition Order

1. theme와 global style 적용
2. 가운데 정렬된 shell 구성
3. `BrandLogo` 배치
4. `FormSection`과 `FieldGroup`으로 field 묶기
5. primary/secondary button 배치

## Don’t

- auth flow를 위해 별도 input/button 스타일 세트를 다시 만들지 않는다

## Related Docs

- [../getting-started.md](../getting-started.md)
- [../patterns/form-section.md](../patterns/form-section.md)
