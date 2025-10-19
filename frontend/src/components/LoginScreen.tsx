import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from './ui/alert';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (password !== passwordConfirm) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        await register({ 
          email, 
          password, 
          password_confirm: passwordConfirm,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
        });
      } else {
        await login({ email, password });
      }
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-orange-500 mb-2 text-2xl font-bold">Dishly</h1>
          <p className="text-gray-500 text-center">Your Personal Chef Assistant</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">First Name (Optional)</label>
                <Input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name (Optional)</label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          {isRegistering && (
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full"
                required
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isRegistering ? 'Sign Up' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-orange-500 font-medium hover:underline"
            >
              {isRegistering ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
