import { Mumble } from '../services/service-types';
import { addCreatorToMumbles } from '../utils/creator-to';
import { ListState } from './state-types';

type ListAction =
  | { type: 'load_new_mumbles'; loadNewMumbles: Mumble[]; count: number }
  | { type: 'reload_mumbles'; reloadedMumbles: Mumble[] };

export function listReducer(state: ListState, action: ListAction) {
  switch (action.type) {
    case 'load_new_mumbles': {
      return {
        ...state,
        mumbles: [...addCreatorToMumbles(action.loadNewMumbles, state.users), ...state.mumbles],
        totalMumbles: state.totalMumbles + action.count,
      };
    }
    case 'reload_mumbles': {
      return {
        ...state,
        mumbles: [...state.mumbles, ...addCreatorToMumbles(action.reloadedMumbles, state.users)],
        nextOffset: state.nextOffset + 10,
      };
    }
  }
}
