import { useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { isValidEmail, passwordStrength } from '../../utils/validators.js';

/**
 * Registration form with inline validation.
 * @param {{ onSuccess?: () => void }} props
 */
export function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
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
    const pw = passwordStrength(password);
    if (pw) {
      setError(pw);
      return;
    }
    try {
      await register({ email, password, name });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
