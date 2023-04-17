import { Mumble } from '../services/service-types';
import { addCreatorToMumble } from '../utils/creator-to';
import { ListState } from './state-types';

type ListAction =
  | { type: 'load_new_mumbles'; loadNewMumbles: Mumble[]; count: number }
  | { type: 'reload_mumbles'; reloadedMumbles: Mumble[] };

export function listReducer(state: ListState, action: ListAction) {
  switch (action.type) {
    case 'load_new_mumbles': {
      return {
        ...state,
        mumbles: [...addCreatorToMumble(action.loadNewMumbles, state.users), ...state.mumbles],
        totalMumbles: state.totalMumbles + action.count,
      };
    }
    case 'reload_mumbles': {
      return {
        ...state,
        mumbles: [...state.mumbles, ...addCreatorToMumble(action.reloadedMumbles, state.users)],
        nextOffset: state.nextOffset + 10,
      };
    }
  }
}
