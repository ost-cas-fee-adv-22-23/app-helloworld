import React, { ChangeEvent, FC, useReducer } from 'react';
import {
  CommentButton,
  CopyButton,
  LikeButtonWithReactionButton,
  ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useSession } from 'next-auth/react';
import { CommentMumble } from './comment';
import { likePost } from '../services/likes';
import { Mumble } from '../services/serviceTypes';
import { commentPost } from '../services/posts';

interface MumbleCard {
  mumble: Mumble;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(mumbleCardReducer, { showComment: false, mumble, comment: '' });

  const likedPost = async () => {
    await likePost({
      postId: state.mumble.id,
      likedByUser: state.mumble.likedByUser,
      accessToken: session?.accessToken,
    });
    dispatch({ type: 'post_liked', likedByUser: !state.mumble.likedByUser });
  };

  const handleCommentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'comment_changed', comment: e.target.value });
  };

  const submitComment = async () => {
    commentPost({ postId: state.mumble.id, comment: state.comment, accessToken: session?.accessToken });
    dispatch({ type: 'comment_submitted' });
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
      case 'comment_changed': {
        return {
          ...state,
          comment: action.comment,
        };
      }
      case 'comment_submitted': {
        return {
          ...state,
          comment: '',
          showComment: false,
          mumble: {
            ...state.mumble,
            replyCount: state.mumble.replyCount + 1,
          },
        };
      }
    }
  }

  return (
    <>
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
        <div className={'my-l'}>
          <p className={'paragraph-M'}>{state.mumble.text}</p>
          <img src={state.mumble.mediaUrl} className="h-178 w-264"></img>
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
      {state.showComment && (
        <CommentMumble
          user={session?.user}
          handleCommentChanged={handleCommentChanged}
          submitComment={submitComment}
        ></CommentMumble>
      )}
    </>
  );
};
