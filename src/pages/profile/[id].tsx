import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import {
  ProfileHeader,
  ProfileHeaderLabelType,
  ProfilePic,
  Tabs,
  TabsItem,
} from '@smartive-education/design-system-component-library-hello-world-team';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import React, { useState } from 'react';
import { fetchMumbles, fetchMumblesSearch } from '../../services/posts';
import { fetchUsers } from '../../services/users';
import { Mumble } from '../../services/serviceTypes';
import { MumbleList } from '../../components/mumbleList';
import { User } from 'next-auth';
import Image from 'next/image';

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
      <div className={'relative grid grid-cols-1 gap-2 place-content-center justify-items-center'}>
        <div className={'my-m'}>
          <div className={'w-full pt-16/9 bg-violet-200 rounded-l relative mb-s'}>
            <div className={'rounded-l bg-violet-200'}>
              <div className={'object-cover rounded-s w-auto h-auto'}>
                <Image alt={'image'} src={'https://picsum.photos/600/300'} width={600} height={300} />
              </div>
            </div>
            <div className={'absolute -mt-xl4 right-xl7'}>
              <Link href={'/'}>
                <ProfilePic editLabel={'Bearbeiten'} altText={'Profilbild'} imageUrl={''} size={'XL'} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={'grid grid-cols-1 gap-1 place-items-center'}>
        <div className={'w-615'}>
          <ProfileHeader
            fullName={'Robert Vogt'}
            labelType={ProfileHeaderLabelType.XL}
            username={'robertvogt'}
            hrefProfile={'#'}
            location={'St.Gallen'}
            joined={'Mitglied seit 4 Wochen'}
            timestamp={'vor 42 Minuten'}
            link={Link}
            href={'/'}
          />
        </div>
      </div>
      <div className={'grid grid-cols-1 gap-2 place-items-center'}>
        <div className={'relative flex mt-m mb-m'}>
          <p className={'paragraph-M justify-text-center text-slate-400 w-[600px]'}>
            Quia aut et aut. Sunt et eligendi similique enim qui quo minus. Aut aut error velit voluptatum optio sed quis
            cumque error magni.
          </p>
        </div>
        <div className={'w-screen px-xs md:w-615'}>
          <Tabs>
            <TabsItem
              onClick={() => setActiveTab('mumbles')}
              label={'Deine Mumbels'}
              active={activeTab === 'mumbles'}
            ></TabsItem>
            <TabsItem onClick={() => setActiveTab('likes')} label={'Deine Likes'} active={activeTab === 'likes'}></TabsItem>
          </Tabs>
        </div>
      </div>
      <MumbleList
        mumbles={activeTab === 'mumbles' ? mumbles : likedMumbles}
        users={users}
        totalMumbles={activeTab === 'mumbles' ? count : likedCount}
        key={activeTab === 'mumbles' ? 'mumbles' : 'likes'}
      ></MumbleList>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  if (!id) {
    throw new Error('Id does not exists!');
  }
  const session = await getToken({ req });

  const [{ count, mumbles }, { count: likedCount, mumbles: likedMumbles }, { users }] = await Promise.all([
    fetchMumbles({ creator: id as string }),
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
        fullName: 'creator?.firstName creator?.lastName',
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
