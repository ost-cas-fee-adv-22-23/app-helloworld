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
    <div className={'text-violet-500 w-full'}>
      <div className={'grid grid-cols-1 justify-items-center m-m'}>
        <h1 className={'head-4 md:head-1'}>
          Willkommen auf Mumble
        </h1>
        <div className={'text-slate-500 '}>
          <h2 className={'paragraph-M md:head-4 md:w-615'}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </h2>
        </div>
      </div>
      <div className={'text-slate-900'}>
        <MumbleList
          mumbles={mumbles}
          users={users}
          totalMumbles={count}
          showWriteCard={true}
          mumbleKey={'mumbles'}
        ></MumbleList>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  try {
    const { count, mumbles } = await fetchMumbles({ limit: 10 });
    const { users } = await fetchUsers({ accessToken: session?.accessToken });

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
