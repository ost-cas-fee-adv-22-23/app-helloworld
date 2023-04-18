import { decodeTime } from 'ulid';

// export type UploadImage = File & { preview: string };

export type PostArgs = {
  text: string;
  file?: File | null;
  accessToken?: string;
};

export const transformMumble = (mumble: RawMumble | Reply) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
  createdDate: new Date(decodeTime(mumble.id)).toLocaleDateString('de-CH'),
});

export const calculateCreatedDate = (mumbleId: string) => new Date(decodeTime(mumbleId)).toLocaleDateString();

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
  replyCount?: number;
  createdTimestamp?: number;
  createdDate?: string;
};

export type RawMumble = Omit<Mumble, 'createdTimestamp'>;

export type QwackerMumbleResponse = {
  count: number;
  data: RawMumble[];
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
  createdTimestamp?: number;
  createdDate?: string;
};

export type SearchRequestBody = {
  text?: string;
  tags?: string[];
  likedBy?: string[];
  mentions?: string[];
  isReply?: boolean;
  limit?: number;
  offset?: number;
};

export type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export type QwackerUserResponse = {
  count?: number;
  data?: User[];
  accessToken: string;
};
