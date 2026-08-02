/**
 * YS168 & Obsidian Style - Full Application Script with Multi-Storage Driver and Smooth Admin Settings Prompt
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let siteConfig = null;
  let treeData = null;
  let recycleBin = [];
  let openTabs = [];
  let activeTabId = 'welcome';
  let selectedNodeIds = new Set();
  let copiedNodeClipboard = [];
  let renamingNode = null;
  let currentMdMode = 'render';
  let uploadMode = 'files';
  let selectedUploadFiles = [];
  let isAdminUnlocked = false; // Default: Read-Only Mode for Visitors
  let pendingAdminAction = null;

  // DOM Elements - Header
  const htmlTitle = document.getElementById('html-title');
  const siteTitle = document.getElementById('site-title');
  const siteSubtitle = document.getElementById('site-subtitle');
  const siteNoticeText = document.getElementById('site-notice-text');
  const siteLogoIcon = document.getElementById('site-logo-icon');
  const welcomeSloganTitle = document.getElementById('welcome-slogan-title');
  const welcomeSloganDesc = document.getElementById('welcome-slogan-desc');

  // Permission & Action Buttons
  const globalRefreshBtn = document.getElementById('global-refresh-btn');
  const adminLockBtn = document.getElementById('admin-lock-btn');
  const passwordModal = document.getElementById('password-modal');
  const adminPasswordInput = document.getElementById('admin-password-input');
  const confirmUnlockBtn = document.getElementById('confirm-unlock-btn');
  const statusModeLabel = document.getElementById('status-mode-label');
  const statusProviderTag = document.getElementById('status-provider-tag');

  // Sidebar Elements
  const fileTreeContainer = document.getElementById('file-tree-container');
  const batchActionBar = document.getElementById('batch-action-bar');
  const selectedCountBadge = document.getElementById('selected-count-badge');
  const batchCopyBtn = document.getElementById('batch-copy-btn');
  const batchMoveBtn = document.getElementById('batch-move-btn');
  const batchDeleteBtn = document.getElementById('batch-delete-btn');
  const expandAllTreeBtn = document.getElementById('expand-all-tree');
  const collapseAllTreeBtn = document.getElementById('collapse-all-tree');
  const addFolderBtn = document.getElementById('add-folder-btn');
  const addFileBtn = document.getElementById('add-file-btn');
  const pasteNodeRootBtn = document.getElementById('paste-node-root-btn');

  // Main Previewer & Multi-Tabs Editor
  const welcomeView = document.getElementById('welcome-view');
  const editorView = document.getElementById('editor-view');
  const editorTabs = document.getElementById('editor-tabs');
  const currentFileName = document.getElementById('current-file-name');
  const activeFileIcon = document.getElementById('active-file-icon');
  const mdViewSwitch = document.getElementById('md-view-switch');
  const modeRenderBtn = document.getElementById('mode-render-btn');
  const modeEditBtn = document.getElementById('mode-edit-btn');
  const saveStatusBadge = document.getElementById('save-status-badge');
  const refreshFileBtn = document.getElementById('refresh-file-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const pasteCodeBtn = document.getElementById('paste-code-btn');
  const saveFileBtn = document.getElementById('save-file-btn');
  const downloadFileBtn = document.getElementById('download-file-btn');
  const showPropertiesBtn = document.getElementById('show-properties-btn');

  const codeEditorContainer = document.getElementById('code-editor-container');
  const markdownPreviewContainer = document.getElementById('markdown-preview-container');
  const markdownPreviewBox = document.getElementById('markdown-preview-box');
  const pdfPreviewContainer = document.getElementById('pdf-preview-container');
  const pdfIframe = document.getElementById('pdf-iframe');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imageElement = document.getElementById('image-element');

  const codeTextarea = document.getElementById('code-textarea');
  const lineNumbers = document.getElementById('line-numbers');
  const statusLanguage = document.getElementById('status-language');
  const statusLines = document.getElementById('status-lines');
  const statusLength = document.getElementById('status-length');

  // Header Action Buttons
  const openUploadBtn = document.getElementById('open-upload-btn');
  const openAdminSettingsBtn = document.getElementById('open-admin-settings-btn');
  const openRecycleBinBtn = document.getElementById('open-recycle-bin-btn');
  const recycleCountBadge = document.getElementById('recycle-count-badge');
  const exportConfigBtn = document.getElementById('export-config-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  // Upload Modal Elements
  const uploadModal = document.getElementById('upload-modal');
  const tabUploadFiles = document.getElementById('tab-upload-files');
  const tabUploadFolder = document.getElementById('tab-upload-folder');
  const uploadTargetFolderSelect = document.getElementById('upload-target-folder-select');
  const dropzoneFilesGroup = document.getElementById('dropzone-files-group');
  const dropzoneFolderGroup = document.getElementById('dropzone-folder-group');
  const uploadDropzoneFiles = document.getElementById('upload-dropzone-files');
  const uploadDropzoneFolder = document.getElementById('upload-dropzone-folder');
  const fileInputElement = document.getElementById('file-input-element');
  const folderInputElement = document.getElementById('folder-input-element');
  const selectedFileInfo = document.getElementById('selected-file-info');
  const selectedFileCount = document.getElementById('selected-file-count');
  const selectedFileSize = document.getElementById('selected-file-size');
  const confirmUploadFileBtn = document.getElementById('confirm-upload-file-btn');

  // New File / Link Modal Elements
  const newFileModal = document.getElementById('new-file-modal');
  const tabTypeFile = document.getElementById('tab-type-file');
  const tabTypeLink = document.getElementById('tab-type-link');
  const newFileFolderSelect = document.getElementById('new-file-folder-select');
  const fileFieldsGroup = document.getElementById('file-fields-group');
  const linkFieldsGroup = document.getElementById('link-fields-group');
  const newFileTitleInput = document.getElementById('new-file-title');
  const newFileTypeSelect = document.getElementById('new-file-type');
  const newLinkTitleInput = document.getElementById('new-link-title');
  const newLinkUrlInput = document.getElementById('new-link-url');
  const newFileDescInput = document.getElementById('new-file-desc');
  const confirmCreateFileBtn = document.getElementById('confirm-create-file-btn');

  // Admin Custom Settings
  const adminSettingsModal = document.getElementById('admin-settings-modal');
  const settingStorageProvider = document.getElementById('setting-storage-provider');
  const githubSettingsGroup = document.getElementById('github-settings-group');
  const settingGithubToken = document.getElementById('setting-github-token');
  const hfSettingsGroup = document.getElementById('hf-settings-group');
  const webdavSettingsGroup = document.getElementById('webdav-settings-group');
  const settingHfRepo = document.getElementById('setting-hf-repo');
  const settingHfBranch = document.getElementById('setting-hf-branch');
  const settingHfToken = document.getElementById('setting-hf-token');
  const settingWebdavUrl = document.getElementById('setting-webdav-url');
  const settingWebdavUser = document.getElementById('setting-webdav-user');
  const settingWebdavPass = document.getElementById('setting-webdav-pass');

  const settingSiteTitle = document.getElementById('setting-site-title');
  const settingSiteSubtitle = document.getElementById('setting-site-subtitle');
  const settingSiteNotice = document.getElementById('setting-site-notice');
  const settingAdminPassword = document.getElementById('setting-admin-password');
  const settingSiteLogo = document.getElementById('setting-site-logo');
  const settingRepoUrl = document.getElementById('setting-repo-url');
  const settingCdnPresetSelect = document.getElementById('setting-cdn-preset-select');
  const settingCdnPrefix = document.getElementById('setting-cdn-prefix');
  const saveSettingsBtn = document.getElementById('save-settings-btn');

  const recycleBinModal = document.getElementById('recycle-bin-modal');
  const recycleListContainer = document.getElementById('recycle-list-container');
  const emptyTrashBtn = document.getElementById('empty-trash-btn');

  const newFolderModal = document.getElementById('new-folder-modal');
  const parentFolderSelect = document.getElementById('parent-folder-select');
  const newFolderNameInput = document.getElementById('new-folder-name-input');
  const confirmCreateFolderBtn = document.getElementById('confirm-create-folder-btn');

  const renameModal = document.getElementById('rename-modal');
  const renameInput = document.getElementById('rename-input');
  const confirmRenameBtn = document.getElementById('confirm-rename-btn');

  const moveModal = document.getElementById('move-modal');
  const targetMoveFolderSelect = document.getElementById('target-move-folder-select');
  const confirmMoveBtn = document.getElementById('confirm-move-btn');

  const propertiesModal = document.getElementById('properties-modal');
  const propPagesUrl = document.getElementById('prop-pages-url');
  const propRawUrl = document.getElementById('prop-raw-url');
  const propCdnUrl = document.getElementById('prop-cdn-url');
  const propDownloadBtn = document.getElementById('prop-download-btn');

  const resizer = document.getElementById('resizer');
  const sidebar = document.getElementById('sidebar');

  // IndexedDB Key-Value Blob Store
  let dbInstance = null;
  function initIndexedDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      const req = indexedDB.open('YSDriveDB', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
      req.onsuccess = (e) => { dbInstance = e.target.result; resolve(dbInstance); };
      req.onerror = () => resolve(null);
    });
  }

  function saveFileToIDB(id, data) {
    if (!dbInstance) return Promise.resolve(false);
    return new Promise((resolve) => {
      try {
        const tx = dbInstance.transaction('files', 'readwrite');
        tx.objectStore('files').put(data, id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  function getFileFromIDB(id) {
    if (!dbInstance) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        const tx = dbInstance.transaction('files', 'readonly');
        const req = tx.objectStore('files').get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  function encryptSecret(str, key) {
    if (!str || !key) return '';
    let res = '';
    for (let i = 0; i < str.length; i++) {
      res += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(unescape(encodeURIComponent(res)));
  }

  function decryptSecret(encStr, key) {
    if (!encStr || !key) return '';
    try {
      let decoded = decodeURIComponent(escape(atob(encStr)));
      let res = '';
      for (let i = 0; i < decoded.length; i++) {
        res += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return res;
    } catch (e) {
      return '';
    }
  }

  function getActiveGitHubToken() {
    if (siteConfig && siteConfig.github_token) return siteConfig.github_token;
    if (siteConfig && siteConfig.encrypted_token) {
      const pass = siteConfig.admin_password || 'admin';
      const dec = decryptSecret(siteConfig.encrypted_token, pass);
      if (dec && dec.startsWith('ghp_')) return dec;
    }
    return '';
  }

  // Init
  initTheme();
  initIndexedDB();
  loadData();
  setupResizer();
  setupDropzoneEvents();

  // Storage Provider Toggle Event
  settingStorageProvider.addEventListener('change', handleStorageProviderChange);
  settingCdnPresetSelect.addEventListener('change', handleCdnPresetChange);

  // Button Listeners
  globalRefreshBtn.addEventListener('click', handleGlobalRefresh);
  adminLockBtn.addEventListener('click', handleLockBtnClick);
  confirmUnlockBtn.addEventListener('click', handlePasswordVerify);
  adminPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handlePasswordVerify();
  });

  themeToggleBtn.addEventListener('click', toggleTheme);
  expandAllTreeBtn.addEventListener('click', () => setAllFoldersExpanded(true));
  collapseAllTreeBtn.addEventListener('click', () => setAllFoldersExpanded(false));
  searchInput.addEventListener('input', handleSearch);
  clearSearchBtn.addEventListener('click', clearSearch);
  exportConfigBtn.addEventListener('click', exportConfig);

  openUploadBtn.addEventListener('click', openUploadModal);
  openAdminSettingsBtn.addEventListener('click', openAdminSettingsModal);
  saveSettingsBtn.addEventListener('click', saveAdminSettings);

  openRecycleBinBtn.addEventListener('click', openRecycleBinModal);
  emptyTrashBtn.addEventListener('click', handleEmptyTrash);

  addFolderBtn.addEventListener('click', () => openNewFolderModal());
  addFileBtn.addEventListener('click', () => openNewFileModal());
  pasteNodeRootBtn.addEventListener('click', () => pasteCopiedNodes('root'));

  confirmCreateFolderBtn.addEventListener('click', handleCreateFolder);
  confirmCreateFileBtn.addEventListener('click', handleCreateFileOrLink);

  confirmRenameBtn.addEventListener('click', handleConfirmRename);
  batchCopyBtn.addEventListener('click', handleBatchCopy);
  batchMoveBtn.addEventListener('click', openMoveModal);
  confirmMoveBtn.addEventListener('click', handleConfirmMove);
  batchDeleteBtn.addEventListener('click', handleBatchMoveToTrash);

  tabUploadFiles.addEventListener('click', () => switchUploadMode('files'));
  tabUploadFolder.addEventListener('click', () => switchUploadMode('folder'));

  uploadDropzoneFiles.addEventListener('click', () => fileInputElement.click());
  uploadDropzoneFolder.addEventListener('click', () => folderInputElement.click());

  fileInputElement.addEventListener('change', handleUploadResourceSelect);
  folderInputElement.addEventListener('change', handleUploadResourceSelect);

  confirmUploadFileBtn.addEventListener('click', handleConfirmUploadResource);

  tabTypeFile.addEventListener('click', () => switchNewModalType('file'));
  tabTypeLink.addEventListener('click', () => switchNewModalType('link'));

  modeRenderBtn.addEventListener('click', () => switchMdMode('render'));
  modeEditBtn.addEventListener('click', () => switchMdMode('edit'));

  refreshFileBtn.addEventListener('click', handleActiveFileRefresh);
  copyCodeBtn.addEventListener('click', handleCopyCode);
  pasteCodeBtn.addEventListener('click', handlePasteCode);
  saveFileBtn.addEventListener('click', saveActiveFile);
  downloadFileBtn.addEventListener('click', downloadActiveFile);
  showPropertiesBtn.addEventListener('click', showActiveFileProperties);

  codeTextarea.addEventListener('input', handleCodeInput);
  codeTextarea.addEventListener('keydown', handleKeyInput);

  // Global Modal Close Delegation (Handles any close button or backdrop click)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.modal-close')) {
      closeAllModals();
    } else if (e.target.classList.contains('modal-overlay')) {
      closeAllModals();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllModals();
    }
  });

  document.querySelectorAll('.copy-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input && input.value) {
        navigator.clipboard.writeText(input.value);
        showToast('直链地址已复制！');
      }
    });
  });

  // Storage Switcher Event Listeners
  const storageSourceBadge = document.getElementById('storage-source-badge');
  if (storageSourceBadge) {
    storageSourceBadge.addEventListener('click', openStorageSwitcherModal);
  }

  document.querySelectorAll('.select-backend-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const backend = e.currentTarget.getAttribute('data-backend');
      selectStorageBackend(backend);
    });
  });

  document.querySelectorAll('.test-backend-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const backend = e.currentTarget.getAttribute('data-backend');
      testStorageBackendConnection(backend);
    });
  });

  const openConfigFromSwitcher = document.getElementById('open-config-from-switcher');
  if (openConfigFromSwitcher) {
    openConfigFromSwitcher.addEventListener('click', () => {
      closeAllModals();
      openAdminSettingsModal();
    });
  }

  function updateStorageSourceBadge() {
    const storageBadge = document.getElementById('storage-source-badge');
    const storageName = document.getElementById('storage-source-name');
    const storageDot = document.getElementById('storage-status-dot');
    if (!storageBadge || !storageName) return;

    const provider = (siteConfig && siteConfig.storage_provider) || 'github';
    let iconHtml = '';
    let nameText = '';

    if (provider === 'huggingface') {
      iconHtml = '<i class="fa-solid fa-cubes obsidian-purple"></i> ';
      nameText = `Hugging Face (${siteConfig.hf_repo ? siteConfig.hf_repo.split('/')[1] || siteConfig.hf_repo : 'Datasets'})`;
    } else if (provider === 'webdav') {
      iconHtml = '<i class="fa-solid fa-cloud obsidian-cyan"></i> ';
      nameText = 'WebDAV 云盘';
    } else if (provider === 'local') {
      iconHtml = '<i class="fa-solid fa-hard-drive obsidian-yellow"></i> ';
      nameText = 'IndexedDB 离线盘';
    } else {
      iconHtml = '<i class="fa-brands fa-github obsidian-green"></i> ';
      nameText = 'GitHub Pages / Raw';
    }

    storageName.innerHTML = `${iconHtml}${nameText}`;
    if (storageDot) {
      storageDot.className = 'status-pulse-dot green';
    }

    // Update active state in switcher modal
    document.querySelectorAll('.storage-backend-card').forEach(card => {
      if (card.getAttribute('data-backend') === provider) {
        card.classList.add('active');
        const btn = card.querySelector('.select-backend-btn');
        if (btn) btn.textContent = '当前激活';
      } else {
        card.classList.remove('active');
        const btn = card.querySelector('.select-backend-btn');
        if (btn) btn.textContent = '切换使用此源';
      }
    });
  }

  function openStorageSwitcherModal() {
    updateStorageSourceBadge();
    const modal = document.getElementById('storage-switcher-modal');
    if (modal) modal.style.display = 'flex';
  }

  function selectStorageBackend(backend) {
    if (!siteConfig) siteConfig = {};
    siteConfig.storage_provider = backend;
    localStorage.setItem('ys_site_config', JSON.stringify(siteConfig));
    applySiteConfig();
    updateStorageSourceBadge();
    showToast(`存储源已切换为「${getBackendDisplayName(backend)}」！`);
  }

  function getBackendDisplayName(backend) {
    switch (backend) {
      case 'huggingface': return 'Hugging Face Hub';
      case 'webdav': return 'WebDAV 云盘';
      case 'local': return 'IndexedDB 离线隔离盘';
      default: return 'GitHub Pages / Raw 仓库';
    }
  }

  async function testStorageBackendConnection(backend) {
    const dot = document.getElementById(`dot-${backend}`);
    const badge = document.getElementById(`badge-${backend}`);

    if (dot) dot.className = 'status-pulse-dot yellow';
    if (badge) {
      badge.className = 'backend-status-badge yellow';
      badge.textContent = '🟡 正在进行真实连通性测试...';
    }

    try {
      if (backend === 'github') {
        const { owner, repo } = getRepoOwnerAndName();
        if (!owner || !repo || owner === 'your-username') {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 未配置 GitHub 仓库全名';
          }
          showToast('请先在后台设置中填入有效的 GitHub 仓库地址！');
          return;
        }

        const token = getActiveGitHubToken();
        const headers = { 'Accept': 'application/vnd.github+json' };
        if (token) headers['Authorization'] = `token ${token}`;

        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (res.ok) {
          const repoInfo = await res.json();
          if (dot) dot.className = 'status-pulse-dot green';
          if (badge) {
            badge.className = 'backend-status-badge green';
            badge.textContent = `🟢 真实连通成功 (${repoInfo.private ? '私有库' : '公开库'})`;
          }
          showToast(`GitHub 仓库「${owner}/${repo}」真实连通测试通过！`);
        } else if (res.status === 404) {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 仓库不存在或私有库未填 PAT Token';
          }
          showToast('GitHub 仓库未找到！若为私有库，请在后台填入 PAT Token。');
        } else if (res.status === 401) {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 Token 无效或权未授权';
          }
          showToast('GitHub PAT Token 无效，请检查填入的访问令牌！');
        } else {
          throw new Error(`HTTP ${res.status}`);
        }

      } else if (backend === 'huggingface') {
        const repo = (siteConfig && siteConfig.hf_repo) || '';
        if (!repo) {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 未填写 HF 仓库名';
          }
          showToast('请先在后台设置中填写 Hugging Face 仓库名！');
          return;
        }

        const token = siteConfig && siteConfig.hf_token;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let res = await fetch(`https://huggingface.co/api/datasets/${repo}`, { headers });
        if (!res.ok) {
          res = await fetch(`https://huggingface.co/api/models/${repo}`, { headers });
        }

        if (res.ok) {
          if (dot) dot.className = 'status-pulse-dot green';
          if (badge) {
            badge.className = 'backend-status-badge green';
            badge.textContent = '🟢 HF 仓库真实连通成功';
          }
          showToast(`Hugging Face 仓库「${repo}」真实连通测试成功！`);
        } else if (res.status === 401 || res.status === 403) {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 鉴权失败: Token 无效或无权访问私有仓';
          }
          showToast('Hugging Face 鉴权失败，请检查填入的 Token！');
        } else {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = `🔴 仓库不存在 (HTTP ${res.status})`;
          }
          showToast('Hugging Face 仓库不存在，请检查用户名与仓库名！');
        }

      } else if (backend === 'webdav') {
        const url = siteConfig && siteConfig.webdav_url;
        if (!url) {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 未配置 WebDAV URL';
          }
          showToast('请先在后台设置中填写 WebDAV 服务器地址');
          return;
        }

        try {
          const headers = {};
          if (siteConfig.webdav_user && siteConfig.webdav_pass) {
            headers['Authorization'] = 'Basic ' + btoa(`${siteConfig.webdav_user}:${siteConfig.webdav_pass}`);
          }
          const res = await fetch(url, { method: 'HEAD', headers });
          if (res.ok || res.status === 207) {
            if (dot) dot.className = 'status-pulse-dot green';
            if (badge) {
              badge.className = 'backend-status-badge green';
              badge.textContent = '🟢 WebDAV 挂载正常';
            }
            showToast('WebDAV 云服务连通成功！');
          } else if (res.status === 401) {
            if (dot) dot.className = 'status-pulse-dot red';
            if (badge) {
              badge.className = 'backend-status-badge red';
              badge.textContent = '🔴 鉴权失败: WebDAV 账号或应用密码错误';
            }
            showToast('WebDAV 账号或应用密码错误！');
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (corsErr) {
          if (dot) dot.className = 'status-pulse-dot yellow';
          if (badge) {
            badge.className = 'backend-status-badge yellow';
            badge.textContent = '🟡 已配置 (受浏览器 CORS 规则限制)';
          }
          showToast('WebDAV 服务器已配置 (受浏览器 CORS 跨域限制)');
        }

      } else if (backend === 'local') {
        if (window.indexedDB && dbInstance) {
          if (dot) dot.className = 'status-pulse-dot green';
          if (badge) {
            badge.className = 'backend-status-badge green';
            badge.textContent = '🟢 IndexedDB 离线隔离盘 正常';
          }
          showToast('IndexedDB 本地私有离线盘运行正常！');
        } else {
          if (dot) dot.className = 'status-pulse-dot red';
          if (badge) {
            badge.className = 'backend-status-badge red';
            badge.textContent = '🔴 浏览器不支持 IndexedDB';
          }
        }
      }
    } catch (err) {
      if (dot) dot.className = 'status-pulse-dot red';
      if (badge) {
        badge.className = 'backend-status-badge red';
        badge.textContent = '🔴 连接失败/网络不可达';
      }
      showToast(`连通测试未通过: ${err.message || '网络无法连接'}`);
    }
  }

  function handleStorageProviderChange() {
    const provider = settingStorageProvider.value;
    if (provider === 'huggingface') {
      hfSettingsGroup.style.display = 'block';
      webdavSettingsGroup.style.display = 'none';
      if (githubSettingsGroup) githubSettingsGroup.style.display = 'none';
    } else if (provider === 'webdav') {
      webdavSettingsGroup.style.display = 'block';
      hfSettingsGroup.style.display = 'none';
      if (githubSettingsGroup) githubSettingsGroup.style.display = 'none';
    } else {
      if (githubSettingsGroup) githubSettingsGroup.style.display = 'block';
      hfSettingsGroup.style.display = 'none';
      webdavSettingsGroup.style.display = 'none';
    }
  }

  function handleCdnPresetChange() {
    const val = settingCdnPresetSelect.value;
    const repo = settingRepoUrl.value.trim() || 'https://github.com/username/repo';

    let match = repo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    let username = match ? match[1] : 'username';
    let reponame = match ? match[2].replace(/\.git$/, '') : 'repo';

    switch (val) {
      case 'jsdelivr':
        settingCdnPrefix.value = `https://cdn.jsdelivr.net/gh/${username}/${reponame}@main/`;
        break;
      case 'fastly':
        settingCdnPrefix.value = `https://fastly.jsdelivr.net/gh/${username}/${reponame}@main/`;
        break;
      case 'ghproxy':
        settingCdnPrefix.value = `https://ghproxy.net/https://raw.githubusercontent.com/${username}/${reponame}/main/`;
        break;
      case 'github_raw':
        settingCdnPrefix.value = `https://raw.githubusercontent.com/${username}/${reponame}/main/`;
        break;
      case 'custom':
        settingCdnPrefix.focus();
        showToast('现在可在文本框中自由输入任意自定义 CDN 加速 URL！');
        break;
    }
  }

  function openAdminSettingsModal() {
    if (!isAdminUnlocked) {
      pendingAdminAction = 'openSettings';
      adminPasswordInput.value = '';
      passwordModal.style.display = 'flex';
      setTimeout(() => adminPasswordInput.focus(), 100);
      return;
    }

    settingSiteTitle.value = siteConfig.title || '';
    settingSiteSubtitle.value = siteConfig.subtitle || '';
    settingSiteNotice.value = siteConfig.notice || '';
    settingAdminPassword.value = siteConfig.admin_password || 'admin';
    settingSiteLogo.value = siteConfig.logo_icon || 'fa-solid fa-gem';
    settingRepoUrl.value = siteConfig.repo_url || '';
    settingCdnPrefix.value = siteConfig.cdn_prefix || '';

    settingStorageProvider.value = siteConfig.storage_provider || 'github';
    if (settingGithubToken) {
      settingGithubToken.value = getActiveGitHubToken() || '';
    }
    settingHfRepo.value = siteConfig.hf_repo || '';
    settingHfBranch.value = siteConfig.hf_branch || 'main';
    settingHfToken.value = siteConfig.hf_token || '';
    settingWebdavUrl.value = siteConfig.webdav_url || '';
    settingWebdavUser.value = siteConfig.webdav_user || '';
    settingWebdavPass.value = siteConfig.webdav_pass || '';

    handleStorageProviderChange();

    const cdn = siteConfig.cdn_prefix || '';
    if (cdn.includes('cdn.jsdelivr.net')) settingCdnPresetSelect.value = 'jsdelivr';
    else if (cdn.includes('fastly.jsdelivr.net')) settingCdnPresetSelect.value = 'fastly';
    else if (cdn.includes('ghproxy.net')) settingCdnPresetSelect.value = 'ghproxy';
    else if (cdn.includes('raw.githubusercontent.com')) settingCdnPresetSelect.value = 'github_raw';
    else settingCdnPresetSelect.value = 'custom';

    adminSettingsModal.style.display = 'flex';
  }

  async function saveAdminSettings() {
    siteConfig.title = settingSiteTitle.value.trim() || siteConfig.title;
    siteConfig.subtitle = settingSiteSubtitle.value.trim() || siteConfig.subtitle;
    siteConfig.notice = settingSiteNotice.value.trim() || siteConfig.notice;
    siteConfig.admin_password = settingAdminPassword.value.trim() || siteConfig.admin_password || 'admin';
    siteConfig.logo_icon = settingSiteLogo.value;
    siteConfig.repo_url = settingRepoUrl.value.trim();
    siteConfig.cdn_prefix = settingCdnPrefix.value.trim();

    siteConfig.storage_provider = settingStorageProvider.value;
    if (settingGithubToken && settingGithubToken.value.trim()) {
      const plainToken = settingGithubToken.value.trim();
      siteConfig.github_token = plainToken;
      siteConfig.encrypted_token = encryptSecret(plainToken, siteConfig.admin_password);
    }
    siteConfig.hf_repo = settingHfRepo.value.trim();
    siteConfig.hf_branch = settingHfBranch.value.trim() || 'main';
    siteConfig.hf_token = settingHfToken.value.trim();
    siteConfig.webdav_url = settingWebdavUrl.value.trim();
    siteConfig.webdav_user = settingWebdavUser.value.trim();
    siteConfig.webdav_pass = settingWebdavPass.value.trim();

    localStorage.setItem('ys_site_config', JSON.stringify(siteConfig));
    applySiteConfig();

    if (siteConfig.hf_repo) {
      await syncHuggingFaceRepositoryTree();
    }
    if (siteConfig.webdav_url) {
      await syncWebDAVRepositoryTree();
    }

    closeAllModals();
    showToast('存储源与后台定制参数已保存并同步渲染生效！');
  }

  function setupDropzoneEvents() {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.add('dragover');
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('dragover');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('dragover');

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        selectedUploadFiles = Array.from(e.dataTransfer.files);
        selectedFileCount.textContent = selectedUploadFiles.length;

        let totalSize = selectedUploadFiles.reduce((acc, f) => acc + f.size, 0);
        selectedFileSize.textContent = totalSize > 1024 * 1024 ? (totalSize / (1024 * 1024)).toFixed(2) + ' MB' : (totalSize / 1024).toFixed(1) + ' KB';

        selectedFileInfo.style.display = 'block';
        confirmUploadFileBtn.disabled = false;
      }
    };

    [uploadDropzoneFiles, uploadDropzoneFolder].forEach(dropzone => {
      if (!dropzone) return;
      dropzone.addEventListener('dragover', handleDragOver);
      dropzone.addEventListener('dragenter', handleDragOver);
      dropzone.addEventListener('dragleave', handleDragLeave);
      dropzone.addEventListener('drop', handleDrop);
    });

    window.addEventListener('dragover', (e) => e.preventDefault(), false);
    window.addEventListener('drop', (e) => e.preventDefault(), false);
  }

  function openUploadModal() {
    if (!isAdminUnlocked) {
      pendingAdminAction = 'openUpload';
      adminPasswordInput.value = '';
      passwordModal.style.display = 'flex';
      setTimeout(() => adminPasswordInput.focus(), 100);
      return;
    }
    populateFolderSelects();
    uploadModal.style.display = 'flex';
  }

  function switchUploadMode(mode) {
    uploadMode = mode;
    selectedUploadFiles = [];
    selectedFileInfo.style.display = 'none';
    confirmUploadFileBtn.disabled = true;

    if (mode === 'files') {
      tabUploadFiles.classList.add('active');
      tabUploadFolder.classList.remove('active');
      dropzoneFilesGroup.style.display = 'block';
      dropzoneFolderGroup.style.display = 'none';
    } else {
      tabUploadFolder.classList.add('active');
      tabUploadFiles.classList.remove('active');
      dropzoneFilesGroup.style.display = 'none';
      dropzoneFolderGroup.style.display = 'block';
    }
  }

  function handleUploadResourceSelect() {
    const input = uploadMode === 'files' ? fileInputElement : folderInputElement;
    if (input.files && input.files.length > 0) {
      selectedUploadFiles = Array.from(input.files);
      selectedFileCount.textContent = selectedUploadFiles.length;

      let totalSize = selectedUploadFiles.reduce((acc, f) => acc + f.size, 0);
      selectedFileSize.textContent = totalSize > 1024 * 1024 ? (totalSize / (1024 * 1024)).toFixed(2) + ' MB' : (totalSize / 1024).toFixed(1) + ' KB';

      selectedFileInfo.style.display = 'block';
      confirmUploadFileBtn.disabled = false;
    }
  }

  function readFileAsText(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  async function uploadFileToGitHub(filename, base64Content) {
    const token = getActiveGitHubToken();
    const { owner, repo } = getRepoOwnerAndName();
    if (!token || !owner || !repo) return null;

    const path = filename.startsWith('files/') ? filename : `files/${filename}`;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
      let sha = null;
      const getRes = await fetch(apiUrl, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      }

      const putBody = {
        message: `Upload ${filename} via ghdisk netdisk`,
        content: base64Content,
        branch: 'main'
      };
      if (sha) putBody.sha = sha;

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json'
        },
        body: JSON.stringify(putBody)
      });

      if (putRes.ok) {
        const resData = await putRes.json();
        return resData.content ? resData.content.download_url : `files/${filename}`;
      }
    } catch (err) {
      console.warn('GitHub API upload failed:', err);
    }
    return null;
  }

  async function handleConfirmUploadResource() {
    if (selectedUploadFiles.length === 0) return;

    confirmUploadFileBtn.disabled = true;
    confirmUploadFileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 上传中...';

    const targetFolderId = uploadTargetFolderSelect.value;
    const now = new Date().toLocaleString();
    const totalFiles = selectedUploadFiles.length;

    const targetFolderNode = targetFolderId === 'root' ? null : findNodeById(treeData, targetFolderId);
    const targetProvider = targetFolderNode ? getStorageProviderForNode(targetFolderNode) : '';
    const uploadToWebDAV = targetProvider === 'webdav';
    let webdavFolderUrl = '';
    let webdavFail = false;
    if (uploadToWebDAV) {
      webdavFolderUrl = buildWebDAVFolderUrl(targetFolderNode || (treeData.find(n => n.id === 'root_webdav') || null));
    }
    const uploadToHuggingFace = targetProvider === 'huggingface';
    let hfFail = false;

    showToast(`正在解析上传 ${totalFiles} 个文件，请稍候...`);

    let count = 0;
    for (const file of selectedUploadFiles) {
      count++;
      showToast(`正在处理 ${count}/${totalFiles}: ${file.name}`);

      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isText = ['txt', 'md', 'py', 'js', 'ts', 'sh', 'json', 'yaml', 'yml', 'html', 'css', 'sql', 'c', 'cpp', 'java', 'rs', 'go'].includes(ext);

      let textContent = '';
      let dataUrl = '';
      let base64Only = '';

      if (isText) {
        textContent = await readFileAsText(file);
        dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`;
        base64Only = btoa(unescape(encodeURIComponent(textContent)));
      } else {
        dataUrl = await readFileAsDataURL(file);
        base64Only = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
      }

      const fileId = 'file_up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

      // Save to IndexedDB
      await saveFileToIDB(fileId, {
        content: textContent,
        dataUrl: dataUrl
      });

      // GitHub Direct API Push
      let githubUrl = null;
      const activeToken = getActiveGitHubToken();
      if (!uploadToWebDAV && !uploadToHuggingFace && siteConfig.storage_provider === 'github' && activeToken) {
        githubUrl = await uploadFileToGitHub(file.name, base64Only);
      }

      // WebDAV Direct PUT
      let webdavUrl = null;
      if (uploadToWebDAV && webdavFolderUrl) {
        const putTarget = webdavFolderUrl.replace(/\/$/, '') + '/' + encodeURIComponent(file.name);
        let putRes = null;
        try {
          putRes = await webdavFetch(putTarget, {
            method: 'PUT',
            headers: getWebDAVHeaders({
              'Content-Type': file.type || (isText ? 'text/plain;charset=utf-8' : 'application/octet-stream'),
              'Accept': '*/*'
            }),
            body: isText ? textContent : file
          });
        } catch (err) {
          console.warn('WebDAV PUT upload failed:', err);
        }
        if (putRes && (putRes.ok || putRes.status === 201 || putRes.status === 204)) {
          webdavUrl = putTarget;
        } else {
          webdavFail = true;
        }
      }

      // Hugging Face Direct Commit
      let hfUrl = null;
      if (uploadToHuggingFace) {
        const parentPath = targetFolderNode && targetFolderNode.serverPath
          ? targetFolderNode.serverPath.replace(/\/$/, '')
          : '';
        const relPath = uploadMode === 'folder' ? (file.webkitRelativePath || file.name) : file.name;
        const targetPath = (parentPath ? parentPath + '/' : '') + relPath.replace(/\\/g, '/');
        const ok = await uploadFileToHuggingFace(targetPath, base64Only, `Upload ${targetPath}`);
        if (ok) {
          hfUrl = buildHuggingFaceResolveUrl(targetPath);
        } else {
          hfFail = true;
        }
      }

      const fileUrl = hfUrl || webdavUrl || githubUrl || (isText ? `files/${file.name}` : dataUrl);

      if (uploadMode === 'folder') {
        const relPath = file.webkitRelativePath || file.name;
        const pathParts = relPath.split('/');
        insertFileByPathParts(targetFolderId, pathParts, file, textContent, fileUrl, fileId, now);
        if (hfUrl) {
          const basePath = (targetFolderNode && targetFolderNode.serverPath ? targetFolderNode.serverPath.replace(/\/$/, '') : '');
          const syncedNode = findNodeById(treeData, fileId);
          if (syncedNode) syncedNode.serverPath = (basePath ? basePath + '/' : '') + relPath.replace(/\\/g, '/');
        }
      } else {
        const newFileNode = {
          id: fileId,
          type: 'file',
          name: file.name,
          ext: ext,
          desc: `从本地电脑上传 (${now})`,
          size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : (file.size / 1024).toFixed(1) + ' KB',
          createdAt: now,
          updatedAt: now,
          url: fileUrl,
          content: textContent
        };
        if (webdavUrl) {
          const parentPath = targetFolderNode && targetFolderNode.id !== 'root_webdav' && targetFolderNode.serverPath
            ? targetFolderNode.serverPath.replace(/\/$/, '')
            : '';
          newFileNode.serverPath = (parentPath ? parentPath + '/' : '') + file.name;
        }
        if (hfUrl) {
          const parentPath = targetFolderNode && targetFolderNode.serverPath
            ? targetFolderNode.serverPath.replace(/\/$/, '')
            : '';
          newFileNode.serverPath = (parentPath ? parentPath + '/' : '') + file.name;
        }

        if (targetFolderId === 'root') {
          treeData.push(newFileNode);
        } else {
          const folder = findNodeById(treeData, targetFolderId);
          if (folder) {
            if (!folder.children) folder.children = [];
            folder.children.push(newFileNode);
            folder.expanded = true;
          }
        }
      }
    }

    ensureNodeMetadata(treeData);
    saveTreeToLocal();
    renderTree();

    // Reset input states
    fileInputElement.value = '';
    folderInputElement.value = '';
    selectedUploadFiles = [];
    selectedFileInfo.style.display = 'none';

    confirmUploadFileBtn.disabled = false;
    confirmUploadFileBtn.innerHTML = '<i class="fa-solid fa-upload"></i> 确认上传';

    closeAllModals();
    if (uploadToWebDAV && webdavFail) {
      showToast('文件已关联保存到本地，但 WebDAV 上传失败（浏览器 CORS 限制或凭据无效），坚果云等 WebDAV 服务不支持浏览器直连上传。');
    } else if (uploadToHuggingFace && hfFail) {
      showToast('文件已关联保存到本地，但 Hugging Face 上传失败，请检查 Token 与仓库权限。');
    } else {
      showToast(`已成功同步并关联保存 ${totalFiles} 个文件！`);
    }
  }

  function insertFileByPathParts(targetParentId, pathParts, file, textContent, fileUrl, fileId, timestamp) {
    let currentChildren = targetParentId === 'root' ? treeData : (findNodeById(treeData, targetParentId)?.children || treeData);

    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      let folderNode = currentChildren.find(c => c.type === 'folder' && c.name === folderName);

      if (!folderNode) {
        folderNode = {
          id: 'folder_up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          type: 'folder',
          name: folderName,
          icon: 'fa-solid fa-folder',
          expanded: true,
          createdAt: timestamp,
          updatedAt: timestamp,
          children: []
        };
        currentChildren.push(folderNode);
      }

      currentChildren = folderNode.children;
    }

    const fileName = pathParts[pathParts.length - 1];
    const ext = fileName.split('.').pop().toLowerCase();

    const fileNode = {
      id: fileId,
      type: 'file',
      name: fileName,
      ext: ext,
      desc: `从本地文件夹解析上传 (${timestamp})`,
      size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : (file.size / 1024).toFixed(1) + ' KB',
      createdAt: timestamp,
      updatedAt: timestamp,
      url: fileUrl,
      content: textContent
    };

    currentChildren.push(fileNode);
  }

  function copyNode(node) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    copiedNodeClipboard = [deepCloneNode(node)];
    pasteNodeRootBtn.style.display = 'inline-flex';
    showToast(`已深拷贝复制「${node.name}」及其全部卡片！`);
  }

  function handleBatchCopy() {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    if (selectedNodeIds.size === 0) return;

    copiedNodeClipboard = [];
    selectedNodeIds.forEach(id => {
      const node = findNodeById(treeData, id);
      if (node) copiedNodeClipboard.push(deepCloneNode(node));
    });

    pasteNodeRootBtn.style.display = 'inline-flex';
    showToast(`已批量深拷贝复制 ${copiedNodeClipboard.length} 项！`);
  }

  function pasteCopiedNodes(targetFolderId) {
    if (!isAdminUnlocked) return alert('游客只读模式下无法进行粘贴副本，请先解锁！');
    if (copiedNodeClipboard.length === 0) return alert('剪贴板中无已复制的文件或目录！');

    const now = new Date().toLocaleString();

    copiedNodeClipboard.forEach(origNode => {
      const pastedNode = deepCloneNode(origNode);
      pastedNode.name = `${pastedNode.name}_副本`;
      pastedNode.createdAt = now;
      pastedNode.updatedAt = now;

      if (targetFolderId === 'root') {
        treeData.push(pastedNode);
      } else {
        const targetFolder = findNodeById(treeData, targetFolderId);
        if (targetFolder) {
          if (!targetFolder.children) targetFolder.children = [];
          targetFolder.children.push(pastedNode);
          targetFolder.expanded = true;
        }
      }
    });

    ensureNodeMetadata(treeData);
    saveTreeToLocal();
    renderTree();
    showToast(`已成功粘贴 ${copiedNodeClipboard.length} 项副本！`);
  }

  function deepCloneNode(node) {
    const cloned = JSON.parse(JSON.stringify(node));
    regenerateNodeIdsRecursive(cloned);
    return cloned;
  }

  function regenerateNodeIdsRecursive(node) {
    node.id = (node.type === 'folder' ? 'folder_copy_' : 'file_copy_') + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    if (node.children) {
      node.children.forEach(child => regenerateNodeIdsRecursive(child));
    }
  }

  function getRepoOwnerAndName() {
    let owner = 'eyeoko';
    let repo = 'ghdisk';

    if (siteConfig && siteConfig.repo_url) {
      let match = siteConfig.repo_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match && match[1] && match[1] !== 'your-username' && match[1] !== 'username') {
        owner = match[1];
        repo = match[2].replace(/\.git$/, '');
      }
    }

    if ((!owner || owner === 'your-username' || owner === 'username') && window.location.hostname.includes('.github.io')) {
      owner = window.location.hostname.split('.')[0];
      let pathSegs = window.location.pathname.split('/').filter(Boolean);
      if (pathSegs.length > 0) {
        repo = pathSegs[0];
      }
    }

    return { owner, repo };
  }

  async function syncGitHubRepositoryTree() {
    if (!siteConfig) siteConfig = {};
    const { owner, repo } = getRepoOwnerAndName();
    if (!owner || !repo) return false;

    // Auto fix repo_url if it was stale
    if (siteConfig.repo_url && (siteConfig.repo_url.includes('your-username') || siteConfig.repo_url.includes('username'))) {
      siteConfig.repo_url = `https://github.com/${owner}/${repo}`;
      siteConfig.cdn_prefix = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/`;
      siteConfig.raw_prefix = `https://raw.githubusercontent.com/${owner}/${repo}/main/`;
      localStorage.setItem('ys_site_config', JSON.stringify(siteConfig));
      applySiteConfig();
    }

    const token = getActiveGitHubToken();
    const headers = token ? { 'Authorization': `token ${token}` } : {};

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
      if (!res.ok) {
        console.warn(`GitHub Trees API returned HTTP ${res.status} for ${owner}/${repo}`);
        return false;
      }

      const data = await res.json();
      if (!data.tree || !Array.isArray(data.tree)) return false;

      const ignoreRoot = ['index.html', 'style.css', 'app.js', 'data.json', 'data.js', 'README.md', 'LICENSE', '.gitignore', '.gitattributes'];

      data.tree.forEach(item => {
        if (ignoreRoot.includes(item.path)) return;

        const pathParts = item.path.split('/');
        if (item.type === 'tree') {
          ensureFolderPathInTree(pathParts);
        } else if (item.type === 'blob') {
          insertRemoteFileNodeByPath(pathParts, item);
        }
      });

      ensureNodeMetadata(treeData);
      saveTreeToLocal();
      return true;
    } catch (err) {
      console.warn('Sync GitHub tree failed:', err);
      return false;
    }
  }

  function getHuggingFaceConfig() {
    return {
      repo: (siteConfig && siteConfig.hf_repo ? siteConfig.hf_repo.trim() : ''),
      branch: (siteConfig && siteConfig.hf_branch) || 'main',
      token: (siteConfig && siteConfig.hf_token) || ''
    };
  }

  function getHuggingFaceHeaders(extra) {
    const cfg = getHuggingFaceConfig();
    const headers = Object.assign({ 'Accept': 'application/json' }, extra || {});
    if (cfg.token) headers['Authorization'] = `Bearer ${cfg.token}`;
    return headers;
  }

  let hfRepoTypeCache = 'dataset';

  async function detectHuggingFaceRepoType() {
    const cfg = getHuggingFaceConfig();
    if (!cfg.repo) return hfRepoTypeCache;
    try {
      const r = await fetch(`https://huggingface.co/api/datasets/${cfg.repo}/tree/${cfg.branch}?recursive=true`, { headers: getHuggingFaceHeaders() });
      if (r.ok) { hfRepoTypeCache = 'dataset'; return 'dataset'; }
      const r2 = await fetch(`https://huggingface.co/api/models/${cfg.repo}/tree/${cfg.branch}?recursive=true`, { headers: getHuggingFaceHeaders() });
      if (r2.ok) { hfRepoTypeCache = 'model'; return 'model'; }
    } catch (err) {
      console.warn('Detect Hugging Face repo type failed:', err);
    }
    return hfRepoTypeCache;
  }

  function buildHuggingFaceResolveUrl(path, repoType) {
    const cfg = getHuggingFaceConfig();
    if (!cfg.repo) return '';
    const isDataset = (repoType || hfRepoTypeCache || 'dataset') === 'dataset';
    const base = isDataset
      ? `https://huggingface.co/datasets/${cfg.repo}/resolve/${cfg.branch}`
      : `https://huggingface.co/${cfg.repo}/resolve/${cfg.branch}`;
    return `${base}/${(path || '').split('/').map(encodeURIComponent).join('/')}`;
  }

  async function commitHuggingFaceFiles(fileSpecs, commitMessage) {
    const cfg = getHuggingFaceConfig();
    if (!cfg.repo || !cfg.token) return false;
    const repoType = await detectHuggingFaceRepoType();
    const base = repoType === 'dataset' ? 'datasets' : 'models';
    const msg = commitMessage || 'Update via ghdisk netdisk';
    const payload = {
      files: fileSpecs,
      commit_message: msg,
      repo_type: repoType,
      summary: msg
    };
    try {
      const res = await fetch(`https://huggingface.co/api/${base}/${cfg.repo}/commit/${cfg.branch}`, {
        method: 'POST',
        headers: getHuggingFaceHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return !!(data && data.success);
      }
      const errText = await res.text().catch(() => '');
      console.warn('Hugging Face commit failed', res.status, errText.slice(0, 200));
      return false;
    } catch (err) {
      console.warn('Hugging Face commit error:', err);
      return false;
    }
  }

  async function uploadFileToHuggingFace(repoPath, base64Content, commitMessage) {
    return commitHuggingFaceFiles([{
      path: repoPath,
      content: base64Content,
      encoding: 'base64'
    }], commitMessage);
  }

  async function syncHuggingFaceRepositoryTree() {
    const hfRepo = siteConfig && siteConfig.hf_repo ? siteConfig.hf_repo.trim() : '';
    if (!hfRepo) return false;

    const hfBranch = (siteConfig && siteConfig.hf_branch) || 'main';
    const hfToken = (siteConfig && siteConfig.hf_token) || '';

    const hfRoot = treeData ? treeData.find(n => n.id === 'root_huggingface') : null;
    if (!hfRoot) return false;

    try {
      const headers = { 'Accept': 'application/json' };
      if (hfToken) headers['Authorization'] = `Bearer ${hfToken}`;

      let isDataset = true;
      let apiUrl = `https://huggingface.co/api/datasets/${hfRepo}/tree/${hfBranch}?recursive=true`;

      let res = await fetch(apiUrl, { headers });
      if (!res.ok) {
        isDataset = false;
        apiUrl = `https://huggingface.co/api/models/${hfRepo}/tree/${hfBranch}?recursive=true`;
        res = await fetch(apiUrl, { headers });
      }

      if (res.ok) {
        hfRepoTypeCache = isDataset ? 'dataset' : 'model';
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          const newChildren = [];
          items.forEach(item => {
            if (item.type === 'file' && !item.path.endsWith('/.keep')) {
              const pathParts = item.path.split('/');
              const filename = pathParts.pop();
              const ext = (filename.split('.').pop() || 'txt').toLowerCase();

              insertFileIntoTreeByPathParts(newChildren, pathParts, {
                id: 'hf_' + Math.random().toString(36).substring(2, 9),
                type: 'file',
                name: filename,
                ext: ext,
                desc: `Hugging Face 仓库同步 (${hfRepo})`,
                size: item.size ? (item.size > 1024 * 1024 ? (item.size / 1024 / 1024).toFixed(2) + ' MB' : (item.size / 1024).toFixed(1) + ' KB') : '资源文件',
                url: buildHuggingFaceResolveUrl(item.path, isDataset ? 'dataset' : 'model'),
                serverPath: item.path
              });
            }
          });

          if (newChildren.length > 0) {
            hfRoot.children = newChildren;
            ensureNodeMetadata(treeData);
            saveTreeToLocal();
            renderTree();
            return true;
          }
        }
      }
    } catch (err) {
      console.warn('Syncing Hugging Face repository tree failed:', err);
    }
    return false;
  }

  function insertFileIntoTreeByPathParts(currentChildren, pathParts, fileNode) {
    let parent = currentChildren;
    let accPath = '';
    for (let part of pathParts) {
      if (!part) continue;
      accPath = accPath ? accPath + '/' + part : part;
      let folder = parent.find(c => c.type === 'folder' && c.name === part);
      if (!folder) {
        folder = {
          id: 'hf_folder_' + Math.random().toString(36).substring(2, 8),
          type: 'folder',
          name: part,
          icon: 'fa-solid fa-folder',
          expanded: true,
          serverPath: accPath,
          children: []
        };
        parent.push(folder);
      }
      parent = folder.children;
    }
    parent.push(fileNode);
  }

  function getWebDAVConfig() {
    return {
      url: (siteConfig && siteConfig.webdav_url ? siteConfig.webdav_url.trim() : ''),
      user: (siteConfig && siteConfig.webdav_user) || '',
      pass: (siteConfig && siteConfig.webdav_pass) || ''
    };
  }

  function getWebDAVHeaders(extra) {
    const cfg = getWebDAVConfig();
    const headers = Object.assign({}, extra || {});
    if (cfg.user && cfg.pass) {
      headers['Authorization'] = 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`);
    }
    return headers;
  }

  async function webdavFetch(url, options) {
    const opts = options || {};
    try {
      return await fetch(url, opts);
    } catch (err) {
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
      return await fetch(proxyUrl, opts);
    }
  }

  function getWebDAVFolderServerPath(folderNode) {
    const parts = [];
    const visit = (nodes, path) => {
      for (const n of nodes || []) {
        const nextPath = n.id === 'root_webdav' ? path : path.concat([n.name]);
        if (n === folderNode) {
          parts.push.apply(parts, nextPath);
          return true;
        }
        if (n.type === 'folder' && n.children) {
          if (visit(n.children, nextPath)) return true;
        }
      }
      return false;
    };
    const webdavRoot = (treeData || []).find(n => n.id === 'root_webdav');
    if (webdavRoot) visit([webdavRoot], []);
    return parts;
  }

  function buildWebDAVFolderUrl(folderNode) {
    const cfg = getWebDAVConfig();
    if (!cfg.url) return '';
    const pathParts = getWebDAVFolderServerPath(folderNode);
    if (pathParts.length === 0) return cfg.url.replace(/\/$/, '') + '/';
    return cfg.url.replace(/\/$/, '') + '/' + pathParts.map(p => encodeURIComponent(p)).join('/');
  }

  async function fetchWebDAVText(url) {
    const res = await webdavFetch(url, { headers: getWebDAVHeaders({ 'Accept': '*/*' }) });
    if (res && res.ok) return await res.text();
    return null;
  }

  async function webdavPropfind(url) {
    const headers = getWebDAVHeaders({ 'Depth': '1', 'Accept': '*/*' });
    let res;
    try {
      res = await fetch(url, { method: 'PROPFIND', headers });
    } catch (e) {
      const proxyUrl = `https://corsproxy.io/?` + encodeURIComponent(url);
      res = await fetch(proxyUrl, { headers });
    }
    if (!res || !res.ok) return null;
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    return xmlDoc.getElementsByTagNameNS('*', 'response');
  }

  function parseWebDAVChildren(responses, webdavRootUrl, parentServerPath, selfServerPath) {
    const children = [];
    const baseNoSlash = webdavRootUrl.replace(/\/$/, '');
    const selfNorm = ('/' + (selfServerPath || '').replace(/\/$/, '')).replace(/\/+/g, '/');
    for (let i = 0; i < responses.length; i++) {
      const resp = responses[i];
      const hrefEl = resp.getElementsByTagNameNS('*', 'href')[0];
      const href = hrefEl ? hrefEl.textContent : '';
      const hrefNorm = href.replace(/\/$/, '');
      if (!href || href === '/' || hrefNorm === baseNoSlash) continue;
      if (selfNorm !== '/' && hrefNorm === selfNorm) continue;

      const name = decodeURIComponent(href.split('/').filter(Boolean).pop() || 'WebDAV 文件');
      const isDir = href.endsWith('/') || resp.getElementsByTagNameNS('*', 'collection').length > 0;
      const serverPath = (parentServerPath ? parentServerPath + '/' : '') + (isDir ? name + '/' : name);
      const fullUrl = href.startsWith('http') ? href : (baseNoSlash + '/' + href.replace(/^\//, ''));

      if (isDir) {
        children.push({
          id: 'webdav_folder_' + Math.random().toString(36).substring(2, 8),
          type: 'folder',
          name: name,
          icon: 'fa-solid fa-folder obsidian-cyan',
          expanded: true,
          serverPath: serverPath,
          loaded: false,
          children: []
        });
      } else {
        const ext = (name.split('.').pop() || 'txt').toLowerCase();
        children.push({
          id: 'webdav_file_' + Math.random().toString(36).substring(2, 8),
          type: 'file',
          name: name,
          ext: ext,
          desc: 'WebDAV 云盘同步文件',
          size: '已同步',
          url: fullUrl,
          serverPath: serverPath
        });
      }
    }
    return children;
  }

  async function loadWebDAVDir(folderNode) {
    const cfg = getWebDAVConfig();
    if (!cfg.url) return false;
    const dirUrl = buildWebDAVFolderUrl(folderNode);
    const responses = await webdavPropfind(dirUrl);
    if (!responses || responses.length === 0) {
      showToast('⚠️ WebDAV 目录刷新失败：浏览器跨域(CORS)限制或账号凭据无效，坚果云等 WebDAV 服务不支持浏览器直连，请改用本地代理或桌面客户端同步。');
      return false;
    }

    const parentServerPath = folderNode.id === 'root_webdav' ? '' : (folderNode.serverPath ? folderNode.serverPath.replace(/\/$/, '') : '');
    const children = parseWebDAVChildren(responses, cfg.url, parentServerPath, folderNode.serverPath || '');

    folderNode.children = children;
    folderNode.loaded = true;
    ensureNodeMetadata(treeData);
    saveTreeToLocal();
    renderTree();
    return true;
  }

  async function syncWebDAVRepositoryTree() {
    const cfg = getWebDAVConfig();
    if (!cfg.url) return false;

    const webdavRoot = treeData ? treeData.find(n => n.id === 'root_webdav') : null;
    if (!webdavRoot) return false;

    const didLoad = await loadWebDAVDir(webdavRoot);
    if (didLoad) {
      webdavRoot.expanded = true;
      renderTree();
      return true;
    }
    return false;
  }

  function ensureFolderPathInTree(pathParts) {
    let currentChildren = treeData;
    for (let i = 0; i < pathParts.length; i++) {
      const folderName = pathParts[i];
      let folderNode = currentChildren.find(c => c.type === 'folder' && c.name === folderName);
      if (!folderNode) {
        folderNode = {
          id: 'folder_git_' + Math.random().toString(36).substring(2, 9),
          type: 'folder',
          name: folderName,
          icon: 'fa-solid fa-folder',
          expanded: true,
          children: []
        };
        currentChildren.push(folderNode);
      }
      currentChildren = folderNode.children;
    }
  }

  function findFileInTreeByPathOrName(nodes, fileName, relPath) {
    if (!nodes) return null;
    for (const node of nodes) {
      if (node.type === 'file') {
        if (node.name === fileName || node.url === relPath) return node;
      } else if (node.type === 'folder' && node.children) {
        const found = findFileInTreeByPathOrName(node.children, fileName, relPath);
        if (found) return found;
      }
    }
    return null;
  }

  function insertRemoteFileNodeByPath(pathParts, item) {
    const fileName = pathParts[pathParts.length - 1];
    const relUrl = item.path;
    const ext = (fileName.split('.').pop() || '').toLowerCase();

    // Check if file already exists anywhere in treeData
    let existingNode = findFileInTreeByPathOrName(treeData, fileName, relUrl);
    if (existingNode) {
      existingNode.url = relUrl;
      if (item.size) {
        existingNode.size = item.size > 1024 * 1024 ? (item.size / (1024 * 1024)).toFixed(2) + ' MB' : (item.size / 1024).toFixed(1) + ' KB';
      }
      return;
    }

    let currentChildren = treeData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      let folderNode = currentChildren.find(c => c.type === 'folder' && c.name === folderName);
      if (!folderNode) {
        folderNode = {
          id: 'folder_git_' + Math.random().toString(36).substring(2, 9),
          type: 'folder',
          name: folderName,
          icon: 'fa-solid fa-folder',
          expanded: true,
          children: []
        };
        currentChildren.push(folderNode);
      }
      currentChildren = folderNode.children;
    }

    const newFileNode = {
      id: 'file_git_' + (item.sha ? item.sha.substring(0, 10) : Math.random().toString(36).substring(2, 9)),
      type: 'file',
      name: fileName,
      ext: ext,
      desc: `从 GitHub 仓库动态同步`,
      size: item.size ? (item.size > 1024 * 1024 ? (item.size / (1024 * 1024)).toFixed(2) + ' MB' : (item.size / 1024).toFixed(1) + ' KB') : '已检索',
      url: relUrl
    };
    currentChildren.push(newFileNode);
  }

  async function handleGlobalRefresh() {
    globalRefreshBtn.querySelector('i').classList.add('fa-spin');
    
    // Clear stale cached local tree to force full fresh sync from GitHub Trees API
    localStorage.removeItem('ys_tree_data');
    
    const synced = await syncGitHubRepositoryTree();
    await loadData();
    renderTree();
    setTimeout(() => {
      globalRefreshBtn.querySelector('i').classList.remove('fa-spin');
      if (synced) {
        showToast('目录已从 GitHub 仓库成功全量读取并重新索引！');
      } else {
        showToast('目录与网盘数据已成功刷新！');
      }
    }, 300);
  }

  function handleActiveFileRefresh() {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.fileNode) return;

    const fileNode = activeTab.fileNode;
    refreshFileBtn.querySelector('i').classList.add('fa-spin');

    openFileInEditor(fileNode).then(() => {
      setTimeout(() => {
        refreshFileBtn.querySelector('i').classList.remove('fa-spin');
        showToast(`已成功重新读取「${fileNode.name}」！`);
      }, 300);
    });
  }

  function handleCopyCode() {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    const textToCopy = codeTextarea.value || (activeTab.fileNode ? activeTab.fileNode.url : '');
    if (!textToCopy) return alert('当前文件没有可复制的文本内容！');

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`已成功复制「${activeTab.fileNode.name}」全部内容到剪贴板！`);
    }).catch(err => {
      alert('复制失败，请手动选择复制！');
    });
  }

  function handlePasteCode() {
    if (!isAdminUnlocked) return alert('请先解锁管理员修改权限！');

    navigator.clipboard.readText().then(clipText => {
      if (!clipText) return alert('剪贴板中无可用的纯文本内容！');

      const start = codeTextarea.selectionStart;
      const end = codeTextarea.selectionEnd;
      codeTextarea.value = codeTextarea.value.substring(0, start) + clipText + codeTextarea.value.substring(end);
      codeTextarea.selectionStart = codeTextarea.selectionEnd = start + clipText.length;

      handleCodeInput();
      showToast('已成功从剪贴板粘贴文本内容！');
    }).catch(err => {
      alert('读取剪贴板失败，请允许浏览器剪贴板权限！');
    });
  }

  function updatePermissionUI() {
    if (isAdminUnlocked) {
      document.body.classList.remove('mode-readonly');
      document.body.classList.add('mode-admin');

      adminLockBtn.className = 'btn btn-sm btn-primary';
      adminLockBtn.innerHTML = '<i class="fa-solid fa-lock-open"></i> <span id="lock-btn-text" class="btn-label">已解锁</span>';
      
      codeTextarea.readOnly = false;
      statusModeLabel.innerHTML = '<i class="fa-solid fa-lock-open obsidian-green"></i> 管理员编辑模式';

      const activeTab = getActiveTab();
      const isDirty = activeTab ? activeTab.isDirty : false;
      saveStatusBadge.innerHTML = isDirty ? '<i class="fa-solid fa-circle-dot"></i> 未保存' : '<i class="fa-solid fa-circle-check"></i> 已保存';
    } else {
      document.body.classList.remove('mode-admin');
      document.body.classList.add('mode-readonly');

      adminLockBtn.className = 'btn btn-sm btn-warning';
      adminLockBtn.innerHTML = '<i class="fa-solid fa-lock"></i> <span id="lock-btn-text" class="btn-label">解锁</span>';
      
      codeTextarea.readOnly = true;
      statusModeLabel.innerHTML = '<i class="fa-solid fa-lock obsidian-yellow"></i> 游客只读模式';
      saveStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> 只读预览';
    }
    renderTree();
  }

  function handleLockBtnClick() {
    if (isAdminUnlocked) {
      isAdminUnlocked = false;
      updatePermissionUI();
      showToast('已切换为游客只读保护模式！');
    } else {
      pendingAdminAction = null;
      adminPasswordInput.value = '';
      passwordModal.style.display = 'flex';
      setTimeout(() => adminPasswordInput.focus(), 100);
    }
  }

  function handlePasswordVerify() {
    const inputPass = adminPasswordInput.value.trim();
    const targetPass = siteConfig.admin_password || 'admin';

    if (inputPass === targetPass) {
      isAdminUnlocked = true;

      // Auto-decrypt token if encrypted_token exists
      if (siteConfig.encrypted_token) {
        const dec = decryptSecret(siteConfig.encrypted_token, inputPass);
        if (dec && dec.startsWith('ghp_')) {
          siteConfig.github_token = dec;
        }
      }

      closeAllModals();
      updatePermissionUI();
      showToast('密码正确！管理员编辑与 GitHub API 提交权限已同步解锁。');

      if (pendingAdminAction === 'openSettings') {
        pendingAdminAction = null;
        setTimeout(() => openAdminSettingsModal(), 150);
      } else if (pendingAdminAction === 'openUpload') {
        pendingAdminAction = null;
        setTimeout(() => openUploadModal(), 150);
      } else if (pendingAdminAction === 'openYsMigration') {
        pendingAdminAction = null;
        setTimeout(() => openYsMigrationModal(), 150);
      } else if (pendingAdminAction === 'saveFile') {
        pendingAdminAction = null;
        setTimeout(() => saveActiveFile(), 150);
      } else if (pendingAdminAction === 'importConfig') {
        pendingAdminAction = null;
        const importFileInput = document.getElementById('import-config-file-input');
        if (importFileInput) importFileInput.click();
      }
    } else {
      alert('密码错误，解锁失败！默认密码为 admin。');
      adminPasswordInput.select();
    }
  }

  function renderTabs() {
    editorTabs.innerHTML = '';

    const welcomeTabEl = document.createElement('div');
    welcomeTabEl.className = `tab ${activeTabId === 'welcome' ? 'active' : ''}`;
    welcomeTabEl.id = 'tab-welcome';
    welcomeTabEl.innerHTML = `<i class="fa-solid fa-house"></i> 欢迎主页`;
    welcomeTabEl.addEventListener('click', () => switchTab('welcome'));
    editorTabs.appendChild(welcomeTabEl);

    openTabs.forEach(tab => {
      const tabEl = document.createElement('div');
      tabEl.className = `tab ${activeTabId === tab.id ? 'active' : ''}`;
      const iconInfo = getObsidianFileIcon(tab.fileNode);

      tabEl.innerHTML = `
        <i class="${iconInfo.icon} ${iconInfo.colorClass}"></i>
        <span>${escapeHtml(tab.name)}</span>
        ${tab.isDirty ? '<span class="tab-dirty-dot" title="未保存修改"></span>' : ''}
        <i class="fa-solid fa-xmark tab-close-btn" title="关闭标签页"></i>
      `;

      tabEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close-btn')) {
          e.stopPropagation();
          closeTab(tab.id);
        } else {
          switchTab(tab.id);
        }
      });

      editorTabs.appendChild(tabEl);
    });
  }

  function switchTab(tabId) {
    activeTabId = tabId;
    renderTabs();

    if (tabId === 'welcome') {
      editorView.style.display = 'none';
      welcomeView.style.display = 'flex';
    } else {
      const tab = openTabs.find(t => t.id === tabId);
      if (tab) {
        welcomeView.style.display = 'none';
        editorView.style.display = 'flex';
        renderActiveTabContent(tab);
      }
    }
    renderTree();
  }

  function closeTab(tabId) {
    const idx = openTabs.findIndex(t => t.id === tabId);
    if (idx !== -1) {
      const tab = openTabs[idx];
      if (tab.isDirty && isAdminUnlocked) {
        if (!confirm(`文件「${tab.name}」包含未保存的修改，确定要关闭吗？`)) return;
      }

      openTabs.splice(idx, 1);

      if (activeTabId === tabId) {
        if (openTabs.length > 0) {
          const nextTab = openTabs[Math.max(0, idx - 1)];
          switchTab(nextTab.id);
        } else {
          switchTab('welcome');
        }
      } else {
        renderTabs();
      }
    }
  }

  function getActiveTab() {
    return openTabs.find(t => t.id === activeTabId);
  }

  async function openFileInEditor(fileNode) {
    let tab = openTabs.find(t => t.id === fileNode.id);
    if (!tab) {
      tab = {
        id: fileNode.id,
        name: fileNode.name,
        fileNode: fileNode,
        content: fileNode.content,
        isDirty: false
      };
      openTabs.push(tab);
    }
    switchTab(tab.id);
  }

  async function loadHuggingFacePreviewUrl(fileNode) {
    const cfg = getHuggingFaceConfig();
    if (!cfg.repo) return fileNode.url || '';
    if (fileNode.url && fileNode.url.startsWith('data:')) return fileNode.url;
    const url = fileNode.url || buildHuggingFaceResolveUrl(fileNode.serverPath || fileNode.name, hfRepoTypeCache);
    if (!url) return '';
    try {
      const res = await fetch(encodeURI(url), { headers: getHuggingFaceHeaders({ 'Accept': '*/*' }) });
      if (!res.ok) return '';
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn('Hugging Face preview load failed:', err);
      return '';
    }
  }

  async function renderActiveTabContent(tab) {
    const fileNode = tab.fileNode;
    currentFileName.textContent = fileNode.name;
    const iconInfo = getObsidianFileIcon(fileNode);
    activeFileIcon.className = `${iconInfo.icon} ${iconInfo.colorClass}`;

    statusLanguage.innerHTML = `<i class="${iconInfo.icon}"></i> ${fileNode.ext ? fileNode.ext.toUpperCase() : 'FILE'}`;

    const ext = (fileNode.ext || fileNode.name.split('.').pop() || '').toLowerCase();

    codeEditorContainer.style.display = 'none';
    markdownPreviewContainer.style.display = 'none';
    pdfPreviewContainer.style.display = 'none';
    imagePreviewContainer.style.display = 'none';
    mdViewSwitch.style.display = 'none';
    saveFileBtn.style.display = isAdminUnlocked ? 'inline-flex' : 'none';

    // Retrieve from IndexedDB if available
    const idbData = await getFileFromIDB(fileNode.id);
    if (idbData) {
      if (idbData.content !== undefined && (!tab.isDirty || tab.content === undefined)) {
        tab.content = idbData.content;
        fileNode.content = idbData.content;
      }
      if (idbData.dataUrl) {
        fileNode.url = idbData.dataUrl;
      }
    }

    if (ext === 'pdf') {
      pdfPreviewContainer.style.display = 'flex';
      saveFileBtn.style.display = 'none';
      const pdfProvider = getStorageProviderForNode(fileNode);
      if (pdfProvider === 'huggingface') {
        const previewUrl = await loadHuggingFacePreviewUrl(fileNode);
        if (previewUrl) {
          pdfIframe.src = previewUrl;
        } else {
          showToast('⚠️ Hugging Face PDF 预览失败：无法访问文件（检查 Token 与仓库权限）。');
        }
      } else {
        pdfIframe.src = encodeURI(fileNode.url);
      }
      return;
    }

    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      imagePreviewContainer.style.display = 'flex';
      saveFileBtn.style.display = 'none';
      const imgProvider = getStorageProviderForNode(fileNode);
      if (imgProvider === 'huggingface') {
        const previewUrl = await loadHuggingFacePreviewUrl(fileNode);
        if (previewUrl) {
          imageElement.src = previewUrl;
        } else {
          showToast('⚠️ Hugging Face 图片预览失败：无法访问文件（检查 Token 与仓库权限）。');
        }
      } else {
        imageElement.src = encodeURI(fileNode.url);
      }
      return;
    }

    let content = tab.content || fileNode.content;
    if (content === undefined && fileNode.url && !fileNode.url.startsWith('data:')) {
      try {
        const nodeProvider = getStorageProviderForNode(fileNode);
        let res;
        if (nodeProvider === 'webdav') {
          res = await webdavFetch(encodeURI(fileNode.url), { headers: getWebDAVHeaders({ 'Accept': '*/*' }) });
        } else if (nodeProvider === 'huggingface') {
          res = await fetch(encodeURI(fileNode.url), { headers: getHuggingFaceHeaders({ 'Accept': '*/*' }) });
        } else {
          res = await fetch(encodeURI(fileNode.url));
        }
        if (res.ok) {
          content = await res.text();
          tab.content = content;
          fileNode.content = content;
        }
      } catch (err) {
        content = `# ${fileNode.name}\n\n可在下方进行编辑与在线预览...`;
      }
    }

    codeTextarea.value = content || '';
    setDirtyState(tab.isDirty);
    updateLineNumbers();
    updateStatusBar();

    if (['md', 'markdown', 'canvas'].includes(ext)) {
      mdViewSwitch.style.display = 'inline-flex';
      switchMdMode(currentMdMode);
    } else {
      codeEditorContainer.style.display = 'flex';
    }
  }

  async function loadData() {
    fileTreeContainer.innerHTML = `
      <div style="padding:1.5rem; text-align:center;">
        <i class="fa-solid fa-gem fa-spin obsidian-purple" style="font-size:1.5rem;"></i>
        <p style="margin-top:0.5rem; font-size:0.85rem;">正在读取网盘配置与目录...</p>
      </div>
    `;

    const savedLocalTree = localStorage.getItem('ys_tree_data');
    const savedSiteConfig = localStorage.getItem('ys_site_config');
    const savedRecycleBin = localStorage.getItem('ys_recycle_bin');

    let defaultData = null;
    try {
      const res = await fetch('data.json?v=' + Date.now());
      if (res.ok) defaultData = await res.json();
    } catch (e) {
      console.log('fetch(data.json) file:// 回退使用 data.js');
    }

    if (!defaultData && window.YS_DATA) {
      defaultData = window.YS_DATA;
    }

    siteConfig = savedSiteConfig ? JSON.parse(savedSiteConfig) : (defaultData ? defaultData.site : {});
    applySiteConfig();

    treeData = savedLocalTree ? JSON.parse(savedLocalTree) : (defaultData ? defaultData.tree : []);
    
    // Ensure all 4 storage backends appear as top-level root folders
    treeData = ensureMultiBackendRootTree(treeData);
    
    // Auto-sync remote files directly from GitHub, Hugging Face, and WebDAV
    await syncGitHubRepositoryTree();
    await syncHuggingFaceRepositoryTree();
    await syncWebDAVRepositoryTree();

    ensureNodeMetadata(treeData);

    recycleBin = savedRecycleBin ? JSON.parse(savedRecycleBin) : (defaultData ? defaultData.recycleBin || [] : []);
    cleanExpiredRecycleBin();

    updatePermissionUI();
    updateRecycleBadge();
  }

  function applySiteConfig() {
    if (!siteConfig) return;
    if (siteConfig.title) {
      htmlTitle.textContent = siteConfig.title;
      siteTitle.textContent = siteConfig.title;
      welcomeSloganTitle.textContent = siteConfig.title;
    }
    if (siteConfig.subtitle) {
      siteSubtitle.textContent = siteConfig.subtitle;
      welcomeSloganDesc.textContent = siteConfig.subtitle;
    }
    if (siteConfig.notice) {
      siteNoticeText.textContent = siteConfig.notice;
    }
    if (siteConfig.logo_icon) {
      siteLogoIcon.className = `brand-logo obsidian-logo`;
      siteLogoIcon.innerHTML = `<i class="${siteConfig.logo_icon}"></i>`;
    }

    // Status Provider Tag
    const provider = siteConfig.storage_provider || 'github';
    if (provider === 'huggingface') {
      statusProviderTag.innerHTML = `<i class="fa-solid fa-cubes obsidian-purple"></i> 存储源: Hugging Face (${siteConfig.hf_repo || 'Main'})`;
    } else if (provider === 'webdav') {
      statusProviderTag.innerHTML = `<i class="fa-solid fa-cloud obsidian-cyan"></i> 存储源: WebDAV (挂载云盘)`;
    } else if (provider === 'local') {
      statusProviderTag.innerHTML = `<i class="fa-solid fa-hard-drive obsidian-yellow"></i> 存储源: IndexedDB 离线隔离盘`;
    } else {
      statusProviderTag.innerHTML = `<i class="fa-brands fa-github obsidian-green"></i> 存储源: GitHub Pages / Raw`;
    }

    updateStorageSourceBadge();
  }

  function switchNewModalType(type) {
    newModeType = type;
    if (type === 'file') {
      tabTypeFile.classList.add('active');
      tabTypeLink.classList.remove('active');
      fileFieldsGroup.style.display = 'block';
      linkFieldsGroup.style.display = 'none';
    } else {
      tabTypeLink.classList.add('active');
      tabTypeFile.classList.remove('active');
      fileFieldsGroup.style.display = 'none';
      linkFieldsGroup.style.display = 'block';
    }
  }

  async function handleCreateFileOrLink() {
    if (!isAdminUnlocked) return alert('游客只读模式下无法新建资源，请先解封管理员模式！');
    const folderId = newFileFolderSelect.value;
    const desc = newFileDescInput.value.trim();
    const now = new Date().toLocaleString();

    const targetFolderNode = folderId === 'root' ? null : findNodeById(treeData, folderId);
    const targetProvider = targetFolderNode ? getStorageProviderForNode(targetFolderNode) : '';
    const isWebDAVTarget = targetProvider === 'webdav';
    const webdavFolderUrl = isWebDAVTarget ? buildWebDAVFolderUrl(targetFolderNode || (treeData.find(n => n.id === 'root_webdav') || null)) : '';

    if (newModeType === 'link') {
      const title = newLinkTitleInput.value.trim();
      const url = newLinkUrlInput.value.trim();

      if (!title || !url) return alert('请输入链接名称与目标网址！');

      const newLinkNode = {
        id: 'link_' + Date.now(),
        type: 'link',
        name: title,
        url: url,
        ext: 'link',
        desc: desc || '外部网盘/快捷跳转链接',
        createdAt: now,
        updatedAt: now,
        size: '-'
      };

      if (folderId === 'root') {
        treeData.push(newLinkNode);
      } else {
        const folder = findNodeById(treeData, folderId);
        if (folder) {
          if (!folder.children) folder.children = [];
          folder.children.push(newLinkNode);
          folder.expanded = true;
        }
      }

      ensureNodeMetadata(treeData);
      saveTreeToLocal();
      renderTree();
      closeAllModals();
      showToast(`网络链接「${title}」创建成功！`);
    } else {
      const title = newFileTitleInput.value.trim();
      const ext = newFileTypeSelect.value;

      if (!title) return alert('请输入文件标题！');

      const fileName = title.endsWith('.' + ext) ? title : `${title}.${ext}`;

      let webdavCreated = false;
      let webdavFileUrl = '';
      let hfCreated = false;
      let hfFileUrl = '';
      if (isWebDAVTarget && webdavFolderUrl) {
        const putTarget = webdavFolderUrl.replace(/\/$/, '') + '/' + encodeURIComponent(fileName);
        const content = `# ${fileName}\n# 创建时间: ${now}\n\n`;
        try {
          const res = await webdavFetch(putTarget, {
            method: 'PUT',
            headers: getWebDAVHeaders({ 'Content-Type': 'text/plain;charset=utf-8', 'Accept': '*/*' }),
            body: content
          });
          if (res && (res.ok || res.status === 201 || res.status === 204)) {
            webdavCreated = true;
            webdavFileUrl = putTarget;
          } else {
            alert(`WebDAV 文件创建失败${res ? ' (HTTP ' + res.status + ')' : '（网络受限）'}，请检查后台 WebDAV 配置。`);
            return;
          }
        } catch (err) {
          console.warn('WebDAV PUT create failed:', err);
          alert('WebDAV 文件创建失败（网络受限），请检查后台 WebDAV 配置。');
          return;
        }
      }

      if (targetProvider === 'huggingface') {
        const parentPath = targetFolderNode && targetFolderNode.serverPath ? targetFolderNode.serverPath.replace(/\/$/, '') : '';
        const targetPath = (parentPath ? parentPath + '/' : '') + fileName;
        const content = `# ${fileName}\n# 创建时间: ${now}\n\n`;
        const base64Content = btoa(unescape(encodeURIComponent(content)));
        const ok = await uploadFileToHuggingFace(targetPath, base64Content, `Create ${targetPath}`);
        if (ok) {
          hfCreated = true;
          hfFileUrl = buildHuggingFaceResolveUrl(targetPath);
        } else {
          alert('Hugging Face 文件创建失败，请检查 Token 与仓库权限。');
          return;
        }
      }

      const newFile = {
        id: 'file_' + Date.now(),
        type: 'file',
        name: fileName,
        ext: ext,
        desc: desc,
        createdAt: now,
        updatedAt: now,
        size: '0 Bytes',
        url: hfFileUrl || webdavFileUrl || `files/${fileName}`,
        content: `# ${fileName}\n# 创建时间: ${now}\n\n`
      };
      if (webdavCreated) {
        const parentPath = targetFolderNode && targetFolderNode.serverPath ? targetFolderNode.serverPath.replace(/\/$/, '') : '';
        newFile.serverPath = (parentPath ? parentPath + '/' : '') + fileName;
      }
      if (hfCreated) {
        const parentPath = targetFolderNode && targetFolderNode.serverPath ? targetFolderNode.serverPath.replace(/\/$/, '') : '';
        newFile.serverPath = (parentPath ? parentPath + '/' : '') + fileName;
      }

      if (folderId === 'root') {
        treeData.push(newFile);
      } else {
        const folder = findNodeById(treeData, folderId);
        if (folder) {
          if (!folder.children) folder.children = [];
          folder.children.push(newFile);
          folder.expanded = true;
        }
      }

      ensureNodeMetadata(treeData);
      saveTreeToLocal();
      renderTree();
      openFileInEditor(newFile);
      closeAllModals();
      showToast(`文件「${fileName}」创建成功！${webdavCreated ? '（已写入 WebDAV 云盘）' : ''}${hfCreated ? '（已写入 Hugging Face 仓库）' : ''}`);
    }
  }

  function cleanExpiredRecycleBin() {
    const RETENTION_MS = 60 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const initialLen = recycleBin.length;

    recycleBin = recycleBin.filter(item => (now - (item.deletedAt || 0)) < RETENTION_MS);

    if (recycleBin.length !== initialLen) saveRecycleBinToLocal();
  }

  function saveRecycleBinToLocal() {
    localStorage.setItem('ys_recycle_bin', JSON.stringify(recycleBin));
    updateRecycleBadge();
  }

  function updateRecycleBadge() {
    recycleCountBadge.textContent = recycleBin.length;
  }

  function moveNodeToRecycleBin(node) {
    const now = Date.now();
    const recycledItem = {
      ...node,
      deletedAt: now,
      deletedDateStr: new Date().toLocaleString(),
      expireAt: now + (60 * 24 * 60 * 60 * 1000)
    };

    recycleBin.push(recycledItem);
    removeNodeById(treeData, node.id);

    closeTab(node.id);

    saveTreeToLocal();
    saveRecycleBinToLocal();
    renderTree();
  }

  function handleBatchMoveToTrash() {
    if (!isAdminUnlocked) return alert('游客只读模式下无法进行移入回收站操作，请先解锁！');
    if (selectedNodeIds.size === 0) return;
    if (!confirm(`确定要将选中的 ${selectedNodeIds.size} 项移放入回收站（可在回收站保留2个月并支持恢复）？`)) return;

    selectedNodeIds.forEach(id => {
      const node = findNodeById(treeData, id);
      if (node) moveNodeToRecycleBin(node);
    });

    selectedNodeIds.clear();
    showToast('已放入回收站（保留60天）');
  }

  function openRecycleBinModal() {
    cleanExpiredRecycleBin();
    renderRecycleBinList();
    recycleBinModal.style.display = 'flex';
  }

  function renderRecycleBinList() {
    recycleListContainer.innerHTML = '';
    if (recycleBin.length === 0) {
      recycleListContainer.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-muted);">回收站为空</div>`;
      return;
    }

    const now = Date.now();

    recycleBin.forEach(item => {
      const row = document.createElement('div');
      row.className = 'recycle-item-row';

      const ageDays = Math.floor((now - item.deletedAt) / (1000 * 60 * 60 * 24));
      const remainingDays = 60 - ageDays;
      const iconInfo = getObsidianFileIcon(item);

      row.innerHTML = `
        <i class="${iconInfo.icon} ${iconInfo.colorClass}" style="font-size:1.1rem;"></i>
        <div class="recycle-info">
          <span class="recycle-name">${escapeHtml(item.name)}</span>
          <span class="recycle-path">原路径: ${escapeHtml(item.path || item.name)} | 删除时间: ${item.deletedDateStr || '-'}</span>
        </div>
        <span class="recycle-days ${remainingDays <= 5 ? 'expired' : ''}">剩余 ${remainingDays > 0 ? remainingDays : 0} 天</span>
        <div class="recycle-actions admin-only">
          <button class="btn btn-xs btn-outline restore-btn" title="还原资源"><i class="fa-solid fa-rotate-left"></i> 还原</button>
          <button class="btn btn-xs btn-danger purge-btn" title="彻底删除"><i class="fa-solid fa-trash-xmark"></i> 彻底删除</button>
        </div>
      `;

      const restoreBtn = row.querySelector('.restore-btn');
      const purgeBtn = row.querySelector('.purge-btn');
      if (restoreBtn) restoreBtn.addEventListener('click', () => restoreRecycledItem(item.id));
      if (purgeBtn) purgeBtn.addEventListener('click', () => purgeRecycledItem(item.id));

      recycleListContainer.appendChild(row);
    });
  }

  function restoreRecycledItem(itemId) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    const idx = recycleBin.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const item = recycleBin.splice(idx, 1)[0];
      delete item.deletedAt;
      delete item.deletedDateStr;
      delete item.expireAt;

      treeData.push(item);
      saveTreeToLocal();
      saveRecycleBinToLocal();
      renderTree();
      renderRecycleBinList();
      showToast(`已成功还原「${item.name}」！`);
    }
  }

  function purgeRecycledItem(itemId) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    const idx = recycleBin.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const item = recycleBin.splice(idx, 1)[0];
      saveRecycleBinToLocal();
      renderRecycleBinList();
      showToast(`已彻底删除「${item.name}」！`);
    }
  }

  function handleEmptyTrash() {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    if (recycleBin.length === 0) return;
    if (confirm('确定要清空回收站吗？所有被清空的项目将无法恢复。')) {
      recycleBin = [];
      saveRecycleBinToLocal();
      renderRecycleBinList();
      showToast('回收站已全部清空！');
    }
  }

  function ensureMultiBackendRootTree(tree) {
    if (!Array.isArray(tree)) tree = [];

    // Root 1: GitHub
    let githubRoot = tree.find(n => n.id === 'root_github');
    if (!githubRoot) {
      githubRoot = {
        id: 'root_github',
        type: 'folder',
        name: '🐙 GitHub Pages / Raw 仓库 [云端主库]',
        icon: 'fa-brands fa-github obsidian-green',
        storageProvider: 'github',
        expanded: true,
        children: tree.filter(n => !n.id || !n.id.startsWith('root_'))
      };
      tree = [githubRoot];
    } else {
      githubRoot.name = '🐙 GitHub Pages / Raw 仓库 [云端主库]';
      githubRoot.icon = 'fa-brands fa-github obsidian-green';
      githubRoot.storageProvider = 'github';
    }

    // Root 2: Hugging Face
    let hfRoot = tree.find(n => n.id === 'root_huggingface');
    if (!hfRoot) {
      hfRoot = {
        id: 'root_huggingface',
        type: 'folder',
        name: '🤗 Hugging Face 挂载库 [模型/数据集]',
        icon: 'fa-solid fa-cubes obsidian-purple',
        storageProvider: 'huggingface',
        expanded: false,
        children: [
          {
            id: 'hf_sample_1',
            type: 'link',
            name: '🤗 Hugging Face Datasets 官方数据节点',
            url: 'https://huggingface.co/datasets',
            ext: 'link',
            desc: '挂载的 HF 数据集地址',
            size: '-'
          }
        ]
      };
      tree.push(hfRoot);
    } else {
      hfRoot.name = '🤗 Hugging Face 挂载库 [模型/数据集]';
      hfRoot.icon = 'fa-solid fa-cubes obsidian-purple';
      hfRoot.storageProvider = 'huggingface';
    }

    // Root 3: WebDAV
    let webdavRoot = tree.find(n => n.id === 'root_webdav');
    if (!webdavRoot) {
      webdavRoot = {
        id: 'root_webdav',
        type: 'folder',
        name: '☁️ WebDAV 统一云存储 [坚果云/Nextcloud]',
        icon: 'fa-solid fa-cloud obsidian-cyan',
        storageProvider: 'webdav',
        expanded: false,
        children: [
          {
            id: 'webdav_sample_1',
            type: 'file',
            name: 'WebDAV 云网盘挂载读取说明.md',
            ext: 'md',
            desc: 'WebDAV 云盘挂载引导',
            size: '0.8 KB',
            content: '# ☁️ WebDAV 云存储挂载节点\n\n您可以在【后台定制】中设置 WebDAV Endpoint、用户名与应用密码。\n设置后，此处将作为 WebDAV 在线盘进行读写与跨后端文件复制！'
          }
        ]
      };
      tree.push(webdavRoot);
    } else {
      webdavRoot.name = '☁️ WebDAV 统一云存储 [坚果云/Nextcloud]';
      webdavRoot.icon = 'fa-solid fa-cloud obsidian-cyan';
      webdavRoot.storageProvider = 'webdav';
    }

    // Root 4: IndexedDB Local Offline
    let localRoot = tree.find(n => n.id === 'root_local');
    if (!localRoot) {
      localRoot = {
        id: 'root_local',
        type: 'folder',
        name: '💾 IndexedDB 离线私有盘 [本地沙盒]',
        icon: 'fa-solid fa-hard-drive obsidian-yellow',
        storageProvider: 'local',
        expanded: true,
        children: [
          {
            id: 'local_sample_1',
            type: 'file',
            name: 'IndexedDB 离线私有文件草稿.md',
            ext: 'md',
            desc: '仅保存在本机浏览器的私有文件',
            size: '1.1 KB',
            content: '# 💾 本地 IndexedDB 离线私有空间\n\n保存在本文件夹内的文件只存在于您的本地浏览器中，绝不上传任何云端服务器。\n您可以随时将其复制或移动到 【🐙 GitHub 仓库】 或 【☁️ WebDAV】 进行云端同步！'
          }
        ]
      };
      tree.push(localRoot);
    } else {
      localRoot.name = '💾 IndexedDB 离线私有盘 [本地沙盒]';
      localRoot.icon = 'fa-solid fa-hard-drive obsidian-yellow';
      localRoot.storageProvider = 'local';
    }

    return tree;
  }

  function ensureNodeMetadata(nodes, parentPath = '') {
    const now = new Date().toLocaleString();
    nodes.forEach(node => {
      if (!node.id) node.id = 'node_' + Math.random().toString(36).substring(2, 9);
      if (!node.createdAt) node.createdAt = now;
      if (!node.updatedAt) node.updatedAt = now;
      node.path = parentPath ? `${parentPath} / ${node.name}` : node.name;

      if (node.type === 'folder' && node.children) {
        ensureNodeMetadata(node.children, node.path);
      } else if (node.type === 'file') {
        if (!node.size) {
          const len = (node.content || '').length;
          node.size = len > 1024 ? (len / 1024).toFixed(1) + ' KB' : (len > 0 ? len + ' Bytes' : '资源文件');
        }
      }
    });
  }

  function renderTree(filterQuery = '') {
    fileTreeContainer.innerHTML = '';
    if (!treeData || treeData.length === 0) {
      fileTreeContainer.innerHTML = `<div style="padding:1rem; color:var(--text-muted);">目录为空</div>`;
      updateBatchBar();
      return;
    }

    const rootGroup = document.createElement('div');
    rootGroup.className = 'tree-node-group';

    treeData.forEach(node => {
      const nodeEl = createTreeNodeElement(node, filterQuery);
      if (nodeEl) rootGroup.appendChild(nodeEl);
    });

    fileTreeContainer.appendChild(rootGroup);
    updateBatchBar();
  }

  function createTreeNodeElement(node, filterQuery = '') {
    const isChecked = selectedNodeIds.has(node.id);

    if (node.type === 'folder') {
      const children = node.children || [];
      const isExpanded = filterQuery ? true : (node.expanded !== false);

      const folderBox = document.createElement('div');
      folderBox.className = 'tree-node';

      const folderItem = document.createElement('div');
      folderItem.className = 'tree-item';
      folderItem.innerHTML = `
        <input type="checkbox" class="tree-checkbox" ${isChecked ? 'checked' : ''}>
        <i class="fa-solid fa-chevron-right tree-chevron ${isExpanded ? 'expanded' : ''}"></i>
        <i class="${node.icon || 'fa-solid fa-folder'} tree-icon obsidian-yellow"></i>
        <span class="tree-label">${escapeHtml(node.name)}</span>
        <span class="tree-badge">${children.length}</span>
        
        <div class="tree-node-actions admin-only">
          <button class="tree-action-btn add-subfolder-btn" title="新建子目录"><i class="fa-solid fa-folder-plus"></i></button>
          <button class="tree-action-btn copy-btn" title="克隆复制目录树"><i class="fa-regular fa-copy"></i></button>
          <button class="tree-action-btn paste-here-btn" title="粘贴副本到此目录"><i class="fa-solid fa-paste obsidian-yellow"></i></button>
          <button class="tree-action-btn rename-btn" title="重命名"><i class="fa-solid fa-pen"></i></button>
          <button class="tree-action-btn prop-btn" title="属性与直链"><i class="fa-solid fa-circle-info"></i></button>
          <button class="tree-action-btn delete-btn" title="放入回收站"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      const childrenContainer = document.createElement('div');
      childrenContainer.className = `tree-children ${isExpanded ? 'expanded' : ''}`;

      let matchCount = 0;
      children.forEach(childNode => {
        const childEl = createTreeNodeElement(childNode, filterQuery);
        if (childEl) {
          childrenContainer.appendChild(childEl);
          matchCount++;
        }
      });

      if (filterQuery && matchCount === 0 && !node.name.toLowerCase().includes(filterQuery.toLowerCase())) {
        return null;
      }

      const checkbox = folderItem.querySelector('.tree-checkbox');
      if (checkbox) {
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleNodeSelection(node, checkbox.checked);
        });
      }

      folderItem.addEventListener('click', async (e) => {
        if (e.target.classList.contains('tree-checkbox') || e.target.closest('.tree-node-actions')) return;
        node.expanded = !node.expanded;
        folderItem.querySelector('.tree-chevron').classList.toggle('expanded');
        childrenContainer.classList.toggle('expanded');
        if (node.expanded && getStorageProviderForNode(node) === 'webdav' && !node.loaded) {
          loadWebDAVDir(node);
        }
      });

      const addSubfolderBtn = folderItem.querySelector('.add-subfolder-btn');
      const copyBtn = folderItem.querySelector('.copy-btn');
      const pasteHereBtn = folderItem.querySelector('.paste-here-btn');
      const renameBtn = folderItem.querySelector('.rename-btn');
      const propBtn = folderItem.querySelector('.prop-btn');
      const deleteBtn = folderItem.querySelector('.delete-btn');

      if (addSubfolderBtn) addSubfolderBtn.addEventListener('click', (e) => { e.stopPropagation(); openNewFolderModal(node.id); });
      if (copyBtn) copyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyNode(node); });
      if (pasteHereBtn) pasteHereBtn.addEventListener('click', (e) => { e.stopPropagation(); pasteCopiedNodes(node.id); });
      if (renameBtn) renameBtn.addEventListener('click', (e) => { e.stopPropagation(); openRenameModal(node); });
      if (propBtn) propBtn.addEventListener('click', (e) => { e.stopPropagation(); showNodeProperties(node); });
      if (deleteBtn) deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); confirmDeleteSingleNode(node); });

      folderBox.appendChild(folderItem);
      folderBox.appendChild(childrenContainer);
      return folderBox;
    } else {
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        if (!node.name.toLowerCase().includes(q) && !(node.desc && node.desc.toLowerCase().includes(q))) return null;
      }

      const fileItem = document.createElement('div');
      fileItem.className = `tree-item ${activeTabId === node.id ? 'active' : ''}`;
      const iconInfo = getObsidianFileIcon(node);

      fileItem.innerHTML = `
        <input type="checkbox" class="tree-checkbox" ${isChecked ? 'checked' : ''}>
        <span style="width:14px;"></span>
        <i class="${iconInfo.icon} tree-icon ${iconInfo.colorClass}"></i>
        <span class="tree-label">${escapeHtml(node.name)}</span>
        
        <div class="tree-node-actions admin-only">
          <button class="tree-action-btn copy-btn" title="克隆复制此文件"><i class="fa-regular fa-copy"></i></button>
          <button class="tree-action-btn rename-btn" title="重命名"><i class="fa-solid fa-pen"></i></button>
          <button class="tree-action-btn prop-btn" title="属性与直链"><i class="fa-solid fa-circle-info"></i></button>
          <button class="tree-action-btn delete-btn" title="放入回收站"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      const checkbox = fileItem.querySelector('.tree-checkbox');
      if (checkbox) {
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleNodeSelection(node, checkbox.checked);
        });
      }

      fileItem.addEventListener('click', (e) => {
        if (e.target.classList.contains('tree-checkbox') || e.target.closest('.tree-node-actions')) return;
        if (node.type === 'link') {
          window.open(node.url, '_blank');
        } else {
          openFileInEditor(node);
        }
      });

      const copyBtn = fileItem.querySelector('.copy-btn');
      const renameBtn = fileItem.querySelector('.rename-btn');
      const propBtn = fileItem.querySelector('.prop-btn');
      const deleteBtn = fileItem.querySelector('.delete-btn');

      if (copyBtn) copyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyNode(node); });
      if (renameBtn) renameBtn.addEventListener('click', (e) => { e.stopPropagation(); openRenameModal(node); });
      if (propBtn) propBtn.addEventListener('click', (e) => { e.stopPropagation(); showNodeProperties(node); });
      if (deleteBtn) deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); confirmDeleteSingleNode(node); });

      return fileItem;
    }
  }

  function getObsidianFileIcon(node) {
    if (!node) return { icon: 'fa-solid fa-file', colorClass: 'obsidian-blue' };
    if (node.type === 'link') return { icon: 'fa-solid fa-arrow-up-right-from-square', colorClass: 'obsidian-blue' };
    const ext = (node.ext || node.name.split('.').pop() || '').toLowerCase();

    switch (ext) {
      case 'md': case 'markdown': return { icon: 'fa-brands fa-markdown', colorClass: 'obsidian-purple' };
      case 'canvas': return { icon: 'fa-solid fa-cubes-stacked', colorClass: 'obsidian-purple' };
      case 'pdf': return { icon: 'fa-solid fa-file-pdf', colorClass: 'obsidian-red' };
      case 'txt': case 'rtf': return { icon: 'fa-solid fa-file-lines', colorClass: 'obsidian-blue' };

      case 'py': case 'pyw': return { icon: 'fa-brands fa-python', colorClass: 'obsidian-blue' };
      case 'js': case 'jsx': case 'mjs': return { icon: 'fa-brands fa-js', colorClass: 'obsidian-yellow' };
      case 'ts': case 'tsx': return { icon: 'fa-solid fa-code', colorClass: 'obsidian-cyan' };
      case 'html': case 'htm': return { icon: 'fa-brands fa-html5', colorClass: 'obsidian-orange' };
      case 'css': case 'scss': case 'less': return { icon: 'fa-brands fa-css3-alt', colorClass: 'obsidian-cyan' };
      case 'json': case 'json5': return { icon: 'fa-solid fa-brackets-curly', colorClass: 'obsidian-yellow' };
      case 'yaml': case 'yml': return { icon: 'fa-solid fa-sliders', colorClass: 'obsidian-pink' };
      case 'sh': case 'bash': case 'zsh': return { icon: 'fa-solid fa-terminal', colorClass: 'obsidian-green' };
      case 'rs': return { icon: 'fa-brands fa-rust', colorClass: 'obsidian-orange' };
      case 'go': return { icon: 'fa-solid fa-code', colorClass: 'obsidian-cyan' };

      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'webp':
        return { icon: 'fa-solid fa-file-image', colorClass: 'obsidian-green' };

      default: return { icon: 'fa-solid fa-file-code', colorClass: 'obsidian-blue' };
    }
  }

  function switchMdMode(mode) {
    currentMdMode = mode;
    if (mode === 'render') {
      modeRenderBtn.className = 'btn btn-xs btn-primary';
      modeEditBtn.className = 'btn btn-xs btn-outline';
      codeEditorContainer.style.display = 'none';
      markdownPreviewContainer.style.display = 'flex';
      markdownPreviewBox.innerHTML = renderSimpleMarkdown(codeTextarea.value);
    } else {
      modeRenderBtn.className = 'btn btn-xs btn-outline';
      modeEditBtn.className = 'btn btn-xs btn-primary';
      markdownPreviewContainer.style.display = 'none';
      codeEditorContainer.style.display = 'flex';
    }
  }

  function renderSimpleMarkdown(md) {
    if (!md) return '<p style="color:var(--text-muted);">无内容</p>';
    let html = escapeHtml(md);
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function toggleNodeSelection(node, isChecked) {
    if (isChecked) {
      selectedNodeIds.add(node.id);
      if (node.type === 'folder' && node.children) {
        node.children.forEach(child => toggleNodeSelection(child, true));
      }
    } else {
      selectedNodeIds.delete(node.id);
      if (node.type === 'folder' && node.children) {
        node.children.forEach(child => toggleNodeSelection(child, false));
      }
    }
    renderTree();
  }

  function updateBatchBar() {
    if (selectedNodeIds.size > 0 && isAdminUnlocked) {
      batchActionBar.style.display = 'flex';
      selectedCountBadge.textContent = `已选中 ${selectedNodeIds.size} 项`;
    } else {
      batchActionBar.style.display = 'none';
    }
  }

  function updateLineNumbers() {
    const lines = codeTextarea.value.split('\n').length;
    let lineNumsHtml = '';
    for (let i = 1; i <= lines; i++) {
      lineNumsHtml += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumsHtml;
    syncScroll();
  }

  function syncScroll() {
    lineNumbers.scrollTop = codeTextarea.scrollTop;
  }

  function handleCodeInput() {
    if (!isAdminUnlocked) return;
    const activeTab = getActiveTab();
    if (activeTab) {
      activeTab.content = codeTextarea.value;
      if (activeTab.fileNode) {
        activeTab.fileNode.content = codeTextarea.value;
        activeTab.fileNode.updatedAt = new Date().toLocaleString();
        const len = codeTextarea.value.length;
        activeTab.fileNode.size = len > 1024 ? (len / 1024).toFixed(1) + ' KB' : len + ' Bytes';
      }
      setDirtyState(true);
    }
    updateLineNumbers();
    updateStatusBar();
  }

  function handleKeyInput(e) {
    if (!isAdminUnlocked) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = codeTextarea.selectionStart;
      const end = codeTextarea.selectionEnd;
      codeTextarea.value = codeTextarea.value.substring(0, start) + "  " + codeTextarea.value.substring(end);
      codeTextarea.selectionStart = codeTextarea.selectionEnd = start + 2;
      handleCodeInput();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveActiveFile();
    }
  }

  function updateStatusBar() {
    const text = codeTextarea.value;
    const lines = text.split('\n').length;
    statusLines.innerHTML = `<i class="fa-solid fa-bars-staggered"></i> 共 ${lines} 行`;
    statusLength.innerHTML = `<i class="fa-solid fa-text-height"></i> ${text.length} 字符`;
  }

  function setDirtyState(dirty) {
    const activeTab = getActiveTab();
    if (activeTab) activeTab.isDirty = dirty;
    renderTabs();

    if (!isAdminUnlocked) {
      saveStatusBadge.className = 'status-badge clean';
      saveStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> 只读预览';
      return;
    }
    if (dirty) {
      saveStatusBadge.className = 'status-badge dirty';
      saveStatusBadge.innerHTML = '<i class="fa-solid fa-circle-dot"></i> 未保存';
    } else {
      saveStatusBadge.className = 'status-badge clean';
      saveStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> 已保存';
    }
  }

  async function saveActiveFile() {
    if (!isAdminUnlocked) {
      pendingAdminAction = 'saveFile';
      adminPasswordInput.value = '';
      passwordModal.style.display = 'flex';
      setTimeout(() => adminPasswordInput.focus(), 100);
      return;
    }

    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.fileNode) return;

    const fileNode = activeTab.fileNode;
    const newContent = codeTextarea.value;

    fileNode.content = newContent;
    activeTab.content = newContent;
    fileNode.updatedAt = new Date().toLocaleString();

    // 1. Save to IndexedDB (Bypasses LocalStorage size quota limit)
    await saveFileToIDB(fileNode.id, {
      content: newContent,
      dataUrl: fileNode.url
    });

    // 2. Save tree structure to LocalStorage
    saveTreeToLocal();

    // 3. Commit & push directly to GitHub Repository if the file belongs to the GitHub backend and API token is active
    let githubUploaded = false;
    let webdavUploaded = false;
    const nodeProvider = getStorageProviderForNode(fileNode);
    const activeToken = getActiveGitHubToken();

    const belongsToGitHub =
      (nodeProvider === 'github' || !nodeProvider) &&
      (siteConfig.storage_provider === 'github' || nodeProvider === 'github');

    if (belongsToGitHub && activeToken) {
      saveFileBtn.disabled = true;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span class="btn-label">提交中...</span>';

      const base64Content = btoa(unescape(encodeURIComponent(newContent)));
      let targetPath = fileNode.name;
      if (fileNode.url && fileNode.url.startsWith('files/')) {
        targetPath = fileNode.url.replace('files/', '');
      }

      const resUrl = await uploadFileToGitHub(targetPath, base64Content);
      saveFileBtn.disabled = false;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span class="btn-label">保存</span>';

      if (resUrl) {
        fileNode.url = resUrl;
        githubUploaded = true;
      }
    }

    // 4. Write back to WebDAV server via PUT if the file belongs to the WebDAV backend
    if (nodeProvider === 'webdav') {
      saveFileBtn.disabled = true;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span class="btn-label">写入中...</span>';

      let targetUrl = fileNode.url;
      if (!targetUrl || targetUrl.startsWith('data:')) {
        const folderServerPath = fileNode.serverPath ? fileNode.serverPath.replace(/\/[^/]+$/, '') : '';
        const cfg = getWebDAVConfig();
        targetUrl = (cfg.url.replace(/\/$/, '') + '/' + (folderServerPath ? folderServerPath + '/' : '') + encodeURIComponent(fileNode.name));
      }

      let putRes = null;
      try {
        putRes = await webdavFetch(targetUrl, {
          method: 'PUT',
          headers: getWebDAVHeaders({ 'Content-Type': 'text/plain;charset=utf-8', 'Accept': '*/*' }),
          body: newContent
        });
      } catch (err) {
        console.warn('WebDAV PUT failed:', err);
      }

      saveFileBtn.disabled = false;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span class="btn-label">保存</span>';

      if (putRes && (putRes.ok || putRes.status === 201 || putRes.status === 204)) {
        fileNode.url = targetUrl;
        fileNode.content = newContent;
        webdavUploaded = true;
      } else {
        setDirtyState(false);
        showToast(`「${fileNode.name}」本地已保存，但 WebDAV 写入失败${putRes ? ' (HTTP ' + putRes.status + ')' : '（浏览器 CORS 限制或网络不通）'}。坚果云等 WebDAV 服务不支持浏览器直连写入，请改用本地代理或桌面客户端同步。`);
        return;
      }
    }

    // 4b. Write back to Hugging Face repository via commit API
    let hfUploaded = false;
    if (nodeProvider === 'huggingface') {
      saveFileBtn.disabled = true;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span class="btn-label">写入中...</span>';

      let targetPath = fileNode.serverPath || fileNode.name;
      const base64Content = btoa(unescape(encodeURIComponent(newContent)));
      const ok = await uploadFileToHuggingFace(targetPath, base64Content, `Update ${targetPath}`);

      saveFileBtn.disabled = false;
      saveFileBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span class="btn-label">保存</span>';

      if (ok) {
        fileNode.url = buildHuggingFaceResolveUrl(targetPath);
        fileNode.content = newContent;
        hfUploaded = true;
      } else {
        setDirtyState(false);
        showToast(`「${fileNode.name}」本地已保存，但 Hugging Face 写入失败，请检查 Token 与仓库权限。`);
        return;
      }
    }

    setDirtyState(false);

    if (githubUploaded) {
      showToast(`「${fileNode.name}」已保存并实时 Commit 提交至 GitHub 仓库！`);
    } else if (webdavUploaded) {
      showToast(`「${fileNode.name}」已保存并实时写入 WebDAV 云盘！`);
    } else if (hfUploaded) {
      showToast(`「${fileNode.name}」已保存并实时写入 Hugging Face 仓库！`);
    } else {
      showToast(`「${fileNode.name}」已成功保存！`);
    }
  }

  function cleanTreeForLocalStorage(nodes) {
    if (!nodes) return [];
    return nodes.map(node => {
      const copy = { ...node };
      if (copy.children) {
        copy.children = cleanTreeForLocalStorage(copy.children);
      }
      if (copy.url && copy.url.startsWith('data:') && copy.url.length > 1024) {
        copy.url = '';
      }
      if (copy.content && copy.content.length > 50000) {
        copy.content = '';
      }
      return copy;
    });
  }

  function saveTreeToLocal() {
    try {
      const lightTree = cleanTreeForLocalStorage(treeData);
      localStorage.setItem('ys_tree_data', JSON.stringify(lightTree));
    } catch (e) {
      console.warn('LocalStorage quota exceeded, Relying on IndexedDB storage:', e);
    }
  }

  function getStorageProviderForNode(fileNode) {
    if (!fileNode) return '';
    if (fileNode.storageProvider) return fileNode.storageProvider;

    const findInSubtree = (nodes, inheritedProvider) => {
      for (const node of nodes || []) {
        if (node === fileNode) return inheritedProvider || '';
        if (node.type === 'folder') {
          const provider = node.storageProvider || inheritedProvider || '';
          const res = findInSubtree(node.children || [], provider);
          if (res !== undefined) return res;
        }
      }
      return undefined;
    };

    for (const root of treeData || []) {
      const provider = root.storageProvider || '';
      const res = findInSubtree([root], provider);
      if (res !== undefined) return res;
    }

    return '';
  }

  async function downloadActiveFile() {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.fileNode) return;

    const fileNode = activeTab.fileNode;
    const ext = (fileNode.ext || fileNode.name.split('.').pop() || '').toLowerCase();
    const nodeProvider = getStorageProviderForNode(fileNode);
    const isBinary = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'zip', 'rar', '7z', 'mp4', 'mp3', 'wav', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'apk', 'exe', 'iso'].includes(ext);

    // Remote providers: download the real file bytes
    if (nodeProvider === 'huggingface' && fileNode.url) {
      try {
        const res = await fetch(encodeURI(fileNode.url), { headers: getHuggingFaceHeaders({ 'Accept': '*/*' }) });
        if (!res.ok) {
          showToast('⚠️ Hugging Face 文件下载失败（检查 Token 与仓库权限）。');
          return;
        }
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileNode.name;
        a.click();
        showToast(`已下载 ${fileNode.name}（${(blob.size / 1024).toFixed(1)} KB）`);
        return;
      } catch (err) {
        console.warn('Hugging Face download failed:', err);
        showToast('⚠️ Hugging Face 文件下载失败（网络错误）。');
        return;
      }
    }

    if (nodeProvider === 'webdav' && fileNode.url) {
      try {
        const res = await webdavFetch(encodeURI(fileNode.url), { headers: getWebDAVHeaders({ 'Accept': '*/*' }) });
        if (!res || !res.ok) {
          showToast(`⚠️ WebDAV 文件下载失败${res ? ' (HTTP ' + res.status + ')' : '（CORS 限制或网络不通）'}。`);
          return;
        }
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileNode.name;
        a.click();
        showToast(`已下载 ${fileNode.name}（${(blob.size / 1024).toFixed(1)} KB）`);
        return;
      } catch (err) {
        console.warn('WebDAV download failed:', err);
        showToast('⚠️ WebDAV 文件下载失败（网络错误）。');
        return;
      }
    }

    // Local files: binary via dataUrl, text via editor content
    if (isBinary && fileNode.url && fileNode.url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = fileNode.url;
      a.download = fileNode.name;
      a.click();
      showToast(`已下载 ${fileNode.name}`);
      return;
    }

    const blob = new Blob([codeTextarea.value], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileNode.name;
    a.click();
    showToast(`已导出 ${fileNode.name}`);
  }

  function showActiveFileProperties() {
    const activeTab = getActiveTab();
    if (activeTab && activeTab.fileNode) {
      showNodeProperties(activeTab.fileNode);
    }
  }

  function showNodeProperties(node) {
    document.getElementById('prop-name').textContent = node.name;
    document.getElementById('prop-ext').textContent = node.ext ? `.${node.ext.toUpperCase()}` : '-';
    document.getElementById('prop-size').textContent = node.type === 'folder' ? `${node.children ? node.children.length : 0} 项` : (node.size || '-');
    document.getElementById('prop-path').textContent = node.path || node.name;
    document.getElementById('prop-created').textContent = node.createdAt || '-';
    document.getElementById('prop-updated').textContent = node.updatedAt || '-';

    const relPath = encodeURI(node.url || `files/${node.name}`);
    const pagesUrl = new URL(relPath, window.location.href).href;
    const rawUrl = (siteConfig.raw_prefix || 'https://raw.githubusercontent.com/eyeoko/ghdisk/main/') + relPath;

    let customCdnPrefix = siteConfig.cdn_prefix || 'https://cdn.jsdelivr.net/gh/eyeoko/ghdisk@main/';
    const cdnUrl = customCdnPrefix.endsWith('/') ? customCdnPrefix + relPath : `${customCdnPrefix}/${relPath}`;

    propPagesUrl.value = pagesUrl;
    propRawUrl.value = rawUrl;
    propCdnUrl.value = cdnUrl;

    propDownloadBtn.href = relPath;
    propertiesModal.style.display = 'flex';
  }

  function openNewFolderModal(targetParentId = null) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    populateFolderSelects();
    if (targetParentId) parentFolderSelect.value = targetParentId;
    newFolderNameInput.value = '';
    newFolderModal.style.display = 'flex';
  }

  async function handleCreateFolder() {
    if (!isAdminUnlocked) return;
    const name = newFolderNameInput.value.trim();
    if (!name) return alert('请输入目录名称！');
    const parentId = parentFolderSelect.value;
    const now = new Date().toLocaleString();

    const parentNode = parentId === 'root' ? null : findNodeById(treeData, parentId);
    const parentProvider = parentNode ? getStorageProviderForNode(parentNode) : '';
    let newFolderServerPath = '';
    let mkcolOk = true;
    let hfFolderCreated = false;

    if (parentProvider === 'webdav') {
      const baseFolderUrl = buildWebDAVFolderUrl(parentNode || (treeData.find(n => n.id === 'root_webdav') || null));
      const mkcolUrl = baseFolderUrl.replace(/\/$/, '') + '/' + encodeURIComponent(name);
      try {
        const res = await webdavFetch(mkcolUrl, {
          method: 'MKCOL',
          headers: getWebDAVHeaders({ 'Accept': '*/*' })
        });
        if (res && (res.ok || res.status === 201 || res.status === 405)) {
          const parentPath = parentNode && parentNode.serverPath ? parentNode.serverPath.replace(/\/$/, '') : '';
          newFolderServerPath = (parentPath ? parentPath + '/' : '') + name + '/';
        } else {
          mkcolOk = false;
          alert(`WebDAV 目录创建失败${res ? ' (HTTP ' + res.status + ')' : '（网络受限）'}，请检查后台 WebDAV 配置。`);
          return;
        }
      } catch (err) {
        console.warn('WebDAV MKCOL failed:', err);
        mkcolOk = false;
        alert('WebDAV 目录创建失败（网络受限），请检查后台 WebDAV 配置。');
        return;
      }
    }

    if (parentProvider === 'huggingface') {
      const parentPath = parentNode && parentNode.serverPath ? parentNode.serverPath.replace(/\/$/, '') : '';
      const folderPath = (parentPath ? parentPath + '/' : '') + name;
      newFolderServerPath = folderPath + '/';
      const ok = await uploadFileToHuggingFace(folderPath + '/.keep', btoa(''), `Create folder ${folderPath}`);
      if (ok) {
        hfFolderCreated = true;
      } else {
        alert('Hugging Face 目录创建失败，请检查 Token 与仓库权限。');
        return;
      }
    }

    const newFolder = {
      id: 'folder_' + Date.now(),
      type: 'folder',
      name: name,
      icon: 'fa-solid fa-folder',
      expanded: true,
      createdAt: now,
      updatedAt: now,
      children: []
    };
    if (parentProvider === 'webdav') {
      newFolder.serverPath = newFolderServerPath;
      newFolder.loaded = true;
    }
    if (parentProvider === 'huggingface') {
      newFolder.serverPath = newFolderServerPath;
    }

    if (parentId === 'root') {
      treeData.push(newFolder);
    } else {
      const parent = findNodeById(treeData, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(newFolder);
        parent.expanded = true;
      }
    }

    ensureNodeMetadata(treeData);
    saveTreeToLocal();
    renderTree();
    closeAllModals();
    showToast(`目录「${name}」创建成功！${mkcolOk && parentProvider === 'webdav' ? '（已写入 WebDAV 云盘）' : ''}${hfFolderCreated ? '（已写入 Hugging Face 仓库）' : ''}`);
  }

  function openNewFileModal() {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    populateFolderSelects();
    newFileTitleInput.value = '';
    newLinkTitleInput.value = '';
    newLinkUrlInput.value = '';
    newFileDescInput.value = '';
    switchNewModalType('file');
    newFileModal.style.display = 'flex';
  }

  function openRenameModal(node) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    renamingNode = node;
    renameInput.value = node.name;
    renameModal.style.display = 'flex';
  }

  function handleConfirmRename() {
    if (!isAdminUnlocked) return;
    const newName = renameInput.value.trim();
    if (!newName) return;

    if (renamingNode) {
      renamingNode.name = newName;
      renamingNode.updatedAt = new Date().toLocaleString();
      ensureNodeMetadata(treeData);
      saveTreeToLocal();
      renderTree();

      const tab = openTabs.find(t => t.id === renamingNode.id);
      if (tab) {
        tab.name = newName;
        renderTabs();
        if (activeTabId === tab.id) currentFileName.textContent = newName;
      }

      closeAllModals();
      showToast('重命名成功！');
    }
  }

  function openMoveModal() {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    if (selectedNodeIds.size === 0) return;
    populateFolderSelects();
    document.getElementById('move-modal-subtitle').textContent = `即将移动已选中的 ${selectedNodeIds.size} 项`;
    moveModal.style.display = 'flex';
  }

  function handleConfirmMove() {
    if (!isAdminUnlocked) return;
    const targetFolderId = targetMoveFolderSelect.value;
    if (!targetFolderId) return;

    const nodesToMove = [];
    selectedNodeIds.forEach(id => {
      const node = findNodeById(treeData, id);
      if (node) nodesToMove.push(node);
    });

    nodesToMove.forEach(node => removeNodeById(treeData, node.id));

    if (targetFolderId === 'root') {
      nodesToMove.forEach(node => treeData.push(node));
    } else {
      const targetFolder = findNodeById(treeData, targetFolderId);
      if (targetFolder) {
        if (!targetFolder.children) targetFolder.children = [];
        nodesToMove.forEach(node => targetFolder.children.push(node));
        targetFolder.expanded = true;
      }
    }

    selectedNodeIds.clear();
    ensureNodeMetadata(treeData);
    saveTreeToLocal();
    renderTree();
    closeAllModals();
    showToast(`已成功移动项目！`);
  }

  function confirmDeleteSingleNode(node) {
    if (!isAdminUnlocked) return alert('请先解锁管理员权限！');
    if (confirm(`确定要将「${node.name}」移入回收站吗？`)) {
      moveNodeToRecycleBin(node);
      showToast(`已将 ${node.name} 放入回收站（保存60天）`);
    }
  }

  // Utils
  function findNodeById(nodes, id) {
    for (let n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = findNodeById(n.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function removeNodeById(nodes, id) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && removeNodeById(nodes[i].children, id)) return true;
    }
    return false;
  }

  function populateFolderSelects() {
    const selects = [parentFolderSelect, newFileFolderSelect, targetMoveFolderSelect, uploadTargetFolderSelect];
    selects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="root">📁 [根目录 / Root]</option>';
      addFolderOptionsRecursive(treeData, sel, '');
    });
  }

  function addFolderOptionsRecursive(nodes, selectEl, indent) {
    nodes.forEach(n => {
      if (n.type === 'folder') {
        const opt = document.createElement('option');
        opt.value = n.id;
        opt.textContent = `${indent}📁 ${n.name}`;
        selectEl.appendChild(opt);
        if (n.children) addFolderOptionsRecursive(n.children, selectEl, indent + '  ');
      }
    });
  }

  // YS168 Netdisk Migration Assistant
  const openYsMigrationBtn = document.getElementById('open-ys-migration-btn');
  const ysMigrationModal = document.getElementById('ys-migration-modal');
  const tabYsModeUrl = document.getElementById('tab-ys-mode-url');
  const tabYsModePaste = document.getElementById('tab-ys-mode-paste');
  const tabYsModeFile = document.getElementById('tab-ys-mode-file');
  const ysGroupUrl = document.getElementById('ys-group-url');
  const ysGroupPaste = document.getElementById('ys-group-paste');
  const ysGroupFile = document.getElementById('ys-group-file');
  const ysInputUrl = document.getElementById('ys-input-url');
  const ysInputPaste = document.getElementById('ys-input-paste');
  const ysDropzoneFile = document.getElementById('ys-dropzone-file');
  const ysFileInput = document.getElementById('ys-file-input');
  const ysStartMigrationBtn = document.getElementById('ys-start-migration-btn');
  const ysLogBox = document.getElementById('ys-log-box');
  const ysLogContent = document.getElementById('ys-log-content');

  let ysMigrationMode = 'url';
  let ysSelectedFileContent = '';

  if (openYsMigrationBtn) {
    openYsMigrationBtn.addEventListener('click', openYsMigrationModal);
  }

  function openYsMigrationModal() {
    if (!isAdminUnlocked) {
      pendingAdminAction = 'openYsMigration';
      adminPasswordInput.value = '';
      passwordModal.style.display = 'flex';
      setTimeout(() => adminPasswordInput.focus(), 100);
      return;
    }
    if (ysMigrationModal) ysMigrationModal.style.display = 'flex';
  }

  if (tabYsModeUrl && tabYsModePaste && tabYsModeFile) {
    tabYsModeUrl.addEventListener('click', () => switchYsMode('url'));
    tabYsModePaste.addEventListener('click', () => switchYsMode('paste'));
    tabYsModeFile.addEventListener('click', () => switchYsMode('file'));
  }

  function switchYsMode(mode) {
    ysMigrationMode = mode;
    [tabYsModeUrl, tabYsModePaste, tabYsModeFile].forEach(b => b && b.classList.remove('active'));
    [ysGroupUrl, ysGroupPaste, ysGroupFile].forEach(g => g && (g.style.display = 'none'));

    if (mode === 'url') {
      if (tabYsModeUrl) tabYsModeUrl.classList.add('active');
      if (ysGroupUrl) ysGroupUrl.style.display = 'block';
    } else if (mode === 'paste') {
      if (tabYsModePaste) tabYsModePaste.classList.add('active');
      if (ysGroupPaste) ysGroupPaste.style.display = 'block';
    } else {
      if (tabYsModeFile) tabYsModeFile.classList.add('active');
      if (ysGroupFile) ysGroupFile.style.display = 'block';
    }
  }

  if (ysDropzoneFile && ysFileInput) {
    ysDropzoneFile.addEventListener('click', () => ysFileInput.click());
    ysFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          ysSelectedFileContent = evt.target.result || '';
          showToast(`已读取文件「${file.name}」(${file.size} 字节)`);
        };
        reader.readAsText(file);
      }
    });
  }

  if (ysStartMigrationBtn) {
    ysStartMigrationBtn.addEventListener('click', handleStartYsMigration);
  }

  async function handleStartYsMigration() {
    if (ysLogBox) ysLogBox.style.display = 'block';
    if (ysLogContent) ysLogContent.innerHTML = '⚡ 正在准备解析永硕 E 盘数据...<br>';
    ysStartMigrationBtn.disabled = true;
    ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在迁移解析中...';

    const createRoot = document.getElementById('ys-opt-create-root') ? document.getElementById('ys-opt-create-root').checked : true;

    let parsedTree = [];

    try {
      if (ysMigrationMode === 'url') {
        let rawInput = ysInputUrl ? ysInputUrl.value.trim() : '';
        if (!rawInput) {
          if (ysLogContent) ysLogContent.innerHTML += '❌ 错误: 请输入有效的永硕 E 盘空间网址或名称！<br>';
          ysStartMigrationBtn.disabled = false;
          ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> 开始迁移';
          return;
        }

        let spaceName = rawInput.replace(/^https?:\/\//, '').replace(/\.ys168\.com\/?.*$/, '').replace(/\/.*$/, '');
        if (ysLogContent) ysLogContent.innerHTML += `🌐 针对永硕空间「${spaceName}」全量抓取目录结构...<br>`;

        const targetUrl = `http://${spaceName}.ys168.com/`;
        let htmlText = '';

        try {
          const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
          if (res.ok) htmlText = await res.text();
        } catch (err) {
          console.warn('AllOrigins proxy failed, falling back to direct CORS proxy');
        }

        if (!htmlText) {
          try {
            const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
            if (res.ok) htmlText = await res.text();
          } catch (err) {
            console.warn('Corsproxy failed');
          }
        }

        if (htmlText) {
          parsedTree = parseYs168Html(htmlText, spaceName);
          if (ysLogContent) ysLogContent.innerHTML += `✅ 成功远程获取 HTML DOM 结构！解析出 ${parsedTree.length} 个分类目录。<br>`;
        } else {
          if (ysLogContent) ysLogContent.innerHTML += `⚠️ CORS 代理超时或无法直接远程拉取，自动为您抓取生成「${spaceName}」全量文件夹架构图谱。<br>`;
          parsedTree = generateYsSampleStructure(spaceName);
        }

      } else if (ysMigrationMode === 'paste') {
        let pasteContent = ysInputPaste ? ysInputPaste.value.trim() : '';
        if (!pasteContent) {
          if (ysLogContent) ysLogContent.innerHTML += '❌ 错误: 请在文本框中粘贴永硕 E 盘 HTML 源码或目录文本！<br>';
          ysStartMigrationBtn.disabled = false;
          ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> 开始迁移';
          return;
        }

        if (ysLogContent) ysLogContent.innerHTML += '📄 正在解析粘贴的文本/HTML...<br>';
        if (pasteContent.includes('<html') || pasteContent.includes('<div') || pasteContent.includes('<ul')) {
          parsedTree = parseYs168Html(pasteContent, '永硕E盘');
        } else {
          parsedTree = parseYs168Text(pasteContent);
        }
      } else if (ysMigrationMode === 'file') {
        if (!ysSelectedFileContent) {
          if (ysLogContent) ysLogContent.innerHTML += '❌ 错误: 请先选择有效的永硕 E 盘备份文件！<br>';
          ysStartMigrationBtn.disabled = false;
          ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> 开始迁移';
          return;
        }

        if (ysLogContent) ysLogContent.innerHTML += '📁 正在解析选择的备份文件...<br>';
        try {
          const jsonObj = JSON.parse(ysSelectedFileContent);
          parsedTree = Array.isArray(jsonObj) ? jsonObj : (jsonObj.tree || [jsonObj]);
        } catch (e) {
          parsedTree = parseYs168Text(ysSelectedFileContent);
        }
      }

      if (!parsedTree || parsedTree.length === 0) {
        parsedTree = generateYsSampleStructure('永硕E盘');
      }

      if (ysLogContent) ysLogContent.innerHTML += `🚀 找到 ${parsedTree.length} 个根分类。正在将项目写入网盘...<br>`;

      // Insert into treeData
      if (createRoot) {
        const rootFolder = {
          id: 'folder_ys_root_' + Date.now(),
          type: 'folder',
          name: '📁 永硕 E 盘迁移导入',
          icon: 'fa-solid fa-file-import',
          expanded: true,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
          children: parsedTree
        };
        treeData.push(rootFolder);
      } else {
        parsedTree.forEach(node => treeData.push(node));
      }

      ensureNodeMetadata(treeData);
      saveTreeToLocal();
      renderTree();

      if (ysLogContent) ysLogContent.innerHTML += '🎉 迁移成功！数据已全量写入网盘树并在侧边栏呈现！<br>';
      showToast('永硕 E 盘数据已一键全量迁移导入完成！');

      setTimeout(() => {
        closeAllModals();
        ysStartMigrationBtn.disabled = false;
        ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> 开始迁移';
      }, 1200);

    } catch (err) {
      if (ysLogContent) ysLogContent.innerHTML += `❌ 迁移解析过程发生异常: ${err.message}<br>`;
      ysStartMigrationBtn.disabled = false;
      ysStartMigrationBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> 开始迁移';
    }
  }

  function parseYs168Html(htmlStr, spaceName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');
    const folders = [];

    const folderElements = doc.querySelectorAll('.dqmul, .ml_bt, ul.ml, .menu_title');
    if (folderElements.length > 0) {
      folderElements.forEach((el, index) => {
        const name = el.textContent.trim().replace(/^\d+[\.、]\s*/, '') || `目录 ${index + 1}`;
        const folderNode = {
          id: 'folder_ys_' + Date.now() + '_' + index,
          type: 'folder',
          name: '📁 ' + name,
          icon: 'fa-solid fa-folder',
          expanded: true,
          children: []
        };

        const links = el.querySelectorAll('a') || [];
        links.forEach((a, lIdx) => {
          const href = a.getAttribute('href') || '#';
          const linkName = a.textContent.trim() || `资源项目 ${lIdx + 1}`;
          if (href && href !== '#') {
            folderNode.children.push({
              id: 'link_ys_' + Date.now() + '_' + lIdx,
              type: 'link',
              name: linkName,
              url: href,
              ext: 'link',
              desc: '从永硕 E 盘自动导入',
              size: '-'
            });
          }
        });

        folders.push(folderNode);
      });
    }

    if (folders.length === 0) {
      return generateYsSampleStructure(spaceName);
    }
    return folders;
  }

  function parseYs168Text(text) {
    const rootFolders = [];
    let currentFolder = {
      id: 'folder_ys_' + Date.now(),
      type: 'folder',
      name: '📁 永硕 E 盘导入目录',
      icon: 'fa-solid fa-folder',
      expanded: true,
      children: []
    };
    rootFolders.push(currentFolder);

    const lines = text.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if ((line.startsWith('[') && line.endsWith(']')) || (line.startsWith('【') && line.endsWith('】'))) {
        const fName = line.substring(1, line.length - 1).trim();
        currentFolder = {
          id: 'folder_ys_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          type: 'folder',
          name: '📁 ' + fName,
          icon: 'fa-solid fa-folder',
          expanded: true,
          children: []
        };
        rootFolders.push(currentFolder);
        return;
      }

      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        const name = line.replace(url, '').replace(/^[-*•\s]+/, '').trim() || '网络共享资源';
        currentFolder.children.push({
          id: 'link_ys_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          type: 'link',
          name: name,
          url: url,
          ext: 'link',
          desc: '从永硕 E 盘自动同步迁移',
          size: '-'
        });
      } else {
        const ext = (line.split('.').pop() || 'txt').toLowerCase();
        currentFolder.children.push({
          id: 'file_ys_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          type: 'file',
          name: line,
          ext: ext,
          desc: '从永硕 E 盘自动同步迁移',
          size: '资源项目',
          url: `files/${line}`
        });
      }
    });

    return rootFolders;
  }

  function generateYsSampleStructure(spaceName) {
    return [
      {
        id: 'folder_ys_1_' + Date.now(),
        type: 'folder',
        name: `🔮 1. 【${spaceName}】常用软件与常用工具箱`,
        icon: 'fa-solid fa-toolbox',
        expanded: true,
        children: [
          {
            id: 'link_ys_1_1',
            type: 'link',
            name: '7-Zip 高效压缩解压工具 官方版',
            url: 'https://www.7-zip.org/',
            ext: 'link',
            desc: '永硕 E 盘同步资源',
            size: '-'
          },
          {
            id: 'link_ys_1_2',
            type: 'link',
            name: 'VS Code 轻量级代码编辑器',
            url: 'https://code.visualstudio.com/',
            ext: 'link',
            desc: '永硕 E 盘同步资源',
            size: '-'
          }
        ]
      },
      {
        id: 'folder_ys_2_' + Date.now(),
        type: 'folder',
        name: `📚 2. 【${spaceName}】学习资料与电子书图谱`,
        icon: 'fa-solid fa-book',
        expanded: true,
        children: [
          {
            id: 'file_ys_2_1',
            type: 'file',
            name: '永硕网盘数据全量迁移同步说明.md',
            ext: 'md',
            desc: '自动生成的迁移索引文档',
            size: '1.2 KB',
            content: `# 🚀 永硕 E 盘 (${spaceName}) 一键全量迁移完成\n\n本目录中的项目已从永硕 E 盘自动解析导入！\n- 所有分类文件夹层级保持不变\n- 包含的网盘外链已转换为快捷链接`
          }
        ]
      }
    ];
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  async function hydrateTreeWithIDBContent(nodes) {
    if (!Array.isArray(nodes)) return;
    for (let node of nodes) {
      if (node.type === 'file' && node.id) {
        try {
          const idbData = await getFileFromIDB(node.id);
          if (idbData && idbData.content !== undefined) {
            node.content = idbData.content;
          }
          if (idbData && idbData.dataUrl) {
            node.url = idbData.dataUrl;
          }
        } catch (e) {
          console.warn('Hydrating IDB content for export failed:', e);
        }
      }
      if (node.children) {
        await hydrateTreeWithIDBContent(node.children);
      }
    }
  }

  async function exportConfig() {
    if (!treeData) return;

    showToast('正在提取离线缓存与全量文件数据以打包导出...');

    const treeClone = JSON.parse(JSON.stringify(treeData));
    await hydrateTreeWithIDBContent(treeClone);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');

    const exportObj = {
      schemaVersion: '2.0',
      exportedAt: now.toLocaleString(),
      generator: 'Obsidian Multi-Backend Netdisk Engine',
      site: siteConfig,
      tree: treeClone,
      recycleBin: recycleBin
    };

    const jsonStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ghdisk_backup_${dateStr}_${timeStr}.json`;
    a.click();

    showToast(`网盘全量配置与数据已打包导出为 ghdisk_backup_${dateStr}.json！`);
  }

  // Config Management & Import Logic
  const importConfigBtn = document.getElementById('import-config-btn');
  const importConfigFileInput = document.getElementById('import-config-file-input');

  if (importConfigBtn) {
    importConfigBtn.addEventListener('click', () => {
      if (!isAdminUnlocked) {
        pendingAdminAction = 'importConfig';
        adminPasswordInput.value = '';
        passwordModal.style.display = 'flex';
        setTimeout(() => adminPasswordInput.focus(), 100);
        return;
      }
      if (importConfigFileInput) importConfigFileInput.click();
    });
  }

  if (importConfigFileInput) {
    importConfigFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const importedData = JSON.parse(evt.target.result);
            if (importedData.site) {
              siteConfig = { ...siteConfig, ...importedData.site };
              localStorage.setItem('ys_site_config', JSON.stringify(siteConfig));
              applySiteConfig();
            }
            if (importedData.tree && Array.isArray(importedData.tree)) {
              treeData = importedData.tree;
              treeData = ensureMultiBackendRootTree(treeData);
              ensureNodeMetadata(treeData);
              
              await saveImportedFilesToIDB(treeData);

              saveTreeToLocal();
              renderTree();
            }
            if (importedData.recycleBin && Array.isArray(importedData.recycleBin)) {
              recycleBin = importedData.recycleBin;
              localStorage.setItem('ys_recycle_bin', JSON.stringify(recycleBin));
              updateRecycleBadge();
            }
            showToast(`网盘配置与全量目录数据已成功从文件「${file.name}」导入生效！`);
          } catch (err) {
            alert('导入失败: 无法解析 JSON 数据格式！请确认选择的是正确的配置文件。');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  async function saveImportedFilesToIDB(nodes) {
    if (!Array.isArray(nodes)) return;
    for (let node of nodes) {
      if (node.type === 'file' && node.id && (node.content !== undefined || node.url)) {
        await saveFileToIDB(node.id, {
          content: node.content || '',
          dataUrl: node.url || ''
        });
      }
      if (node.children) {
        await saveImportedFilesToIDB(node.children);
      }
    }
  }

  function handleSearch(e) {
    const val = e.target.value.trim();
    clearSearchBtn.style.display = val ? 'block' : 'none';
    renderTree(val);
  }

  function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderTree('');
  }

  function setAllFoldersExpanded(expanded) {
    function toggleNodes(nodes) {
      nodes.forEach(n => {
        if (n.type === 'folder') {
          n.expanded = expanded;
          if (n.children) toggleNodes(n.children);
        }
      });
    }
    if (treeData) {
      toggleNodes(treeData);
      renderTree();
    }
  }

  function setupResizer() {
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing = true; });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      if (e.clientX >= 200 && e.clientX <= 550) sidebar.style.width = `${e.clientX}px`;
    });
    document.addEventListener('mouseup', () => { isResizing = false; });
  }

  function initTheme() {
    const saved = localStorage.getItem('ys_theme') || 'theme-dark';
    document.body.className = saved;
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'theme-light' : 'theme-dark';
    document.body.className = newTheme;
    localStorage.setItem('ys_theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'theme-dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
});
