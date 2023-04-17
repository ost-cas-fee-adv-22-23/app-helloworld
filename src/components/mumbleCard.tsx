import React, { ChangeEvent, FC, useReducer } from 'react';
import {
  CommentButton,
  CopyButton,
  LikeButtonWithReactionButton,
  ProfileHeader,
  ProfileHeaderLabelType,
  ProfileHeaderPictureSize,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useSession } from 'next-auth/react';
import { CommentMumble } from './comment';
import { likePost } from '../services/likes';
import { Mumble, Reply } from '../services/serviceTypes';
import { commentPost } from '../services/posts';
import Link from 'next/link';
import Image from 'next/image';
import { MumbleTextContent } from './mumbleTextContent';

interface MumbleCard {
  mumble: Mumble;
  showComments?: boolean;
  commentSubmitted?: (newReply: Reply) => void;
}

interface MumbleCardState {
  showComments: boolean;
  mumble: Mumble;
  comment: string;
}

interface MumbleCardAction {
  type: 'post_liked' | 'comment' | 'add_comment' | 'comment_changed' | 'comment_submitted';
  newPost?: Reply;
  likedByUser?: boolean;
  comment?: string;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble, showComments, commentSubmitted }) => {
  const { data: session } = useSession();

  const initialMumbleCardState: MumbleCardState = {
    showComments: !!showComments,
    mumble,
    comment: '',
  };

  const [state, dispatch] = useReducer(mumbleCardReducer, initialMumbleCardState);

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

  function mumbleCardReducer(state: MumbleCardState, action: MumbleCardAction): MumbleCardState {
    switch (action.type) {
      case 'post_liked': {
        return {
          ...state,
          mumble: {
            ...state.mumble,
            likedByUser: !!action.likedByUser,
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
          comment: action.comment ?? '',
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
          labelType={ProfileHeaderLabelType.M}
          profilePictureSize={ProfileHeaderPictureSize.M}
          timestamp={state.mumble.createdDate}
          username={state.mumble?.creatorProfile?.userName}
          imageSrc={state.mumble?.creatorProfile?.avatarUrl}
          hrefProfile={'#'}
          altText={'Avatar'}
          link={Link}
          href={`/profile/${state.mumble?.creatorProfile?.id}`}
        ></ProfileHeader>
      </div>
      {state.mumble.text && (
        <div className={'mb-s w-full'}>
          <MumbleTextContent text={state.mumble.text}></MumbleTextContent>
        </div>
      )}
      {state.mumble.mediaUrl && (
        <div className={'mb-l h-328 w-full relative bg-slate-50'}>
          {/*eslint-disable-next-line react/forbid-component-props*/}
          <Image
            src={state.mumble.mediaUrl}
            alt={'Posted image'}
            fill
            className={'object-cover rounded-s'}
            placeholder={'blur'}
            blurDataURL={state.mumble.mediaUrl}
          />
        </div>
      )}
      {/*Mobile Version*/}
      <div className="flex md:hidden relative -left-3 space-x-8">
        {/*TODO This Comment should exist as label in the storybook*/}
        <Link href={`/mumble/${state.mumble.id}`}>
          {' '}
          <CommentButton
            label={{
              noComments: 'Comment',
              someComments: 'Comments',
            }}
            numberOfComments={state.mumble.replyCount ?? 0}
            onClick={() => null}
            hideLabel={true}
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
          hideLabel={true}
        />
        <CopyButton
          onClick={copyMumbleUrl}
          active={false}
          label={{
            inactive: 'Copy Link',
            active: 'Link copied',
          }}
          hideLabel={true}
        />
      </div>
      {/*Desktop Version*/}
      <div className="hidden md:flex relative -left-3 space-x-8">
        {/*TODO This Comment should exist as label in the storybook*/}
        <Link href={`/mumble/${state.mumble.id}`}>
          {' '}
          <CommentButton
            label={{
              noComments: 'Comment',
              someComments: 'Comments',
            }}
            numberOfComments={state.mumble.replyCount ?? 0}
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
        <CopyButton
          onClick={copyMumbleUrl}
          active={false}
          label={{
            inactive: 'Copy Link',
            active: 'Link copied',
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
