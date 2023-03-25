import { transformMumble, PostArgs } from './serviceTypes';
import axios from 'axios';

export const postMumble = async (postArgs: PostArgs) => {
  if (!postArgs.accessToken) {
    throw new Error('No access token');
  }

  const formData = new FormData();
  formData.append('text', postArgs.text);
  if (postArgs.file) {
    formData.append('image', postArgs.file);
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${postArgs.accessToken}`,
      },
    });

    return transformMumble(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};
