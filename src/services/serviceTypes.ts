import { decodeTime } from 'ulid';

export type UploadImage = File & { preview: string };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
  createdDate: new Date(decodeTime(mumble.id)).toLocaleDateString(),
});
