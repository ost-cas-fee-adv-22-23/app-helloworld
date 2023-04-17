import { Mumble } from '../services/service-types';
import { addCreatorToMumble } from '../utils/creator-to-mumble';
import { ListState } from './state-types';

type ListAction =
  | { type: 'update_mumbles'; updatedMumbles: Mumble[]; count: number }
  | { type: 'reload_mumbles'; reloadedMumbles: Mumble[] };

export function listReducer(state: ListState, action: ListAction) {
  switch (action.type) {
    case 'update_mumbles': {
      return {
        ...state,
        mumbles: [...addCreatorToMumble(action.updatedMumbles, state.users), ...state.mumbles],
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
