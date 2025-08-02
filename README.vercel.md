# Vercel 部署指南

本指南将帮助您将 SoulMate 应用部署到 Vercel 平台。

## 前提条件
- 拥有 Vercel 账号
- 已安装 Git
- 已将代码库托管到 GitHub、GitLab 或 Bitbucket

## 部署步骤

### 1. 导入项目到 Vercel
1. 登录 Vercel 控制台
2. 点击 "New Project"
3. 选择您的代码仓库
4. 点击 "Import"

### 2. 配置项目
1. 选择构建命令: `npm run build`
2. 选择输出目录: `build`
3. 配置环境变量:
   - `SECRET_KEY`: 您的 Flask 应用密钥
   - `FLASK_APP`: `api/index.py`
   - 其他必要的环境变量

### 3. 部署项目
点击 "Deploy" 按钮开始部署过程。

## 注意事项
1. Vercel 的文件系统是只读的，我们使用了临时目录存储数据库文件。在生产环境中，建议使用云数据库服务（如 AWS RDS、Supabase 等）。
2. 部署完成后，您需要更新前端代码中的 API 调用路径，指向 Vercel 提供的域名。
3. 对于生产环境，建议设置适当的 CORS 策略，限制来源域名。

## 技术栈
- 前端: React
- 后端: Flask
- 部署平台: Vercel