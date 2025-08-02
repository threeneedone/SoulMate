#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SoulMate 项目初始化脚本
此脚本用于初始化项目环境，包括安装依赖和设置数据库。
"""
import os
import sys
import subprocess
import platform

def run_command(command, cwd=None):
    """执行命令并返回输出"""
    print(f"执行命令: {' '.join(command)}")
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print(result.stdout)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"命令执行失败: {e}")
        print(f"错误输出: {e.stderr}")
        return False, e.stderr

def install_python_dependencies():
    """安装Python依赖"""
    print("安装Python依赖...")
    return run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def install_node_dependencies():
    """安装Node.js依赖"""
    print("安装Node.js依赖...")
    if platform.system() == "Windows":
        return run_command(["npm.cmd", "install"])
    else:
        return run_command(["npm", "install"])

def initialize_database():
    """初始化数据库"""
    print("初始化数据库...")
    # 数据库会在app.py运行时自动初始化
    return True, "数据库初始化完成"

def start_backend():
    """启动后端服务"""
    print("启动后端服务...")
    if platform.system() == "Windows":
        return run_command([sys.executable, "app.py"])
    else:
        return run_command(["python3", "app.py"])

def start_frontend():
    """启动前端服务"""
    print("启动前端服务...")
    if platform.system() == "Windows":
        return run_command(["npm.cmd", "start"])
    else:
        return run_command(["npm", "start"])

if __name__ == '__main__':
    print("===== SoulMate 项目初始化 =====")
    
    # 安装Python依赖
    success, output = install_python_dependencies()
    if not success:
        print("Python依赖安装失败，请检查错误信息。")
        sys.exit(1)
    
    # 安装Node.js依赖
    success, output = install_node_dependencies()
    if not success:
        print("Node.js依赖安装失败，请检查错误信息。")
        sys.exit(1)
    
    # 初始化数据库
    success, output = initialize_database()
    if not success:
        print("数据库初始化失败，请检查错误信息。")
        sys.exit(1)
    
    print("\n初始化完成！\n")
    print("请分别在两个终端中运行以下命令来启动服务：")
    print("1. 启动后端服务:")
    if platform.system() == "Windows":
        print("   python app.py")
    else:
        print("   python3 app.py")
    print("2. 启动前端服务:")
    print("   npm start")
    
    print("\n或者，您可以手动运行init_project.py脚本的特定功能:")
    print("- 安装依赖: python init_project.py install")
    print("- 启动后端: python init_project.py backend")
    print("- 启动前端: python init_project.py frontend")