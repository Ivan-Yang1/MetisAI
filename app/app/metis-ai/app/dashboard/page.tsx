'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useProjects } from '@/app/hooks/useProjects';
import { Button } from '@/app/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { projects, loading, createProject, deleteProject } = useProjects(user?.id || null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setIsCreatingProject(true);
    await createProject(newProjectName.trim(), newProjectDescription.trim());
    setIsCreatingProject(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      await deleteProject(id);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">正在加载项目...</p>
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                MetisAI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                欢迎，{user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                登出
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            我的项目
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            管理您的项目，查看项目详情，或创建新的项目。
          </p>
        </div>

        {/* 创建项目表单 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>创建新项目</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  项目名称
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="请输入项目名称"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  项目描述（可选）
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="请输入项目描述"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateProject}
              disabled={isCreatingProject || !newProjectName.trim()}
              isLoading={isCreatingProject}
            >
              创建项目
            </Button>
          </CardFooter>
        </Card>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.description || '暂无描述'}
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>状态：{project.status}</span>
                  <span className="mx-2">•</span>
                  <span>
                    创建时间：{new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  查看详情
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  删除
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-block h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-500 dark:text-gray-400">📂</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              暂无项目
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              您还没有创建任何项目。点击上方按钮创建您的第一个项目。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
