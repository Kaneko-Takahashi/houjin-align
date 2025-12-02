# api/app/routes/checks.py


from fastapi import APIRouter, UploadFile, File, HTTPException

import csv

import io


router = APIRouter(
    prefix="/checks",
    tags=["checks"],
)


def _decode_csv_bytes(data: bytes) -> tuple[str, str]:
    """
    CSVファイルのバイト列を文字列に変換する簡易ヘルパー。
    - まず UTF-8 (BOM付き含む) を試す
    - ダメなら Excel 日本語でよく使われる cp932(Shift_JIS) を試す
    """
    for enc in ("utf-8-sig", "cp932"):
        try:
            text = data.decode(enc)
            return text, enc
        except UnicodeDecodeError:
            continue
    raise HTTPException(
        status_code=400,
        detail="CSVの文字コードを判別できませんでした。UTF-8 または Shift-JIS で保存してください。",
    )


@router.post("/upload")
async def upload_corporate_file(file: UploadFile = File(...)):
    """
    法人情報ファイル(CSV)を受け取り、行ごとのデータをJSONで返すエンドポイント（照合前の段階）。
    """
    # 1) 拡張子チェック（最低限のバリデーション）
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="現在は CSV ファイルのみ対応しています。")

    # 2) ファイル内容を読み込み
    raw_bytes = await file.read()

    # 3) 文字コード判定して文字列へ
    text, used_encoding = _decode_csv_bytes(raw_bytes)

    # 4) csv.DictReader でヘッダ行付きCSVとして読み込む
    reader = csv.DictReader(io.StringIO(text))

    records = []
    for row in reader:
        # Excel で列名を少し変えても最低限動くように get() で取得
        record = {
            "client_id": row.get("取引先ID") or row.get("顧客ID") or "",
            "company_name": row.get("会社名") or "",
            "corp_number": (row.get("法人番号") or "").replace("-", "").strip(),
            "zip_code": str(row.get("郵便番号") or "").strip(),
            "address": row.get("住所") or "",
            # デバッグ用に元の行も残しておく（フロントで使わなければ無視してOK）
            "raw": row,
        }

        # 法人番号が空の行はスキップ（空行対策）
        if not record["corp_number"]:
            continue

        records.append(record)

    if not records:
        raise HTTPException(
            status_code=400,
            detail="有効な行がありませんでした。ヘッダ行とデータ行が正しく設定されているか確認してください。",
        )

    # 5) JSONレスポンスとして返却
    return {
        "filename": file.filename,
        "encoding": used_encoding,
        "count": len(records),
        "records": records,
    }
