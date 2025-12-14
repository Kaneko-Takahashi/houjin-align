import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import health, checks

app = FastAPI(
    title="Houjin Align API",
    version="0.1.0",
)

# CORS設定: 環境変数から許可オリジンを取得
# 開発環境: http://localhost:3000
# 本番環境: VercelでデプロイしたフロントエンドのURL
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(health.router)
app.include_router(checks.router)

