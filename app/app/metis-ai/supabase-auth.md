# Supabase 认证配置说明

## 问题
在测试过程中，我们发现 Supabase 的邮箱注册和登录功能都被禁用了，导致无法正常使用登录和注册功能。

## 解决方法
需要在 Supabase 控制台中手动启用邮箱注册和登录功能。

### 步骤
1. 访问 Supabase 控制台：https://app.supabase.com
2. 选择您的项目
3. 点击左侧菜单的 "Auth"
4. 点击 "Settings" 选项卡
5. 找到 "Email" 部分
6. 启用以下选项：
   - "Enable email signup"（邮箱注册）
   - "Enable email logins"（邮箱登录）
7. 保存设置

## 测试
启用后，您可以使用以下测试账号登录：
- 邮箱：1372269428@qq.com
- 密码：Supabase20010214Yyy

或者您可以注册新账号。
