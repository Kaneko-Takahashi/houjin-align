import FileUploadForm from '@/components/FileUploadForm'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <>
      <div className="header">
        <div className="header-logo-title">
          <Logo size={48} className="header-logo" />
          <h1 className="header-title">
            Houjin Align（法人情報チェックツール）
          </h1>
        </div>
        <p className="header-subtitle">
          CSV/Excel ファイルをアップロードして法人情報チェックを行うためのツールの試作版です。
        </p>
      </div>
      <FileUploadForm />
    </>
  )
}

