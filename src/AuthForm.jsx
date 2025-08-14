import { useState } from 'react';
import nhost from './nhost';

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
  setError('');
  try {
    let result;
    if (isSignUp) {
      result = await nhost.auth.signUp({ email, password });
    } else {
      result = await nhost.auth.signIn({ email, password });
    }

    if (result.error) {
      throw result.error;
    }

    onAuth(); // refresh app
  } catch (err) {
    setError(err.message || 'Login failed');
  }
};


  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>{isSignUp ? 'Create Account' : 'Login'}</button>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
