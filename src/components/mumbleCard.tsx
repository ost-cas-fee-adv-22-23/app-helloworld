import React, {FC} from 'react';
import {Mumble} from '../services/mumble';
import {
    Card,
    CommentButton,
    CopyButton,
    LikeButtonWithReactionButton,
    ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';

interface MumbleCard {
    mumble: Mumble
}

export const MumbleCard: FC<MumbleCard> = ({ mumble }) => {
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
            onClick={undefined}
          />
          <LikeButtonWithReactionButton
            onClick={undefined}
            active
            label={{
              noReaction: 'Like',
              oneReaction: 'Like',
              reactionByCurrentUser: 'Liked',
              severalReaction: 'Likes',
            }}
            likes={mumble.likeCount ?? 0}
            reactionByCurrentUser={mumble.likedByUser}
          />
          <CopyButton onClick={undefined} active={false} label={{ inactive: 'Copy Link', active: 'Link copied' }} />
        </div>
      </Card>
    </>
  );
};
