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
import { fetchUserById, fetchUsers, User } from '../../services/users';
import { Mumble } from '../../services/serviceTypes';
import { MumbleList } from '../../components/mumbleList';
import Image from 'next/image';

type Props = {
  profileUser: User;
  count: number;
  mumbles: Mumble[];
  likedCount: number;
  likedMumbles: Mumble[];
  users: User[];
};

export default function ProfilePage({
  profileUser,
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
              <div className={'w-auto h-auto'}>
                <Image
                  alt={'image'}
                  src={'https://picsum.photos/id/36/600/300'}
                  width={600}
                  height={300}
                  placeholder={'blur'}
                  blurDataURL={'https://picsum.photos/id/36/600/300'}
                  className="object-cover rounded-s"
                />
              </div>
            </div>
            <div className={'absolute -mt-xl4 right-xl7'}>
              <Link href={`/profile/${profileUser.id}`}>
                <ProfilePic
                  editLabel={'Bearbeiten'}
                  altText={'Profilbild'}
                  imageUrl={`${profileUser.avatarUrl}`}
                  size={'XL'}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={'grid grid-cols-1 gap-1 place-items-center'}>
        <div className={'w-615'}>
          <ProfileHeader
            fullName={`${profileUser.firstName} ${profileUser.lastName}`}
            labelType={ProfileHeaderLabelType.XL}
            username={`${profileUser.userName}`}
            hrefProfile={'#'}
            link={Link}
            href={`/profile/${profileUser.id}`}
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

  const [{ user }, { count, mumbles }, { count: likedCount, mumbles: likedMumbles }, { users }] = await Promise.all([
    fetchUserById({ userId: id, accessToken: session?.accessToken }),
    fetchMumbles({ limit: 10, creator: id as string }),
    fetchMumblesSearch({ likedBy: id as string, limit: 10, accessToken: session?.accessToken }),
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
      profileUser: user,
      mumbles: mumblesWithUserInfo,
      count,
      likedCount,
      likedMumbles: likedMumblesWithUserInfo,
      users,
    },
  };
};
