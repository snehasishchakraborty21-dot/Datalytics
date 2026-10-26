import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, CheckCircle2, AlertCircle, X, Check } from 'lucide-react';

interface CreateAccountPageProps {
  onNavigateHome: () => void;
  onNavigateSignIn: () => void;
  onNavigateVerifyEmail?: (email: string) => void;
}

const COUNTRIES = [
  'Zambia',
  'Kenya',
  'South Africa',
  'Nigeria',
  'Ghana',
  'Rwanda',
  'Tanzania',
  'Uganda',
  'Ethiopia',
  'Egypt',
  'Morocco',
  'Senegal',
  'Angola',
  'Botswana',
  'Namibia',
  'Zimbabwe',
  'Mauritius',
  'Cote d’Ivoire',
  'Mozambique',
  'Democratic Republic of Congo',
  'Cameroon',
  'United Kingdom',
  'United States',
  'Canada',
  'France',
  'Germany',
  'Switzerland',
  'United Arab Emirates',
  'Other Country',
];

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({
  onNavigateHome,
  onNavigateSignIn,
  onNavigateVerifyEmail,
}) => {
  // Form input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Country dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  // Errors and submission states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal notice state for terms/privacy preview
  const [policyNotice, setPolicyNotice] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Image load states
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Field element refs for keyboard focus on error
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const policyCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Filter countries by search query
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase().trim())
  );

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key for policy notice modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && policyNotice.isOpen) {
        setPolicyNotice({ isOpen: false, title: '', message: '' });
      }
    };
    if (policyNotice.isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => policyCloseBtnRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [policyNotice.isOpen]);

  // Form submission validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate First Name (support international names)
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    // Validate Last Name (support international names)
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    // Validate Email Address
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate Country selection
    if (!country.trim()) {
      newErrors.country = 'Please select your country.';
    }

    // Validate Password (at least 6 characters)
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Validate Agreement Checkbox
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions and Privacy Policy.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first invalid field
      if (newErrors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (newErrors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.country && countryBtnRef.current) {
        countryBtnRef.current.focus();
      } else if (newErrors.password && passwordRef.current) {
        passwordRef.current.focus();
      } else if (newErrors.confirmPassword && confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      } else if (newErrors.agreeTerms && termsCheckboxRef.current) {
        termsCheckboxRef.current.focus();
      }
      return;
    }

    // Successful preview submission - open email verification directly
    // Clear both password fields for security, never pass passwords to verification state
    setPassword('');
    setConfirmPassword('');
    if (onNavigateVerifyEmail) {
      onNavigateVerifyEmail(trimmedEmail);
    }
  };

  const handleOpenPolicy = (title: string) => {
    setPolicyNotice({
      isOpen: true,
      title,
      message: `The complete ${title} document will be published alongside institutional customer onboarding. All account details entered here remain securely preserved on your device.`,
    });
  };

  return (
    <main className="w-full bg-white text-[#111827] flex-1">
      {/* Full-width container aligned with 56–64px desktop gutters and ~40px top/bottom padding */}
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Authentic African Commercial District Photograph (hidden on mobile, 480-520px tall on desktop) */}
          <div className="hidden lg:flex lg:col-span-6 w-full flex-col justify-center">
            <figure className="w-full flex flex-col m-0">
              <div className="relative w-full h-[500px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
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
                      African Commercial District
                    </span>
                    <p className="text-xs text-[#525B66] max-w-xs font-sans">
                      Modern financial institutions and regional commercial enterprise
                    </p>
                  </div>
                )}

                {!imgError && (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Britam_Tower_and_surrounding_buildings_in_sunlight_from_Radisson_Blu_hotel%2C_Nairobi%2C_KE.jpg/1280px-Britam_Tower_and_surrounding_buildings_in_sunlight_from_Radisson_Blu_hotel%2C_Nairobi%2C_KE.jpg"
                    alt="Britam Tower and commercial financial towers in sunlight in the Upper Hill commercial district, Nairobi"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    className={`w-full h-full object-cover object-[center_45%] transition-opacity duration-300 ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                Photo: Daniel Case (CC BY-SA 4.0 via Wikimedia Commons)
              </p>
            </figure>
          </div>

          {/* Right Column: Registration Form (approx 520px wide, vertically centered beside photograph) */}
          <div className="w-full lg:col-span-6 flex justify-center items-center py-2 lg:py-0">
            <div className="w-full max-w-[520px] flex flex-col justify-center">
              {/* Heading without supporting paragraph or step indicator, reduced ~24px gap below */}
              <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#111827] mb-6 text-left">
                Create Account
              </h1>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Row 1: First Name | Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="ca-first-name"
                          className="block text-sm font-medium text-[#111827] mb-1.5"
                        >
                          First Name <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          ref={firstNameRef}
                          id="ca-first-name"
                          type="text"
                          name="given-name"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (errors.firstName) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.firstName;
                                return next;
                              });
                            }
                          }}
                          placeholder="Enter your first name"
                          aria-required="true"
                          aria-invalid={Boolean(errors.firstName)}
                          aria-describedby={errors.firstName ? 'ca-first-name-error' : undefined}
                          className={`w-full h-10 px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                            errors.firstName
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                              : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                          }`}
                        />
                        {errors.firstName && (
                          <p
                            id="ca-first-name-error"
                            className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.firstName}</span>
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="ca-last-name"
                          className="block text-sm font-medium text-[#111827] mb-1.5"
                        >
                          Last Name <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          ref={lastNameRef}
                          id="ca-last-name"
                          type="text"
                          name="family-name"
                          autoComplete="family-name"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (errors.lastName) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.lastName;
                                return next;
                              });
                            }
                          }}
                          placeholder="Enter your last name"
                          aria-required="true"
                          aria-invalid={Boolean(errors.lastName)}
                          aria-describedby={errors.lastName ? 'ca-last-name-error' : undefined}
                          className={`w-full h-10 px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                            errors.lastName
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                              : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                          }`}
                        />
                        {errors.lastName && (
                          <p
                            id="ca-last-name-error"
                            className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.lastName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Email Address — full width */}
                    <div>
                      <label
                        htmlFor="ca-email"
                        className="block text-sm font-medium text-[#111827] mb-1.5"
                      >
                        Email Address <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        ref={emailRef}
                        id="ca-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.email;
                              return next;
                            });
                          }
                        }}
                        placeholder="Enter your email address"
                        aria-required="true"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'ca-email-error' : undefined}
                        className={`w-full h-10 px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                            : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="ca-email-error"
                          className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Row 3: Country | Organization (optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Country (Searchable Selection) */}
                      <div className="relative" ref={countryDropdownRef}>
                        <label
                          htmlFor="ca-country-btn"
                          className="block text-sm font-medium text-[#111827] mb-1.5"
                        >
                          Country <span className="text-[#DC2626]">*</span>
                        </label>
                        <button
                          ref={countryBtnRef}
                          id="ca-country-btn"
                          type="button"
                          onClick={() => {
                            setCountryDropdownOpen((prev) => !prev);
                            setCountrySearch('');
                            if (!countryDropdownOpen) {
                              setTimeout(() => countryInputRef.current?.focus(), 50);
                            }
                          }}
                          className={`w-full h-10 px-3.5 py-2.5 text-sm text-left bg-white border rounded-md flex items-center justify-between outline-none cursor-pointer transition-colors focus:outline-none focus:ring-2 ${
                            errors.country
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                              : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                          }`}
                          aria-haspopup="listbox"
                          aria-expanded={countryDropdownOpen}
                          aria-required="true"
                          aria-invalid={Boolean(errors.country)}
                          aria-describedby={errors.country ? 'ca-country-error' : undefined}
                        >
                          <span className={`truncate ${country ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                            {country || 'Select your country'}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0 ml-1" />
                        </button>

                        {countryDropdownOpen && (
                          <div className="absolute z-30 mt-1 w-full bg-white border border-[#CBD5E1] rounded-md shadow-lg max-h-60 flex flex-col overflow-hidden">
                            <div className="p-2 border-b border-[#E5E9E7] bg-[#F8FAFC]">
                              <input
                                ref={countryInputRef}
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Type to filter country..."
                                className="w-full px-2.5 py-1.5 text-xs text-[#111827] bg-white border border-[#CBD5E1] rounded-xs outline-none focus:border-[#0A3D36]"
                              />
                            </div>
                            <div
                              className="overflow-y-auto max-h-48 py-1 divide-y divide-[#F1F5F9]"
                              role="listbox"
                            >
                              {filteredCountries.length === 0 ? (
                                <div className="px-3.5 py-2 text-xs text-[#64748B]">
                                  No matching country
                                </div>
                              ) : (
                                filteredCountries.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                      setCountry(c);
                                      setCountryDropdownOpen(false);
                                      if (errors.country) {
                                        setErrors((prev) => {
                                          const next = { ...prev };
                                          delete next.country;
                                          return next;
                                        });
                                      }
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#F1F7F4] hover:text-[#0A3D36] flex items-center justify-between cursor-pointer transition-colors"
                                    role="option"
                                    aria-selected={country === c}
                                  >
                                    <span>{c}</span>
                                    {country === c && <Check className="w-3.5 h-3.5 text-[#0A3D36]" />}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {errors.country && (
                          <p
                            id="ca-country-error"
                            className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.country}</span>
                          </p>
                        )}
                      </div>

                      {/* Organization (Optional) */}
                      <div>
                        <label
                          htmlFor="ca-organization"
                          className="block text-sm font-medium text-[#111827] mb-1.5"
                        >
                          Organization <span className="text-xs text-[#64748B] font-normal">(optional)</span>
                        </label>
                        <input
                          id="ca-organization"
                          type="text"
                          name="organization"
                          autoComplete="organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Company or university"
                          className="w-full h-10 px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border border-[#D1D5DB] rounded-md transition-colors focus:outline-none focus:border-[#0A3D36] focus:ring-2 focus:ring-[#0A3D36]/20"
                        />
                      </div>
                    </div>

                    {/* Row 4: Password | Confirm Password (aligned with visibility buttons and single requirement beneath row) */}
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                          <label
                            htmlFor="ca-password"
                            className="block text-sm font-medium text-[#111827] mb-1.5"
                          >
                            Password <span className="text-[#DC2626]">*</span>
                          </label>
                          <div className="relative">
                            <input
                              ref={passwordRef}
                              id="ca-password"
                              type={showPassword ? 'text' : 'password'}
                              name="new-password"
                              autoComplete="new-password"
                              value={password}
                              minLength={6}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPassword(val);
                                if (errors.password) {
                                  // Clear length error once the 6-character requirement is met
                                  if (val.length >= 6 || (errors.password === 'Password is required.' && val.length > 0)) {
                                    setErrors((prev) => {
                                      const next = { ...prev };
                                      delete next.password;
                                      return next;
                                    });
                                  }
                                }
                              }}
                              placeholder="Create a password"
                              aria-required="true"
                              aria-invalid={Boolean(errors.password)}
                              aria-describedby={
                                errors.password ? 'ca-password-error' : 'ca-password-rule'
                              }
                              className={`w-full h-10 pl-3.5 pr-11 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
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
                              id="ca-password-error"
                              className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.password}</span>
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label
                            htmlFor="ca-confirm-password"
                            className="block text-sm font-medium text-[#111827] mb-1.5"
                          >
                            Confirm Password <span className="text-[#DC2626]">*</span>
                          </label>
                          <div className="relative">
                            <input
                              ref={confirmPasswordRef}
                              id="ca-confirm-password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="new-password"
                              autoComplete="new-password"
                              value={confirmPassword}
                              minLength={6}
                              onChange={(e) => {
                                const val = e.target.value;
                                setConfirmPassword(val);
                                if (errors.confirmPassword) {
                                  if (val === password || (errors.confirmPassword === 'Confirm password is required.' && val.length > 0)) {
                                    setErrors((prev) => {
                                      const next = { ...prev };
                                      delete next.confirmPassword;
                                      return next;
                                    });
                                  }
                                }
                              }}
                              placeholder="Re-enter your password"
                              aria-required="true"
                              aria-invalid={Boolean(errors.confirmPassword)}
                              aria-describedby={
                                errors.confirmPassword ? 'ca-confirm-password-error' : undefined
                              }
                              className={`w-full h-10 pl-3.5 pr-11 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                                errors.confirmPassword
                                  ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20'
                                  : 'border-[#D1D5DB] focus:border-[#0A3D36] focus:ring-[#0A3D36]/20'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-r-md cursor-pointer"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" aria-hidden="true" />
                              ) : (
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p
                              id="ca-confirm-password-error"
                              className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.confirmPassword}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Single concise requirement beneath the entire password row so inputs remain aligned */}
                      <p id="ca-password-rule" className="mt-1.5 text-xs text-[#64748B]">
                        Use at least 6 characters.
                      </p>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="pt-0.5">
                      <div className="flex items-start gap-2.5">
                        <input
                          ref={termsCheckboxRef}
                          id="ca-agree-terms"
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => {
                            setAgreeTerms(e.target.checked);
                            if (errors.agreeTerms) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.agreeTerms;
                                return next;
                              });
                            }
                          }}
                          aria-required="true"
                          aria-invalid={Boolean(errors.agreeTerms)}
                          aria-describedby={errors.agreeTerms ? 'ca-terms-error' : undefined}
                          className="mt-1 w-4 h-4 rounded text-[#0A3D36] border-[#CBD5E1] focus:ring-[#0A3D36] focus:ring-2 cursor-pointer"
                        />
                        <label
                          htmlFor="ca-agree-terms"
                          className="text-xs sm:text-sm text-[#4B5563] leading-relaxed cursor-pointer"
                        >
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={() => handleOpenPolicy('Terms and Conditions')}
                            className="font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                          >
                            Terms and Conditions
                          </button>{' '}
                          and{' '}
                          <button
                            type="button"
                            onClick={() => handleOpenPolicy('Privacy Policy')}
                            className="font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                          >
                            Privacy Policy
                          </button>
                          . <span className="text-[#DC2626]">*</span>
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p
                          id="ca-terms-error"
                          className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium pl-6"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.agreeTerms}</span>
                        </p>
                      )}
                    </div>

                    {/* Primary Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>

                  {/* Below Button: Already have an account? Sign In */}
                  <div className="mt-5 text-center text-sm text-[#4B5563]">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={onNavigateSignIn}
                      className="font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Discreet Back to Home link */}
                  <div className="mt-3.5 text-center">
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

      {/* Accessible Policy Notice Modal for Terms / Privacy Policy */}
      {policyNotice.isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-notice-title"
        >
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setPolicyNotice({ isOpen: false, title: '', message: '' })}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-md border border-[#E5E9E7] shadow-xl overflow-hidden z-10 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E7] mb-4">
              <h3 id="policy-notice-title" className="text-base font-semibold text-[#111827]">
                {policyNotice.title}
              </h3>
              <button
                ref={policyCloseBtnRef}
                type="button"
                onClick={() => setPolicyNotice({ isOpen: false, title: '', message: '' })}
                className="p-1 text-[#64748B] hover:text-[#111827] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                aria-label="Close document notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
              {policyNotice.message}
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPolicyNotice({ isOpen: false, title: '', message: '' })}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
              >
                Return to Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
