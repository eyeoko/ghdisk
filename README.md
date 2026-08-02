# 🗂️ 简易个人多源网盘 (GitHub Pages / Hugging Face / WebDAV / IndexedDB)

这是一个结合了 **多后端存储驱动支持（GitHub Pages / Hugging Face 模型数据集仓库 / WebDAV 坚果云云网盘 / IndexedDB 离线离线存储）**、**永硕 E 盘 (YS168) 一键数据全量迁移助手**、**自由自定义任意 CDN 加速节点 URL**、**本地整个文件夹/目录结构无损上传**、**文件与目录深拷贝复制与粘贴副本**、**多标签页无缝切换**、**剪贴板复制/粘贴与刷新**、**密码锁权限管理（游客只读保护/密码解锁管理）**、**Obsidian 紫晶图标风格**、**400+ 语种格式关联**、**配置与数据导入导出 (`data.json`)**、**2个月回收站超期自动清理** 的全功能静态网盘系统，免费托管部署于 **GitHub Pages** 上！

---

## ⚡ 为什么需要 IndexedDB 本地私有离线盘？

本项目引入 **IndexedDB 本地私有离线盘** 并不是为了替代云端，而是与 GitHub / WebDAV 等云端后端形成 **“本地+云端 双引擎互补（Local-First 本地优先架构）”**：

### 1. ⚡ 秒级极速打开（0 毫秒网络延迟）
- **纯云端模式**：每次点开一个文件，都需要向 GitHub API 或 CDN 服务器发起 HTTP 请求，受网络波动影响，往往需要等待 300 毫秒到 3 秒不等。
- **IndexedDB 本地私有盘**：文件直接保存在您电脑的 NVMe 固态硬盘和内存中，点击文件 **1~5 毫秒内瞬间呈现**，获得与桌面本地软件完全一致的零延迟极速体验！

### 2. 📡 100% 断网离线可用（Local-First 本地优先）
- 在高铁、飞机、无 Wi-Fi 或网络环境较差时，纯云端网盘将完全瘫痪。
- 引入 IndexedDB 后，即便电脑完全断网，您依然可以 **随时打开网盘、检索文件、新建文档、修改代码**。当网络恢复时，系统会自动将本地修改离线同步并提交 (Commit) 到 GitHub 远程仓库！

### 3. 🛡️ 绝对隐私与敏感数据隔离
- 并非所有文档都适合推送到云端。如果您有私人密码笔记、敏感配置文件、私钥草稿或内部代码，放在 GitHub 上即使是私有库也存在泄露风险。
- **IndexedDB 隔离盒**：数据存放在您浏览器的独立沙盒中，**任何第三方服务器、任何 API 都无法调取**，数据生命周期完全掌控在您自己手中。

### 4. 💰 突破 API 频率限制与免登录即用
- **防限流保护**：GitHub API 对未经身份验证的请求有每小时 60 次的调用限制。把常用文件缓存在本地 IndexedDB 中，可以极大节省 API 调用额度。
- **零门槛即用**：对于没有 GitHub 账号或不便配置 Token 的普通访客，依然可以直接把本网盘当成一个 **全功能的本地离线网盘 & Markdown 笔记本** 使用。

### 5. 🔄 容灾防丢失（本地 L1 缓存 + 云端 L2 备份）
- 避免因网络中断、GitHub API 故障或浏览器误刷新导致正在编辑的代码草稿丢失。
- 您的每一次修改都会 **先瞬间写入 IndexedDB (第一重保险)**，然后再异步上传到 GitHub 仓库 (第二重保险)，真正做到**双重冗余、万无一失**！

---

## 📂 IndexedDB 文件的物理保存位置与查看方式

IndexedDB 的文件保存在 **您当前使用的 Web 浏览器存储目录** 中（采用 Chromium LevelDB 数据库引擎格式存储）。

