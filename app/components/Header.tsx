import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Chzzk LoL Tier Server
            </Link>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/test" className="text-gray-300 hover:text-white transition-colors">
                  API Test
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
