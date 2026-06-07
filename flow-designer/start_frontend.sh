#!/usr/bin/env bash
# 一键启动前端
set -e
cd "$(dirname "$0")/frontend"

echo "📦 安装前端依赖..."
npm install

echo "🚀 启动前端开发服务 http://localhost:5173"
npm run dev

