import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { fetchUsers } from '../services/users';
import { fetchMumbles } from '../services/posts';
import { MumbleList } from '../components/mumbleList';

export default function PageHome({ mumbles, users, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <MumbleList mumbles={mumbles} users={users}></MumbleList>
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
    const { count, mumbles } = await fetchMumbles({ limit: 10 });
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

    return { props: { count, mumbles: mumblesWithUserInfo, users } };
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
