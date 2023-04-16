import axios from 'axios';
import { QwackerUserResponse } from './service-types';

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
