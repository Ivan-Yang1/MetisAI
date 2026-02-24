import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 获取用户认证信息
    const { data: { user } } = await supabase.auth.getUser(request.headers.get('authorization')?.substring(7));

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 }
      );
    }

    // 解析请求数据
    const { project_id, files } = await request.json();

    if (!project_id || !files || Object.keys(files).length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters: project_id or files' },
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

    // 这里可以添加调用 MetaGPT 分析代码的逻辑
    // 目前我们返回一个模拟的建议
    const mockSuggestions = [
      {
        title: '代码优化建议',
        description: '您的代码中存在一些可以优化的地方，以下是我们的建议：\n1. 优化变量命名，使用更具有描述性的名称\n2. 添加适当的注释，提高代码可读性\n3. 重构重复代码，提取可复用的函数',
      },
      {
        title: '性能优化建议',
        description: '以下是一些性能优化建议：\n1. 避免在循环中使用昂贵的操作\n2. 优化 DOM 操作，减少重排和重绘\n3. 考虑使用虚拟化列表处理大量数据',
      },
      {
        title: '安全性建议',
        description: '以下是一些安全性建议：\n1. 验证所有用户输入，避免 XSS 攻击\n2. 确保密码和其他敏感信息被正确加密\n3. 实施适当的访问控制措施',
      },
    ];

    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      data: {
        suggestions: mockSuggestions,
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
