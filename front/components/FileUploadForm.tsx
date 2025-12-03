'use client'

import { useState } from 'react'
import { uploadCorporateFile, type UploadResponse } from '@/lib/apiClient'

export default function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    try {
      const response = await uploadCorporateFile(selectedFile)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロード中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
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
              <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                レコード一覧
              </h4>
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
                    {result.records.map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record.corp_number || '-'}</td>
                        <td>{record.company_name || '-'}</td>
                        <td>
                          <span className="status-badge">未照合</span>
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

