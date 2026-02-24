'use client';

import { useAuth } from '@/app/hooks/useAuth';
import AuthPage from './auth/page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          欢迎回来，{user.name}！
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          您已成功登录到 MetisAI 平台。
        </p>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {/* 这里将放置仪表盘内容 */}
        </div>
      </div>
    </div>
  );
}
