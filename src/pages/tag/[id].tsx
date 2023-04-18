import React from 'react';
import { MumbleList } from '../../components/mumble-list';

export default function MumblePage() {
  return (
    <>
      <h1 className={'head-2 text-slate-900'}>{'This page is under construction.'}</h1>
      <MumbleList mumbles={[]} users={[]} totalMumbles={0} mumbleKey={'mumbles'}></MumbleList>
    </>
  );
}
