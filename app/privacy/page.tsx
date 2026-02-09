export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>
      <p className="text-sm text-gray-400 mb-8">최종 수정일: 2026년 2월 7일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. 수집하는 개인정보</h2>
        <p className="text-gray-300 leading-relaxed">
          Chzzk Riot Tier Tracker는 서비스 제공을 위해 다음 정보를 수집합니다.
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
          <li>Riot Games 계정 정보 (PUUID, 소환사명, 태그라인)</li>
          <li>LoL/TFT 랭크 정보 (티어, 랭크, LP)</li>
          <li>치지직(Chzzk) 사용자명</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. 개인정보의 수집 목적</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>치지직 채팅에서 LoL/TFT 티어 뱃지 표시</li>
          <li>사용자 랭크 정보 조회 및 캐싱</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. 개인정보의 보유 및 이용 기간</h2>
        <p className="text-gray-300 leading-relaxed">
          수집된 정보는 서비스 이용 기간 동안 보유하며, 사용자가 연동 해제를 요청할 경우 즉시 삭제합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. 개인정보의 제3자 제공</h2>
        <p className="text-gray-300 leading-relaxed">
          수집된 개인정보는 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. 개인정보의 파기</h2>
        <p className="text-gray-300 leading-relaxed">
          사용자가 서비스 연동을 해제하면 관련 데이터를 지체 없이 파기합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. 문의</h2>
        <p className="text-gray-300 leading-relaxed">
          개인정보 관련 문의는 아래 이메일로 연락해 주세요.
        </p>
        <p className="text-gray-300 mt-2">이메일: x8608666@gmail.com</p>
      </section>
    </main>
  );
}
