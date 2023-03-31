import { transformMumble, UploadImage } from './serviceTypes';
import axios from 'axios';

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
