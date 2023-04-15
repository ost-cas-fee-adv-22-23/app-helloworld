import axios from 'axios';

export type User = {
  id?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

type QwackerUserResponse = {
  count?: number;
  data?: User[];
  accessToken: string;
};

export const fetchUsers = async (params?: { accessToken?: string }) => {
  const { accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: '100',
  })}`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { count, data } = res.data as QwackerUserResponse;

  return {
    count,
    users: data,
  };
};

export const fetchUserById = async (params?: { accessToken: unknown; userId: string | string[] }) => {
  const { userId, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/${userId}?`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = (await res.data) as User;

  return {
    user,
  };
};
export const fetchUserByMe = async (params?: { accessToken: unknown }) => {
  const { accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = (await res.data) as User;

  return {
    user,
  };
};
