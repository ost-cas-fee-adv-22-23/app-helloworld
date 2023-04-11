import React, { ChangeEvent, FC, useEffect, useReducer } from 'react';
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
import Image from 'next/image';

interface MumbleCard {
  mumble: Mumble;
  showComments?: boolean;
  commentSubmitted?: (newReply: Reply) => void;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble, showComments, commentSubmitted }) => {
  const { data: session } = useSession();

  const handleResize = () => {
    if (state.device === 'desktop' && innerWidth < 600) {
      dispatch({ type: 'device_mobile' });
    } else if (state.device === 'mobile' && innerWidth > 600) {
      dispatch({ type: 'device_desktop' });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const [state, dispatch] = useReducer(mumbleCardReducer, {
    showComments,
    mumble,
    device: 'mobile',
  });

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

  const copyMumbleUrl = () => navigator.clipboard.writeText(`${window.location.href}mumble/${state.mumble.id}`);

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
      case 'device_mobile': {
        return {
          ...state,
          device: 'mobile',
        };
      }
      case 'device_desktop': {
        return {
          ...state,
          device: 'desktop',
        };
      }
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
      <div className={'mb-l'}>
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
      </div>
      {state.mumble.text && (
        <div className={'mb-s w-full'}>
          <p className={'paragraph-M'}>{state.mumble.text}</p>
        </div>
      )}
      {state.mumble.mediaUrl && (
        <div className={'mb-l h-328 w-full relative bg-slate-50'}>
          <Image
            src={state.mumble.mediaUrl}
            alt={'Posted image'}
            fill
            className={'object-cover rounded-s'}
            blurDataURL={'../../public/vercel.svg'}
            placeholder="blur"
          />
        </div>
      )}
      <div className="flex relative -left-3 space-x-8">
        {/*TODO This Comment should exist as label in the storybook*/}
        <Link href={`/mumble/${state.mumble.id}`}>
          {' '}
          <CommentButton
            label={{
              noComments: state.device === 'desktop' ? 'Comment' : '',
              someComments: state.device === 'desktop' ? 'Comments' : '',
            }}
            numberOfComments={state.mumble.replyCount}
            onClick={() => null}
          />
        </Link>
        <LikeButtonWithReactionButton
          onClick={() => likedPost()}
          active
          label={{
            noReaction: state.device === 'desktop' ? 'Like' : '',
            oneReaction: state.device === 'desktop' ? 'Like' : '',
            reactionByCurrentUser: state.device === 'desktop' ? 'Liked' : '',
            severalReaction: state.device === 'desktop' ? 'Likes' : '',
          }}
          likes={state.mumble.likeCount ?? 0}
          reactionByCurrentUser={state.mumble.likedByUser}
        />
        <CopyButton
          onClick={copyMumbleUrl}
          active={false}
          label={{
            inactive: state.device === 'desktop' ? 'Copy Link' : '',
            active: state.device === 'desktop' ? 'Link copied' : '',
          }}
        />
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
