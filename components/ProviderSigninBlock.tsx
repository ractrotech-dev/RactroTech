import { signInWithFacebook, signInWithGithub, signInWithGoogle } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import type { OAuthProviders } from '@/lib/oauth/enabled-providers';
import Image from 'next/image';

const providerIcons = {
  google: 'https://img.icons8.com/color/48/google-logo.png',
  facebook: 'https://img.icons8.com/color/48/facebook-new.png',
  github: 'https://img.icons8.com/ios-filled/50/000000/github.png',
};

type ProviderSigninBlockProps = {
  providers: OAuthProviders;
};

export default function ProviderSigninBlock({ providers }: ProviderSigninBlockProps) {
  const { google: isGoogleEnabled, github: isGithubEnabled, facebook: isFacebookEnabled } =
    providers;

  return (
    <div className="grid gap-2">
      {isGoogleEnabled && (
        <form action={signInWithGoogle} className="w-full">
          <Button
            variant="outline"
            aria-label="Continue with Google"
            type="submit"
            className="h-9 w-full justify-start gap-2 border-2 border-black bg-white px-3 text-[10px] font-black tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-50"
          >
            <Image src={providerIcons.google} alt="Google" width={16} height={16} className="h-4 w-4" />
            Continue with Google
          </Button>
        </form>
      )}
      {isFacebookEnabled && (
        <form action={signInWithFacebook} className="w-full">
          <Button
            variant="outline"
            aria-label="Continue with Facebook"
            type="submit"
            className="h-9 w-full justify-start gap-2 border-2 border-black bg-white px-3 text-[10px] font-black tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-50"
          >
            <Image src={providerIcons.facebook} alt="Facebook" width={16} height={16} className="h-4 w-4" />
            Continue with Facebook
          </Button>
        </form>
      )}
      {isGithubEnabled && (
        <form action={signInWithGithub} className="w-full">
          <Button
            variant="outline"
            aria-label="Continue with Github"
            type="submit"
            className="h-9 w-full justify-start gap-2 border-2 border-black bg-white px-3 text-[10px] font-black tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-50"
          >
            <Image src={providerIcons.github} alt="Github" width={16} height={16} className="h-4 w-4" />
            Continue with Github
          </Button>
        </form>
      )}
    </div>
  );
}
