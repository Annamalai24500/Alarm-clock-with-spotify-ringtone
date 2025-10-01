import React from 'react'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <header className="flex flex-col items-center">
        <a
          href="http://127.0.0.1:3000/auth/login"
          className="px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-transform transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#1DB954]/40"
          style={{ backgroundColor: '#1DB954' }}
        >
          Login with Spotify
        </a>
      </header>
    </div>

  )
}

export default Login;
