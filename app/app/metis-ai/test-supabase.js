const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从 .env.local 文件加载配置
const envFilePath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envFilePath)) {
  console.error('❌ 未找到 .env.local 文件！');
  process.exit(1);
}

const envContent = fs.readFileSync(envFilePath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, value] = trimmedLine.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// 创建 Supabase 客户端
const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: 环境变量配置缺失！');
  console.error('请检查 .env.local 文件中的 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🔍 开始验证 Supabase 配置...');

  try {
    // 1. 测试连接
    console.log('\n1. 测试数据库连接...');
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (tablesError) {
      console.error('❌ 连接失败:', tablesError.message);
      console.error('💡 可能的原因:');
      console.error('   - Supabase 项目状态异常');
      console.error('   - 网络连接问题');
      console.error('   - SQL 迁移脚本未成功执行');
    } else {
      console.log('✅ 数据库连接正常');
      console.log(`📊 用户表中有 ${tables ? tables.length : 0} 条记录`);
    }

    // 2. 验证表结构
    console.log('\n2. 验证核心表是否存在...');
    const requiredTables = ['users', 'projects', 'files', 'conversations', 'messages', 'code_generation_tasks'];
    const allTablesExist = true;

    for (const table of requiredTables) {
      try {
        const { data } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        console.log(`✅ ${table} 表存在`);
      } catch (error) {
        console.error(`❌ ${table} 表不存在或无法访问:`, error.message);
        allTablesExist = false;
      }
    }

    // 3. 验证认证配置
    console.log('\n3. 验证认证配置...');
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      console.log('✅ 用户已登录');
      console.log(`👤 用户ID: ${session.user.id}`);
      console.log(`📧 邮箱: ${session.user.email}`);
    } else {
      console.log('ℹ️ 用户未登录（这是正常的，当前未执行登录操作）');
    }

    // 4. 测试 RLS 策略（需要用户登录才能测试）
    if (session) {
      console.log('\n4. 测试 RLS 策略...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id);

      if (userError) {
        console.error('❌ RLS 策略测试失败:', userError.message);
      } else {
        console.log('✅ RLS 策略正常工作');
        console.log(`📄 用户数据:`, userData);
      }
    }

    console.log('\n🎉 Supabase 配置验证完成！');

    if (allTablesExist) {
      console.log('✅ 所有核心表都已正确创建');
    } else {
      console.warn('⚠️ 一些核心表不存在或无法访问');
    }

    return allTablesExist;

  } catch (error) {
    console.error('\n❌ 验证过程中发生错误:', error);
    return false;
  }
}

testSupabase().then((success) => {
  process.exit(success ? 0 : 1);
});
