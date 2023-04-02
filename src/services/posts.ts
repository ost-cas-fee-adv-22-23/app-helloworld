import { QwackerMumbleResponse, transformMumble, PostArgs } from './serviceTypes';
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
