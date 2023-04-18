import { Reply } from '../services/service-types';
import { MumblePageState } from './state-types';
type MumblePageAction = { type: 'comment_submitted'; newReply: Reply };

export function mumblePageReducer(state: MumblePageState, action: MumblePageAction): MumblePageState {
  switch (action.type) {
    case 'comment_submitted': {
      return {
        ...state,
        mumble: {
          ...state.mumble,
          replyCount: state.mumble.replyCount ?? 0 + 1,
        },
        replies: [action.newReply, ...state.replies],
      };
    }
  }
}
