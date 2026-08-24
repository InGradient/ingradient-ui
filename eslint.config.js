import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'
import globals from 'globals'

// ui-refactoring-rule.md 재발 방지 lint:
//  #7 store/API/SDK 직접 의존 금지 (모든 라이브러리 계층)
const NO_STORE_API = { group: ['axios', '@reduxjs/*', 'redux', 'zustand', '*/api/*', '*/sdk/*'], message: 'UI library 안에서 API/store/SDK 직접 import 금지 (규칙 #7)' }

export default tseslint.config(
  { ignores: ['lib/', 'dist/', 'node_modules/', 'apps/'] },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: { security },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'security/detect-eval-with-expression': 'error',
      'no-debugger': 'error',
    },
  },

  // 규칙 #9: 비표준 props 이름 차단 (typeStyle/inputSize/btnType 등)
  {
    files: ['src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'TSPropertySignature[key.name=/^(typeStyle|inputSize|btnType|btnSize|btnVariant)$/]',
        message: '비표준 props 이름 (규칙 #9). variant/size/disabled 같은 공통 이름 사용',
      }],
    },
  },

  // 규칙 #2/#7: primitive 는 components/patterns/pages 역참조 금지 + store/API 금지
  {
    files: ['src/primitives/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['**/components/**', '**/patterns/**', '**/pages/**', '@ingradient/ui/components', '@ingradient/ui/patterns'], message: 'primitive → 상위 계층 역참조 금지 (규칙 #2)' },
        NO_STORE_API,
      ] }],
    },
  },

  // 규칙 #2/#7: components 는 patterns/pages 역참조 금지 + store/API 금지
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['**/patterns/**', '**/pages/**', '@ingradient/ui/patterns'], message: 'components → patterns/pages 역참조 금지 (규칙 #2)' },
        NO_STORE_API,
      ] }],
    },
  },

  // 규칙 #2/#7: patterns 는 pages 역참조 금지 + store/API 금지
  {
    files: ['src/patterns/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['**/pages/**'], message: 'patterns → pages 역참조 금지 (규칙 #2)' },
        NO_STORE_API,
      ] }],
    },
  },

  // 규칙 #7: package pages 도 store/API 금지
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        NO_STORE_API,
      ] }],
    },
  },

  // stories/tests 는 데모·검수용(규칙 #6/#11)이라 계층 교차 import 허용 — #2 제한 해제
  {
    files: ['src/**/*.stories.{ts,tsx}', 'src/**/*.test.{ts,tsx}', 'packages/*/src/**/*.stories.{ts,tsx}', 'packages/*/src/**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
