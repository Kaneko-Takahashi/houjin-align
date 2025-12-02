/**
 * API 呼び出し用の簡易クライアント
 * 
 * ベースURLは一旦 http://localhost:8000 としている。
 * 将来は環境変数や設定ファイルから取得する予定。
 */

const API_BASE_URL = 'http://localhost:8000'

export interface UploadResponse {
  filename: string
  message: string
}

/**
 * 法人情報ファイルをアップロードする
 * @param file アップロードするファイル
 * @returns アップロード結果
 */
export async function uploadCorporateFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/checks/upload`, {
    method: 'POST',
    body: formData,
    // Content-Type は multipart/form-data になるように、FormData を使う
    // ヘッダーの Content-Type はブラウザに任せる（boundary を自動設定）
  })

  if (!response.ok) {
    throw new Error(`アップロードに失敗しました: ${response.statusText}`)
  }

  return response.json()
}

