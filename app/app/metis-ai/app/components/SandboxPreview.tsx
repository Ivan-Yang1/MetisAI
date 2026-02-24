'use client';

import { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

interface SandboxPreviewProps {
  files?: { [key: string]: string };
  className?: string;
}

export function SandboxPreview({ files = {}, className = '' }: SandboxPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  // 默认文件内容
  const defaultFiles = {
    '/index.html': `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>预览</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #333;
        text-align: center;
      }
      .content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>沙箱预览</h1>
      <div class="content">
        <p>请在左侧选择或创建文件以查看预览</p>
      </div>
    </div>
  </body>
</html>`,
    '/styles.css': `/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}
`,
    '/script.js': `// 示例 JavaScript 代码
console.log("沙箱预览功能已启动");
`,
  };

  // 合并用户提供的文件和默认文件
  const mergedFiles = { ...defaultFiles, ...files };

  // 初始化时设置激活文件
  useEffect(() => {
    const fileKeys = Object.keys(mergedFiles);
    if (fileKeys.length > 0 && !activeFile) {
      setActiveFile(fileKeys[0]);
    }
    setIsLoading(false);
  }, [mergedFiles, activeFile]);

  // 获取文件类型
  const getFileExtension = (fileName: string) => {
    return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  };

  // 格式化文件名
  const formatFileName = (fileName: string) => {
    return fileName.startsWith('/') ? fileName.slice(1) : fileName;
  };

  // 确定预览类型
  const getPreviewType = (fileName: string) => {
    const ext = getFileExtension(fileName);
    if (ext === 'html') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'js' || ext === 'jsx' || ext === 'ts' || ext === 'tsx') return 'javascript';
    if (ext === 'json') return 'json';
    return 'text';
  };

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>沙箱预览</CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => setIsLoading(!isLoading)}>
            {isLoading ? '停止加载' : '重新加载'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex h-[600px] items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">正在加载沙箱...</p>
            </div>
          </div>
        ) : (
          <div className="h-[600px]">
            <Sandpack
              theme="dark"
              template="vanilla"
              files={mergedFiles}
              options={{
                showNavigator: true,
                showTabs: true,
                activeFile: (activeFile || '/index.html') as any,
              }}
              customSetup={{
                dependencies: {},
                entry: '/index.html',
              }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
        <span>已加载 {Object.keys(mergedFiles).length} 个文件</span>
        <span>预览类型: {activeFile ? getPreviewType(activeFile) : 'HTML'}</span>
      </CardFooter>
    </Card>
  );
}
