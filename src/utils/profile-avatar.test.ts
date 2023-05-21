import { profileAvatar } from './profile-avatar';

describe('profileAvatar', () => {
  test('valid avatarUrl', () => {
    expect(profileAvatar('testurl')).toStrictEqual('testurl');
  });

  test('undefined', () => {
    expect(profileAvatar(undefined)).toStrictEqual('/avatar_placeholder.png');
  });
});
