import {
  Card,
  CommentButton,
  CopyButton,
  LikeButtonWithReactionButton,
  Navbar,
  ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';
import {getSession, signOut, useSession} from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchMumbles, likePost, Mumble } from '../services/mumble';
import { useState } from 'react';
import { fetchUsers } from '../services/users';
import { WriteMumble } from '../components/writeMumble';
import { MumbleCard } from '../components/mumbleCard';

type PageProps = {
  count: number;
  mumbles: Mumble[];
  error?: string;
};

export default function PageHome({
  mumbles: initialMumbles,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const [mumbles] = useState(initialMumbles);

  const likedPost = (postId: string) => likePost({ postId, accessToken: session?.accessToken });

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <Navbar logoHref={'#'} logoAriaLabel={'Navigate to home'}>
        <span>Profile</span>
        <span>Settings</span>
        <a href="#" onClick={() => signOut()}>
          <p>Logout</p>
        </a>
      </Navbar>

      <div className={'grid grid-cols-1 justify-items-center'}>
        <WriteMumble></WriteMumble>
        <ul className={'w-screen md:w-615'}>
          {mumbles.map((mumble) => (
            <li key={mumble.id} className={'m-s'}>
              <MumbleCard mumble={mumble}></MumbleCard>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const { count, mumbles } = await fetchMumbles({ limit: 200 });
    const { users } = await fetchUsers({ accessToken: session.accessToken });

    const mumblesWithUserInfo = mumbles.map((mumble) => {
      const creator = users?.find((user) => user.id === mumble.creator);
      return {
        ...mumble,
        creatorProfile: {
          id: creator?.id,
          userName: creator?.userName,
          firstName: creator?.firstName,
          lastName: creator?.lastName,
          fullName: `${mumble?.creatorProfile?.firstName} ${mumble?.creatorProfile?.lastName}`,
          avatarUrl: creator?.avatarUrl,
        },
      };
    });

    return { props: { count, mumbles: mumblesWithUserInfo } };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, mumbles: [], count: 0 } };
  }
};
