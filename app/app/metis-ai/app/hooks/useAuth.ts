import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已登录
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error checking user:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (data?.user) {
          // 从数据库获取用户详细信息
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            setUser(null);
            setLoading(false);
            return;
          }

          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // 用户登录成功
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            setUser(null);
            setLoading(false);
            return;
          }

          setUser(userData);
        } else {
          // 用户登出
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 登录函数
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          throw userError;
        }

        setUser(userData);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // 注册函数
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // 创建用户记录
        const { error: userError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
        });

        if (userError) {
          throw userError;
        }

        setUser({
          id: data.user.id,
          email,
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    signUp,
    logout,
  };
}
