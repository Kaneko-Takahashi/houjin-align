# デプロイ手順書

このドキュメントは、Houjin Align を Vercel（フロントエンド）と Render（バックエンド）にデプロイする手順を説明します。

## 前提条件

- GitHubアカウント（既にリポジトリが作成されていること）
- Vercelアカウント（無料）
- Renderアカウント（無料）
- 国税庁法人番号 Web-API のアプリケーションID

## デプロイの流れ

1. **バックエンド（Render）を先にデプロイ** → URLを確定
2. **フロントエンド（Vercel）をデプロイ** → バックエンドのURLを環境変数に設定

## ステップ1: Renderでバックエンドをデプロイ

### 1.1 Renderアカウントの作成

1. https://render.com にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでサインアップ（推奨）

### 1.2 新しいWebサービスを作成

1. Renderのダッシュボードで「New +」→「Web Service」をクリック
2. 「Connect GitHub」をクリックして、`houjin-align` リポジトリを接続
3. リポジトリを選択

### 1.3 サービス設定

以下の設定を行います：

- **Name**: `houjin-align-api`（任意）
- **Region**: `Singapore` または `Oregon`（日本に近い地域を選択）
- **Branch**: `master`
- **Root Directory**: `api`（重要！）
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 1.4 環境変数の設定

Renderのダッシュボードで「Environment」セクションに以下を設定：

```
HOUJIN_APP_ID=あなたのアプリケーションID
HOUJIN_API_REQUEST_INTERVAL=1.0
HOUJIN_API_MAX_RETRIES=3
HOUJIN_API_RETRY_DELAY=2.0
ALLOWED_ORIGINS=http://localhost:3000
```

**注意**: `ALLOWED_ORIGINS` は後でVercelのURLに更新します。

### 1.5 デプロイの開始

1. 「Create Web Service」をクリック
2. デプロイが完了するまで待機（5-10分程度）
3. デプロイ完了後、URLを確認（例: `https://houjin-align-api.onrender.com`）

### 1.6 動作確認

ブラウザで `https://houjin-align-api.onrender.com/health` にアクセスして、`{"status":"ok"}` が返ってくることを確認

## ステップ2: Vercelでフロントエンドをデプロイ

### 2.1 Vercelアカウントの作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでサインアップ（推奨）

### 2.2 プロジェクトのインポート

1. Vercelのダッシュボードで「Add New...」→「Project」をクリック
2. `houjin-align` リポジトリを選択
3. 「Import」をクリック

### 2.3 プロジェクト設定

以下の設定を確認・変更：

- **Framework Preset**: `Next.js`（自動検出される）
- **Root Directory**: `front`（重要！）
- **Build Command**: `yarn build`（自動設定される）
- **Output Directory**: `.next`（自動設定される）

### 2.4 環境変数の設定

「Environment Variables」セクションで以下を設定：

```
NEXT_PUBLIC_API_BASE_URL=https://houjin-align-api.onrender.com
```

**重要**: Renderで取得したバックエンドのURLを設定してください。

### 2.5 デプロイの開始

1. 「Deploy」をクリック
2. デプロイが完了するまで待機（2-5分程度）
3. デプロイ完了後、URLを確認（例: `https://houjin-align.vercel.app`）

### 2.6 バックエンドのCORS設定を更新

1. Renderのダッシュボードに戻る
2. 環境変数 `ALLOWED_ORIGINS` を更新：
   ```
   ALLOWED_ORIGINS=http://localhost:3000,https://houjin-align.vercel.app
   ```
3. Renderサービスを再デプロイ（自動的に再デプロイされる場合もあります）

## ステップ3: 動作確認

### 3.1 フロントエンドの確認

1. VercelのURL（例: `https://houjin-align.vercel.app`）にアクセス
2. アプリケーションが正常に表示されることを確認

### 3.2 バックエンド連携の確認

1. フロントエンドでCSVファイルをアップロード
2. バックエンドAPIが正常に動作することを確認
3. ブラウザの開発者ツール（F12）でエラーがないか確認

### 3.3 国税庁API連携の確認

1. アプリケーションIDが正しく設定されているか確認
2. 法人番号の照合が正常に動作するか確認

## トラブルシューティング

### バックエンドに接続できない

- Vercelの環境変数 `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか確認
- Renderのサービスが起動しているか確認（無料プランは15分間非アクティブでスリープします）

### CORSエラーが発生する

- Renderの環境変数 `ALLOWED_ORIGINS` にVercelのURLが含まれているか確認
- カンマ区切りで複数のURLを設定可能です

### ビルドエラーが発生する

- ログを確認して、依存パッケージが正しくインストールされているか確認
- `requirements.txt` と `package.json` が正しく配置されているか確認

## 注意事項

### Renderの無料プラン

- 15分間非アクティブでスリープします
- 初回リクエスト時に30-60秒の起動時間が必要です
- クライアントに見せる際は「初回アクセス時に少し時間がかかる場合があります」と説明してください

### Vercelの無料プラン

- ほぼ常時起動に近い動作
- 月間100GBの帯域幅制限
- サーバーレス関数の実行時間制限あり

## カスタムドメインの設定（オプション）

### Vercel

1. プロジェクト設定 →「Domains」
2. ドメイン名を入力
3. DNS設定を確認

### Render

1. サービス設定 →「Custom Domains」
2. ドメイン名を入力
3. DNS設定を確認

## 参考リンク

- [Render ドキュメント](https://render.com/docs)
- [Vercel ドキュメント](https://vercel.com/docs)
- [Next.js デプロイガイド](https://nextjs.org/docs/deployment)
