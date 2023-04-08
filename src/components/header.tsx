import React, { FC } from 'react';
import {
  IconButton,
  LogoutIcon,
  Navbar,
  ProfilePic,
  SettingsIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const Header: FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Navbar logoHref={'/'} logoAriaLabel={'Navigate to home'}>
          <span className={'absolute top-0'}>
            <Link href={`/profile/${session.user?.id}`}>
              <ProfilePic altText={'Profilbild'} editLabel={'Bearbeiten'} imageUrl={session?.user?.avatarUrl} size={'S'} />
            </Link>
          </span>
          <div className={'pl-xxl'}>
            <IconButton label={'Settings'} variant={'purple'} iconText={'Settings'}>
              <SettingsIcon size={24} />
            </IconButton>
          </div>
          <a href="#" onClick={() => signOut()}>
            <IconButton label={'Logout'} variant={'purple'} iconText={'Logout'}>
              <LogoutIcon size={24} />
            </IconButton>
          </a>
        </Navbar>
      </>
    );
  } else {
    // TODO: Here better solution
    return null;
  }
};
