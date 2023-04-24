import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { MumbleCard } from '../../components/mumble-card';
import { fetchUsers } from '../../services/users';
import { fetchMumbleById, fetchReplies } from '../../services/posts';
import { Mumble, Reply, User } from '../../services/service-types';
import { BorderType, Card, Size } from '@smartive-education/design-system-component-library-hello-world-team';
import { useReducer } from 'react';
import { mumblePageReducer } from '../../state/mumble-page-reducer';
import { MumblePageState } from '../../state/state-types';
import { addCreatorToReplies, addCreatorToReply } from '../../utils/creator-to';

type Props = {
  mumble: Mumble;
  replies?: Reply[];
  users: User[];
};

export default function MumblePage({
  mumble,
  replies,
  users,
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const initialMumbleCardState: MumblePageState = { mumble, replies: replies ?? [] };
  const [state, dispatch] = useReducer(mumblePageReducer, initialMumbleCardState);

  const commentSubmitted = (newReply: Reply) => {
    dispatch({ type: 'comment_submitted', newReply: addCreatorToReply(newReply, users) });
  };

  return (
    <>
      <div className={'grid grid-cols-1 justify-items-center m-s md:my-xl'}>
        <div className={'w-full md:w-615'}>
          <Card borderType={BorderType.rounded} size={Size.M}>
            <div className={'divide-y-1 divide-slate-200'}>
              <div className={'pb-m'}>
                <MumbleCard mumble={state.mumble} showComments={true} commentSubmitted={commentSubmitted}></MumbleCard>
              </div>
              {replies && replies.length > 0 && (
                <ul className={'divide-y-1 divide-slate-200 -mx-xl'}>
                  {state.replies.map((reply) => (
                    <li key={reply.id} className={'pt-xl pb-m'}>
                      <div className={'mx-xl'}>
                        <MumbleCard mumble={reply} commentSubmitted={commentSubmitted}></MumbleCard>
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

  const repliesWithUserInfo = addCreatorToReplies(replies, users);

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
      users,
    },
  };
};
