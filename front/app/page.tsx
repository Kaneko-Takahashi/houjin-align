import FileUploadForm from '@/components/FileUploadForm'

export default function Home() {
  return (
    <>
      <div className="header">
        <h1 className="header-title">
          Houjin Align（法人情報チェックツール）
        </h1>
        <p className="header-subtitle">
          CSV/Excel ファイルをアップロードして法人情報チェックを行うためのツールの試作版です。
        </p>
      </div>
      <FileUploadForm />
    </>
  )
}

