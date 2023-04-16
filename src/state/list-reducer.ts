import { Mumble } from '../services/service-types';
import { addCreatorToMumble } from '../utils/creator-to-mumble';
import { ListState } from './state-types';

type ListAction = { type: 'reload_mumbles'; reloadedMumbles: Mumble[] };
export function listReducer(state: ListState, action: ListAction) {
  switch (action.type) {
    case 'reload_mumbles': {
      return {
        ...state,
        mumbles: [...state.mumbles, ...addCreatorToMumble(action.reloadedMumbles, state.users)],
        nextOffset: state.nextOffset + 10,
      };
    }
  }
}
