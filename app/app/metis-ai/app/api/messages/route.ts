import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // 验证对话是否属于用户
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or not authorized' },
        { status: 404 }
      );
    }

    // 获取对话的所有消息
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get messages API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
try {
    const { conversation_id, role, content } = await request.json();
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    if (!conversation_id || !role || !content) {
      return NextResponse.json(
        { error: 'Conversation ID, role, and content are required' },
        { status: 400 }
      );
    }

    // 验证对话是否属于用户
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .eq('user_id', user.id)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or not authorized' },
        { status: 404 }
      );
    }

    // 创建消息
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        role,
        content,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create message API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
