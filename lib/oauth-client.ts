export function signInWithOAuth(provider: 'google' | 'github') {
  window.location.href = `/api/oauth/${provider}`;
}
