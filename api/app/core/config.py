# api/app/core/config.py

from typing import Optional

from pydantic import BaseSettings


class Settings(BaseSettings):
    """アプリケーション設定"""

    # 国税庁法人番号 Web-API のアプリケーションID
    # 環境変数 HOUJIN_APP_ID から読み込む想定
    houjin_app_id: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

