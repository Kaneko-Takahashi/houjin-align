# api/app/services/corporate_lookup.py

from typing import Optional

from ..schemas.corporate import CorporateCheckInput, CorporateCheckResult, CorporateCheckStatus


class CorporateLookupService:
    """国税庁法人番号 Web-API との連携を担当するサービス層（今はダミー実装）"""

    def __init__(
        self,
        app_id: Optional[str] = None,
        base_url: str = "https://api.houjin-bangou.nta.go.jp",
        api_version: str = "4",
    ) -> None:
        self.app_id = app_id  # 将来 env から渡す
        self.base_url = base_url
        self.api_version = api_version

    def lookup_by_number(self, payload: CorporateCheckInput) -> CorporateCheckResult:
        """
        法人番号をキーに、1件分の法人情報を照会する。

        現時点では「ダミー実装」とし、
        - 特定の法人番号だけ OK
        - それ以外は NOT_FOUND
        などの簡易ロジックでよい。
        """

        # TODO: 将来ここで実際に HTTP リクエストを投げる

        if payload.corporate_number == "0000000000000":
            # ダミー：特定の番号だけ「ヒットした」扱い
            return CorporateCheckResult(
                corporate_number=payload.corporate_number,
                input_name=payload.name,
                matched_name="株式会社テスト",
                matched_address="東京都千代田区霞が関３丁目１−１",
                status=CorporateCheckStatus.OK,
                raw_response=None,  # 将来 CSV 文字列など
            )

        # その他は、とりあえず NOT_FOUND 扱い
        return CorporateCheckResult(
            corporate_number=payload.corporate_number,
            input_name=payload.name,
            matched_name=None,
            matched_address=None,
            status=CorporateCheckStatus.NOT_FOUND,
            raw_response=None,
        )

