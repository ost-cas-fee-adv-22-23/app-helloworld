import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { MumbleCard } from '../../components/mumbleCard';
import { fetchUsers } from '../../services/users';
import { fetchMumbleById, fetchReplies } from '../../services/posts';
import { Mumble, Reply } from '../../services/serviceTypes';
import { Card } from '@smartive-education/design-system-component-library-hello-world-team';

type Props = {
  mumble: Mumble;
  replies?: Reply[];
};

export default function MumblePage({ mumble, replies }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <>
      <div className={'grid grid-cols-1 justify-items-center mt-m'}>
        <div className={'w-screen md:w-615'}s>
        <Card borderType={'rounded'} size={'M'}>
          <div className={'divide-y-1 divide-slate-200'}>
            <div className={'pb-m'}>
              <MumbleCard mumble={mumble}></MumbleCard>
            </div>
            {replies && replies.length > 0 && (
              <ul className={'divide-y-1 divide-slate-200 -mx-xl'}>
                {replies.map((reply) => (
                  <li key={reply.id} className={'pt-xl pb-m'}>
                    <div className={'mx-xl'}>
                      <MumbleCard mumble={reply}></MumbleCard>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  let postId = '';
  if (typeof id === 'string') {
    postId = id;
  }

  const session = await getToken({ req });

  const [{ mumble }, { replies }, { users }] = await Promise.all([
    fetchMumbleById({ postId, accessToken: session?.accessToken }),
    fetchReplies({ postId, accessToken: session?.accessToken }),
    fetchUsers({ accessToken: session?.accessToken }),
  ]);

  const repliesWithUserInfo = replies.map((reply) => {
    const creator = users?.find((user) => user.id === reply.creator);

    return {
      ...reply,
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

  const creator = users?.find((user) => user.id === mumble.creator);
  const mumbleWithUserInfo = {
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

  return {
    props: {
      mumble: mumbleWithUserInfo,
      replies: repliesWithUserInfo,
    },
  };
};
