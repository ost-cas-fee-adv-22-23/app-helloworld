import {getSession} from 'next-auth/react';

export type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

type QwackerUserResponse = {
  count?: number;
  data?: User[];accessToken
};

export const fetchUsers = async (params?: { accessToken?: string }) => {
  const { accessToken } = params || {};

/*  if (!accessToken) {
    throw new Error('No access token');
  }*/

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: '100',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { count, data } = (await res.json()) as QwackerUserResponse;

  return {
    count,
    users: data,
  };
};
