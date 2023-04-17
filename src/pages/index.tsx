import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { fetchUsers } from '../services/users';
import { fetchMumbles } from '../services/posts';
import { MumbleList } from '../components/mumble-list';

export default function PageHome({ mumbles, users, error, count }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <div className={'grid grid-cols-1 justify-items-center'}>
        <h2 className={'head-2 text-violet-500'}>Willkommen auf Mumble</h2>
        <h4 className={'head-4 text-slate-500 w-[550px] mb-m'}>
          Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
        </h4>
      </div>
      <MumbleList
        mumbles={mumbles}
        users={users}
        totalMumbles={count}
        showWriteCard={true}
        mumbleKey={'mumbles'}
      ></MumbleList>
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

    return { props: { count, mumbles, users } };
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
