export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="about-page-title">このツールについて</h1>

      <section className="about-section">
        <h2 className="about-section-title">ツール概要</h2>
        <p className="about-section-text">
          Houjin Align は、取引先リストの法人番号や名称を確認するための社内向けチェックツールです。
          国税庁の法人番号 Web-API を活用して、アップロードした CSV/Excel ファイルに含まれる法人情報の照合を行います。
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">できること</h2>
        <ul className="about-list">
          <li>
            <strong>CSV/Excel のアップロード</strong>
            <br />
            法人番号や法人名が含まれるファイルをアップロードできます。
          </li>
          <li>
            <strong>国税庁の法人番号 Web-API との照合</strong>
            <br />
            アップロードしたデータを国税庁の法人番号 Web-API と照合します。
            （現在はダミー実装となっており、実際の API 呼び出しは行っていません）
          </li>
          <li>
            <strong>照合ステータスの確認</strong>
            <br />
            各レコードについて、以下のステータスで照合結果を表示します：
            <ul className="about-sublist">
              <li><strong>未照合</strong>：まだ照合処理が完了していない状態</li>
              <li><strong>一致</strong>：法人番号と名称が一致した状態</li>
              <li><strong>未登録</strong>：法人番号が登録されていない、または存在しない状態</li>
              <li><strong>要確認</strong>：名称が一致しないなど、手動での確認が必要な状態</li>
              <li><strong>エラー</strong>：照合処理中にエラーが発生した状態</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">想定利用シーン</h2>
        <ul className="about-list">
          <li>
            <strong>新規取引先の与信チェック前の下準備</strong>
            <br />
            取引先リストの法人番号や名称が正確かどうかを事前に確認し、与信チェックの効率を向上させます。
          </li>
          <li>
            <strong>顧客マスタのクレンジング</strong>
            <br />
            既存の顧客マスタデータに含まれる法人情報の整合性を確認し、データの品質向上に役立ちます。
          </li>
          <li>
            <strong>取引先リストの定期チェック</strong>
            <br />
            定期的に取引先リストをチェックし、法人情報の変更や誤りを早期に発見します。
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">注意事項</h2>
        <div className="about-notice">
          <p className="about-section-text">
            本ツールの結果はあくまで補助情報であり、最終的な確認は担当部門の判断で行うこと。
            法人番号や名称の照合結果は参考情報として活用し、重要な判断を行う際は必ず公式の情報源を確認してください。
          </p>
        </div>
      </section>
    </div>
  )
}

