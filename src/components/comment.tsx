import React, { ChangeEvent, FC, useState } from 'react';
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
import { ModalFileUpload } from './modal-file-upload';
import { CardForm, FileData } from '../state/state-types';

interface CurrentUser {
  user?: User;
  handleCommentChanged: (f: CardForm) => void;
  submitComment: () => void;
  isSubmitting: boolean;
  form: CardForm;
}

export const CommentMumble: FC<CurrentUser> = ({ user, handleCommentChanged, submitComment, isSubmitting, form }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onTextCommentChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    handleCommentChanged({
      comment: e.target.value,
    });
  };
  const onFileHandler = (file: FileData) => {
    handleCommentChanged({
      file: file.file,
      filename: file.filename,
    });
  };

  const fileUploadClick = () => {
    handleCommentChanged({
      commentError: '',
    });
    setIsOpen(true);
  };

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
          link={Link}
          href={`/profile/${user?.id}`}
        />
        <form className="mt-m">
          <Textfield placeholder="Und was meinst du dazu?" value={form.comment} onChange={(e) => onTextCommentChanged(e)} />
          {form.filename ? (
            <span className="text-slate-700 text-xxs font-medium mt-xxs self-start" id={`filename`}>
              {'Bild hinzugefügt: ' + form.filename}
            </span>
          ) : null}
          {form.commentError ? (
            <span className="text-red text-xxs font-medium mt-xxs self-end" id={`textInputError`}>
              {form.commentError}
            </span>
          ) : null}
        </form>
        <div className="flex flex-row gap-l justify-between unset">
          <Button label="Bild hochladen" size="L" variant="default" isDisabled={isSubmitting} onClick={fileUploadClick}>
            <UploadIcon size={16} />
          </Button>
          <Button
            label="Absenden"
            size="L"
            variant="purple"
            isDisabled={isSubmitting || !(!!form.file || !!form.comment)}
            onClick={submitComment}
          >
            <SendIcon size={16} />
          </Button>
        </div>
      </div>
      <ModalFileUpload
        title="Bild hochladen"
        isOpen={isOpen}
        onClose={(e) => setIsOpen(e)}
        onSubmitFile={onFileHandler}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
