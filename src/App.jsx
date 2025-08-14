import { useEffect, useState } from 'react';
import nhost from './nhost';
import AuthForm from './AuthForm';
import ChatPage from './ChatPage'; // your main app

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(nhost.auth.isAuthenticated());

  useEffect(() => {
    const unsubscribe = nhost.auth.onAuthStateChanged(() => {
      setIsLoggedIn(nhost.auth.isAuthenticated());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {isLoggedIn ? <ChatPage /> : <AuthForm onAuth={() => setIsLoggedIn(true)} />}
    </div>
  );
}
