# Legacy Layer

이 폴더는 호환성 목적의 임시 진입점이다.

## Why It Exists

- 기존 `Portal*` 기반 소비 코드를 한 번에 끊을 수 없기 때문이다.

## How To Use It

- 가능하면 쓰지 않는다
- 꼭 필요하면 `@ingradient/ui/legacy`로만 접근한다

## Do Not

- 새 public API를 legacy에 추가하지 않는다
- 새 코드에서 legacy 이름을 기준으로 설계하지 않는다

legacy는 확장 대상이 아니라 제거 대상이다.
