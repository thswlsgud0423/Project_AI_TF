import { createContext, useContext, useState, type FormEvent, type ReactNode } from 'react'

// 데모용 고정 계정: 실제 인증 서버 없이 화면 흐름만 보여줍니다.
const DEMO_USER = { id: 'admin', pw: '1q2w3e' }
const STORAGE_KEY = 'demo_auth_user'

const AuthContext = createContext<{ user: string; logout: () => void } | null>(null)

// 로그인된 상태에서만 사용 (AuthGate 안쪽)
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthGate')
  return ctx
}

function readSession() {
  try { return sessionStorage.getItem(STORAGE_KEY) } catch { return null }
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(readSession)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (id.trim() === DEMO_USER.id && pw === DEMO_USER.pw) {
      try { sessionStorage.setItem(STORAGE_KEY, DEMO_USER.id) } catch { /* ignore */ }
      setError(false)
      setUser(DEMO_USER.id)
    } else {
      setError(true)
    }
  }

  function logout() {
    try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setId(''); setPw(''); setUser(null)
  }

  if (user) {
    return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">예비군 관리 앱</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">계정으로 로그인하세요</p>

        <label htmlFor="login-id" className="mb-1 block text-xs font-semibold text-gray-500">아이디</label>
        <input
          id="login-id" autoFocus autoComplete="username" value={id}
          onChange={(e) => setId(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600"
        />

        <label htmlFor="login-pw" className="mb-1 block text-xs font-semibold text-gray-500">비밀번호</label>
        <input
          id="login-pw" type="password" autoComplete="current-password" value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600"
        />

        {error && <p role="alert" className="-mt-2 mb-3 text-xs text-red-600">아이디 또는 비밀번호가 올바르지 않습니다.</p>}

        <button type="submit" className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-bold text-white hover:opacity-90">
          로그인
        </button>
        <p className="mt-4 text-center text-xs text-gray-400">데모 계정 — 아이디: admin / 비밀번호: 1q2w3e</p>
      </form>
    </div>
  )
}
