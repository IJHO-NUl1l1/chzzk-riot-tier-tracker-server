/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 향후 Next.js 버전을 위한 설정
  allowedDevOrigins: [
    '192.168.35.213', // 현재 경고에 표시된 IP
    'localhost',
    '127.0.0.1'
  ],
}

module.exports = nextConfig
