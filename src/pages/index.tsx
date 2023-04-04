import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useReducer } from 'react';
import { fetchUsers } from '../services/users';
import { MumbleCard } from '../components/mumbleCard';
import { fetchMumbles } from '../services/posts';
import { Button, Card, MumbleIcon } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble } from '../services/serviceTypes';

export default function PageHome({ mumbles, users, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [state, dispatch] = useReducer(mumbleCardReducer, { mumbles, users, nextOffset: 10 });

  function mumbleCardReducer(state, action) {
    switch (action.type) {
      case 'reload_mumbles': {
        return {
          ...state,
          mumbles: [
            ...state.mumbles,
            ...action.reloadedMumbles.map((mumble) => {
              const creator = state.users?.find((user) => user.id === mumble.creator);
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
            }),
          ],
          nextOffset: state.nextOffset + 10,
        };
      }
    }
  }

  const loadMore = async () => {
    const reloadedMumbles = await fetchMumbles({ limit: 10, offset: state.nextOffset });
    dispatch({ type: 'reload_mumbles', reloadedMumbles: reloadedMumbles.mumbles });
  };

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <div className={'grid grid-cols-1 justify-items-center'}>
        <h1 className={'head-1 text-violet-500'}>Willkommen auf Mumble</h1>
        <ul className={'w-screen md:w-615'}>
          {state.mumbles.map((mumble: Mumble) => (
            <li key={mumble.id} className={'m-s'}>
              <Card borderType={'rounded'}>
                <MumbleCard mumble={mumble}></MumbleCard>
              </Card>
            </li>
          ))}
        </ul>
        <Button label="Load more" onClick={() => loadMore()} variant="purple">
          <MumbleIcon size={16} />
        </Button>
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
