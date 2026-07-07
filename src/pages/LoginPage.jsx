import { useState } from 'react'

const CORRECT_ID = 'palm'
const CORRECT_PASSWORD = '1234'

function LoginPage({ onNext }) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (id === CORRECT_ID && password === CORRECT_PASSWORD) {
      setError('')
      onNext()
    } else {
      setError('ID หรือ Password ไม่ถูกต้อง')
    }
  }

  return (
    <div className="login-wrapper">
      {/* ฝั่งซ้าย: แบรนด์ */}
      <div className="login-left">
        <div className="login-logo">✳</div>
        <h1 className="login-hello">Hello,<br />Welcome! 🍒</h1>
        <p className="login-subtitle">
          Your space to plan every day with intention.<br />
          Track what matters, one day at a time.
        </p>
        <p className="login-credit">Crafted with care by Palm </p>
      </div>

      {/* ฝั่งขวา: ฟอร์ม */}
      <div className="login-right">
        <div className="login-form">
          <h2>Welcome Back!</h2>
          <p style={{ color: '#888', marginBottom: 24 }}>
            กรอก ID และ Password เพื่อเข้าสู่ระบบ
          </p>

          <input
            type="text"
            placeholder="กรอก ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            className="input-field"
            style={{ marginBottom: 16 }}
          />

          <input
            type="password"
            placeholder="กรอก Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            className="input-field"
            style={{ marginBottom: 16 }}
          />

          <button onClick={handleLogin} className="btn-primary" style={{ width: '100%' }}>
            เข้าสู่ระบบ
          </button>

          {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage