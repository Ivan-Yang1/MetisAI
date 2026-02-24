import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './app/lib/supabase';

// 认证中间件
async function authMiddleware(request: NextRequest) {
  // 从请求头获取授权信息
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

  try {
    // 使用 Supabase 验证 JWT 令牌
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // 令牌有效，继续处理请求
    return null;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 公共路由（不需要认证）
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否是公共路由
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 否则需要认证
  return await authMiddleware(request);
}

export const config = {
  matcher: '/api/:path*', // 仅对 API 路由应用中间件
};
