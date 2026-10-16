// Supabase surfaces raw GoTrue messages like "Invalid login credentials" and
// "AuthApiError: For security purposes, you can only request this after 51
// seconds". Those are accurate and unhelpful. Map the ones people actually hit.

const MAP: [RegExp, string][] = [
  [/invalid login credentials/i, "That email and password do not match an account. Check both, or create an account instead."],
  [/email not confirmed/i, "This account still needs confirming. Open the link in the email we sent you, then come back."],
  [/user already registered|already been registered/i, "There is already an account with that email. Sign in instead, or reset the password."],
  [/password should be at least/i, "That password is too short. Use at least 6 characters."],
  [/only request this after (\d+) seconds?/i, "Too many tries in a row. Wait about a minute, then try again."],
  [/rate limit|too many requests/i, "Too many tries in a row. Wait a minute, then try again."],
  [/unable to validate email|invalid format/i, "That does not look like a valid email address."],
  [/new password should be different/i, "That is the password you already have. Pick a different one."],
  [/failed to fetch|network/i, "Could not reach the server. Check your connection and try again."],
];

export function friendly(message: string): string {
  for (const [pattern, text] of MAP) {
    if (pattern.test(message)) return text;
  }
  return message;
}
