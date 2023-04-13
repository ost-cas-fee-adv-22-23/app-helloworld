import React, { FC, useReducer } from 'react';
import { BorderType, Card } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble } from '../services/serviceTypes';
import { MumbleCard } from './mumbleCard';
import { fetchMumbles } from '../services/posts';
import InfiniteScroll from 'react-infinite-scroller';
import { User } from '../services/users';

interface MumbleListProps {
  mumbles: Mumble[];
  users: User[];
  totalMumbles: number;
}

interface MumbleListState {
  mumbles: Mumble[];
  users: User[];
  nextOffset: number;
  totalMumbles: number;
}

interface MumbleCardAction {
  type: 'reload_mumbles';
  reloadedMumbles: Mumble[];
}

export const MumbleList: FC<MumbleListProps> = ({ mumbles, users, totalMumbles }) => {
  const initialMumbleListState: MumbleListState = {
    mumbles: addCreatorToMumble(mumbles, users),
    users,
    nextOffset: 10,
    totalMumbles,
  };
  const [state, dispatch] = useReducer(mumbleCardReducer, initialMumbleListState);

  function addCreatorToMumble(mumbles: Mumble[], users: User[]): Mumble[] {
    return mumbles.map((mumble) => {
      const creator = users?.find((user) => user.id === mumble.creator);
      return {
        ...mumble,
        creatorProfile: {
          id: creator?.id,
          userName: creator?.userName,
          firstName: creator?.firstName,
          lastName: creator?.lastName,
          fullName: `${mumble?.creatorProfile?.firstName} ${mumble?.creatorProfile?.lastName}`,
          avatarUrl: creator?.avatarUrl,
        },
      };
    });
  }

  function mumbleCardReducer(state: MumbleListState, action: MumbleCardAction): MumbleListState {
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

  const loadMore = async () => {
    const reloadedMumbles = await fetchMumbles({ limit: 10, offset: state.nextOffset });
    dispatch({ type: 'reload_mumbles', reloadedMumbles: reloadedMumbles.mumbles });
  };

  return (
    <>
      <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={state.nextOffset < totalMumbles} useWindow={true}>
        <div className={'grid grid-cols-1 justify-items-center'}>
          <ul className={'w-screen md:w-630'}>
            {state.mumbles.map((mumble: Mumble) => (
              <li key={mumble.id} className={'m-s'}>
                <Card borderType={BorderType.rounded}>
                  <MumbleCard mumble={mumble}></MumbleCard>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </InfiniteScroll>
    </>
  );
};
