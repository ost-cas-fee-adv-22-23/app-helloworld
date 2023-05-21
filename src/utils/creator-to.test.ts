import { Mumble, User } from '../services/service-types';
import { addCreatorToMumbles } from './creator-to';

describe('addCreatorToMumbles', () => {
  const mumbles = [{ id: '123', creator: '1' }] as Mumble[];
  const creators = [
    { id: '1', userName: 'userName1', firstName: 'firstName1', lastName: 'lastName1', avatarUrl: 'url1' },
    { id: '2', userName: 'userName2', firstName: 'firstName2', lastName: 'lastName2', avatarUrl: 'url2' },
  ] as User[];

  const aggregatedMumble = {
    ...mumbles[0],
    creatorProfile: {
      id: creators[0].id,
      userName: creators[0].userName,
      firstName: creators[0].firstName,
      lastName: creators[0].lastName,
      fullName: `${creators[0].firstName} ${creators[0].lastName}`,
      avatarUrl: creators[0].avatarUrl,
    },
  };

  test('add creator to mumble', () => {
    expect(addCreatorToMumbles(mumbles, creators)[0]).toStrictEqual(aggregatedMumble);
  });

  test('no mumble', () => {
    expect(addCreatorToMumbles([], creators)).toStrictEqual([]);
  });
});
