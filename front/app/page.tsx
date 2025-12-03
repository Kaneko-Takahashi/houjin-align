import FileUploadForm from '@/components/FileUploadForm'

export default function Home() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">
          Houjin Align（法人情報チェックツール）
        </h1>
        <p className="page-subtitle">
          CSV/Excel ファイルをアップロードして法人情報チェックを行うためのツールの試作版です。
        </p>
      </div>
      <FileUploadForm />
    </>
  )
}

