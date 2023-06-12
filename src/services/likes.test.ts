import { likePost } from './likes';
import axios from 'axios';

describe('likePost', () => {
  const postId = '123';
  const accessToken = 'bli';

  jest.mock('axios');
  axios.put = jest.fn().mockResolvedValue({});
  axios.delete = jest.fn().mockResolvedValue({});

  test('[#01] should like mumble', () => {
    likePost({ postId, likedByUser: false, accessToken }).then((_) => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith('undefinedposts/123/likes', undefined, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });
  });

  test('[#02] should dislike mumble', () => {
    likePost({ postId, likedByUser: true, accessToken }).then((_) => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledWith('undefinedposts/123/likes', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });
  });

  test('[#03] should throw error instead of calling api as accessToken is missing', () => {
    expect(() => likePost({ postId, likedByUser: false, accessToken: undefined })).rejects.toThrowError('No access token');
  });
});
