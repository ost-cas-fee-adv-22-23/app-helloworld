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
import { postMumble } from '../services/posts';
import { useSession } from 'next-auth/react';

export const WriteMumble: FC = () => {
  const [text, setText] = React.useState<string>('');
  const [file, setFile] = useState<File>();
  const { data: session } = useSession();

  // const queryClient = useQueryClient();

  // const mutation = useMutation(postMumble, {
  //   onSuccess: async (data) => {
  //     await queryClient.invalidateQueries();
  //     console.log(data);
  //   },
  //   onError: async (error) => {
  //     console.log(error);
  //   },
  // });

  const textfieldChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const onSubmitPostHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const mutationArgs = {
      text: text,
      file: file,
      accessToken: session?.accessToken,
    };

    // mutation.mutate(mutationArgs);
    setText('');
  };

  return (
    <>
      <div className="bg-slate-100 p-10">
        <div className="w-[550px]">
          <Card as="div" borderType="rounded" size="M">
            <div className="grid grid-cols-1">
              <div className="absolute flex flex-row md:-left-l">
                <ProfileHeader
                  altText="Robert Vogt"
                  fullName="Hey, was gibts neues?"
                  imageSrc="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
                  labelType="h4"
                  profilePictureSize="M"
                />
              </div>
              <div className="mt-xl">
                <Textfield placeholder="Was gibt's Neues?" value={''} onChange={(e) => textfieldChangeHandler(e)} />
              </div>
              <div className="flex flex-row gap-l justify-between unset">
                <Button label="Bild hochladen" size="L" variant="default">
                  <UploadIcon size={16} />
                </Button>
                <Button label="Absenden" size="L" variant="purple" onClick={(e) => onSubmitPostHandler(e)}>
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
