import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface SignInPageProps {
  onNavigateHome: () => void;
  onNavigateCreateAccount?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigateHome,
  onNavigateCreateAccount,
}) => {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & feedback states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Accessible notice dialog state for unbuilt screens
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');

  // Image load states
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Input refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const closeNoticeBtnRef = useRef<HTMLButtonElement>(null);

  // Esc key handler for notice modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && noticeModalOpen) {
        setNoticeModalOpen(false);
      }
    };
    if (noticeModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeNoticeBtnRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [noticeModalOpen]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate password (presence only, no account-creation password rules)
    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Move focus to first invalid field
      if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.password && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    // Valid frontend preview submission
    // Do not connect Firebase or another authentication service
    // Do not send, log or persist credentials
    // Clear password after submission
    setPassword('');
    setPreviewSubmitted(true);
  };

  const handleOpenNotice = (title: string) => {
    setNoticeTitle(title);
    setNoticeModalOpen(true);
  };

  return (
    <main className="w-full bg-white text-[#111827] flex-1">
      {/* Full-width container aligned with 56–64px desktop gutters and ~40px top/bottom padding */}
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Authentic African Business / Urban Development Photograph (hidden on mobile, 480-520px tall on desktop) */}
          <div className="hidden lg:flex lg:col-span-6 w-full flex-col justify-center">
            <figure className="w-full flex flex-col m-0">
              <div className="relative w-full h-[500px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80">
                {(!imgLoaded || imgError) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                    <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                      African Business &amp; Urban Commerce
                    </span>
                    <p className="text-xs text-[#525B66] max-w-xs font-sans">
                      Commercial infrastructure, financial markets and institutional data services
                    </p>
                  </div>
                )}

                {!imgError && (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Sandton_Skyline.jpg"
                    alt="Modern architectural and commercial skyline of Sandton, Johannesburg's premier financial and business district"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    className={`w-full h-full object-cover object-[center_60%] transition-opacity duration-300 ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                Photo: Wikiguy1101 (CC BY-SA 4.0 via Wikimedia Commons)
              </p>
            </figure>
          </div>

          {/* Right Column: Clean Sign-In Form (approx 440px wide, vertically centred beside photograph) */}
          <div className="w-full lg:col-span-6 flex justify-center items-center py-2 lg:py-0">
            <div className="w-full max-w-[440px] flex flex-col justify-center">
              {/* Heading without supporting paragraph */}
              <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#111827] mb-6 md:mb-8 text-left">
                Sign In
              </h1>

              {/* Design Preview Notice Banner after submission */}
              {previewSubmitted && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 p-4 bg-[#F1F7F4] border border-[#0A3D36]/20 rounded-md flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#0A3D36] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#0A3D36]">
                      Preview complete. Authentication is not connected.
                    </p>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      This design demonstration validates form inputs without transmitting credentials.
                    </p>
                  </div>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email Address Field */}
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block text-sm font-medium text-[#111827] mb-1.5"
                  >
                    Email Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="signin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                      if (previewSubmitted) setPreviewSubmitted(false);
                    }}
                    placeholder="Enter your email address"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'signin-email-error' : undefined}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                        : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="signin-email-error"
                      className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="signin-password"
                      className="block text-sm font-medium text-[#111827]"
                    >
                      Password <span className="text-[#DC2626]">*</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      ref={passwordRef}
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: undefined }));
                        }
                        if (previewSubmitted) setPreviewSubmitted(false);
                      }}
                      placeholder="Enter your password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'signin-password-error' : undefined}
                      className={`w-full pl-3.5 pr-11 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                          : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-r-md cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="signin-password-error"
                      className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}

                  {/* "Forgot Password?" link beneath the password field */}
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenNotice('Password Recovery')}
                      className="text-xs sm:text-sm font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Full-width oceanic-green "Sign In" button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  Sign In
                </button>
              </form>

              {/* Below the button: New to Datalytics? Create Account */}
              <div className="mt-6 text-center text-sm text-[#4B5563]">
                <span>New to Datalytics? </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateCreateAccount) {
                      onNavigateCreateAccount();
                    } else {
                      handleOpenNotice('Account Registration');
                    }
                  }}
                  className="font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Create Account
                </button>
              </div>

              {/* Discreet "Back to Home" link */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-xs text-[#64748B] hover:text-[#111827] hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible notice modal for unbuilt screens */}
      {noticeModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="step-notice-title"
        >
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setNoticeModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-sm bg-white rounded-md border border-[#E5E9E7] shadow-xl overflow-hidden z-10 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E7] mb-4">
              <h3 id="step-notice-title" className="text-sm font-semibold text-[#111827]">
                {noticeTitle || 'Notice'}
              </h3>
              <button
                ref={closeNoticeBtnRef}
                type="button"
                onClick={() => setNoticeModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#111827] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                aria-label="Close notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
              This screen will be added in the next design step.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setNoticeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
