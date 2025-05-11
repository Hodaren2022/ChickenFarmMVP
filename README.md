# 土雞飼養管理系統

這是一個用於管理土雞飼養的React應用程式，提供了完整的飼養記錄、雞隻管理、飼料管理、用藥與疫苗接種記錄等功能。

## 功能特色

- 日常飼養記錄
- 雞隻批次管理
- 飼料購買與使用記錄
- 藥品與疫苗接種管理
- 成本統計與分析
- 銷售管理

## 技術架構

- 前端框架：React
- UI庫：Ant Design
- 構建工具：Vite
- 日期處理：Day.js

## 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式運行
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 發布到GitHub步驟

### 1. 初始化Git倉庫

在專案根目錄下打開命令提示符或PowerShell，執行：

```bash
git init
```

### 2. 添加文件到暫存區

```bash
git add .
```

### 3. 提交變更

```bash
git commit -m "初始提交：土雞飼養管理系統"
```

### 4. 在GitHub上創建新倉庫

1. 登入GitHub帳戶
2. 點擊右上角的"+"圖標，選擇"New repository"
3. 填寫倉庫名稱，例如："ChickenFarmMVP"
4. 可以添加描述："土雞飼養管理系統"
5. 選擇倉庫為公開(Public)或私有(Private)
6. 不要勾選"Initialize this repository with a README"
7. 點擊"Create repository"

### 5. 連接本地倉庫與GitHub倉庫

在GitHub創建倉庫後，頁面會顯示命令指引。複製並執行以下命令（替換YOUR_USERNAME為您的GitHub用戶名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/ChickenFarmMVP.git
```

### 6. 推送代碼到GitHub

```bash
git push -u origin master
```
或者如果您使用main作為主分支：
```bash
git push -u origin main
```

### 7. 驗證

訪問您的GitHub倉庫網址確認代碼已成功上傳。

## 部署到GitHub Pages (可選)

如果您想將應用部署到GitHub Pages，可以按照以下步驟操作：

1. 安裝gh-pages包：
```bash
npm install --save-dev gh-pages
```

2. 在package.json中添加以下內容：
```json
"homepage": "https://YOUR_USERNAME.github.io/ChickenFarmMVP",
"scripts": {
  // 其他腳本...
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. 部署到GitHub Pages：
```bash
npm run deploy
```

4. 在GitHub倉庫設置中，將GitHub Pages的來源設置為gh-pages分支。

## 注意事項

- 確保已安裝Git並配置好用戶信息
- 如果使用雙重認證，可能需要使用個人訪問令牌(Personal Access Token)而不是密碼
- .gitignore文件已配置，會自動排除node_modules等不必要的文件