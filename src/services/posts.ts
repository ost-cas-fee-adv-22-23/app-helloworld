import {
  calculateCreatedDate,
  Mumble,
  PostArgs,
  QwackerMumbleResponse,
  Reply,
  SearchRequestBody,
  transformMumble,
} from './service-types';
import axios from 'axios';

export const fetchMumbles = async (params?: {
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  olderThanMumbleId?: string;
  creator?: string;
}) => {
  const { limit, offset, newerThanMumbleId, olderThanMumbleId, creator } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
    olderThan: olderThanMumbleId || '',
    creator: creator || '',
  })}`;

  const res = await axios.get(url);

  const { count, data } = res.data as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};

export const createPost = async (postArgs: PostArgs) => {
  const formData = new FormData();
  formData.append('text', postArgs.text);
  if (postArgs.file) {
    formData.append('image', postArgs.file);
  }

  try {
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${postArgs.accessToken}`,
        },
      })
      .catch((error) => {
        throw new Error('Posted: ' + error.message);
      });

    return transformMumble(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};

export const commentPost = async (params: { postId: string; comment: string; accessToken?: string }) => {
  const { postId, comment, accessToken } = params || {};

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}`,
    { text: comment },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const reply = (await res.data) as Reply;

  return { ...reply, createdDate: calculateCreatedDate(reply.id) };
};

export const fetchMumbleById = async (params?: { postId: string; accessToken?: string }) => {
  const { postId, accessToken } = params || {};

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

export const fetchMumblesSearch = async (params?: {
  text?: string;
  tags?: string;
  likedBy?: string;
  mentions?: string;
  isReply?: boolean;
  limit?: number;
  offset?: number;
  accessToken?: string;
}) => {
  const { text, tags, likedBy, mentions, isReply, limit, offset, accessToken } = params || {};

  const payload: SearchRequestBody = {
    limit: limit || 10,
    offset: offset || 0,
  };

  if (text) {
    payload.text = text;
  }
  if (tags) {
    payload.tags = [tags];
  }
  if (likedBy) {
    payload.likedBy = [likedBy];
  }
  if (mentions) {
    payload.mentions = [mentions];
  }
  if (isReply != null) {
    payload.isReply = isReply;
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/search`;

  const res = await axios
    .post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((error) => {
      throw new Error('Posted: ' + error.message);
    });

  const { count, data } = res.data as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};
