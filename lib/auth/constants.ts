export const AUTH_ERRORS = {
  invalidCredentials: 'Invalid email or password.',
  rateLimited: 'Too many attempts. Please try again later.',
  emailNotVerified: 'Please verify your email before signing in. Check your inbox for the confirmation link.',
  genericFailure: 'Something went wrong. Please try again.',
} as const;
