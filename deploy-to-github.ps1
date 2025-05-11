# 土雞飼養管理系統 GitHub 發布腳本
# 使用方法：在PowerShell中運行此腳本

# 顯示歡迎信息
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   土雞飼養管理系統 GitHub 發布腳本   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查是否已安裝Git
try {
    $gitVersion = git --version
    Write-Host "✓ Git已安裝: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未檢測到Git，請先安裝Git: https://git-scm.com/downloads" -ForegroundColor Red
    exit
}

# 詢問GitHub用戶名
$githubUsername = Read-Host "請輸入您的GitHub用戶名"
if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "✗ GitHub用戶名不能為空" -ForegroundColor Red
    exit
}

# 詢問倉庫名稱
$repoName = Read-Host "請輸入倉庫名稱 (默認: ChickenFarmMVP)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "ChickenFarmMVP"
}

# 確認信息
Write-Host ""
Write-Host "即將執行以下操作:" -ForegroundColor Yellow
Write-Host "1. 初始化Git倉庫" -ForegroundColor Yellow
Write-Host "2. 添加所有文件到Git" -ForegroundColor Yellow
Write-Host "3. 提交初始代碼" -ForegroundColor Yellow
Write-Host "4. 添加GitHub遠程倉庫: https://github.com/$githubUsername/$repoName.git" -ForegroundColor Yellow
Write-Host "5. 推送代碼到GitHub" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "是否繼續? (Y/N)"
if ($confirmation -ne "Y" -and $confirmation -ne "y") {
    Write-Host "操作已取消" -ForegroundColor Red
    exit
}

# 執行Git操作
Write-Host ""
Write-Host "開始執行Git操作..." -ForegroundColor Cyan

# 初始化Git倉庫
Write-Host "初始化Git倉庫..." -NoNewline
try {
    git init | Out-Null
    Write-Host "✓ 成功" -ForegroundColor Green
} catch {
    Write-Host "✗ 失敗" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# 添加文件
Write-Host "添加文件到Git..." -NoNewline
try {
    git add . | Out-Null
    Write-Host "✓ 成功" -ForegroundColor Green
} catch {
    Write-Host "✗ 失敗" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# 提交代碼
Write-Host "提交代碼..." -NoNewline
try {
    git commit -m "初始提交：土雞飼養管理系統" | Out-Null
    Write-Host "✓ 成功" -ForegroundColor Green
} catch {
    Write-Host "✗ 失敗" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# 添加遠程倉庫
Write-Host "添加GitHub遠程倉庫..." -NoNewline
try {
    git remote add origin "https://github.com/$githubUsername/$repoName.git" | Out-Null
    Write-Host "✓ 成功" -ForegroundColor Green
} catch {
    Write-Host "✗ 失敗" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# 推送代碼
Write-Host "推送代碼到GitHub (這可能需要您輸入GitHub憑據)..." -ForegroundColor Yellow
try {
    git push -u origin master
    Write-Host "✓ 代碼推送成功" -ForegroundColor Green
} catch {
    Write-Host "嘗試使用main分支..." -ForegroundColor Yellow
    try {
        git push -u origin main
        Write-Host "✓ 代碼推送成功" -ForegroundColor Green
    } catch {
        Write-Host "✗ 推送失敗" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit
    }
}

# 完成信息
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   發布完成!   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "您的代碼已成功推送到GitHub倉庫:" -ForegroundColor Green
Write-Host "https://github.com/$githubUsername/$repoName" -ForegroundColor Green
Write-Host ""
Write-Host "後續步驟:" -ForegroundColor Yellow
Write-Host "1. 訪問上述URL確認代碼已上傳" -ForegroundColor Yellow
Write-Host "2. 如需部署到GitHub Pages，請參考GITHUB_GUIDE.md文件中的說明" -ForegroundColor Yellow
Write-Host ""

Read-Host "按Enter鍵退出"