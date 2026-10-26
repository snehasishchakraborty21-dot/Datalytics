import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, Check, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onNavigateHome: () => void;
  onExploreDatasets: () => void;
  onNavigateConsulting: () => void;
  onNavigateStorage: () => void;
  initialEnquiryType?: string;
}

const ENQUIRY_TYPES = [
  'Dataset Enquiry',
  'Custom Data Request',
  'Consulting',
  'Data Storage',
  'Subscription or Pricing',
  'General Enquiry',
];

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

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  onExploreDatasets,
  onNavigateConsulting,
  onNavigateStorage,
  initialEnquiryType,
}) => {
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [enquiryType, setEnquiryType] = useState(initialEnquiryType || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // UI & Dropdown states
  const [countrySearch, setCountrySearch] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Errors & submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Image load & error states
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  // Field element refs for focusing the first invalid input
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  const enquiryTypeRef = useRef<HTMLSelectElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);

  // Sync initialEnquiryType if prop changes
  useEffect(() => {
    if (initialEnquiryType) {
      setEnquiryType(initialEnquiryType);
    }
  }, [initialEnquiryType]);

  // Close country dropdown on click outside
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

  // Filter countries for searchable selection
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Scroll smoothly to form section with heading visible beneath sticky header
  const handleScrollToForm = () => {
    const formEl = document.getElementById('contact-enquiry-form');
    if (formEl) {
      const yOffset = -90;
      const y = formEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!country.trim()) {
      newErrors.country = 'Please select a country.';
    }

    if (!enquiryType.trim()) {
      newErrors.enquiryType = 'Please select an enquiry type.';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    }

    if (!agreePrivacy) {
      newErrors.agreePrivacy = 'You must agree to the Privacy Policy to proceed.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Move focus to first invalid field
      if (newErrors.fullName && fullNameRef.current) {
        fullNameRef.current.focus();
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.country && countryBtnRef.current) {
        countryBtnRef.current.focus();
      } else if (newErrors.enquiryType && enquiryTypeRef.current) {
        enquiryTypeRef.current.focus();
      } else if (newErrors.subject && subjectRef.current) {
        subjectRef.current.focus();
      } else if (newErrors.message && messageRef.current) {
        messageRef.current.focus();
      } else if (newErrors.agreePrivacy && privacyRef.current) {
        privacyRef.current.focus();
      }
      return;
    }

    // In-memory preview only
    setIsSubmitted(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="w-full bg-white pt-8 md:pt-12 pb-8 md:pb-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* 1. BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#525B66] mb-6 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#0A3D36] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
          >
            Home
          </button>
          <span className="mx-2 text-[#94A3B8]" aria-hidden="true">
            /
          </span>
          <span className="text-[#111827] font-semibold">Contact</span>
        </nav>

        {/* 2. PAGE INTRODUCTION: Balanced Split Section */}
        <section aria-labelledby="contact-intro-heading" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Heading, Description, Action Button */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h1
                id="contact-intro-heading"
                className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.14] mb-4"
              >
                Let’s discuss your data needs.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-7">
                Contact Datalytics about datasets, research, storage or general enquiries.
              </p>

              <div>
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  <span>Send an Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Large authentic photograph of professional discussion / research collaboration */}
            <div className="lg:col-span-6 w-full">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[390px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!heroImgLoaded || heroImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Professional Collaboration
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Research consultation, client engagement and specialist data advisory
                      </p>
                    </div>
                  )}

                  {!heroImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Strategy_Session_-_Wiki_Indaba_2022.jpg/1280px-Strategy_Session_-_Wiki_Indaba_2022.jpg"
                      alt="Professionals and researchers reviewing information and discussing projects together during a strategy session"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      onLoad={() => setHeroImgLoaded(true)}
                      onError={() => setHeroImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: Anass Sedrati (CC BY-SA 4.0 via Wikimedia Commons)
                </p>
              </figure>
            </div>
          </div>
        </section>

        {/* 3. CONTACT FORM SECTION */}
        <section
          id="contact-enquiry-form"
          aria-labelledby="contact-form-heading"
          className="scroll-mt-24 mb-8"
        >
          {/* Heading without supporting paragraph */}
          <h2
            id="contact-form-heading"
            className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-6 md:mb-8"
          >
            Send an Enquiry
          </h2>

          {/* Submission Success Screen (in-memory preview) */}
          {isSubmitted ? (
            <div className="bg-[#F1F7F4] border border-[#CBD5E1] rounded-md p-7 sm:p-9 md:p-11 max-w-3xl animate-in fade-in duration-200">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#E0ECE6] text-[#0A3D36] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-1.5">
                    Preview complete. Your enquiry has not been sent.
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    This is an interactive frontend demonstration. Your entered information has been held in memory only and no transmission was made.
                  </p>
                </div>
              </div>

              {/* Summary of entered fields */}
              <div className="bg-white border border-[#E2E8F0] rounded-sm p-5 mb-6 text-xs sm:text-sm text-[#334155] space-y-2">
                <div>
                  <span className="font-semibold text-[#111827]">Full Name:</span> {fullName}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">Email Address:</span> {email}
                </div>
                {organization && (
                  <div>
                    <span className="font-semibold text-[#111827]">Organization:</span> {organization}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-[#111827]">Country:</span> {country}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">Enquiry Type:</span> {enquiryType}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">Subject:</span> {subject}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">Message:</span>{' '}
                  <p className="mt-1 text-[#475569] whitespace-pre-line pl-2 border-l-2 border-[#CBD5E1]">
                    {message}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#0A3D36] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Form</span>
                </button>
              </div>
            </div>
          ) : (
            /* Full-width two-column form on desktop */
            <form onSubmit={handleSubmit} noValidate className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Full Name <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={fullNameRef}
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.fullName;
                          return n;
                        });
                      }
                    }}
                    placeholder="Enter your full name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Email Address <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.email;
                          return n;
                        });
                      }
                    }}
                    placeholder="name@organization.com"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 3. Organization (Optional) */}
                <div>
                  <label
                    htmlFor="organization"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Organization <span className="text-xs text-[#64748B] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company, institution or university"
                    className="w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none transition-colors"
                  />
                </div>

                {/* 4. Country (Required, Searchable selection) */}
                <div className="relative" ref={countryDropdownRef}>
                  <label
                    htmlFor="country-btn"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Country <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <button
                    ref={countryBtnRef}
                    id="country-btn"
                    type="button"
                    onClick={() => {
                      setCountryDropdownOpen((prev) => !prev);
                      setCountrySearch('');
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm text-left bg-white border rounded-sm flex items-center justify-between outline-none cursor-pointer transition-colors ${
                      errors.country
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={countryDropdownOpen}
                    aria-required="true"
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? 'country-error' : undefined}
                  >
                    <span className={country ? 'text-[#111827]' : 'text-[#94A3B8]'}>
                      {country || 'Select your country'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-[#CBD5E1] rounded-md shadow-lg max-h-60 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-[#E5E9E7] bg-[#F8FAFC]">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Type to filter country..."
                          className="w-full px-2.5 py-1.5 text-xs text-[#111827] bg-white border border-[#CBD5E1] rounded-xs outline-none focus:border-[#0A3D36]"
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48 py-1 divide-y divide-[#F1F5F9]" role="listbox">
                        {filteredCountries.length === 0 ? (
                          <div className="px-3.5 py-2 text-xs text-[#64748B]">No matching country</div>
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
                                    const n = { ...prev };
                                    delete n.country;
                                    return n;
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
                    <p id="country-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* 5. Enquiry Type (Required Dropdown) */}
                <div>
                  <label
                    htmlFor="enquiryType"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Enquiry Type <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <select
                      ref={enquiryTypeRef}
                      id="enquiryType"
                      value={enquiryType}
                      onChange={(e) => {
                        setEnquiryType(e.target.value);
                        if (errors.enquiryType) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.enquiryType;
                            return n;
                          });
                        }
                      }}
                      aria-required="true"
                      aria-invalid={!!errors.enquiryType}
                      aria-describedby={errors.enquiryType ? 'enquiryType-error' : undefined}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-sm outline-none transition-colors appearance-none cursor-pointer pr-10 ${
                        !enquiryType ? 'text-[#94A3B8]' : 'text-[#111827]'
                      } ${
                        errors.enquiryType
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      }`}
                    >
                      <option value="" disabled>
                        Select enquiry type
                      </option>
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type} className="text-[#111827]">
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                  {errors.enquiryType && (
                    <p id="enquiryType-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.enquiryType}
                    </p>
                  )}
                </div>

                {/* 6. Subject (Required) */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Subject <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={subjectRef}
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.subject;
                          return n;
                        });
                      }
                    }}
                    placeholder="Brief subject of your enquiry"
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* 7. Message (Required, Full-width textarea spanning 2 cols) */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-sans"
                  >
                    Message <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    ref={messageRef}
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.message;
                          return n;
                        });
                      }
                    }}
                    placeholder="Provide details about your dataset request, project scope, storage specifications or enquiry..."
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors resize-y ${
                      errors.message
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-red-600 font-medium font-sans">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* 8. Required Privacy Policy Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      ref={privacyRef}
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => {
                        setAgreePrivacy(e.target.checked);
                        if (errors.agreePrivacy) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.agreePrivacy;
                            return n;
                          });
                        }
                      }}
                      aria-required="true"
                      aria-invalid={!!errors.agreePrivacy}
                      className="mt-1 w-4 h-4 rounded-xs border-[#CBD5E1] text-[#0A3D36] focus:ring-[#0A3D36] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      I agree to the Privacy Policy. <span className="text-[#0A3D36] font-bold" aria-hidden="true">*</span>
                    </span>
                  </label>
                  {errors.agreePrivacy && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium font-sans pl-7">
                      {errors.agreePrivacy}
                    </p>
                  )}
                </div>

                {/* 9. Submit Button */}
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                  >
                    <span>Submit Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* 4. USEFUL SERVICE LINKS: Compact row containing only the 3 links */}
        <section aria-label="Other services" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div>
              <button
                type="button"
                onClick={onExploreDatasets}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs group"
              >
                <span>Explore Datasets</span>
                <ArrowRight className="w-4 h-4 text-[#0A3D36] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onNavigateConsulting}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs group"
              >
                <span>Consulting Services</span>
                <ArrowRight className="w-4 h-4 text-[#0A3D36] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onNavigateStorage}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs group"
              >
                <span>Data Storage</span>
                <ArrowRight className="w-4 h-4 text-[#0A3D36] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
