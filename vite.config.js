import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // 當部署到GitHub Pages時取消下面這行的註釋，並將YOUR_REPO_NAME替換為您的倉庫名稱
  base: '/您的儲存庫名稱/' // <-- 這裡要改成您的儲存庫名稱
})