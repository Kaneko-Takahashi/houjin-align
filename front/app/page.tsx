import FileUploadForm from '@/components/FileUploadForm'

export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginTop: 0, marginBottom: '10px' }}>
        Houjin Align（法人情報チェックツール）
      </h1>
      <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
        CSV/Excel ファイルをアップロードして法人情報チェックを行うためのツールの試作版です。
      </p>
      <FileUploadForm />
    </div>
  )
}

