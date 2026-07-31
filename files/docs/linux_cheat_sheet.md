# Linux 高频运维命令速查手册

本常用手册整理了开发与运维中高频使用的 Linux 命令，可随时预览或下载备用。

## 1. 系统与资源监控
- **实时 CPU & 内存查看**: `top` 或 `htop`
- **磁盘空间占用**: `df -h`
- **查看当前目录占用大小**: `du -sh *`

## 2. 网络与端口排查
- **查看端口占用**: `netstat -tulnp` 或 `ss -tulnp`
- **测试网络连通**: `curl -I https://github.com`
- **抓包通信分析**: `tcpdump -i eth0 port 80`

## 3. 常用脚本开机自启
把脚本路径写入 `/etc/rc.local` 或使用 `systemd` 服务管理：
```bash
sudo systemctl enable my_service.service
sudo systemctl start my_service.service
```
