const fs = require('fs');
const path = require('path');

// 查找所有需要修改的文件
const filesToFix = [
  'app/api/code-generation-tasks/[id]/route.ts',
  'app/api/conversations/[id]/route.ts',
  'app/api/files/[id]/route.ts',
  'app/api/messages/[id]/route.ts',
  'app/api/projects/[id]/route.ts',
];

// 替换函数
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 修改所有函数的类型注解
  content = content.replace(/\{ params \}: \{ params: \{ id: string; \} \}/g, '{ params }: { params: Promise<{ id: string; }> }');
  content = content.replace(/\{ params \}: \{ params: \{ id: string;\} \}/g, '{ params }: { params: Promise<{ id: string; }> }');
  content = content.replace(/\{ params \}: \{ params: \{ id: string \} \}/g, '{ params }: { params: Promise<{ id: string; }> }');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

// 遍历所有文件
filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  }
});

console.log('All files fixed.');
