import { FC } from 'react';
import { Navbar } from '@smartive-education/design-system-component-library-hello-world-team';
import { signOut } from 'next-auth/react';

export const Header: FC = () => {
  return (
    <>
      <Navbar logoHref={'#'} logoAriaLabel={'Navigate to home'}>
        <span>Profile</span>
        <span>Settings</span>
        <a href="#" onClick={() => signOut()}>
          <p>Logout</p>
        </a>
      </Navbar>
    </>
  );
};
