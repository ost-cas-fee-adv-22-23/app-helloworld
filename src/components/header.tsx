import React, { FC } from 'react';
import {
  IconButton,
  LogoutIcon,
  Navbar,
  ProfilePic,
  SettingsIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { signOut, useSession } from 'next-auth/react';
import { profileAvatar } from '../utils/profile-avatar';

export const Header: FC = () => {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <Navbar logoHref={'/'} logoAriaLabel={'Navigate to home'}>
          <span className={'absolute top-0'}>
            <a href={`/profile/me`}>
              <ProfilePic
                altText={'Profilbild'}
                editLabel={'Bearbeiten'}
                imageUrl={profileAvatar(session?.user?.avatarUrl)}
                size={'S'}
              />
            </a>
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
      )}
    </>
  );
};
