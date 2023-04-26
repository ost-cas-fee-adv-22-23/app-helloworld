import { signIn, useSession } from 'next-auth/react';
import { BrandingLogo, Button, MumbleIcon } from '@smartive-education/design-system-component-library-hello-world-team';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  });

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 divide-x h-screen'}>
      <div className={'bg-gradient-to-br from-pink-500 to-violet-500 flex justify-center items-center'}>
        <div className={'label-XL text-center'}>
          <div className={'flex justify-center'}>
            <BrandingLogo orientation={'horizontal'} color={'white'}></BrandingLogo>
          </div>
          <div className={'text-pink-300'}>
            Find out what&apos;s new in <span className={'text-white'}>#fashion</span>.
          </div>
        </div>
      </div>

      <div className={'flex justify-center items-center'}>
        <div>
          <h1 className={'label-XL'}>Anmelden</h1>
          <Button label="Let's mumble" onClick={() => signIn('zitadel', { callbackUrl: '/' })} size="L" variant="gradient">
            <MumbleIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
