import React, { FC, useState } from 'react';
import {
  Button,
  Card,
  ProfileHeader,
  SendIcon,
  Textfield,
  UploadIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/posts';
import { useSession } from 'next-auth/react';
import { PostArgs, UploadImage } from '../services/serviceTypes';
import toast, { Toaster } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';
import {
  BorderType,
  Size,
} from '@smartive-education/design-system-component-library-hello-world-team/dist/components/molecules/card/card';
import {
  ProfileHeaderLabelType,
  ProfileHeaderPictureSize,
} from '@smartive-education/design-system-component-library-hello-world-team/dist/components/molecules/profile-header/profile-header';

export const WriteCard: FC = () => {
  const [text, setText] = React.useState<string>('');
  const [file, setFile] = useState<UploadImage>();
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation((args: PostArgs) => createPost(args), {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries();
      console.log(data);
    },
    onError: async (error) => {
      console.log(error);
    },
  });

  const textfieldChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const onSubmitPostHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const mutationArgs: PostArgs = {
      text: text,
      file: file,
      accessToken: session?.accessToken,
    };

    mutation.mutate(mutationArgs);

    if (mutation.isError) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error('Something went wrong: ' + mutation?.error.message);
    }

    setText('');
    setFile(undefined);
  };

  return (
    <>
      <div className="bg-slate-100 p-10">
        {mutation.isLoading && (
          <div>
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
        §§
        <div className="w-[550px]">
          <Card as="div" borderType={BorderType.rounded} size={Size.M}>
            <div className="grid grid-cols-1">
              <div className="absolute flex flex-row md:-left-l">
                <ProfileHeader
                  altText={session?.user.username}
                  fullName={`${session?.user.firstname} ${session?.user.lastname}`}
                  imageSrc={session?.user.avatarUrl}
                  labelType={ProfileHeaderLabelType.h4}
                  profilePictureSize={ProfileHeaderPictureSize.M}
                />
              </div>
              <form className="mt-xl">
                <Textfield placeholder="Was gibt's Neues?" value={text || ''} onChange={(e) => textfieldChangeHandler(e)} />
              </form>
              <div className="flex flex-row gap-l justify-between unset">
                <Button label="Bild hochladen" size="L" variant="default" onClick={(e) => console.log('File upload' + e)}>
                  <UploadIcon size={16} />
                </Button>
                <Button label="Absenden" size="L" variant="purple" onClick={(e) => onSubmitPostHandler(e)}>
                  <SendIcon size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Toaster />
      </div>
    </>
  );
};
