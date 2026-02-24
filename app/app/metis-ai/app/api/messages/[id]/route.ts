import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // 获取消息详情
    const { data: message, error } = await supabase
      .from('messages')
      .select(`*, conversations (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    // 验证消息所属对话是否属于当前用户
    if (message.conversations.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Message not found or not authorized' },
        { status: 403 }
      );
    }

    // 删除关联数据，只返回消息信息
    const { conversations, ...messageData } = message;
    return NextResponse.json(messageData);
  } catch (error) {
    console.error('Get message API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
try {
    const { content } = await request.json();
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // 验证消息所属对话是否属于当前用户
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select(`*, conversations (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (messageError || !message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    if (message.conversations.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Message not found or not authorized' },
        { status: 403 }
      );
    }

    // 更新消息
    const { data, error } = await supabase
      .from('messages')
      .update({ content })
      .eq('id', (await params).id)
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
    console.error('Update message API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
try {
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // 验证消息所属对话是否属于当前用户
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select(`*, conversations (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (messageError || !message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    if (message.conversations.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Message not found or not authorized' },
        { status: 403 }
      );
    }

    // 删除消息
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', (await params).id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