### 物理路径：
- ** Windows 系统**：
  `C:\Users\<用户名>\AppData\Local\Google\Chrome\User Data\Default\IndexedDB\https_eyeoko.github.io_0.indexeddb.leveldb\`
- **🐧 Linux 系统**：
  `~/.config/google-chrome/Default/IndexedDB/https_eyeoko.github.io_0.indexeddb.leveldb/`
- **🍎 macOS 系统**：
  `~/Library/Application Support/Google/Chrome/Default/IndexedDB/https_eyeoko.github.io_0.indexeddb.leveldb/`

### 🔍 浏览器内可视化查看方法：
1. 打开网盘页面：`https://eyeoko.github.io/ghdisk/`
2. 按 **`F12`**（或右键点击 **“检查 / Inspect”**）。
3. 选择顶部的 **`Application`（应用）** 标签页。
4. 在左侧菜单中展开 **`Storage`（存储）** -> **`IndexedDB`** -> **`YSDriveDB`** -> **`files`**，即可直接查看所有 key-value 存储的文件节点数据！

---

## ✨ 关联第三方存储服务使用指南

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
  2. **填写 WebDAV 服务器地址与凭据**：
     - **WebDAV 服务器 Endpoint**：例如坚果云 `https://dav.jianguoyun.com/dav/`
     - **WebDAV 用户名**：你的登录账号
     - **WebDAV 应用授权码**：坚果云后台生成的第三方应用密码。
  3. 保存后即可通过 WebDAV 协议进行云端同步！

> ### ⚠️ 坚果云 (Jianguoyun) WebDAV 浏览器直连限制说明
>
> **坚果云的 WebDAV 服务器（`dav.jianguoyun.com`）不发送任何 `Access-Control-Allow-Origin` 跨域响应头，且对预检请求 `OPTIONS` 一律返回 `401`（强制要求 Basic 鉴权，而跨域预检不能携带鉴权头）。**
>
> 因此，**浏览器前端无法直接对坚果云执行目录列取（PROPFIND）、上传（PUT）、删除（DELETE）等 WebDAV 写操作**——这是坚果云服务端的硬性限制，任何第三方 CORS 代理（如 `corsproxy.io`、`allorigins`）均无法绕过（分别返回 403 / 500）。
>
> 本项目对此的兼容表现：
> - **目录刷新/列取**：尝试直连失败后给出明确提示，不会静默失败。
> - **文件保存 / 上传 / 新建 / 建目录**：本地 IndexedDB 保存仍正常；WebDAV 远端写入会提示"浏览器 CORS 限制"。
>
> **若要实现对坚果云 WebDAV 的真实读写，请改用以下任一方式：**
> 1. 本地运行一个 **Node.js 代理服务**（无鉴权的本机服务，转发 WebDAV 请求到坚果云），再在前端配置该本地代理地址；
> 2. 使用坚果云官方客户端 / 桌面同步盘进行文件同步；
> 3. 若使用支持 CORS 的 WebDAV 服务（部分自建 Nextcloud / ownCloud 可通过反向代理开启跨域头），则可直接浏览器读写。

> **注意**：**Nextcloud / ownCloud 等自建 WebDAV 服务**若配置了正确的 CORS 头，本项目已实现完整的 WebDAV 读写链路（带 Basic 鉴权的 GET 内容拉取、PUT 保存/上传/新建、MKCOL 建目录、递归子目录 PROPFIND 列取）。

### 4. 📥 永硕 E 盘 (YS168) 数据一键全量迁移助手
- 点击顶栏 **`数据迁移/配置 ▾`** 或 **`永硕迁移`**，支持：
  1. 输入永硕空间网址（如 `http://yourname.ys168.com`）全自动远程抓取结构；
  2. 粘贴永硕网页 HTML 源码或文本列表一键解析；
  3. 导入永硕备份 JSON/TXT 文件。

---

## 🚀 本地使用与部署

1. **本地双击预览**：
   直接双击打开 `index.html` 即可运行体验！默认初始为游客只读模式，点击右上角【游客模式 (点击解锁)】输入密码 `admin` 即可解封管理员权限。

2. **部署到 GitHub Pages**：
   - 将全部源码 push 到 GitHub 仓库。
   - 在 Settings -> Pages 中开启服务即可完成网盘上线！
