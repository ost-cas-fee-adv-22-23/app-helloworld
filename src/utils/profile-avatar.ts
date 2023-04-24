export function profileAvatar(avatar: string | undefined): string {
  return avatar ? avatar : '/avatar_placeholder.png';
}
