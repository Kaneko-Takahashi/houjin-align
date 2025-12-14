from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import health, checks
from .core.config import settings

app = FastAPI(
    title="Houjin Align API",
    version="0.1.0",
)

# CORS設定: RenderのALLOWED_ORIGINS（例: "http://localhost:3000,https://houjin-align.vercel.app"）をリスト化
raw = getattr(settings, "allowed_origins", "") or ""
if isinstance(raw, str):
    origins = [o.strip() for o in raw.split(",") if o.strip()]
else:
    origins = list(raw)

# 起動時にoriginsをログ出力して、Renderログで反映確認できるようにする
print("[CORS] allow_origins =", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CORSテスト用エンドポイント（デバッグ用）
@app.get("/cors-test")
def cors_test():
    return {"ok": True}

# ルーター登録
app.include_router(health.router)
app.include_router(checks.router)

