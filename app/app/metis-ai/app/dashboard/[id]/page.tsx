'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';
import { AIDialogue } from '@/app/components/AIDialogue';
import { AgentManagement } from '@/app/components/AgentManagement';

export default function ProjectDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user || !projectId) return;

      try {
        setLoading(true);

        // 1. 从数据库获取项目信息
        const projectResponse = await fetch(`/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProject(projectData);
        } else {
          console.error('获取项目信息失败');
        }

        // 2. 获取项目文件
        const filesResponse = await fetch(`/api/files?project_id=${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setFiles(filesData);
        } else {
          console.error('获取项目文件失败');
        }
      } catch (error) {
        console.error('获取项目数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [user, projectId]);

  const handleFileSelect = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const fileData = await response.json();
        setSelectedFile(fileId);
        setFileContent(fileData.content);
        setEditing(false);
      } else {
        console.error('获取文件内容失败');
      }
    } catch (error) {
      console.error('获取文件内容失败:', error);
    }
  };

  const handleFileSave = async () => {
    if (!selectedFile || !fileContent) return;

    try {
      const response = await fetch(`/api/files/${selectedFile}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          content: fileContent,
        }),
      });

      if (response.ok) {
        setEditing(false);
        alert('文件保存成功');
      } else {
        console.error('保存文件失败');
      }
    } catch (error) {
      console.error('保存文件失败:', error);
    }
  };

  const handleFileCreate = async () => {
    const fileName = prompt('请输入新文件名');
    if (!fileName) return;

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          name: fileName,
          content: '',
          type: 'file',
        }),
      });

      if (response.ok) {
        const newFile = await response.json();
        setFiles([...files, newFile]);
        alert('文件创建成功');
      } else {
        console.error('创建文件失败');
      }
    } catch (error) {
      console.error('创建文件失败:', error);
    }
  };

  const handleAgentSelect = (agentIds: string[]) => {
    setSelectedAgents(agentIds);
    console.log('Selected agents:', agentIds);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">正在加载项目数据...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            项目未找到
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            您所访问的项目不存在或您没有权限访问。
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            返回仪表盘
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'}>
                返回仪表盘
              </Button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {project.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                欢迎，{user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                登出
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧面板：项目信息、文件树和智能体管理 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 项目信息卡片 */}
            <Card>
              <CardHeader>
                <CardTitle>项目信息</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>项目ID：</strong> {project.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>状态：</strong> {project.status}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>创建时间：</strong> {new Date(project.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>描述：</strong> {project.description || '暂无描述'}
                </p>
                <Button onClick={handleFileCreate} className="w-full">
                  创建文件
                </Button>
              </CardContent>
            </Card>

            {/* 文件树卡片 */}
            <Card>
              <CardHeader>
                <CardTitle>项目文件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedFile === file.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 智能体管理卡片 */}
            <AgentManagement
              selectedAgents={selectedAgents}
              onAgentSelect={handleAgentSelect}
              className="h-full"
            />
          </div>

          {/* 中间面板：AI 对话界面 */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI 对话</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[800px]">
                <AIDialogue projectId={projectId} />
              </CardContent>
            </Card>
          </div>

          {/* 右侧面板：文件内容 */}
          <div className="lg:col-span-2">
            {selectedFile ? (
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>
                    {files.find((f) => f.id === selectedFile)?.name || '未选择文件'}
                  </CardTitle>
                  <div className="space-x-2">
                    {editing ? (
                      <>
                        <Button size="sm" onClick={handleFileSave}>
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                          取消
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => setEditing(true)}>
                        编辑
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full h-[600px] p-4 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 font-mono text-sm resize-none"
                      placeholder="文件内容"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap break-all p-4 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm h-[600px] overflow-auto">
                      {fileContent || '文件内容为空'}
                    </pre>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>
                    关闭文件
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex h-[600px] items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  请从左侧文件树中选择一个文件查看内容
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
