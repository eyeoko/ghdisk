#!/usr/bin/env bash
# ==========================================
# Docker 一键清理无用镜像、容器与卷
# ==========================================

echo "===> 正在清理已停止的容器..."
docker container prune -f

echo "===> 正在清理无标签的虚悬镜像..."
docker image prune -f

echo "===> 正在清理未使用的网络..."
docker network prune -f

echo "===> Docker 空间清理完成！"
docker system df
