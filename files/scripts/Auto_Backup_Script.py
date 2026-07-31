#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto Backup Script for Linux/macOS
说明：用于定时打包指定目录并同步至备份位置的 Python 脚本
"""

import os
import tarfile
import datetime

BACKUP_SOURCE = "/var/www/data"
BACKUP_TARGET = "/backup"

def create_backup():
    today = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"backup_{today}.tar.gz"
    target_path = os.path.join(BACKUP_TARGET, output_filename)
    
    print(f"[*] 开始打包备份: {BACKUP_SOURCE} -> {target_path}")
    os.makedirs(BACKUP_TARGET, exist_ok=True)
    
    with tarfile.open(target_path, "w:gz") as tar:
        tar.add(BACKUP_SOURCE, arcname=os.path.basename(BACKUP_SOURCE))
        
    print(f"[+] 备份完成！文件大小: {os.path.getsize(target_path) / 1024:.2f} KB")

if __name__ == "__main__":
    create_backup()
