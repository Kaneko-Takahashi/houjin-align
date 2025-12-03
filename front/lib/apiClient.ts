/**
 * API 呼び出し用の簡易クライアント
 * 
 * ベースURLは一旦 http://localhost:8000 としている。
 * 将来は環境変数や設定ファイルから取得する予定。
 */

const API_BASE_URL = 'http://localhost:8000'

export interface CorporateRecord {
  client_id: string
  company_name: string
  corp_number: string
  zip_code: string
  address: string
  raw?: Record<string, string>
}

export interface UploadResponse {
  filename: string
  encoding: string
  count: number
  records: CorporateRecord[]
}

/**
 * 法人情報ファイルをアップロードする
 * @param file アップロードするファイル
 * @returns アップロード結果
 */
export async function uploadCorporateFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${API_BASE_URL}/checks/upload`, {
      method: 'POST',
      body: formData,
      // Content-Type は multipart/form-data になるように、FormData を使う
      // ヘッダーの Content-Type はブラウザに任せる（boundary を自動設定）
    })

    if (!response.ok) {
      // エラーレスポンスの詳細を取得
      let errorMessage = `アップロードに失敗しました (${response.status})`
      
      if (response.status === 404) {
        errorMessage = `エンドポイントが見つかりません (404)。バックエンドサーバーが正しく起動しているか、エンドポイントパスを確認してください。`
      } else if (response.status >= 500) {
        errorMessage = `サーバーエラーが発生しました (${response.status})。バックエンドサーバーのログを確認してください。`
      } else {
        try {
          const errorData = await response.json()
          if (errorData.detail) {
            errorMessage = errorData.detail
          }
        } catch {
          // JSON解析に失敗した場合は statusText を使用
          errorMessage = `${errorMessage}: ${response.statusText}`
        }
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    // ネットワークエラー（接続拒否など）の処理
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `サーバーが起動しているか確認してください (${API_BASE_URL})`
      )
    }
    throw error
  }
}

