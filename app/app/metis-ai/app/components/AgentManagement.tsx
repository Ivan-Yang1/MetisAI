'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

// 智能体类型定义
export interface Agent {
  id: string;
  name: string;
  profile: string;
  goal: string;
  constraints: string;
  actions: string[];
  description: string;
}

// 预定义的智能体列表
const PREDEFINED_AGENTS: Agent[] = [
  {
    id: 'pm',
    name: '产品经理',
    profile: '产品经理',
    goal: '负责产品规划和需求分析',
    constraints: '需要明确用户需求和产品定位',
    actions: ['需求分析', '产品规划', '功能设计'],
    description: '负责产品规划和需求分析，制定产品发展路线',
  },
  {
    id: 'architect',
    name: '架构师',
    profile: '架构师',
    goal: '负责系统架构设计',
    constraints: '需要考虑技术可行性和扩展性',
    actions: ['系统设计', '架构规划', '技术选型'],
    description: '负责系统架构设计和技术选型，确保系统可扩展和可维护',
  },
  {
    id: 'engineer',
    name: '工程师',
    profile: '工程师',
    goal: '负责代码实现和开发',
    constraints: '需要按时完成开发任务',
    actions: ['代码实现', '单元测试', '代码优化'],
    description: '负责代码实现和开发，编写高质量的可维护代码',
  },
  {
    id: 'qa',
    name: '测试工程师',
    profile: '测试工程师',
    goal: '负责测试和质量保证',
    constraints: '需要确保软件质量',
    actions: ['编写测试用例', '执行测试', '缺陷跟踪'],
    description: '负责软件测试和质量保证，确保产品符合质量标准',
  },
  {
    id: 'pmgr',
    name: '项目经理',
    profile: '项目经理',
    goal: '负责项目管理和协调',
    constraints: '需要确保项目按时交付',
    actions: ['项目规划', '进度跟踪', '团队协调'],
    description: '负责项目管理和协调，确保项目按时按质交付',
  },
];

interface AgentManagementProps {
  selectedAgents?: string[];
  onAgentSelect?: (agentIds: string[]) => void;
  className?: string;
}

export function AgentManagement({
  selectedAgents = [],
  onAgentSelect = () => {},
  className = '',
}: AgentManagementProps) {
  const [selected, setSelected] = useState<string[]>(selectedAgents);

  const handleAgentSelect = (agentId: string) => {
    const newSelected = selected.includes(agentId)
      ? selected.filter(id => id !== agentId)
      : [...selected, agentId];

    setSelected(newSelected);
    onAgentSelect(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === PREDEFINED_AGENTS.length) {
      setSelected([]);
      onAgentSelect([]);
    } else {
      const allIds = PREDEFINED_AGENTS.map(agent => agent.id);
      setSelected(allIds);
      onAgentSelect(allIds);
    }
  };

  const handleClearAll = () => {
    setSelected([]);
    onAgentSelect([]);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>智能体管理</CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleSelectAll}>
            {selected.length === PREDEFINED_AGENTS.length ? '取消全选' : '全选'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleClearAll}>
            清除选择
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {PREDEFINED_AGENTS.map(agent => (
            <div
              key={agent.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selected.includes(agent.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
              onClick={() => handleAgentSelect(agent.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {agent.name}
                  </h3>
                  {selected.includes(agent.id) && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                      已选中
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {agent.profile} - {agent.goal}
              </p>

              <div className="flex flex-wrap gap-1 mb-2">
                {agent.actions.map(action => (
                  <span
                    key={action}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {action}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
        <span>已选中 {selected.length} 个智能体</span>
        <span>共 {PREDEFINED_AGENTS.length} 个智能体</span>
      </CardFooter>
    </Card>
  );
}
