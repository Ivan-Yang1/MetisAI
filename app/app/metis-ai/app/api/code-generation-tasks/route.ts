import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    let query = supabase
      .from('code_generation_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectId) {
      // 验证项目是否属于用户
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (projectError || !project) {
        return NextResponse.json(
          { error: 'Project not found or not authorized' },
          { status: 404 }
        );
      }

      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get code generation tasks API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
try {
    const { project_id, prompt } = await request.json();
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    if (!project_id || !prompt) {
      return NextResponse.json(
        { error: 'Project ID and prompt are required' },
        { status: 400 }
      );
    }

    // 验证项目是否属于用户
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or not authorized' },
        { status: 404 }
      );
    }

    // 创建代码生成任务
    const { data, error } = await supabase
      .from('code_generation_tasks')
      .insert({
        user_id: user.id,
        project_id,
        prompt,
        status: 'pending',
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
    console.error('Create code generation task API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
