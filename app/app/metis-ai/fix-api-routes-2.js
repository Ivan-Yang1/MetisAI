const fs = require('fs');
const path = require('path');

// 查找所有需要修改的文件
const filesToFix = [
  'app/api/code-generation-tasks/route.ts',
  'app/api/code-generation-tasks/[id]/route.ts',
  'app/api/conversations/route.ts',
  'app/api/conversations/[id]/route.ts',
  'app/api/files/route.ts',
  'app/api/files/[id]/route.ts',
  'app/api/messages/route.ts',
  'app/api/messages/[id]/route.ts',
  'app/api/projects/route.ts',
  'app/api/projects/[id]/route.ts',
  'app/api/users/route.ts',
];

// 替换函数
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 删除 authMiddleware 调用块
  content = content.replace(/  \/\/ 验证用户身份\s*const authResult = await authMiddleware\(request\);\s*if \(authResult\) {\s*return authResult;\s*}\s*/g, '');

  // 修复 // 验证用户身份try { 这种情况
  content = content.replace(/  \/\/ 验证用户身份try \{/g, '  try {');

  // 删除任何剩余的 authMiddleware 导入
  content = content.replace(/import \{ authMiddleware \} from '.*';\n/, '');

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
