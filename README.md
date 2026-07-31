# Obsidian 风格 多源存储网盘系统 (GitHub Pages / Hugging Face / WebDAV)

这是一个结合了 **多后端存储驱动支持（GitHub Pages / Hugging Face 模型数据集仓库 / WebDAV 坚果云云网盘）**、**自由自定义任意 CDN 加速节点 URL**、**本地整个文件夹/目录结构无损上传**、**文件与目录深拷贝复制与粘贴副本**、**多标签页无缝切换**、**剪贴板复制/粘贴与刷新**、**密码锁权限管理（游客只读保护/密码解锁管理）**、**Obsidian 紫晶图标风格**、**400+ 语种格式关联**、**后台控制面板定制**、**2个月回收站超期自动清理** 的全功能静态网盘系统，免费托管部署于 **GitHub Pages** 上！

---

## ✨ 关联与其他存储服务使用指南

本系统完美支持关联并挂载多种第三方存储后端：

### 1. 🐙 GitHub Pages / Raw 存储（默认原生模式）
- **特点**：免费托管于 GitHub Pages 上，适合直接搭配 Git / GitHub Action。
- **自定义 CDN 加速**：可在后台自由输入 `https://cdn.jsdelivr.net/gh/user/repo@main/` 或自建 CDN 镜像代理 URL。

### 2. 🤗 Hugging Face Hub (模型/数据集仓库挂载)
- **支持仓类型**：Hugging Face Datasets 或 Models 仓库。
- **配置步骤**：
  1. 解锁管理员权限（默认密码 `admin`）后，打开 **【后台定制】** 弹窗。
  2. **选择后端存储服务驱动**：切换为 **`🤗 Hugging Face Hub`**。
  3. **填写仓库信息**：
     - **HF 仓库名称**：例如 `your-username/my-dataset`
     - **HF Branch 分支**：`main`
     - **HF Access Token**（可选）：填写在 Hugging Face Settings -> Tokens 中生成的 `hf_xxxxx` 访问令牌。
  4. 点击 **【保存存储源与站点设置】** 即可完成 Hugging Face 仓库关联！

### 3. 📁 WebDAV 统一云存储（坚果云 / Nextcloud / ownCloud）
- **支持网盘**：坚果云 (Jianguoyun)、Nextcloud、ownCloud 等标准 WebDAV 网盘。
- **配置步骤**：
  1. 打开 **【后台定制】** 弹窗，将存储驱动切换为 **`📁 WebDAV 云存储服务`**。
  2. **填写 WebDAV 服务器地址与凭设**：
     - **WebDAV 服务器 Endpoint**：例如坚果云 `https://dav.jianguoyun.com/dav/`
     - **WebDAV 用户名**：你的登录账号
     - **WebDAV 应用授权码**：坚果云后台生成的第三方应用密码。
  3. 保存后即可通过 WebDAV 协议进行云端同步！

---

## 🚀 本地使用与部署

1. **本地双击预览**：
   直接双击打开 `index.html` 即可运行体验！默认初始为游客只读模式，点击右上角【游客模式 (点击解锁)】输入密码 `admin` 即可解封管理员权限。

2. **部署到 GitHub Pages**：
   - 将全部源码 push 到 GitHub 仓库。
   - 在 Settings -> Pages 中开启服务即可完成网盘上线！
