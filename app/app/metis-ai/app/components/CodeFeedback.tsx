'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

interface CodeFeedbackProps {
  projectId?: string;
  files?: { [key: string]: string };
  onFeedbackGenerated?: (suggestions: any) => void;
  className?: string;
}

export function CodeFeedback({ projectId, files, onFeedbackGenerated, className = '' }: CodeFeedbackProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 检测文件变化
  useEffect(() => {
    if (files && Object.keys(files).length > 0) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [files]);

  const handleAnalyzeCode = async () => {
    if (!files || Object.keys(files).length === 0) {
      setAnalysisError('没有文件需要分析');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setSuggestions(null);

    try {
      const response = await fetch('/api/ai/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          files: files,
        }),
      });

      if (!response.ok) {
        throw new Error('代码分析失败');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSuggestions(data.data.suggestions);
        if (onFeedbackGenerated) {
          onFeedbackGenerated(data.data.suggestions);
        }
      } else {
        throw new Error(data.error || '代码分析失败');
      }
    } catch (error) {
      console.error('Code feedback error:', error);
      setAnalysisError(error instanceof Error ? error.message : '未知错误');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestion = async (suggestion: any) => {
    // 这里可以添加应用建议的逻辑
    console.log('Applying suggestion:', suggestion);
    alert('应用建议功能正在开发中');
  };

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>代码反馈循环</CardTitle>
        <div className="flex space-x-2">
          {suggestions && (
            <Button size="sm" variant="outline" onClick={() => setSuggestions(null)}>
              清除建议
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          沙箱代码修改后，点击分析按钮获取改进建议。
        </p>

        {analysisError && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{analysisError}</p>
          </div>
        )}

        {suggestions && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              代码改进建议：
            </h3>
            {suggestions.map((suggestion: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {suggestion.description}
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleApplySuggestion(suggestion)}>
                    应用建议
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={handleAnalyzeCode} disabled={isAnalyzing || !hasChanges}>
          {isAnalyzing ? '分析中...' : '分析代码'}
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {hasChanges ? '检测到文件变化' : '没有文件变化'}
        </p>
      </CardFooter>
    </Card>
  );
}
