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
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="file-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          ファイルを選択:
        </label>
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          disabled={isLoading}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '400px',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!selectedFile || isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {isLoading ? 'アップロード中…' : 'アップロード'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          <strong>エラー:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '10px' }}>アップロード成功</h3>
          <div style={{ marginBottom: '8px' }}>
            <strong>ファイル名:</strong> {result.filename}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>文字コード:</strong> {result.encoding}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>レコード数:</strong> {result.count} 件
          </div>

          {result.records && result.records.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginTop: 0, marginBottom: '12px' }}>レコード一覧</h4>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #ddd',
                          fontWeight: 'bold',
                        }}
                      >
                        行番号
                      </th>
                      <th
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #ddd',
                          fontWeight: 'bold',
                        }}
                      >
                        法人番号
                      </th>
                      <th
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #ddd',
                          fontWeight: 'bold',
                        }}
                      >
                        名称
                      </th>
                      <th
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #ddd',
                          fontWeight: 'bold',
                        }}
                      >
                        照合ステータス
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.records.map((record, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                        <td
                          style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {record.corp_number || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {record.company_name || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {/* 将来、法人番号照合ステータスを表示するための空カラム */}
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
    </form>
  )
}

