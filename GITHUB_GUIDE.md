# GitHub 發布指南

本文檔提供了將土雞飼養管理系統發布到 GitHub 的詳細步驟指南。

## 前置準備

1. **安裝 Git**
   - 如果尚未安裝 Git，請從[官方網站](https://git-scm.com/downloads)下載並安裝
   - 安裝後，設置您的用戶名和電子郵件：
     ```bash
     git config --global user.name "您的名字"
     git config --global user.email "您的電子郵件"
     ```

2. **創建 GitHub 帳戶**
   - 如果您還沒有 GitHub 帳戶，請在 [GitHub](https://github.com/) 註冊一個

## 詳細步驟

### 1. 初始化 Git 倉庫

1. 打開命令提示符或 PowerShell
2. 導航到專案根目錄：
   ```bash
   cd "d:\Ai 軟體開發\ChickenFarmMVP"
   ```
3. 初始化 Git 倉庫：
   ```bash
   git init
   ```
   ![Git Init](https://i.imgur.com/JGfJWZs.png)

### 2. 添加文件到暫存區

```bash
git add .
```

這個命令會將所有文件添加到 Git 的暫存區，但會自動排除 `.gitignore` 文件中指定的項目（如 node_modules 目錄）。

### 3. 提交變更

```bash
git commit -m "初始提交：土雞飼養管理系統"
```

### 4. 在 GitHub 上創建新倉庫

1. 登入您的 GitHub 帳戶
2. 點擊右上角的 "+" 圖標，選擇 "New repository"
   ![New Repo](https://i.imgur.com/hXejQ1s.png)
3. 填寫倉庫信息：
   - 倉庫名稱：`ChickenFarmMVP`
   - 描述：`土雞飼養管理系統`
   - 可見性：選擇 Public（公開）或 Private（私有）
   - 不要勾選 "Initialize this repository with a README"
4. 點擊 "Create repository" 按鈕
   ![Create Repo](https://i.imgur.com/UEk5rZl.png)

### 5. 連接本地倉庫與 GitHub 倉庫

創建倉庫後，GitHub 會顯示命令指引。複製並執行以下命令（替換 YOUR_USERNAME 為您的 GitHub 用戶名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/ChickenFarmMVP.git
```

### 6. 推送代碼到 GitHub

```bash
git push -u origin master
```

如果您的默認分支是 `main` 而不是 `master`，請使用：

```bash
git push -u origin main
```

系統會要求您輸入 GitHub 的用戶名和密碼。如果您啟用了雙重認證，則需要使用個人訪問令牌 (Personal Access Token) 而不是密碼。

### 7. 創建個人訪問令牌（如需要）

如果您啟用了雙重認證，請按照以下步驟創建個人訪問令牌：

1. 在 GitHub 中，點擊您的頭像 → Settings → Developer settings → Personal access tokens → Generate new token
2. 給令牌一個描述性名稱
3. 選擇令牌的有效期
4. 勾選 `repo` 範圍的所有權限
5. 點擊 "Generate token"
6. 複製生成的令牌（重要：這是您唯一能看到令牌的機會）
7. 當 Git 提示輸入密碼時，使用此令牌

### 8. 驗證發布

訪問 `https://github.com/YOUR_USERNAME/ChickenFarmMVP` 確認您的代碼已成功上傳。

## 部署到 GitHub Pages（可選）

如果您想讓您的應用可以通過網頁訪問，可以部署到 GitHub Pages：

### 1. 安裝 gh-pages 包

```bash
npm install --save-dev gh-pages
```

### 2. 修改 package.json

在 package.json 文件中添加以下內容：

```json
{
  "name": "chicken-farm-mvp",
  "private": true,
  "version": "0.1.0",
  "homepage": "https://YOUR_USERNAME.github.io/ChickenFarmMVP",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  // 其他配置...
}
```

### 3. 修改 vite.config.js

確保 vite.config.js 文件包含正確的 base 路徑：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/ChickenFarmMVP/',
  // 其他配置...
});
```

### 4. 部署

```bash
npm run deploy
```

### 5. 設置 GitHub Pages

1. 在您的 GitHub 倉庫中，點擊 "Settings" 標籤
2. 在左側導航欄中，點擊 "Pages"
3. 在 "Source" 部分，選擇 "gh-pages" 分支
4. 點擊 "Save"
5. 等待幾分鐘，您的網站將在 `https://YOUR_USERNAME.github.io/ChickenFarmMVP` 上線

## 常見問題解決

### 推送失敗

如果推送時出現錯誤，可能是因為：

1. **認證問題**：確保使用正確的用戶名和密碼或個人訪問令牌
2. **遠程倉庫 URL 錯誤**：檢查遠程倉庫 URL
   ```bash
   git remote -v
   ```
   如果 URL 不正確，可以重新設置：
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/ChickenFarmMVP.git
   ```

### 合併衝突

如果您在推送時遇到合併衝突，可以嘗試：

```bash
git pull --rebase origin main
```

然後解決衝突後再次推送。

## 後續更新

完成初始推送後，您可以使用以下工作流程進行後續更新：

1. 進行代碼修改
2. 添加修改到暫存區：`git add .`
3. 提交修改：`git commit -m "更新說明"`
4. 推送到 GitHub：`git push`

## 結語

恭喜！您已成功將土雞飼養管理系統發布到 GitHub。現在您可以與他人分享您的代碼，或者繼續開發並推送更新。