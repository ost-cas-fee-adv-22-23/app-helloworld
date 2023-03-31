import { Mumble, QwackerMumbleResponse, Reply, transformMumble, UploadImage } from './serviceTypes';
import axios from 'axios';

export const fetchMumbles = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
  const { limit, offset, newerThanMumbleId } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const res = await axios.get(url);

  const { count, data } = res.data as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};

export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
  if (!accessToken) {
    throw new Error('No access token');
  }

  const formData = new FormData();
  formData.append('text', text);
  if (file) {
    formData.append('image', file);
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return transformMumble(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};

export const commentPost = async (params: { postId: string; comment: string; accessToken?: string }) => {
  const { postId, comment, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  return await axios.post(
    `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}`,
    { text: comment },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const fetchMumbleById = async (params?: { postId: string; accessToken?: string }) => {
  const { postId, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const mumble = (await res.data) as Mumble;

  return {
    mumble,
  };
};

export const fetchReplies = async (params?: { postId: string; accessToken?: string }) => {
  const { postId, accessToken } = params || {};
  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}/replies`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const replies = (await res.data) as Reply[];

  return {
    replies,
  };
};
