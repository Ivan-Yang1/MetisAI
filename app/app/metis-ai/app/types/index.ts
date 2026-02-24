// 用户类型
export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

// 项目类型
export type Project = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  tech_stack?: string[];
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
};

// 文件类型
export type File = {
  id: string;
  project_id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'directory';
  created_at: string;
  updated_at: string;
};

// 对话类型
export type Conversation = {
  id: string;
  user_id: string;
  project_id?: string;
  title?: string;
  created_at: string;
  updated_at: string;
};

// 消息类型
export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  updated_at: string;
};

// 代码生成任务类型
export type CodeGenerationTask = {
  id: string;
  user_id: string;
  project_id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
};
