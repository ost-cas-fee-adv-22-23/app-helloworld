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
import { fetchUserById, fetchUserByMe, fetchUsers } from '../../services/users';
import { Mumble, User } from '../../services/service-types';
import { MumbleList } from '../../components/mumble-list';
import Image from 'next/image';
import { profileAvatar } from '../../utils/profile-avatar';

type Props = {
  profileUser: User;
  count: number;
  mumbles: Mumble[];
  likedCount: number;
  likedMumbles: Mumble[];
  users: User[];
  currentUser: boolean;
};

export default function ProfilePage({
  profileUser,
  count,
  mumbles,
  likedCount,
  likedMumbles,
  users,
  currentUser,
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
                  className={'object-cover rounded-s'}
                />
              </div>
            </div>
            <div className={'absolute -mt-xl4 right-xl7'}>
              <Link href={`/profile/${profileUser.id}`}>
                <ProfilePic
                  editLabel={'Bearbeiten'}
                  altImage={'Profilbild'}
                  imageUrl={`${profileAvatar(profileUser.avatarUrl)}`}
                  size={'XL'}
                  nextImage={Image}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={'grid grid-cols-1 gap-1 place-items-center'}>
        <div className={'md:w-615'}>
          <ProfileHeader
            fullName={`${profileUser.firstName} ${profileUser.lastName}`}
            hrefProfile={`/profile/${profileUser.id}`}
            labelType={ProfileHeaderLabelType.XL}
            username={`${profileUser.userName}`}
            link={Link}
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
          {currentUser && (
            <Tabs>
              <TabsItem
                onClick={() => setActiveTab('mumbles')}
                label={'Deine Mumbels'}
                active={activeTab === 'mumbles'}
              ></TabsItem>
              <TabsItem
                onClick={() => setActiveTab('likes')}
                label={'Deine Likes'}
                active={activeTab === 'likes'}
              ></TabsItem>
            </Tabs>
          )}
        </div>
      </div>
      <MumbleList
        mumbles={activeTab === 'mumbles' ? mumbles : likedMumbles}
        users={users}
        totalMumbles={activeTab === 'mumbles' ? count : likedCount}
        key={activeTab === 'mumbles' ? 'mumbles' : 'likes'}
        mumbleKey={activeTab === 'mumbles' ? 'mumbles' : 'likes'}
        userId={profileUser.id}
      ></MumbleList>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  if (!id) {
    throw new Error('Id does not exists!');
  }

  const session = await getToken({ req });

  const { user } =
    id === 'me'
      ? await fetchUserByMe({ accessToken: session?.accessToken })
      : await fetchUserById({ userId: id, accessToken: session?.accessToken });

  const [{ count, mumbles }, { count: likedCount, mumbles: likedMumbles }, { users }] = await Promise.all([
    fetchMumbles({ limit: 10, creator: user.id as string }),
    fetchMumblesSearch({ likedBy: user.id as string, limit: 10, accessToken: session?.accessToken }),
    fetchUsers({ accessToken: session?.accessToken }),
  ]);

  return {
    props: {
      profileUser: user,
      mumbles,
      count,
      likedCount,
      likedMumbles,
      users,
      currentUser: session?.user.id === user.id,
    },
  };
};
