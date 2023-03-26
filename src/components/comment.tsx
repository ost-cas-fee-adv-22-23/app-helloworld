import React, { FC, useContext, useReducer, useState } from 'react';
import {
  Button,
  Card,
  ProfileHeader,
  SendIcon,
  Textfield,
  UploadIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useSession } from 'next-auth/react';
import {commentPost, likePost, Mumble} from '../services/mumble';
import { User } from '../services/users';

interface CurrentUser {
  mumbleId: string;
}

export const CommentMumble: FC<CurrentUser> = ({ mumbleId }) => {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(commentReducer, { comment: '' });

  function commentReducer(state, action) {
    switch (action.type) {
      case 'comment_changed': {
        return {
          ...state,
          comment: action.comment,
        };
      }
    }
  }

  const comment = () =>
      commentPost({ postId: mumbleId, comment: state.comment, accessToken: session?.accessToken });

  return (
    <>
      <div className="grid grid-cols-1 mt-xl">
        <ProfileHeader
          fullName="Robert Vogt"
          labelType={'S'}
          profilePictureSize={'S'}
          username={'rvogt'}
          imageSrc="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
          hrefProfile={'#'}
          altText={'Avatar'}
        />
        <div className="mt-xxxs">
          <Textfield placeholder="Und was meinst du dazu?" onChange={(e) => {
            dispatch({ type: 'comment_changed', comment: e.target.value})
          }} />
        </div>
        <div className="flex flex-row gap-l justify-between unset">
          <Button label="Bild hochladen" size="L" variant="default">
            <UploadIcon size={16} />
          </Button>
          <Button label="Absenden" size="L" variant="purple" onClick={() => comment()}>
            <SendIcon size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};
