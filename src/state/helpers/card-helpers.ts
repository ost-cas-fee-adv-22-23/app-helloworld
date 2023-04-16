import { Mumble } from '../../services/service-types';

export type CardState = {
  comment: string;
  mumble: Mumble;
  showComments?: boolean;
};
