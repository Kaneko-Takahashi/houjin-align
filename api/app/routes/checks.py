from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    tags=["checks"],
)


@router.post("/checks/upload", summary="法人情報ファイルのアップロード（ダミー）")
async def upload_corporate_file(file: UploadFile = File(...)):
    """
    法人情報リストのファイルを受け取り、後続で NTA Web-API 照会や照合ロジックを実装する予定のエンドポイント。
    現時点では、ファイル名だけを返すダミー実装とする。
    
    将来的には、app/services/nta_client.py のようなモジュールで
    国税庁法人番号 Web-API を呼び出す処理を実装する予定。
    """
    return {
        "filename": file.filename,
        "message": "このエンドポイントはまだダミーです。後で照合処理を実装します。",
    }

