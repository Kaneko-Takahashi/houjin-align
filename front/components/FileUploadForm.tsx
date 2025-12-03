'use client'

import { useState } from 'react'
import { uploadCorporateFile, lookupCorporate, type UploadResponse, type CorporateRecord, type CorporateLookupResult } from '@/lib/apiClient'

// 照合ステータスの型定義
export type CheckStatus = 'UNCHECKED' | 'CHECKING' | 'OK' | 'NOT_FOUND' | 'NEED_CHECK' | 'ERROR'

// ステータス付きレコードの型
type RecordWithStatus = CorporateRecord & {
  status: CheckStatus
}

export default function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordsWithStatus, setRecordsWithStatus] = useState<RecordWithStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('ファイルを選択してください')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setRecordsWithStatus([])

    try {
      const response = await uploadCorporateFile(selectedFile)
      setResult(response)
      // アップロード後、各レコードにデフォルトのステータスを付与
      const recordsWithDefaultStatus: RecordWithStatus[] = response.records.map(record => ({
        ...record,
        status: 'UNCHECKED' as CheckStatus,
      }))
      setRecordsWithStatus(recordsWithDefaultStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロード中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // ステータスバッジのクラス名を取得するユーティリティ
  const getStatusBadgeClass = (status: CheckStatus): string => {
    const baseClass = 'status-badge'
    switch (status) {
      case 'OK':
        return `${baseClass} status-badge-ok`
      case 'NOT_FOUND':
        return `${baseClass} status-badge-notfound`
      case 'NEED_CHECK':
        return `${baseClass} status-badge-needcheck`
      case 'ERROR':
        return `${baseClass} status-badge-error`
      case 'UNCHECKED':
      case 'CHECKING':
      default:
        return `${baseClass} status-badge-pending`
    }
  }

  // ステータスの表示文字列を取得するユーティリティ
  const getStatusLabel = (status: CheckStatus): string => {
    switch (status) {
      case 'UNCHECKED':
        return '未照合'
      case 'CHECKING':
        return '照合中…'
      case 'OK':
        return '一致'
      case 'NOT_FOUND':
        return '未登録'
      case 'NEED_CHECK':
        return '要確認'
      case 'ERROR':
        return 'エラー'
      default:
        return '未照合'
    }
  }

  // 一括照合処理
  const handleBulkLookup = async () => {
    if (recordsWithStatus.length === 0) {
      return
    }

    setIsChecking(true)
    setError(null)

    // 全レコードのステータスを「照合中」に更新
    setRecordsWithStatus(prev => 
      prev.map(record => ({ ...record, status: 'CHECKING' as CheckStatus }))
    )

    // 各レコードについて順に照合処理を実行
    const updatedRecords: RecordWithStatus[] = [...recordsWithStatus]
    
    for (let i = 0; i < updatedRecords.length; i++) {
      const record = updatedRecords[i]
      
      try {
        const lookupResult: CorporateLookupResult = await lookupCorporate({
          corporate_number: record.corp_number,
          name: record.company_name,
        })

        // 照合結果に基づいてステータスを更新
        updatedRecords[i] = {
          ...record,
          status: lookupResult.status as CheckStatus,
        }
      } catch (err) {
        // APIエラー時は該当レコードのみ「エラー」ステータスに
        updatedRecords[i] = {
          ...record,
          status: 'ERROR' as CheckStatus,
        }
      }

      // UIを更新（リアルタイムで進捗を表示）
      setRecordsWithStatus([...updatedRecords])
    }

    setIsChecking(false)
  }

  return (
    <>
      <div className="card">
        <h2 className="card-title">CSVファイルをアップロード</h2>
        <p className="card-description">
          CSV/Excel ファイルを選択してアップロードボタンをクリックしてください。
        </p>
        <form onSubmit={handleSubmit}>
          <div className="file-input-wrapper">
            <label htmlFor="file-input" className="file-input-label">
              ファイルを選択:
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={isLoading}
              className="file-input"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className="upload-button"
          >
            {isLoading ? 'アップロード中…' : 'アップロード'}
          </button>

          {error && (
            <div className="error-message">
              <strong>エラー:</strong> {error}
            </div>
          )}
        </form>
      </div>

      {result && (
        <div className="result-card">
          <h2 className="result-card-title">アップロード結果</h2>
          
          <div className="success-message">
            <div>
              <h3 className="success-message-title">アップロード成功</h3>
              <div className="success-info">
                <strong>ファイル名:</strong> {result.filename}
              </div>
              <div className="success-info">
                <strong>文字コード:</strong> {result.encoding}
              </div>
              <div className="success-info">
                <strong>レコード数:</strong> {result.count} 件
              </div>
            </div>
          </div>

          {result.records && result.records.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  レコード一覧
                </h4>
                <button
                  type="button"
                  onClick={handleBulkLookup}
                  disabled={recordsWithStatus.length === 0 || isChecking}
                  className="upload-button"
                  style={{ marginLeft: '16px' }}
                >
                  {isChecking ? '照合中…' : '法人番号を一括照合'}
                </button>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>行番号</th>
                      <th>法人番号</th>
                      <th>名称</th>
                      <th>照合ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recordsWithStatus.length > 0 ? recordsWithStatus : result.records.map(r => ({ ...r, status: 'UNCHECKED' as CheckStatus }))).map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record.corp_number || '-'}</td>
                        <td>{record.company_name || '-'}</td>
                        <td>
                          <span className={getStatusBadgeClass(record.status)}>
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

