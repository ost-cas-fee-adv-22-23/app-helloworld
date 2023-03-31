import React, { FC, useReducer } from 'react';
import {
  Card,
  CommentButton,
  CopyButton,
  LikeButtonWithReactionButton,
  ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useSession } from 'next-auth/react';
import { CommentMumble } from './comment';
import { likePost } from '../services/likes';
import { Mumble } from '../services/serviceTypes';

interface MumbleCard {
  mumble: Mumble;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(mumbleCardReducer, { showComment: false, mumble });

  const likedPost = async () => {
    const test = await likePost({
      postId: state.mumble.id,
      likedByUser: state.mumble.likedByUser,
      accessToken: session?.accessToken,
    });
    console.log('asdf');
    console.log(test);
    dispatch({ type: 'post_liked', likedByUser: !state.mumble.likedByUser });
  };

  function mumbleCardReducer(state, action) {
    switch (action.type) {
      case 'post_liked': {
        return {
          ...state,
          mumble: {
            ...state.mumble,
            likedByUser: action.likedByUser,
            likeCount: action.likedByUser ? (state.mumble?.likeCount ?? 0) + 1 : state.mumble?.likeCount - 1,
          },
        };
      }
      case 'comment': {
        return {
          ...state,
          showComment: !state.showComment,
        };
      }
      case 'add_comment': {
        return {
          ...state,
          showComment: false,
        };
      }
    }
  }

  return (
    <>
      <Card borderType={'rounded'}>
        <ProfileHeader
          fullName={`${state.mumble?.creatorProfile?.firstName} ${state.mumble?.creatorProfile?.lastName}`}
          labelType={'M'}
          profilePictureSize={'M'}
          timestamp={state.mumble.createdDate}
          username={state.mumble?.creatorProfile?.userName}
          imageSrc={state.mumble?.creatorProfile?.avatarUrl}
          hrefProfile={'#'}
          altText={'Avatar'}
        ></ProfileHeader>
        <a href={`/mumble/${state.mumble.id}`}>
          <div className={'mt-l'}>
            <p className={'paragraph-M'}>{state.mumble.text}</p>
          </div>
        </a>
        <div className="flex relative -left-3 space-x-8">
          <CommentButton
            label={{ noComments: 'Comment', someComments: 'Comments' }}
            numberOfComments={state.mumble.replyCount}
            onClick={(e) => {
              dispatch({ type: 'comment' });
            }}
          />
          <LikeButtonWithReactionButton
            onClick={() => likedPost()}
            active
            label={{
              noReaction: 'Like',
              oneReaction: 'Like',
              reactionByCurrentUser: 'Liked',
              severalReaction: 'Likes',
            }}
            likes={state.mumble.likeCount ?? 0}
            reactionByCurrentUser={state.mumble.likedByUser}
          />
          <CopyButton onClick={undefined} active={false} label={{ inactive: 'Copy Link', active: 'Link copied' }} />
        </div>
        {state.showComment && <CommentMumble mumbleId={state.mumble.id}></CommentMumble>}
      </Card>
    </>
  );
};
