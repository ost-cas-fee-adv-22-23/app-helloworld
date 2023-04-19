import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {getToken} from 'next-auth/jwt';

// https://nextjs.org/docs/advanced-features/middleware
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  if(!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}


export const config = {
  matcher: ['/', '/mumble/[id]', '/profile/[id]', '/tag[id]'],
};
