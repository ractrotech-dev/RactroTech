import Image from 'next/image'

import {
  signInWithFacebookAdmin,
  signInWithGithubAdmin,
  signInWithGoogleAdmin,
} from '@/app/admin/login/actions'
import { buttonClass } from '@/components/admin/ui'
import type { OAuthProviders } from '@/lib/oauth/enabled-providers'

const providerIcons = {
  google: 'https://img.icons8.com/color/48/google-logo.png',
  facebook: 'https://img.icons8.com/color/48/facebook-new.png',
  github: 'https://img.icons8.com/ios-filled/50/000000/github.png',
}

type AdminProviderSigninBlockProps = {
  providers: OAuthProviders
}

const providerButton = buttonClass('secondary', 'md', 'h-10 w-full')

export default function AdminProviderSigninBlock({ providers }: AdminProviderSigninBlockProps) {
  const { google: isGoogleEnabled, github: isGithubEnabled, facebook: isFacebookEnabled } =
    providers

  return (
    <div className="grid gap-2">
      {isGoogleEnabled && (
        <form action={signInWithGoogleAdmin} className="w-full">
          <button aria-label="Continue with Google" type="submit" className={providerButton}>
            <Image src={providerIcons.google} alt="" width={16} height={16} className="h-4 w-4" />
            Continue with Google
          </button>
        </form>
      )}
      {isFacebookEnabled && (
        <form action={signInWithFacebookAdmin} className="w-full">
          <button aria-label="Continue with Facebook" type="submit" className={providerButton}>
            <Image src={providerIcons.facebook} alt="" width={16} height={16} className="h-4 w-4" />
            Continue with Facebook
          </button>
        </form>
      )}
      {isGithubEnabled && (
        <form action={signInWithGithubAdmin} className="w-full">
          <button aria-label="Continue with GitHub" type="submit" className={providerButton}>
            {/* The GitHub mark is a black PNG; invert it so it stays visible in dark mode. */}
            <Image src={providerIcons.github} alt="" width={16} height={16} className="h-4 w-4 dark:invert" />
            Continue with GitHub
          </button>
        </form>
      )}
    </div>
  )
}
