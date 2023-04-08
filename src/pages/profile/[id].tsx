import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import {
  Tabs,
  TabsItem,
  ProfilePic,
  ProfileHeader,
} from '@smartive-education/design-system-component-library-hello-world-team';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import React, { useState } from 'react';
import { fetchMumblesByUser, fetchMumblesSearch } from '../../services/posts';
import { fetchUsers } from '../../services/users';
import { Mumble } from '../../services/serviceTypes';
import { MumbleList } from '../../components/mumbleList';
import { User } from 'next-auth';
import { LikedList } from '../../components/likedList';

type Props = {
  count: number;
  mumbles: Mumble[];
  likedCount: number;
  likedMumbles: Mumble[];
  users: User[];
};

export default function ProfilePage({
  count,
  mumbles,
  likedCount,
  likedMumbles,
  users,
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [activeTab, setActiveTab] = useState('mumbles');

  return (
    <>
      <div className={'grid grid-cols-1 justify-items-center my-xl'}>
        <div>
          <div className={'rounded-m bg-violet-200'}>
            <img alt={'image'} className={'object-cover rounded-m '} src={'https://picsum.photos/700/400'} />
          </div>
        </div>
        <div className={'flex'}>
          <Link href={'/'}>
            <ProfilePic editLabel={'Bearbeiten'} altText={'Profilbild'} imageUrl={''} size={'XL'} />
          </Link>
        </div>
      </div>
      <div className={'relative flex flex-row md:-left-xxl p-xxs'}>
        <ProfileHeader
          fullName={'Robert Vogt'}
          labelType={'XL'}
          joined={'Mitglied seit 4 Wochen'}
          username={'robertvogt'}
          hrefProfile={''}
          location={'St.Gallen'}
          timestamp={'vor 42 Minuten'}
          link={Link}
          href={'/'}
        />
      </div>
      <div className={'relative mt-m'}>
        <div className={'paragraph-M'}>
          Quia aut et aut. Sunt et eligendi similique enim qui quo minus. Aut aut error velit voluptatum optio sed quis
          cumque error magni.
        </div>
      </div>
      <Tabs>
        <TabsItem
          onClick={() => setActiveTab('mumbles')}
          label={'Deine Mumbels'}
          active={activeTab === 'mumbles'}
        ></TabsItem>
        <TabsItem onClick={() => setActiveTab('likes')} label={'Deine Likes'} active={activeTab === 'likes'}></TabsItem>
      </Tabs>
      {activeTab === 'mumbles' ? (
        <MumbleList mumbles={mumbles} users={users} totalMumbles={count}></MumbleList>
      ) : (
        <LikedList mumbles={likedMumbles} users={users} totalMumbles={likedCount}></LikedList>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  if (!id) {
    throw new Error('Id does not exists!');
  }
  const session = await getToken({ req });

  const [{ count, mumbles }, { count: likedCount, mumbles: likedMumbles }, { users }] = await Promise.all([
    fetchMumblesByUser({ creator: id as string }),
    fetchMumblesSearch({ likedBy: id as string, accessToken: session?.accessToken }),
    fetchUsers({ accessToken: session?.accessToken }),
  ]);

  const mumblesWithUserInfo = mumbles.map((mumble) => {
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

  const likedMumblesWithUserInfo = likedMumbles.map((liked) => {
    const creator = users?.find((user) => user.id === liked.creator);

    return {
      ...liked,
      creatorProfile: {
        id: creator?.id,
        userName: creator?.userName,
        firstName: creator?.firstName,
        lastName: creator?.lastName,
        fullName: `${creator?.firstName} ${creator?.lastName}`,
        avatarUrl: creator?.avatarUrl,
      },
    };
  });

  console.log('Mumble: ' + mumblesWithUserInfo);

  return {
    props: {
      mumbles: mumblesWithUserInfo,
      count,
      likedCount,
      likedMumbles: likedMumblesWithUserInfo,
      users,
    },
  };
};
