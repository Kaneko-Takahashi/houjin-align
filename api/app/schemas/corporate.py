# api/app/schemas/corporate.py

from typing import Optional, List
from pydantic import BaseModel


class CorporateCheckInput(BaseModel):
    """CSV 1レコード分など、照合対象の最小単位"""

    corporate_number: str  # 法人番号（13桁想定だが、ここでは str として扱う）
    name: Optional[str] = None  # 商号／名称（将来のゆるい照合用に任意で持たせる）


class CorporateCheckStatus:
    """照合ステータスを文字列定数で管理"""

    OK = "OK"  # 法人番号から1件ヒット＆名称も違和感なし
    NOT_FOUND = "NOT_FOUND"  # 法人番号に該当なし
    NEED_CHECK = "NEED_CHECK"  # ヒットしたが名称が微妙・複数候補など


class CorporateCheckResult(BaseModel):
    """1件の照合結果"""

    corporate_number: str
    input_name: Optional[str] = None
    matched_name: Optional[str] = None
    matched_address: Optional[str] = None
    status: str  # "OK" / "NOT_FOUND" / "NEED_CHECK" など
    raw_response: Optional[str] = None  # 将来 CSV 生データや XML を入れる用（今は None 固定でも可）


class BulkLookupRequest(BaseModel):
    """一括照合リクエスト"""

    records: List[CorporateCheckInput]


class BulkLookupResponse(BaseModel):
    """一括照合レスポンス"""

    results: List[CorporateCheckResult]
    total_count: int
    success_count: int
    error_count: int

