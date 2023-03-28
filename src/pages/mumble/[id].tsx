import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchMumbleById, fetchReplies, Mumble, Reply } from '../../services/mumble';
import { getToken } from 'next-auth/jwt';
import { MumbleCard } from '../../components/mumbleCard';
import { fetchUsers } from '../../services/users';
import {mockSession} from 'next-auth/client/__tests__/helpers/mocks';
import user = mockSession.user;

type Props = {
  mumble: Mumble;
  replies?: Reply[];
};

export default function MumblePage({ mumble, replies }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const replies1 = replies ?? [];
  return (
    <>
      <div className={'grid grid-cols-1 justify-items-center mt-m'}>
        <MumbleCard mumble={mumble}></MumbleCard>
        <ul>
          {replies1.map((reply) => (
            <li key={reply.id} className={'m-s'}>
              <MumbleCard mumble={reply}></MumbleCard>
            </li>
          ))}
        </ul>
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

  // TODO: Find out how to avoid this fetchUsers-Call
  const [{ mumble }, { replies }, { users }] = await Promise.all([
    fetchMumbleById({ postId, accessToken: session?.accessToken }),
    fetchReplies({ postId, accessToken: session?.accessToken }),
    fetchUsers({ accessToken: session?.accessToken }),
  ]);

  const repliesWithUserInfo = replies.map(reply => {
      const creator = users?.find((user) => user.id === reply.creator);

      return ({...reply,
          creatorProfile: {
          id: creator?.id,
              userName: creator?.userName,
              firstName: creator?.firstName,
              lastName: creator?.lastName,
              fullName: `${mumble?.creatorProfile?.firstName} ${mumble?.creatorProfile?.lastName}`,
              avatarUrl: creator?.avatarUrl,
      }})
  })

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
