/**
 * OAuth Success Page
 * Shown after successful Chzzk OAuth login.
 * Chrome extension can detect this page and close the tab.
 */
export default function AuthSuccessPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      <h1>로그인 성공!</h1>
      <p>치지직 계정이 연결되었습니다.</p>
      <p style={{ color: '#888', fontSize: '14px' }}>
        이 창은 자동으로 닫힙니다...
      </p>
    </div>
  );
}
