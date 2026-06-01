import 'server-only';

export type OAuthProviders = {
  google: boolean;
  github: boolean;
  facebook: boolean;
};

/** Server-only: never use OAuth secrets in client bundles. */
export function getEnabledOAuthProviders(): OAuthProviders {
  return {
    google: Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID?.trim()),
    github: Boolean(process.env.GITHUB_OAUTH_CLIENT_ID?.trim()),
    facebook: Boolean(process.env.FACEBOOK_OAUTH_CLIENT_ID?.trim()),
  };
}
