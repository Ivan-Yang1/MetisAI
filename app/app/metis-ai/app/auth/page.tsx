'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const { login, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('请填写所有必填字段');
      return;
    }

    if (!isLogin && !name) {
      setError('请填写姓名');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? '登录' : '注册'}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isLogin ? '欢迎回来' : '创建新账户'}
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <Input
                label="姓名"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                required
              />
            )}
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              required
            />
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的密码"
              required
            />
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm dark:bg-red-900/20">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {isLogin ? '登录' : '注册'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              disabled={loading}
            >
              {isLogin ? '没有账户？注册' : '已有账户？登录'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
