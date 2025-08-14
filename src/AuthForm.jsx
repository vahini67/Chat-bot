import { useState } from 'react';
import nhost from './nhost';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload
    setError('');
    try {
      if (isSignUp) {
        const { error } = await nhost.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await nhost.auth.signIn({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isSignUp ? 'Create Account' : 'Login'}
        </button>
      </form>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
