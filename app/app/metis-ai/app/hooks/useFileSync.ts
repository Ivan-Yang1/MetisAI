'use client';

import { useState, useEffect } from 'react';

interface FileSyncProps {
  files: { [key: string]: string };
}

export function useFileSync({ files }: FileSyncProps) {
  const [syncedFiles, setSyncedFiles] = useState<{ [key: string]: string }>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化时同步文件
    if (Object.keys(files).length > 0) {
      syncFiles(files);
    }
  }, []);

  const syncFiles = async (newFiles: { [key: string]: string }) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      // 模拟文件同步过程
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 同步文件
      setSyncedFiles(newFiles);

      console.log('Files synced:', newFiles);
    } catch (error) {
      console.error('File sync error:', error);
      setSyncError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // 监听文件变化并同步
    if (JSON.stringify(files) !== JSON.stringify(syncedFiles)) {
      syncFiles(files);
    }
  }, [files]);

  const addFile = async (fileName: string, content: string) => {
    const newFiles = {
      ...files,
      [fileName]: content,
    };

    await syncFiles(newFiles);
  };

  const updateFile = async (fileName: string, content: string) => {
    if (!files[fileName]) {
      throw new Error(`File ${fileName} not found`);
    }

    const newFiles = {
      ...files,
      [fileName]: content,
    };

    await syncFiles(newFiles);
  };

  const deleteFile = async (fileName: string) => {
    if (!files[fileName]) {
      throw new Error(`File ${fileName} not found`);
    }

    const newFiles = { ...files };
    delete newFiles[fileName];

    await syncFiles(newFiles);
  };

  return {
    syncedFiles,
    isSyncing,
    syncError,
    addFile,
    updateFile,
    deleteFile,
  };
}
