import { useSignUpEmailPassword, useSignInEmailPassword } from '@nhost/react'
import { useState } from 'react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const { signUpEmailPassword, isLoading: signingUp, error: signUpError } = useSignUpEmailPassword()
  const { signInEmailPassword, isLoading: signingIn, error: signInError } = useSignInEmailPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup') {
      await signUpEmailPassword(email, password)
    } else {
      await signInEmailPassword(email, password)
    }
  }

  return (
    <div>
      <h2>{mode === 'signup' ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit" disabled={signingIn || signingUp}>
          {mode === 'signup' ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      {signUpError && <p style={{ color: 'red' }}>{signUpError.message}</p>}
      {signInError && <p style={{ color: 'red' }}>{signInError.message}</p>}
      <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
        Switch to {mode === 'signup' ? 'Log In' : 'Sign Up'}
      </button>
    </div>
  )
}