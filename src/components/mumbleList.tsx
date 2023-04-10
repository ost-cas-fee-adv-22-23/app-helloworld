import React, { FC, useReducer } from 'react';
import { Card } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble } from '../services/serviceTypes';
import { MumbleCard } from './mumbleCard';
import { fetchMumbles } from '../services/posts';
import { User } from 'next-auth';
import InfiniteScroll from 'react-infinite-scroller';

interface MumbleList {
  mumbles: Mumble[];
  users: User[];
  totalMumbles: number;
}

export const MumbleList: FC<MumbleList> = ({ mumbles, users, totalMumbles }) => {
  const [state, dispatch] = useReducer(mumbleCardReducer, {
    mumbles: addCreatorToMumble(mumbles, users),
    users,
    nextOffset: 10,
    totalMumbles,
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
          {/* TODO: remove md:text-violet-500*/}
          <h1 className={'head-4 md:head-1 text-violet-500 md:text-violet-500'}>Willkommen auf Mumble</h1>
          <ul className={'w-screen md:w-615'}>
            {state.mumbles.map((mumble: Mumble) => (
              <li key={mumble.id} className={'m-s'}>
                <Card borderType={'rounded'}>
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
