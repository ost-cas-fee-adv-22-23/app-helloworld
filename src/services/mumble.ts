import { decodeTime } from 'ulid';
import { User } from './users';
import { UploadImage } from './serviceTypes';
import axios from 'axios';

export type Mumble = {
  id: string;
  creator: string;
  creatorProfile?: User;
  text: string;
  mediaUrl: string;
  mediaType: string;
  likeCount: number;
  likedByUser: boolean;
  type: string;
  replyCount: number;
  createdTimestamp: number;
  createdDate?: string;
};

export type Reply = {
  id: string;
  creator: string;
  text: string;
  mediaUrl: string;
  mediaType: string;
  likeCount: number;
  likedByUser: boolean;
  type: string;
  parentId: string;
};

type RawMumble = Omit<Mumble, 'createdTimestamp'>;

type QwackerMumbleResponse = {
  count: number;
  data: RawMumble[];
};

export const fetchMumbles = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
  const { limit, offset, newerThanMumbleId } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });
  const { count, data } = (await res.json()) as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};

// @ts-ignore
const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
  createdDate: new Date(decodeTime(mumble.id)).toLocaleDateString(),
});

export const likePost = async (params?: { postId: string; likedByUser: boolean; accessToken?: string }) => {
  const { postId, likedByUser, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}/likes`;

  const method = likedByUser ? 'DELETE' : 'PUT';
  // const method = 'DELETE'

  const res = await fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const commentPost = async (params: { postId: string; comment: string; accessToken?: string }) => {
  const { postId, comment, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      text: comment,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getMumble = async (id: string, accessToken?: string) => {
  if (!accessToken) {
    throw new Error('No access token');
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/{id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};

export const fetchMumbleById = async (params?: { postId: string; accessToken?: string }) => {
  const { postId, accessToken } = params || {};

  if (!accessToken) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });

  const mumble = (await res.json()) as Mumble;

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
  console.log(url);

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });

  const replies = (await res.json()) as Reply[];

  return {
    replies,
  };
};
