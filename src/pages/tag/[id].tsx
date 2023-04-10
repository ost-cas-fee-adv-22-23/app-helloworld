import React from 'react';
import { MumbleList } from '../../components/mumbleList';

export default function MumblePage() {
  return (
    <>
      <MumbleList mumbles={[]} users={[]} totalMumbles={0} heading={'This page is under construction.'}></MumbleList>
    </>
  );
}
