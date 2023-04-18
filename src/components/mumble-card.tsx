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
import { Mumble, Reply } from '../services/service-types';
import { commentPost } from '../services/posts';
import Link from 'next/link';
import Image from 'next/image';
import { cardReducer } from '../state/card-reducer';
import { MumbleTextContent } from './mumble-text-content';
import { profileAvatar } from '../utils/profile-avatar';

interface MumbleCard {
  mumble: Mumble;
  showComments?: boolean;
  commentSubmitted?: (newReply: Reply) => void;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble, showComments, commentSubmitted }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(cardReducer, { showComments, mumble, comment: '' });

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

  return (
    <>
      <div className={'mb-l'}>
        <ProfileHeader
          fullName={`${state.mumble?.creatorProfile?.firstName} ${state.mumble?.creatorProfile?.lastName}`}
          labelType={ProfileHeaderLabelType.M}
          profilePictureSize={ProfileHeaderPictureSize.M}
          timestamp={state.mumble.createdDate}
          username={state.mumble?.creatorProfile?.userName}
          imageSrc={profileAvatar(state.mumble?.creatorProfile?.avatarUrl)}
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
      <div className="flex relative -left-3 space-x-8">
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
