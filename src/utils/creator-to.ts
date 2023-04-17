import { Mumble, User } from '../services/service-types';

export function addCreatorToMumble(mumbles: Mumble[], users: User[]) {
  return mumbles.map((mumble) => {
    const creator = users?.find((user) => user.id === mumble.creator);
    return {
      ...mumble,
      creatorProfile: {
        id: creator?.id || '',
        userName: creator?.userName || '',
        firstName: creator?.firstName || '',
        lastName: creator?.lastName || '',
        fullName: `${creator?.firstName} ${creator?.lastName}` || '',
        avatarUrl: creator?.avatarUrl || '',
      },
    };
  });
}
