# Houjin Align（ホウジン・アライン）

法人情報（社名・法人番号）を国税庁の法人番号APIと突き合わせてチェックするWebツールです。

## 概要

外部パートナーから受領した法人情報リスト（CSV/Excel）と、国税庁法人番号 Web-API から取得した正式な法人情報を照合し、整合性をチェックするツールです。確認作業の効率化と正確性の向上を目的としています。

## 技術スタック

- **フロントエンド**: Next.js 14 (React 18, TypeScript)
- **バックエンド**: FastAPI (Python 3)
- **外部API**: 国税庁法人番号 Web-API

## 実装済み機能

### ✅ 基本機能

1. **CSV/Excelファイルのアップロード**
   - CSVファイルのアップロードに対応
   - UTF-8、Shift-JIS（CP932）の文字コードに対応
   - 法人番号、会社名、住所などの情報を読み込み

2. **法人番号の一括照合**
   - アップロードされたレコードを一括で国税庁APIと照合
   - レート制限対策（リクエスト間隔制御）
   - リトライ機能（最大3回）
   - エラーハンドリングとログ出力

3. **照合結果の表示**
   - 照合ステータスをバッジ形式で表示
   - ステータス種類：
     - **一致 (OK)**: 法人番号と名称が一致
     - **要確認 (NEED_CHECK)**: 名称に差異がある
     - **未登録 (NOT_FOUND)**: 法人番号が存在しない
     - **エラー (ERROR)**: 照合処理中にエラーが発生
     - **未照合 (UNCHECKED)**: まだ照合処理が完了していない

4. **CSVダウンロード機能**
   - 照合結果をCSV形式でダウンロード
   - 以下の情報を含む：
     - 行番号
     - 法人番号
     - 名称（入力）
     - 住所（入力）
     - 照合ステータス
     - 名称（国税庁）
     - 住所（国税庁）
   - BOM付きUTF-8でエンコード（Excelで正しく開ける）

## セットアップ

### 前提条件

- Node.js 18以上
- Python 3.10以上
- 国税庁法人番号 Web-API のアプリケーションID（申請が必要）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd houjin-align
```

### 2. フロントエンドのセットアップ

```bash
cd front
yarn install
```

### 3. バックエンドのセットアップ

```bash
cd api
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. 環境変数の設定

1. `api/.env.example` を `api/.env` にコピー
2. `api/.env` ファイルを開き、アプリケーションIDを設定

```bash
# api/.env ファイル
HOUJIN_APP_ID=your_actual_app_id_here

# オプション設定（デフォルト値で動作します）
HOUJIN_API_REQUEST_INTERVAL=1.0
HOUJIN_API_MAX_RETRIES=3
HOUJIN_API_RETRY_DELAY=2.0
```

**アプリケーションIDの取得方法:**
- 国税庁法人番号公表サイト（https://www.houjin-bangou.nta.go.jp/）にアクセス
- Web-API利用申請を行い、アプリケーションIDを取得

**注意:** `.env` ファイルは Git リポジトリに含まれません。機密情報を含むため、共有しないでください。

## 起動方法

### バックエンドサーバーの起動

```bash
cd api
# 仮想環境をアクティベート
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

uvicorn app.main:app --reload --port 8000
```

### フロントエンドサーバーの起動

```bash
cd front
yarn dev
```

ブラウザで http://localhost:3000 にアクセス

## 使用方法

1. **ファイルのアップロード**
   - トップページでCSVファイルを選択
   - 「アップロード」ボタンをクリック
   - アップロードされたレコードが一覧表示されます

2. **法人番号の照合**
   - 「法人番号を一括照合」ボタンをクリック
   - 各レコードが国税庁APIと照合されます
   - 照合結果がステータスバッジで表示されます

3. **結果のダウンロード**
   - 「CSVダウンロード」ボタンをクリック
   - 照合結果がCSV形式でダウンロードされます

## プロジェクト構成

```
houjin-align/
├── api/                    # FastAPI バックエンド
│   ├── app/
│   │   ├── main.py         # FastAPI エントリーポイント
│   │   ├── routes/         # API エンドポイント
│   │   │   ├── checks.py   # 照合関連エンドポイント
│   │   │   └── health.py   # ヘルスチェック
│   │   ├── services/       # ビジネスロジック
│   │   │   └── corporate_lookup.py  # 国税庁API連携
│   │   ├── schemas/        # データスキーマ
│   │   └── core/           # 設定管理
│   ├── requirements.txt    # Python依存パッケージ
│   └── .env.example        # 環境変数テンプレート
│
├── front/                  # Next.js フロントエンド
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx        # トップページ
│   │   ├── about/          # このツールについて
│   │   └── components/    # 共通コンポーネント
│   ├── components/         # React コンポーネント
│   │   ├── FileUploadForm.tsx  # ファイルアップロードフォーム
│   │   └── Logo.tsx        # ロゴコンポーネント
│   ├── lib/                # ユーティリティ
│   │   └── apiClient.ts    # API クライアント
│   └── package.json        # Node.js依存パッケージ
│
└── docs/                   # ドキュメント
    ├── requirements.md      # 要件定義
    ├── architecture.md      # アーキテクチャ
    └── ui_*.md             # UI設計書
```

## API エンドポイント

### バックエンド API

- `POST /checks/upload` - ファイルアップロード
- `POST /checks/lookup` - 単一レコードの照合
- `POST /checks/bulk-lookup` - 一括照合
- `GET /health` - ヘルスチェック

## デプロイ

本アプリケーションは、Vercel（フロントエンド）と Render（バックエンド）に無料でデプロイできます。

詳細な手順は [DEPLOY.md](DEPLOY.md) を参照してください。

### クイックスタート

1. **バックエンド（Render）をデプロイ**
   - Renderアカウントを作成
   - GitHubリポジトリを接続
   - Root Directory: `api` を指定
   - 環境変数を設定

2. **フロントエンド（Vercel）をデプロイ**
   - Vercelアカウントを作成
   - GitHubリポジトリを接続
   - Root Directory: `front` を指定
   - 環境変数 `NEXT_PUBLIC_API_BASE_URL` にRenderのURLを設定

## 今後の実装予定

- [ ] フィルタリング機能（要確認・不一致のみを絞り込み）
- [ ] 表記ゆれ対策（株式会社/(株)などの表記統一）
- [ ] Excelファイル（.xlsx, .xls）の直接アップロード対応
- [ ] 履歴保存機能

## トラブルシューティング

### 404エラーが発生する場合

- アプリケーションIDが正しく設定されているか確認
- `api/.env` ファイルが存在し、`HOUJIN_APP_ID` が設定されているか確認
- バックエンドサーバーのログを確認（デバッグ情報が出力されます）

### 照合が動作しない場合

- アプリケーションIDが設定されていない場合、ダミーモードで動作します
- 実際のAPI呼び出しには、有効なアプリケーションIDが必要です

## ライセンス

（プロジェクトのライセンスを記載）

## 開発者向け情報

### ログレベル

バックエンドのログレベルを調整するには、`api/app/main.py` でロギング設定を変更してください。

### デバッグ

- バックエンド: `api/app/services/corporate_lookup.py` にデバッグログが出力されます
- フロントエンド: ブラウザの開発者ツールのコンソールを確認

## ファビコン設定

ブラウザタブに表示されるファビコンは、`front/app/icon.svg` で設定されています。Next.jsのApp Routerでは、`app`ディレクトリに`icon.svg`を配置すると自動的にfaviconとして使用されます。
