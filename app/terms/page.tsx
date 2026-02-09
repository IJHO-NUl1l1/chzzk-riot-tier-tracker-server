export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">서비스 이용약관</h1>
      <p className="text-sm text-gray-400 mb-8">최종 수정일: 2026년 2월 7일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
        <p className="text-gray-300 leading-relaxed">
          본 약관은 Chzzk Riot Tier Tracker(이하 &quot;서비스&quot;)의 이용 조건 및 절차에 관한 사항을 규정합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제2조 (서비스 내용)</h2>
        <p className="text-gray-300 leading-relaxed">
          서비스는 치지직(Chzzk) 라이브 채팅에서 LoL/TFT 랭크 정보를 표시하는 브라우저 확장 프로그램입니다.
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
          <li>Riot Games 계정 연동을 통한 랭크 정보 조회</li>
          <li>채팅 사용자 닉네임 옆에 티어 뱃지 표시</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제3조 (이용자의 의무)</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>타인의 계정 정보를 도용하지 않아야 합니다.</li>
          <li>서비스를 악의적인 목적으로 사용하지 않아야 합니다.</li>
          <li>Riot Games 및 치지직의 이용약관을 준수해야 합니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제4조 (면책사항)</h2>
        <p className="text-gray-300 leading-relaxed">
          서비스는 Riot Games 및 네이버(치지직)와 제휴 관계가 아니며, 공식적으로 승인된 서비스가 아닙니다.
          API 정책 변경 등으로 인한 서비스 중단에 대해 책임지지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제5조 (서비스 변경 및 중단)</h2>
        <p className="text-gray-300 leading-relaxed">
          서비스 운영자는 필요한 경우 사전 공지 후 서비스 내용을 변경하거나 중단할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">제6조 (문의)</h2>
        <p className="text-gray-300 leading-relaxed">
          서비스 이용 관련 문의는 아래 이메일로 연락해 주세요.
        </p>
        <p className="text-gray-300 mt-2">이메일: x8608666@gmail.com</p>
      </section>
    </main>
  );
}
