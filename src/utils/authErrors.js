const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'Email inválido.',
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/wrong-password': 'Email ou senha incorretos.',
  'auth/user-not-found': 'Email ou senha incorretos.',
  'auth/missing-password': 'Informe sua senha.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/email-already-in-use': 'Já existe uma conta com este email.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  'auth/requires-recent-login': 'Por segurança, saia e entre novamente para alterar a senha.',
}

export const MIN_PASSWORD_LENGTH = 6

export function getAuthErrorMessage(
  error,
  fallback = 'Algo deu errado. Tente novamente.'
) {
  return AUTH_ERROR_MESSAGES[error?.code] || fallback
}
