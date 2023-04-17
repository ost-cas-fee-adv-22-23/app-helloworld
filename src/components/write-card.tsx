import React, { ChangeEvent, FC, useReducer, useState } from 'react';
import {
  BorderType,
  Button,
  Card,
  ProfileHeader,
  ProfileHeaderLabelType,
  ProfileHeaderPictureSize,
  SendIcon,
  Size,
  Textfield,
  UploadIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/posts';
import { useSession } from 'next-auth/react';
import { PostArgs } from '../services/service-types';
import { Oval } from 'react-loader-spinner';
import { ModalFileUpload } from './modal-file-upload';
import { writeReducer } from '../state/write-reducer';
import { FileData } from '../state/state-types';

interface WriteCard {
  onSubmit: () => void;
}
export const WriteCard: FC<WriteCard> = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(writeReducer, {
    formInputError: '',
    form: {
      file: null,
      filename: '',
      textInput: '',
      textInputError: '',
    },
    isSubmitting: false,
  });
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation((args: PostArgs) => createPost(args), {
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      dispatch({ type: 'form_submit_added' });
      onSubmit();
    },
    onError: async () => {
      dispatch({ type: 'form_submit_error', error: 'Post konnte nicht hinzugefügt werden. Bitte versuche es nochmals!' });
    },
  });

  const onTextfieldChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: 'file_error_reset' });
    dispatch({ type: 'form_change', textInput: e.target.value });
  };

  const onSubmitPostHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch({ type: 'file_upload_submitting' });
    dispatch({ type: 'file_error_reset' });

    const mutationArgs: PostArgs = {
      text: state.form.textInput,
      file: state.form.file,
      accessToken: session?.accessToken,
    };

    mutation.mutate(mutationArgs);
  };

  const onFileHandler = (file: FileData) => {
    dispatch({ type: 'file_upload_submitting' });
    dispatch({ type: 'file_upload_reset' });
    dispatch({ type: 'file_upload_add', payload: file });
  };

  const fileUploadClick = () => {
    dispatch({ type: 'file_error_reset' });
    setIsOpenUpload(true);
  };

  return (
    <>
      <div className="p-10">
        {mutation.isLoading && (
          <div className={'relative flex flex-row m-s w-fill justify-center'}>
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}
        <ModalFileUpload
          title="Bild hochladen"
          isOpen={isOpenUpload}
          onClose={(e) => setIsOpenUpload(e)}
          onSubmitFile={onFileHandler}
          isSubmitting={state.isSubmitting}
        />
        <div className="m-s w-fill">
          <Card as="div" borderType={BorderType.rounded} size={Size.M}>
            <div className="grid grid-cols-1">
              <div className="absolute flex flex-row">
                <ProfileHeader
                  altText={session?.user.username}
                  fullName={'Hey, was läuft?'}
                  imageSrc={session?.user.avatarUrl}
                  labelType={ProfileHeaderLabelType.L}
                  href={'#'}
                  profilePictureSize={ProfileHeaderPictureSize.M}
                />
              </div>
              <form className="mt-xl">
                <Textfield placeholder="Deine Meinung zählt?" value={state.form.textInput} onChange={onTextfieldChanged} />
                {state.form.filename ? (
                  <span className="text-slate-700 text-xxs font-medium mt-xxs self-start" id={`filename`}>
                    {'Bild hinzugefügt: ' + state.form.filename}
                  </span>
                ) : null}
                {state.form.textInputError ? (
                  <span className="text-red text-xxs font-medium mt-xxs self-end" id={`textInputError`}>
                    {state.form.textInputError}
                  </span>
                ) : null}
              </form>
              <div className="flex flex-row gap-l justify-between unset pt-xl">
                <Button
                  label="Bild hochladen"
                  size="L"
                  variant="default"
                  isDisabled={state.isSubmitting}
                  onClick={fileUploadClick}
                >
                  <UploadIcon size={16} />
                </Button>
                <Button
                  label="Absenden"
                  size="L"
                  variant="purple"
                  isDisabled={state.isSubmitting || !(!!state.form.file || !!state.form.textInput)}
                  onClick={(e) => onSubmitPostHandler(e)}
                >
                  <SendIcon size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
