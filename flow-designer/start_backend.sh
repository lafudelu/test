#!/usr/bin/env bash
# 一键启动后端（需要先激活 Python 环境）
set -e
cd "$(dirname "$0")/backend"

echo "📦 安装后端依赖..."
pip install -r requirements.txt -q

echo "🚀 启动后端服务 http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

