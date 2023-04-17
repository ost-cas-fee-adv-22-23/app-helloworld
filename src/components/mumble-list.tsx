import React, { FC, useReducer } from 'react';
import { BorderType, Card } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble, User } from '../services/service-types';
import { MumbleCard } from './mumble-card';
import { fetchMumbles } from '../services/posts';
import InfiniteScroll from 'react-infinite-scroller';
import { WriteCard } from './write-card';
import { addCreatorToMumble } from '../utils/creator-to';
import { listReducer } from '../state/list-reducer';

interface MumbleList {
  mumbles: Mumble[];
  users: User[];
  totalMumbles: number;
  showWriteCard?: boolean;
}

export const MumbleList: FC<MumbleList> = ({ mumbles, users, totalMumbles, showWriteCard = false }) => {
  const mumblesWithCreator = addCreatorToMumble(mumbles, users);

  const [state, dispatch] = useReducer(listReducer, {
    mumbles: mumblesWithCreator,
    nextOffset: 10,
    showWriteCard,
    totalMumbles,
    users,
  });

  const onSubmitPost = async () => {
    const loadNewMumbles = await fetchMumbles({ limit: 10, newerThanMumbleId: state.mumbles[0].id });
    dispatch({ type: 'load_new_mumbles', loadNewMumbles: loadNewMumbles.mumbles, count: loadNewMumbles.count });
  };

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
                <WriteCard onSubmit={() => onSubmitPost()} />
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