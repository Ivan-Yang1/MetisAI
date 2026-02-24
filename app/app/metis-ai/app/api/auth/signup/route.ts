import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (data?.user) {
      // 创建用户记录
      const { error: userError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
      });

      if (userError) {
        return NextResponse.json(
          { error: userError.message },
          { status: 400 }
        );
      }
    }

    // 成功注册，返回用户信息
    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
