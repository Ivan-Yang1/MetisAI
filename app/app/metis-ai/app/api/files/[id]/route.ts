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

    // 获取文件详情
    const { data: file, error } = await supabase
      .from('files')
      .select(`*, projects (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    // 验证文件所属项目是否属于当前用户
    if (file.projects.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: File not found or not authorized' },
        { status: 403 }
      );
    }

    // 删除关联数据，只返回文件信息
    const { projects, ...fileData } = file;
    return NextResponse.json(fileData);
  } catch (error) {
    console.error('Get file API error:', error);
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
    const { name, path, content, type } = await request.json();
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // 验证文件所属项目是否属于当前用户
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select(`*, projects (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (file.projects.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: File not found or not authorized' },
        { status: 403 }
      );
    }

    // 更新文件
    const updates: any = {};
    if (name) updates.name = name;
    if (path) updates.path = path;
    if (content !== undefined) updates.content = content;
    if (type) updates.type = type;

    const { data, error } = await supabase
      .from('files')
      .update(updates)
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
    console.error('Update file API error:', error);
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

    // 验证文件所属项目是否属于当前用户
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select(`*, projects (id, user_id)`)
      .eq('id', (await params).id)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (file.projects.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: File not found or not authorized' },
        { status: 403 }
      );
    }

    // 删除文件
    const { error } = await supabase
      .from('files')
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
    console.error('Delete file API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
