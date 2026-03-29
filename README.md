# 📋 AI Task Manager

リアルタイムタスク管理アプリケーション with AI アドバイス機能

## 🚀 機能

- ✅ ユーザー認証（Firebase）
- ✅ リアルタイムタスク同期（Firestore）
- ✅ AI タスク分析（Groq API）
- ✅ タスク優先度管理
- ✅ 期限管理

## 🛠️ 技術スタック

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Auth + Firestore)
- **AI**: Groq AI API
- **Deployment**: Vercel

## 📦 インストール

```bash
git clone https://github.com/YOUR_USERNAME/ai-task-manager.git
cd ai-task-manager
npm install
```

## 🔑 環境変数

`.env.local` ファイルを作成：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_key
```

## 🚀 開発

```bash
npm run dev
```

http://localhost:5173 でアクセス

## 🌐 デプロイ

https://ai-task-manager-steel-iota.vercel.app/

## 👤 テストアカウント

```
メール: test@example.com
パスワード: test123
```

## 📄 ライセンス

MIT
