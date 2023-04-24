import { Reply } from '../services/service-types';
import { CardState } from './state-types';

type CardAction =
  | { type: 'add_comment' }
  | { type: 'comment' }
  | { type: 'comment_changed'; comment: string }
  | { type: 'comment_error'; error: string }
  | { type: 'file_changed'; file: File; name: string }
  | { type: 'comment_submitting' }
  | { type: 'comment_submitted'; newPost: Reply }
  | { type: 'post_liked'; likedByUser: boolean };

export function cardReducer(state: CardState, action: CardAction) {
  switch (action.type) {
    case 'add_comment': {
      return {
        ...state,
        showComments: false,
      };
    }
    case 'comment': {
      return {
        ...state,
        showComments: !state.showComments,
      };
    }
    case 'comment_changed': {
      return {
        ...state,
        form: {
          ...state.form,
          comment: action.comment,
        },
      };
    }
    case 'comment_error': {
      return {
        ...state,
        form: {
          ...state.form,
          commentError: action.error,
        },
      };
    }
    case 'file_changed': {
      return {
        ...state,
        form: {
          ...state.form,
          file: action.file,
          filename: action.name,
        },
      };
    }
    case 'comment_submitting': {
      return {
        ...state,
        isSubmitting: true,
      };
    }
    case 'comment_submitted': {
      return {
        ...state,
        form: {
          comment: '',
          commentError: '',
          file: null,
          filename: '',
        },
        isSubmitting: false,
      };
    }
    case 'post_liked': {
      return {
        ...state,
        mumble: {
          ...state.mumble,
          likedByUser: action.likedByUser,
          likeCount: action.likedByUser ? (state.mumble?.likeCount ?? 0) + 1 : state.mumble?.likeCount - 1,
        },
      };
    }
  }
}
