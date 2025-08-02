# SoulMate 项目

## 项目简介
SoulMate是一个基于Python + Flask后端和React前端的缘分匹配应用，提供免费和付费的缘分匹配服务。

## 技术栈
- 后端: Python, Flask, Flask-CORS, SQLite
- 前端: React, JavaScript, CSS
- 支付集成: 微信支付API

## 项目结构
```
SoulMate/
├── api/
│   ├── index.py         # Flask API 主入口
│   ├── UserManager.py   # 用户管理类
│   └── create_payment_table.py  # 创建支付表脚本
├── src/
│   ├── app.jsx          # 前端主应用
│   ├── components/
│   │   └── Modals.jsx   # 模态框组件
│   └── styles.css       # 前端样式
├── package.json     # 前端依赖管理
├── package-lock.json # 前端依赖锁定文件
├── requirements.txt # 后端依赖管理
└── README.md        # 项目文档
```

## 安装和运行说明

### 后端
1. 安装Python 3.8+
2. 安装依赖:
   ```
   pip install -r requirements.txt
   ```
3. 初始化数据库:
   ```
   python api/create_payment_table.py
   ```
4. 启动后端服务:
   ```
   python api/index.py
   ```

### 前端
1. 安装依赖:
   ```
   npm install
   ```
2. 运行前端开发服务器:
   ```
   npm start
   ```

## API 接口
- GET `/api/v1/users/<user_id>`: 获取用户数据
- POST `/api/v1/generate/submit`: 提交生成任务
- POST `/api/v1/payment/create`: 创建支付订单
- POST `/api/v1/payment/callback`: 支付回调接口

## 注意事项
1. **数据存储**：本项目使用SQLite数据库进行数据存储。实际应用中可根据需求迁移到MySQL、PostgreSQL等更强大的数据库。
2. **安全性**：
   - 在生产环境中，应限制CORS允许的来源，避免跨站请求伪造
   - 敏感数据（如用户信息、支付凭证）应加密存储
   - 实现完善的用户认证和授权机制
3. **支付系统**：本项目已集成微信支付API，但需要正确配置商户信息和API密钥才能在生产环境中使用。
4. **环境要求**：支付功能需要在微信环境中运行才能正常工作。
5. **性能优化**：
   - 对于图片生成等耗时操作，已实现异步任务处理
   - 可进一步实现缓存机制，减少重复计算
6. **部署建议**：
   - 使用Docker容器化应用，便于部署和扩展
   - 考虑使用Nginx作为反向代理服务器
   - 后端服务和前端静态文件应分开部署
7. **开发环境**：确保安装了Node.js (v14+) 和Python (v3.8+) 以获得最佳兼容性。