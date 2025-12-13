# api/app/services/corporate_lookup.py

import time
from typing import Optional, List
import httpx
import logging
import csv
import io

from ..schemas.corporate import CorporateCheckInput, CorporateCheckResult, CorporateCheckStatus

logger = logging.getLogger(__name__)


class CorporateLookupService:
    """国税庁法人番号 Web-API との連携を担当するサービス層"""

    def __init__(
        self,
        app_id: Optional[str] = None,
        base_url: str = "https://api.houjin-bangou.nta.go.jp",
        api_version: str = "4",
        request_interval: float = 1.0,  # リクエスト間隔（秒）
        max_retries: int = 3,  # 最大リトライ回数
        retry_delay: float = 2.0,  # リトライ時の待機時間（秒）
    ) -> None:
        self.app_id = app_id
        self.base_url = base_url
        self.api_version = api_version
        self.request_interval = request_interval  # レート制限対策: リクエスト間隔
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.last_request_time = 0.0  # 最後のリクエスト時刻

    def _wait_for_rate_limit(self) -> None:
        """レート制限対策: 前回のリクエストから一定時間経過するまで待機"""
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        if elapsed < self.request_interval:
            wait_time = self.request_interval - elapsed
            time.sleep(wait_time)
        
        self.last_request_time = time.time()

    def _call_nta_api(self, corporate_number: str) -> Optional[dict]:
        """
        国税庁法人番号 Web-API を呼び出す
        
        API仕様: https://www.houjin-bangou.nta.go.jp/webapi/index.html
        エンドポイント: /{version}/num?id={app_id}&number={corporate_number}&type=12
        """
        if not self.app_id:
            logger.warning("アプリケーションIDが設定されていません。ダミーモードで動作します。")
            return None

        # レート制限対策: リクエスト間隔を制御
        self._wait_for_rate_limit()

        url = f"{self.base_url}/{self.api_version}/num"
        params = {
            "id": self.app_id,
            "number": corporate_number,
            "type": "12",  # CSV形式
        }

        for attempt in range(self.max_retries):
            try:
                with httpx.Client(timeout=30.0) as client:
                    response = client.get(url, params=params)
                    response.raise_for_status()
                    
                    # CSV形式のレスポンスをパース
                    csv_text = response.text
                    reader = csv.DictReader(io.StringIO(csv_text))
                    
                    # 最初のデータ行を取得
                    for row in reader:
                        return {
                            "corporate_number": row.get("法人番号", "").strip(),
                            "name": row.get("商号又は名称", "").strip(),
                            "address": row.get("本店又は主たる事務所の所在地", "").strip(),
                        }
                    
                    # データが見つからない場合
                    return None
                    
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Too Many Requests
                    logger.warning(f"レート制限に達しました。{self.retry_delay * (attempt + 1)}秒待機します。")
                    time.sleep(self.retry_delay * (attempt + 1))
                    continue
                elif e.response.status_code == 404:
                    # 法人番号が見つからない
                    return None
                else:
                    logger.error(f"API呼び出しエラー (ステータス: {e.response.status_code}): {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay * (attempt + 1))
                        continue
                    raise
            except httpx.RequestError as e:
                logger.error(f"APIリクエストエラー: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (attempt + 1))
                    continue
                raise
            except Exception as e:
                logger.error(f"予期しないエラー: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (attempt + 1))
                    continue
                raise

        return None

    def lookup_by_number(self, payload: CorporateCheckInput) -> CorporateCheckResult:
        """
        法人番号をキーに、1件分の法人情報を照会する。
        """
        # アプリケーションIDが設定されていない場合はダミーモード
        if not self.app_id:
            if payload.corporate_number == "0000000000000":
                return CorporateCheckResult(
                    corporate_number=payload.corporate_number,
                    input_name=payload.name,
                    matched_name="株式会社テスト",
                    matched_address="東京都千代田区霞が関３丁目１−１",
                    status=CorporateCheckStatus.OK,
                    raw_response=None,
                )
            return CorporateCheckResult(
                corporate_number=payload.corporate_number,
                input_name=payload.name,
                matched_name=None,
                matched_address=None,
                status=CorporateCheckStatus.NOT_FOUND,
                raw_response=None,
            )

        # 実際のAPI呼び出し
        try:
            api_response = self._call_nta_api(payload.corporate_number)
            
            if api_response is None:
                return CorporateCheckResult(
                    corporate_number=payload.corporate_number,
                    input_name=payload.name,
                    matched_name=None,
                    matched_address=None,
                    status=CorporateCheckStatus.NOT_FOUND,
                    raw_response=None,
                )

            # 照合ロジック: 名称の一致確認（簡易実装）
            matched_name = api_response.get("name", "")
            matched_address = api_response.get("address", "")
            
            # 名称の照合（簡易実装）
            # 将来的には表記ゆれ対策などを実装
            status = CorporateCheckStatus.OK
            if payload.name and matched_name:
                # 簡易的な名称比較（実際には表記ゆれ対策が必要）
                if payload.name.strip() != matched_name.strip():
                    status = CorporateCheckStatus.NEED_CHECK

            return CorporateCheckResult(
                corporate_number=payload.corporate_number,
                input_name=payload.name,
                matched_name=matched_name,
                matched_address=matched_address,
                status=status,
                raw_response=None,
            )
            
        except Exception as e:
            logger.error(f"照合処理中にエラーが発生しました: {e}")
            return CorporateCheckResult(
                corporate_number=payload.corporate_number,
                input_name=payload.name,
                matched_name=None,
                matched_address=None,
                status=CorporateCheckStatus.NOT_FOUND,  # エラー時はNOT_FOUNDとして扱う
                raw_response=None,
            )

    def bulk_lookup(self, records: List[CorporateCheckInput]) -> List[CorporateCheckResult]:
        """
        複数のレコードを一括で照合する。
        レート制限対策として、各リクエスト間に適切な間隔を設ける。
        """
        results: List[CorporateCheckResult] = []
        
        total = len(records)
        logger.info(f"一括照合を開始します。総件数: {total}件")
        
        for i, record in enumerate(records, 1):
            try:
                result = self.lookup_by_number(record)
                results.append(result)
                
                if i % 50 == 0:
                    logger.info(f"進捗: {i}/{total}件 ({i * 100 // total}%)")
                    
            except Exception as e:
                logger.error(f"レコード {i} の照合中にエラーが発生しました: {e}")
                results.append(
                    CorporateCheckResult(
                        corporate_number=record.corporate_number,
                        input_name=record.name,
                        matched_name=None,
                        matched_address=None,
                        status=CorporateCheckStatus.NOT_FOUND,
                        raw_response=None,
                    )
                )
        
        logger.info(f"一括照合が完了しました。総件数: {total}件")
        return results
