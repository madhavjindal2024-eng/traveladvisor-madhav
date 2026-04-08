import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import { RegisterForm } from '../components/auth/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Combined login and register on a single glass card.
 */
export function Auth() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <PageWrapper>
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="glass-card w-full max-w-md p-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">JWT is stored in an httpOnly cookie.</p>
          <div className="mt-6 flex gap-2 rounded-xl bg-[var(--bg-card)] p-1">
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 text-sm ${mode === 'login' ? 'bg-[var(--accent-primary)]/25' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 text-sm ${mode === 'register' ? 'bg-[var(--accent-primary)]/25' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
          <div className="mt-6">
            {mode === 'login' ? (
              <LoginForm onSuccess={() => navigate(from, { replace: true })} />
            ) : (
              <RegisterForm onSuccess={() => navigate(from, { replace: true })} />
            )}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Google OAuth can be wired on the server when client IDs are available.
          </p>
        </div>
      </main>
    </PageWrapper>
  );
}
