import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export function useProjects(userId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (err) {
        setError(err as Error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // 监听项目变化
    const projectsChannel = supabase
      .channel('projects-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [userId]);

  // 创建项目
  const createProject = async (name: string, description?: string) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name,
          description,
          status: 'draft',
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setProjects((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      setError(error as Error);
      return null;
    }
  };

  // 更新项目
  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setProjects((prev) =>
        prev.map((project) => (project.id === id ? data : project))
      );
      return data;
    } catch (error) {
      setError(error as Error);
      return null;
    }
  };

  // 删除项目
  const deleteProject = async (id: string) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      return true;
    } catch (error) {
      setError(error as Error);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
