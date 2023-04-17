import { Mumble } from '../services/service-types';
import { addCreatorToMumble } from '../utils/creator-to-mumble';
import { ListState } from './state-types';

type ListAction =
  | { type: 'refetch_count'; count: number }
  | { type: 'refetch_mumbles'; updatedMumbles: Mumble[] }
  | { type: 'reload_mumbles'; reloadedMumbles: Mumble[] };

export function listReducer(state: ListState, action: ListAction) {
  switch (action.type) {
    case 'refetch_count': {
      return {
        ...state,
        totalMumbles: action.count,
      };
    }
    case 'refetch_mumbles': {
      return {
        ...state,
        mumbles: addCreatorToMumble(action.updatedMumbles, state.users),
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
