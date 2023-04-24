import React, { FC, useReducer } from 'react';
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
import { CardForm } from '../state/state-types';

interface MumbleCard {
  mumble: Mumble;
  showComments?: boolean;
  commentSubmitted?: (newReply: Reply) => void;
}

export const MumbleCard: FC<MumbleCard> = ({ mumble, showComments, commentSubmitted }) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(cardReducer, {
    form: { comment: '', commentError: '', filename: '', file: null },
    showComments,
    mumble,
    isSubmitting: false,
  });

  const likedPost = async () => {
    await likePost({
      postId: state.mumble.id,
      likedByUser: state.mumble.likedByUser,
      accessToken: session?.accessToken,
    });
    dispatch({ type: 'post_liked', likedByUser: !state.mumble.likedByUser });
  };

  const handleCommentChanged = (f: CardForm) => {
    if (f.file && f.filename) {
      dispatch({ type: 'file_changed', file: f.file, name: f.filename });
    } else if (f.commentError) {
      dispatch({ type: 'comment_error', error: f.commentError });
    } else {
      dispatch({ type: 'comment_changed', comment: f.comment || '' });
    }
  };

  const copyMumbleUrl = () => navigator.clipboard.writeText(`${window.location.href}mumble/${state.mumble.id}`);

  const submitComment = async () => {
    dispatch({ type: 'comment_submitting' });
    const newPost = await commentPost({
      postId: state.mumble.id,
      comment: state.form.comment,
      file: state.form.file,
      accessToken: session?.accessToken,
    });
    commentSubmitted && commentSubmitted(newPost);
    dispatch({ type: 'comment_submitted', newPost });
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
          form={state.form}
          isSubmitting={state.isSubmitting}
        ></CommentMumble>
      )}
    </>
  );
};
