#!/bin/bash
# 设置环境变量
export FLASK_APP=api/index.py
export FLASK_ENV=development
# 启动Flask服务器
python -m flask run