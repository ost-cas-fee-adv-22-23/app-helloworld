import React, { FC, useReducer } from 'react';
import { BorderType, Card } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble } from '../services/service-types';
import { MumbleCard } from './mumble-card';
import { fetchMumbles } from '../services/posts';
import { User } from 'next-auth';
import InfiniteScroll from 'react-infinite-scroller';
import { WriteCard } from './write-card';

interface MumbleList {
  mumbles: Mumble[];
  users: User[];
  totalMumbles: number;
  showWriteCard?: boolean;
}

export const MumbleList: FC<MumbleList> = ({ mumbles, users, totalMumbles, showWriteCard = false }) => {
  const [state, dispatch] = useReducer(mumbleCardReducer, {
    mumbles: addCreatorToMumble(mumbles, users),
    users,
    nextOffset: 10,
    totalMumbles,
    showWriteCard,
  });

  function addCreatorToMumble(mumbles: Mumble[], users: User[]) {
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

  function mumbleCardReducer(state, action) {
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
          <ul className={'w-screen md:w-615'}>
            {state.showWriteCard && (
              <li>
                <WriteCard />
              </li>
            )}
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
