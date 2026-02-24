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
  const content = fs.readFileSync(filePath, 'utf8');

  // 删除导入语句
  let fixedContent = content.replace(/import { authMiddleware } from '.*';\n/, '');

  // 删除 authMiddleware 调用
  fixedContent = fixedContent.replace(/\s*const authResult = await authMiddleware\(request\);\s*if \(authResult\) {\s*return authResult;\s*}\s*/, '');

  fs.writeFileSync(filePath, fixedContent, 'utf8');
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
