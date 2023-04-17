import { Reply } from '../services/service-types';
import { CardState } from './state-types';

type CardAction =
  | { type: 'add_comment' }
  | { type: 'comment' }
  | { type: 'comment_changed'; comment: string }
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
        comment: action.comment,
      };
    }
    case 'comment_submitted': {
      return {
        ...state,
        comment: '',
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
