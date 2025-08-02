@echo off
REM 设置环境变量
set FLASK_APP=api/index.py
set FLASK_ENV=development
REM 启动Flask服务器
python -m flask run