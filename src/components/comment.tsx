import React, { ChangeEvent, FC } from 'react';
import {
  Button,
  ProfileHeader,
  ProfileHeaderLabelType,
  ProfileHeaderPictureSize,
  SendIcon,
  Textfield,
  UploadIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { User } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { profileAvatar } from '../utils/profile-avatar';

interface CurrentUser {
  user?: User;
  handleCommentChanged: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  submitComment: () => void;
}

export const CommentMumble: FC<CurrentUser> = ({ user, handleCommentChanged, submitComment }) => {
  return (
    <>
      <div className="grid grid-cols-1 mt-xl">
        <ProfileHeader
          fullName={`${user?.firstname} ${user?.lastname}`}
          labelType={ProfileHeaderLabelType.S}
          profilePictureSize={ProfileHeaderPictureSize.S}
          username={user?.username}
          imageSrc={profileAvatar(user?.avatarUrl)}
          hrefProfile={'#'}
          altText={'Avatar'}
          link={Link}
          nextImage={Image}
          href={`/profile/${user?.id}`}
        />
        <form className="mt-m">
          <Textfield placeholder="Und was meinst du dazu?" onChange={handleCommentChanged} />

          <div className="flex flex-row gap-l justify-between unset">
            <Button label="Bild hochladen" size="L" variant="default" onClick={(e) => console.log('File upload' + e)}>
              <UploadIcon size={16} />
            </Button>
            <Button label="Absenden" size="L" variant="purple" onClick={submitComment}>
              <SendIcon size={16} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
