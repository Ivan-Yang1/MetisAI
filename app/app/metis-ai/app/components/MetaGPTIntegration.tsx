'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

interface MetaGPTIntegrationProps {
  projectId?: string;
  onCodeGenerated?: (files: { [key: string]: string }) => void;
  className?: string;
}

export function MetaGPTIntegration({ projectId, onCodeGenerated, className = '' }: MetaGPTIntegrationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      setGenerationError('请输入生成代码的提示');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error('代码生成失败');
      }

      const data = await response.json();

      if (data.success && data.data) {
        // 处理生成的代码
        const generatedFiles: { [key: string]: string } = {};
        data.data.code_files.forEach((file: any) => {
          generatedFiles[file.path] = file.content;
        });

        // 调用回调函数
        if (onCodeGenerated) {
          onCodeGenerated(generatedFiles);
        }

        setPrompt('');
        alert('代码生成成功');
      } else {
        throw new Error(data.error || '代码生成失败');
      }
    } catch (error) {
      console.error('MetaGPT integration error:', error);
      setGenerationError(error instanceof Error ? error.message : '未知错误');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateCode();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>MetaGPT 集成</CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => setPrompt('')} disabled={isGenerating}>
            清除
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            代码生成提示
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您想要生成的代码的描述，例如：'创建一个简单的待办事项应用'"
            className="w-full h-[150px] p-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
        </div>

        {generationError && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{generationError}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={handleGenerateCode} disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? '生成中...' : '生成代码'}
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          点击生成按钮或按 Enter 键开始生成代码
        </p>
      </CardFooter>
    </Card>
  );
}
