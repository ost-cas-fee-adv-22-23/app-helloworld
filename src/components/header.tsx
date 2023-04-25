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
import { useRouter } from 'next/router';
import Image from 'next/image';

export const Header: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const href = `/profile/me`;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      {session && (
        <Navbar logoHref={'/'} logoAriaLabel={'Navigate to home'}>
          <span className={'absolute top-0'}>
            <a href={href} onClick={(e) => handleClick(e)}>
              <ProfilePic
                altImage={'Profilbild'}
                editLabel={'Bearbeiten'}
                imageUrl={profileAvatar(session?.user?.avatarUrl)}
                nextImage={Image}
                size={'S'}
              />
            </a>
          </span>
          <div className={'pl-xxl'}>
            <IconButton label={'Settings'} variant={'purple'} iconText={'Settings'}>
              <SettingsIcon size={24} />
            </IconButton>
          </div>
          <a href="#" onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
            <IconButton label={'Logout'} variant={'purple'} iconText={'Logout'}>
              <LogoutIcon size={24} />
            </IconButton>
          </a>
        </Navbar>
      )}
    </>
  );
};
