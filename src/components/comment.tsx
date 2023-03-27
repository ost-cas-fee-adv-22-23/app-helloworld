import React, { FC, useReducer } from 'react';
import {
  Button,
  ProfileHeader,
  SendIcon,
  Textfield,
  UploadIcon,
} from '@smartive-education/design-system-component-library-hello-world-team';
import { useSession } from 'next-auth/react';
import { commentPost } from '../services/mumble';

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

  const comment = () => commentPost({ postId: mumbleId, comment: state.comment, accessToken: session?.accessToken });

  return (
    <>
      <div className="grid grid-cols-1 mt-xl">
        <ProfileHeader
          fullName={`${session?.user.firstname} ${session?.user.lastname}`}
          labelType={'S'}
          profilePictureSize={'S'}
          username={session?.user.username}
          imageSrc={session?.user.avatarUrl}
          hrefProfile={'#'}
          altText={'Avatar'}
        />
        <div className="mt-xxxs">
          <Textfield
            placeholder="Und was meinst du dazu?"
            onChange={(e) => {
              dispatch({ type: 'comment_changed', comment: e.target.value });
            }}
          />
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
