// 로그인 화면 fixture. 현장 PC 는 보통 오프라인이라 .ige 프로젝트 파일로 들어간다.
import type { LoginLabels, LoginPackageInfo, LoginSavedSession } from '@ingradient/edge-pages'
import { SAMPLE_USER } from './chrome'

export const LOGIN_LABELS: LoginLabels = {
  title: 'INGRADIENT Edge',
  online: 'Online',
  offline: 'Offline',
  onlineSupport: 'Online supported',
  loadPackage: 'Load Project File (.ige)',
  loading: 'Loading...',
  emailLabel: 'Email',
  emailPlaceholder: 'user@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  savePassword: 'Save Password',
  keepSignedIn: 'Keep Me Signed In',
  submit: 'Login',
  submitting: 'Verifying...',
  register: 'Register',
  greeting: (name) => `Welcome, ${name}`,
  continueSession: 'Continue',
  changeAccount: 'Sign in with another account',
  settingsTitle: 'Settings',
}

/** 불러온 .ige 파일 정보. platform_url 이 없으면 완전 오프라인 패키지다. */
export const PACKAGE_INFO: LoginPackageInfo = {
  project_name: 'FINEMTECH (Metal)',
  package_version: 2,
}

export const SAVED_SESSION: LoginSavedSession = {
  user_id: 'u-1',
  name: SAMPLE_USER.name,
  email: SAMPLE_USER.email,
}
