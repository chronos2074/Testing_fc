<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Gu-yJwkNKlbiL6ioNZZ3qEOMIJKlxNX-

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Google Cloud Run にデプロイする

**前提条件:**
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) がインストール済み
- `gcloud auth login` で認証済み
- 使用する GCP プロジェクトで [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com) と [Container Registry API](https://console.cloud.google.com/apis/library/containerregistry.googleapis.com) が有効

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
# 1. イメージをビルド
docker build -t gcr.io/YOUR_PROJECT_ID/fanclub-gacha .

# 2. GCR にプッシュ
docker push gcr.io/YOUR_PROJECT_ID/fanclub-gacha

# 3. Cloud Run にデプロイ
gcloud run deploy fanclub-gacha \
  --image gcr.io/YOUR_PROJECT_ID/fanclub-gacha \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

デプロイ後、Cloud Run が発行する URL でアプリにアクセスできます。
