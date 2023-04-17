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
          imageSrc={user?.avatarUrl}
          hrefProfile={'#'}
          altText={'Avatar'}
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
