const http = require('http');

// 测试 API 路由
const testEndpoints = async () => {
  const endpoints = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/logout',
    '/api/users',
    '/api/projects',
    '/api/files',
    '/api/conversations',
    '/api/messages',
    '/api/code-generation-tasks',
  ];

  console.log('Testing API endpoints...');

  for (const endpoint of endpoints) {
    console.log(`\nTesting ${endpoint}...`);

    try {
      // 发送 GET 请求
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:3000${endpoint}`, (res) => {
          console.log(`Status: ${res.statusCode}`);
          console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

          res.on('data', (chunk) => {
            console.log(`Body: ${chunk.toString()}`);
          });

          res.on('end', () => {
            resolve();
          });
        });

        req.on('error', (err) => {
          reject(err);
        });

        req.end();
      });
    } catch (error) {
      console.error(`Error testing ${endpoint}: ${error.message}`);
    }
  }

  console.log('\nAll endpoints tested.');
};

// 启动开发服务器并测试
const { exec } = require('child_process');

console.log('Starting development server...');

const devServer = exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Server error: ${stderr}`);
  }
});

// 等待服务器启动
setTimeout(() => {
  console.log('Server started. Testing endpoints...');
  testEndpoints()
    .then(() => {
      console.log('Testing completed.');
      devServer.kill(); // 停止服务器
    })
    .catch((error) => {
      console.error(`Error testing endpoints: ${error.message}`);
      devServer.kill(); // 停止服务器
    });
}, 3000);
