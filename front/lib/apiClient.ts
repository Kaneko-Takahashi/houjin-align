/**
 * API 呼び出し用の簡易クライアント
 * 
 * ベースURLは環境変数から取得します。
 * 開発環境: http://localhost:8000
 * 本番環境: RenderでデプロイしたバックエンドのURL
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

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

export type CorporateLookupInput = {
  corporate_number: string
  name?: string
}

export type CorporateLookupResult = {
  corporate_number: string
  input_name: string | null
  matched_name: string | null
  matched_address: string | null
  status: 'OK' | 'NOT_FOUND' | 'NEED_CHECK'
  raw_response: unknown
}

export interface BulkLookupRequest {
  records: CorporateLookupInput[]
}

export interface BulkLookupResponse {
  results: CorporateLookupResult[]
  total_count: number
  success_count: number
  error_count: number
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

/**
 * 法人番号照合を行う
 * @param input 照合対象の法人番号と名称
 * @returns 照合結果
 */
export async function lookupCorporate(
  input: CorporateLookupInput
): Promise<CorporateLookupResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/checks/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      let errorMessage = `照合に失敗しました (${response.status})`
      
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

/**
 * 複数の法人番号を一括照合する
 * @param request 一括照合リクエスト
 * @returns 一括照合結果
 */
export async function bulkLookupCorporate(
  request: BulkLookupRequest
): Promise<BulkLookupResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/checks/bulk-lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let errorMessage = `一括照合に失敗しました (${response.status})`
      
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

