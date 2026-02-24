-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建文件表
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL CHECK (type IN ('file', 'directory')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建对话表
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建代码生成任务表
CREATE TABLE IF NOT EXISTS code_generation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result JSONB,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_code_generation_tasks_user_id ON code_generation_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_code_generation_tasks_project_id ON code_generation_tasks(project_id);

-- 创建更新时间戳的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间戳的触发器
CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_code_generation_tasks_updated_at
    BEFORE UPDATE ON code_generation_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为用户表启用 RLS（Row Level Security）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 为项目表启用 RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- 为文件表启用 RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view files in their projects" ON files
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create files in their projects" ON files
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can update files in their projects" ON files
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can delete files in their projects" ON files
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
    );

-- 为对话表启用 RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON conversations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON conversations
    FOR DELETE USING (auth.uid() = user_id);

-- 为消息表启用 RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
    );

-- 为代码生成任务表启用 RLS
ALTER TABLE code_generation_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own code generation tasks" ON code_generation_tasks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create code generation tasks" ON code_generation_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own code generation tasks" ON code_generation_tasks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own code generation tasks" ON code_generation_tasks
    FOR DELETE USING (auth.uid() = user_id);
