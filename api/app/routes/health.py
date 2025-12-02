from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get("/", summary="ヘルスチェック")
async def health_check():
    """
    API が起動しているかを確認するためのシンプルなヘルスチェック。
    """
    return {"status": "ok"}

