import {
  Card,
  CommentButton,
  CopyButton,
  LikeButtonWithReactionButton,
  Navbar,
  ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { getSession, signOut } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import {fetchMumbles, likePost, Mumble} from '../services/mumble';
import { useState } from 'react';
import { fetchUsers } from '../services/users';

type PageProps = {
  count: number;
  mumbles: Mumble[];
  error?: string;
};

export default function PageHome({
  mumbles: initialMumbles,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {


   const likedPost = (postId: string) => likePost({postId});


  const [mumbles] = useState(initialMumbles);

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
        <ul className={'w-screen md:w-615'}>
          {mumbles.map((mumble) => (
            <li key={mumble.id} className={'m-s'}>
              <Card borderType={'rounded'}>
                <ProfileHeader
                  fullName={`${mumble?.creatorProfile?.firstName} ${mumble?.creatorProfile?.lastName}`}
                  labelType={'M'}
                  profilePictureSize={'M'}
                  timestamp={mumble.createdDate}
                  username={mumble?.creatorProfile?.userName}
                  imageSrc={mumble?.creatorProfile?.avatarUrl}
                  hrefProfile={'#'}
                  altText={'Avatar'}
                ></ProfileHeader>
                <div className={'mt-l'}>
                  <p className={'paragraph-M'}>{mumble.text}</p>
                </div>

                <div className="flex relative -left-3 space-x-8">
                  <CommentButton
                    label={{ noComments: 'Comment', someComments: 'Comments' }}
                    numberOfComments={mumble.replyCount}
                    onClick={undefined}
                  />
                  <LikeButtonWithReactionButton
                    onClick={() => likedPost(mumble.id)}
                    active
                    label={{
                      noReaction: 'Like',
                      oneReaction: 'Like',
                      reactionByCurrentUser: 'Liked',
                      severalReaction: 'Likes',
                    }}
                    likes={mumble.likeCount ?? 0}
                    reactionByCurrentUser={mumble.likedByUser}
                  />
                  <CopyButton onClick={undefined} active={false} label={{ inactive: 'Copy Link', active: 'Link copied' }} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps= async (context) => {
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
    const { users } = await fetchUsers({accessToken: session.accessToken});

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
