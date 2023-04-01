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
import { Mumble, Reply } from '../services/serviceTypes';
import { commentPost } from '../services/posts';
import Link from 'next/link';

interface MumbleCard {
  mumble: Mumble;
  showComments?: boolean;
  commentSubmitted?: (newReply: Reply) => void;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble, showComments, commentSubmitted }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(mumbleCardReducer, { showComments, mumble, comment: '' });

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
    const newPost = await commentPost({
      postId: state.mumble.id,
      comment: state.comment,
      accessToken: session?.accessToken,
    });
    dispatch({ type: 'comment_submitted', newPost });

    commentSubmitted && commentSubmitted(newPost);
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
          showComments: !state.showComments,
        };
      }
      case 'add_comment': {
        return {
          ...state,
          showComments: false,
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
      <div className={'my-l'}>
        <p className={'paragraph-M'}>{state.mumble.text}</p>
        <img src={state.mumble.mediaUrl} className="h-178 w-264"></img>
      </div>
      <div className="flex relative -left-3 space-x-8">
        {/*TODO This Comment should exist as label in the storybook*/}
        <Link href={`/mumble/${state.mumble.id}`}>
          {' '}
          <CommentButton
            label={{ noComments: 'Comment', someComments: 'Comments' }}
            numberOfComments={state.mumble.replyCount}
            onClick={() => null}
          />
        </Link>
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
      {state.showComments && (
        <CommentMumble
          user={session?.user}
          handleCommentChanged={handleCommentChanged}
          submitComment={submitComment}
        ></CommentMumble>
      )}
    </>
  );
};
