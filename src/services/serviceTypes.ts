import { decodeTime } from 'ulid';
import { User } from './users';

export type UploadImage = File & { preview: string };

export type PostArgs = {
  text: string;
  file?: UploadImage;
  accessToken?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
  createdDate: new Date(decodeTime(mumble.id)).toLocaleDateString(),
});

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

export type RawMumble = Omit<Mumble, 'createdTimestamp'>;

export type QwackerMumbleResponse = {
  count: number;
  data: RawMumble[];
};
