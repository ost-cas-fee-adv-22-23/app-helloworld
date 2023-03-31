import { decodeTime } from 'ulid';
import { User } from './users';

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
  createdDate: new Date(decodeTime(mumble.id)).toLocaleDateString(),
});

export const likePost = async (params?: { postId: string }) => {
  const { postId } = params || {};

  const accessToken = undefined;
  // TODO: Fix this accessToken
  const token = accessToken ?? 'Bearer fwE0Gk7rcCjCYYOxt-ZVdWT69WVmpgsFbIVom87GhOqz3r2o7A3nIluKl-ZSwPgjnl_1qf8';

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}/likes`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: token,
    },
  });
};