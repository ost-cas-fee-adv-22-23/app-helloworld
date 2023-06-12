import axios from 'axios';
import { createPost, fetchMumbles } from './posts';
import { PostArgs } from './service-types';

const mumbles = [
  {
    id: '01H292YCVJVFK932ABZKA2K9Q9',
    creator: {
      id: '195305735549092097',
      userName: 'petermanser',
      firstName: 'Peter',
      lastName: 'Manser',
      avatarUrl:
        'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/195305735549092097/avatar?v=3b1662b598359b0221e987ebc08375f7',
    },
    text: 'FCSG',
    mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/037faf32-faf9-452b-ad17-2ff00ea62116',
    mediaType: 'image/jpeg',
    likeCount: 1,
    likedByUser: false,
    type: 'post',
    replyCount: 0,
  },
];

const response = {
  count: 3,
  data: mumbles,
};

const aggregatedMumble = { ...response.data[0], createdDate: '6.6.2023', createdTimestamp: 1686079746930 };

const aggregatedResponse = {
  count: response.count,
  mumbles: [aggregatedMumble],
};

describe('fetchMumbles', () => {
  jest.mock('axios');
  axios.get = jest.fn().mockImplementation(() => Promise.resolve({ data: response }));

  test('[#01] should fetch mumbles', () => {
    fetchMumbles({}).then((res) => expect(res).toStrictEqual(aggregatedResponse));
  });

  test('[#02/01] should create Post', () => {
    // Arrange
    const postArgs: PostArgs = {
      text: 'test',
      accessToken: 'bli',
    };

    // Act and assert
    createPost(postArgs).then((res) => expect(res).toStrictEqual(aggregatedMumble));
  });

  test('[#02/02] should not create post as accessToken is missing', () => {
    // Arrange
    const postArgs: PostArgs = {
      text: 'test',
      accessToken: undefined,
    };

    // Act and assert
    expect(() => createPost(postArgs)).rejects.toThrowError('No access token');
  });
});

describe('createPost', () => {
  jest.mock('axios');
  axios.post = jest.fn().mockImplementation(() => Promise.resolve({ data: mumbles[0] }));

  test('[#01] should create Post', () => {
    // Arrange
    const postArgs: PostArgs = {
      text: 'test',
      accessToken: 'bli',
    };

    // Act and assert
    createPost(postArgs).then((res) => expect(res).toStrictEqual(aggregatedMumble));
  });

  test('[#02] should not create post as accessToken is missing', () => {
    // Arrange
    const postArgs: PostArgs = {
      text: 'test',
      accessToken: undefined,
    };

    // Act and assert
    expect(() => createPost(postArgs)).rejects.toThrowError('No access token');
  });
});
