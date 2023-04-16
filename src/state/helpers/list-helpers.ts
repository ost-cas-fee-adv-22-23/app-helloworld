import { Mumble, User } from '../../services/service-types';

export type ListState = {
  mumbles: Mumble[];
  nextOffset: number;
  showWriteCard: boolean;
  totalMumbles: number;
  users: User[];
};
