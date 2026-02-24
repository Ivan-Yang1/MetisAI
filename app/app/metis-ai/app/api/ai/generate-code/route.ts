import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { supabase } from '@/app/lib/supabase';

const execPromise = promisify(exec);

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
    const { prompt, project_name, investment, n_round, code_review, run_tests, implement, project_id } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required parameter: prompt' },
        { status: 400 }
      );
    }

    // 创建代码生成任务记录
    let taskId = null;
    if (project_id) {
      const { data: task, error } = await supabase
        .from('code_generation_tasks')
        .insert({
          user_id: user.id,
          project_id,
          prompt,
          status: 'processing'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating code generation task:', error);
      } else {
        taskId = task.id;
      }
    }

    try {
      // 调用 Python 脚本生成代码
      const pythonScriptPath = process.cwd() + '/scripts/generate_code.py';

      const requestData = JSON.stringify({
        prompt,
        project_name: project_name || 'generated_project',
        investment: investment || 3.0,
        n_round: n_round || 5,
        code_review: code_review !== false,
        run_tests: !!run_tests,
        implement: implement !== false
      });

      // 执行 Python 脚本
      const { stdout, stderr } = await execPromise(`python "${pythonScriptPath}" '${requestData}'`);

      // 解析 Python 脚本输出
      const output = JSON.parse(stdout);

      if (output.success) {
        // 更新任务状态为已完成
        if (taskId) {
          await supabase
            .from('code_generation_tasks')
            .update({
              status: 'completed',
              result: output.data
            })
            .eq('id', taskId);
        }

        return NextResponse.json({
          success: true,
          task_id: taskId,
          data: output.data
        });
      } else {
        // 更新任务状态为失败
        if (taskId) {
          await supabase
            .from('code_generation_tasks')
            .update({
              status: 'failed',
              error: output.error
            })
            .eq('id', taskId);
        }

        return NextResponse.json({
          error: output.error
        }, { status: 500 });
      }
    } catch (error: any) {
      // 更新任务状态为失败
      if (taskId) {
        await supabase
          .from('code_generation_tasks')
          .update({
            status: 'failed',
            error: error.message
          })
          .eq('id', taskId);
      }

      return NextResponse.json({
        error: 'Code generation failed: ' + error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
