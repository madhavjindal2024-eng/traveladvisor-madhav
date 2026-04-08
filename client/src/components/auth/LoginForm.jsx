import { useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { isValidEmail } from '../../utils/validators.js';

/**
 * Login form with inline validation.
 * @param {{ onSuccess?: () => void }} props
 */
export function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
