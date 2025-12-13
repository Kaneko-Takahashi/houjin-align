# api/app/core/config.py

from typing import Optional

from pydantic import BaseSettings


class Settings(BaseSettings):
    """アプリケーション設定"""

    # 国税庁法人番号 Web-API のアプリケーションID
    # 環境変数 HOUJIN_APP_ID から読み込む想定
    houjin_app_id: Optional[str] = None

    # レート制限対策: リクエスト間隔（秒）
    # 環境変数 HOUJIN_API_REQUEST_INTERVAL から読み込む（デフォルト: 1.0秒）
    houjin_api_request_interval: float = 1.0

    # 最大リトライ回数
    # 環境変数 HOUJIN_API_MAX_RETRIES から読み込む（デフォルト: 3回）
    houjin_api_max_retries: int = 3

    # リトライ時の待機時間（秒）
    # 環境変数 HOUJIN_API_RETRY_DELAY から読み込む（デフォルト: 2.0秒）
    houjin_api_retry_delay: float = 2.0

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

