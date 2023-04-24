import { Mumble, Reply, User } from '../services/service-types';

export function addCreatorToMumbles(mumbles: Mumble[], users: User[]) {
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

export function addCreatorToReplies(replies: Reply[], users: User[] | undefined) {
  return replies.map((reply) => {
    const creator = users?.find((user) => user.id === reply.creator);
    return {
      ...reply,
      creatorProfile: {
        id: creator?.id,
        userName: creator?.userName,
        firstName: creator?.firstName,
        lastName: creator?.lastName,
        fullName: `${creator?.firstName} ${creator?.lastName}`,
        avatarUrl: creator?.avatarUrl,
      },
    };
  });
}

export function addCreatorToReply(reply: Reply, users: User[] | undefined) {
  const creator = users?.find((user) => user.id === reply.creator);
  return {
    ...reply,
    creatorProfile: {
      id: creator?.id,
      userName: creator?.userName,
      firstName: creator?.firstName,
      lastName: creator?.lastName,
      fullName: `${creator?.firstName} ${creator?.lastName}`,
      avatarUrl: creator?.avatarUrl,
    },
  };
}
