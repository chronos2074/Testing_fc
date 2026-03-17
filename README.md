# 車いすラグビーファンクラブ ガチャアプリ

車いすラグビーファンクラブ会員向けの月1回限定ガチャアプリです。会員はガチャを回して、その月限定の選手画像やコメントをゲットできます。

---

## 機能概要

### ユーザー向け機能

- **月1回ガチャ**: ファンクラブ会員は毎月1回ガチャを回すことができます。同じ月に2回以上回そうとするとブロックされます（月が変わると自動リセット）。
- **賞品表示**: 当選した画像・レアリティ・選手コメントをモーダルで表示します。
- **画像ダウンロード**: 当選画像を `WR_FanClub_[タイムスタンプ].jpg` としてローカルに保存できます。

### 管理者向け機能（`?admin=true` で表示）

- **画像URL設定**: 3枠分の賞品画像URLを登録・プレビューできます。
- **選手コメント設定**: 表示するコメントをテキストで設定できます。
- **会員配布用URL生成**: 設定内容をBase64エンコードしたURLを生成し、会員に配布します。会員がそのURLにアクセスすると設定が自動適用されます。
- **テスト機能**: ガチャ履歴のリセットやローカル動作確認ができます。

---

## URLパラメータ

| パラメータ | 説明 |
|---|---|
| `?admin=true` | 管理者パネルを表示 |
| `?cfg=[base64文字列]` | 画像・コメント設定を自動ロード（管理者が生成したURLを会員に配布する際に使用） |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 19 |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS（CDN） |
| ビルドツール | Vite |
| ランタイム | Node.js 20 |
| デプロイ | Docker + Google Cloud Run |

---

## ローカル開発

**前提条件:** Node.js

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev
```

---

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

---

## Google Cloud Run へのデプロイ

**前提条件:**
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) がインストール済み
- `gcloud auth login` で認証済み
- 対象 GCP プロジェクトで [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com) と [Container Registry API](https://console.cloud.google.com/apis/library/containerregistry.googleapis.com) が有効

**手順 1: プロジェクトを設定**
```bash
gcloud config set project YOUR_PROJECT_ID
```

**手順 2: 方法 A - Cloud Build でデプロイ（推奨）**
```bash
gcloud builds submit --config=cloudbuild.yaml
```

**手順 2: 方法 B - 手動で Docker ビルド & デプロイ**
```bash
# イメージをビルド
docker build -t gcr.io/YOUR_PROJECT_ID/fanclub-gacha .

# GCR にプッシュ
docker push gcr.io/YOUR_PROJECT_ID/fanclub-gacha

# Cloud Run にデプロイ
gcloud run deploy fanclub-gacha \
  --image gcr.io/YOUR_PROJECT_ID/fanclub-gacha \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

デプロイ後、Cloud Run が発行する URL でアプリにアクセスできます。

---

## データ管理

アプリはブラウザの `localStorage` を使用しています。バックエンドは不要です。

| キー | 内容 |
|---|---|
| `wr_gacha_history` | ガチャ結果（賞品・メッセージ・日付） |
| `wr_gacha_admin_settings` | 管理者が設定した画像URL・コメント |

---

## 月次運用フロー

1. 管理者が `?admin=true` にアクセス
2. 今月の賞品画像URL・選手コメントを設定
3. 「会員配布用URLをコピー」ボタンで設定済みURLを生成
4. 生成URLを会員に配布（メール・SNS等）
5. 会員がURLにアクセスしてガチャを楽しむ
