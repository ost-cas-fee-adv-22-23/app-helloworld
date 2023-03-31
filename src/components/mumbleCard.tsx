import React, { FC, useReducer } from 'react';
import { Mumble } from '../services/mumble';
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

interface MumbleCard {
  mumble: Mumble;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(mumbleCardReducer, { showComment: false });

  const likedPost = (postId: string, likedByUser: boolean) =>
    likePost({ postId, likedByUser, accessToken: session?.accessToken });

  function mumbleCardReducer(state, action) {
    switch (action.type) {
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
            onClick={(e) => {
              dispatch({ type: 'comment' });
            }}
          />
          <LikeButtonWithReactionButton
            onClick={() => likedPost(mumble.id, mumble.likedByUser)}
            active
            label={{
              noReaction: 'Like',
              oneReaction: 'Like',
              reactionByCurrentUser: 'Liked',
              severalReaction: 'Likes',
            }}
            likes={mumble.likeCount ?? 0}
            reactionByCurrentUser={false}
          />
          <CopyButton onClick={undefined} active={false} label={{ inactive: 'Copy Link', active: 'Link copied' }} />
        </div>
        {state.showComment && <CommentMumble mumbleId={mumble.id}></CommentMumble>}
      </Card>
    </>
  );
};
