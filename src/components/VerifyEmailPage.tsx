import React, { useState, useRef, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VerifyEmailPageProps {
  email?: string;
  onEmailChange?: (newEmail: string) => void;
  onNavigateSignIn: () => void;
  onNavigateCreateAccount: () => void;
  onNavigateHome: () => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({
  email: initialEmail = '',
  onEmailChange,
  onNavigateSignIn,
  onNavigateCreateAccount,
  onNavigateHome,
}) => {
  // Temporary email in memory for preview
  const [currentEmail, setCurrentEmail] = useState(initialEmail);

  // 4-digit verification code states (supports leading zeros, e.g. '0123')
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Verification state (demo only: 1234 triggers success)
  const [isVerified, setIsVerified] = useState(false);

  // Inline email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmailValue, setEditEmailValue] = useState(initialEmail);
  const [editError, setEditError] = useState<string | null>(null);

  // Input refs for 4-digit code and editing email
  const digit0Ref = useRef<HTMLInputElement>(null);
  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digitRefs = [digit0Ref, digit1Ref, digit2Ref, digit3Ref];

  const editInputRef = useRef<HTMLInputElement>(null);

  // Sync initial email when prop changes
  useEffect(() => {
    if (initialEmail && initialEmail !== currentEmail) {
      setCurrentEmail(initialEmail);
      setEditEmailValue(initialEmail);
    }
  }, [initialEmail]);

  // Auto-focus first digit input on mount if email exists
  useEffect(() => {
    if (currentEmail && !isVerified && !isEditingEmail) {
      digitRefs[0].current?.focus();
    }
  }, [currentEmail, isVerified, isEditingEmail]);

  // Focus input when editing email begins
  useEffect(() => {
    if (isEditingEmail) {
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [isEditingEmail]);

  // Handle single digit input change
  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric digits
    const numeric = val.replace(/\D/g, '');
    const char = numeric ? numeric.slice(-1) : '';

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setCodeError(null);
    setResendNotice(null);

    // Auto-advance focus to next digit if character was entered
    if (char && index < 3) {
      digitRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace and arrow navigation across digit boxes
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current box is already empty; clear and focus previous box
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        digitRefs[index - 1].current?.focus();
      } else {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
      setCodeError(null);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      digitRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      digitRefs[index + 1].current?.focus();
    }
  };

  // Handle pasting complete 4-digit code (e.g. "1234", "0482")
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numeric = pasteData.replace(/\D/g, '').slice(0, 4);

    if (!numeric) return;

    const newDigits = [...digits];
    for (let i = 0; i < 4; i++) {
      newDigits[i] = numeric[i] || '';
    }
    setDigits(newDigits);
    setCodeError(null);
    setResendNotice(null);

    // Focus the box corresponding to the last entered character or 4th box
    const focusIndex = Math.min(numeric.length, 3);
    digitRefs[focusIndex].current?.focus();
  };

  // Verify Email action
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setResendNotice(null);

    const fullCode = digits.join('');

    if (fullCode.length < 4) {
      setCodeError('Please enter all 4 digits.');
      const firstEmptyIndex = digits.findIndex((d) => !d);
      if (firstEmptyIndex !== -1) {
        digitRefs[firstEmptyIndex].current?.focus();
      }
      return;
    }

    // Demo rule: code 1234 verifies successfully, any other code displays "Incorrect code. Please try again."
    if (fullCode === '1234') {
      setCodeError(null);
      setIsVerified(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCodeError('Incorrect code. Please try again.');
      digitRefs[0].current?.focus();
      digitRefs[0].current?.select();
    }
  };

  // Resend code action
  const handleResendCode = () => {
    setCodeError(null);
    setResendNotice('Demo only — no email sent.');
  };

  // Inline Email Editing: Save
  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editEmailValue.trim();

    if (!trimmed) {
      setEditError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEditError('Please enter a valid email address.');
      return;
    }

    setEditError(null);
    setCurrentEmail(trimmed);
    if (onEmailChange) {
      onEmailChange(trimmed);
    }
    setIsEditingEmail(false);
    setDigits(['', '', '', '']);
    setCodeError(null);
    setResendNotice('Email address updated. Demo code is 1234.');
  };

  // Inline Email Editing: Cancel
  const handleCancelEdit = () => {
    setEditEmailValue(currentEmail);
    setEditError(null);
    setIsEditingEmail(false);
  };

  return (
    <main className="w-full bg-white text-[#111827] flex-1">
      {/* Full-width container with comfortable top/bottom padding (~40–48px) */}
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto py-10 sm:py-12 flex items-center justify-center">
        {/* Compact verification area (approx 440–500px wide, centered) */}
        <div className="w-full max-w-[480px] flex flex-col items-center">
          {/* Small, restrained envelope icon */}
          <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center text-[#0A3D36] mb-4 shrink-0">
            <Mail className="w-6 h-6" aria-hidden="true" />
          </div>

          {/* Heading */}
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#111827] text-center mb-2">
            Verify Your Email
          </h1>

          {/* Case 1: Opened without registration email */}
          {!currentEmail ? (
            <div className="w-full text-center space-y-4 pt-2">
              <p className="text-base text-[#4B5563] font-medium">
                No email address selected.
              </p>

              <p className="text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed">
                Please complete the account creation form first to test email verification in this design preview.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={onNavigateCreateAccount}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={onNavigateSignIn}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] hover:bg-neutral-50 border border-neutral-300 rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                >
                  Back to Sign In
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-xs text-[#64748B] hover:text-[#111827] hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          ) : isVerified ? (
            /* Case 2: Code 1234 Verification Preview Complete */
            <div
              role="status"
              aria-live="polite"
              className="w-full mt-4 p-6 sm:p-7 bg-[#F1F7F4]/60 border border-[#0A3D36]/25 rounded-md text-center flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#E0ECE6] flex items-center justify-center text-[#0A3D36] mb-3 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#111827] mb-2">
                Verification Preview Complete
              </h2>

              <p className="text-sm text-[#334155] leading-relaxed mb-1">
                Your email address <strong className="text-[#111827] font-semibold">{currentEmail}</strong> has been confirmed.
              </p>

              <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mb-6">
                Design preview demonstration. In the live platform, single-use codes expire and are authoritatively verified on the server.
              </p>

              <button
                type="button"
                onClick={onNavigateSignIn}
                className="w-full py-3 px-4 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
              >
                Continue to Sign In
              </button>

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
          ) : (
            /* Case 3: 4-Digit Code Entry Screen */
            <div className="w-full flex flex-col items-center">
              {/* Prominently displayed email address */}
              <p className="text-center text-sm sm:text-base font-semibold text-[#111827] break-words break-all px-2 select-all mb-1.5">
                {currentEmail}
              </p>

              {/* Instruction */}
              <p className="text-sm text-[#4B5563] text-center leading-relaxed mb-2 max-w-sm">
                Enter the 4-digit code sent to your email.
              </p>

              {/* Discreet Demo Line */}
              <p className="text-xs text-[#64748B] text-center mb-6">
                Demo only — use 1234. No email is sent.
              </p>

              {/* Inline Email Editing Form if requested */}
              {isEditingEmail && (
                <form
                  onSubmit={handleSaveEmail}
                  noValidate
                  className="w-full p-4 mb-6 bg-white border border-[#CBD5E1] rounded-md space-y-3"
                >
                  <label
                    htmlFor="edit-preview-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155]"
                  >
                    Change Email Address
                  </label>
                  <input
                    ref={editInputRef}
                    id="edit-preview-email"
                    type="email"
                    value={editEmailValue}
                    onChange={(e) => {
                      setEditEmailValue(e.target.value);
                      if (editError) setEditError(null);
                    }}
                    placeholder="Enter new email address"
                    aria-invalid={Boolean(editError)}
                    aria-describedby={editError ? 'edit-email-error' : undefined}
                    className={`w-full px-3 py-2 text-sm text-[#111827] bg-white border rounded-md outline-none transition-colors ${
                      editError
                        ? 'border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {editError && (
                    <p id="edit-email-error" className="text-xs text-[#DC2626] font-medium">
                      {editError}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:text-[#111827] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* 4-Digit Code Entry Form */}
              <form onSubmit={handleVerify} noValidate className="w-full flex flex-col items-center">
                {/* Neatly aligned digit boxes with inline validation beside/below without pop-ups */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
                  {/* Four Neatly Aligned Digit Boxes */}
                  <div className="flex items-center gap-3 sm:gap-3.5" role="group" aria-label="4-digit verification code">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={digitRefs[index]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete="one-time-code"
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        aria-label={`Digit ${index + 1} of 4`}
                        aria-invalid={Boolean(codeError)}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold font-mono text-[#111827] bg-white border rounded-md transition-all focus:outline-none focus:ring-2 ${
                          codeError
                            ? 'border-[#DC2626] text-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                            : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Validation message shown beside the code field without pop-ups */}
                  {codeError && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#DC2626] bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-2 rounded-md transition-opacity"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{codeError}</span>
                    </div>
                  )}
                </div>

                {/* Primary Oceanic Green Button: "Verify Email" */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2 mb-4"
                >
                  Verify Email
                </button>

                {/* Below: Didn’t receive the code? Resend Code */}
                <div className="text-center text-sm text-[#4B5563] mb-1">
                  <span>Didn’t receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                  >
                    Resend Code
                  </button>
                </div>

                {/* Resend status inline notice */}
                {resendNotice && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-xs text-[#0A3D36] font-medium text-center mb-2"
                  >
                    {resendNotice}
                  </p>
                )}

                {/* Small links: "Change Email" and "Back to Sign In" */}
                <div className="mt-4 flex flex-col items-center gap-2.5 text-center">
                  {!isEditingEmail && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEmail(true);
                        setEditEmailValue(currentEmail);
                        setCodeError(null);
                        setResendNotice(null);
                      }}
                      className="text-xs sm:text-sm text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                    >
                      Change Email
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onNavigateSignIn}
                    className="text-xs sm:text-sm text-[#4B5563] hover:text-[#111827] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                  >
                    Back to Sign In
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="text-xs text-[#64748B] hover:text-[#111827] hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs pt-1"
                  >
                    ← Back to Home
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
