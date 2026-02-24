'use client';

import { useState, useRef, useEffect } from 'react';
import { useCodeGeneration } from '@/app/hooks/useCodeGeneration';
import { Message } from '@/app/types';

interface AIDialogueProps {
  projectId?: string;
  className?: string;
}

export function AIDialogue({ projectId, className = '' }: AIDialogueProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { generateCode, error } = useCodeGeneration();

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim() || isGenerating) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      conversation_id: '1',
      role: 'user',
      content: inputValue.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    try {
      const response = await generateCode({
        prompt: userMessage.content,
        project_id: projectId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '1',
        role: 'assistant',
        content: response.success
          ? `代码生成成功！生成了 ${response.data?.code_files.length || 0} 个文件。`
          : `代码生成失败：${response.error}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '1',
        role: 'assistant',
        content: `代码生成失败：${err instanceof Error ? err.message : '未知错误'}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-medium mb-2">AI 代码生成助手</h3>
            <p className="text-center max-w-sm mb-4">
              请输入您的需求，AI 将帮助您生成完整的代码项目。
              <br />
              例如："创建一个待办事项应用"
            </p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* 头像 */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {message.role === 'user' ? '👤' : '🤖'}
              </div>

              {/* 消息内容 */}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 opacity-75 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {/* 加载状态 */}
        {isGenerating && (
          <div className="flex justify-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              🤖
            </div>
            <div className="bg-white text-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入您的需求，例如：'创建一个待办事项应用'..."
            disabled={isGenerating}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '生成中...' : '发送'}
          </button>
        </form>

        {/* 错误信息 */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
