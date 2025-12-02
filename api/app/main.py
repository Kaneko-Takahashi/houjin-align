from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, checks

app = FastAPI(
    title="Houjin Align API",
    version="0.1.0",
    description="法人情報チェックツール Houjin Align のバックエンド API（MVP スケルトン）",
)

# 開発中はオリジンを広く許可する。本番環境では適切に制限すること。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(health.router)
app.include_router(checks.router)

