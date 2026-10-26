import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronDown, Check, Upload, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ConsultingPageProps {
  onNavigateHome: () => void;
}

const CONSULTING_SERVICES = [
  {
    title: 'Custom Data Research',
    description: 'Find information relevant to your market, industry or research question.',
  },
  {
    title: 'Market and Industry Analysis',
    description: 'Explore market conditions, sector trends and business opportunities.',
  },
  {
    title: 'Data Cleaning and Preparation',
    description: 'Organize and prepare existing data for analysis.',
  },
  {
    title: 'Statistical Analysis',
    description: 'Examine patterns, relationships and findings within your data.',
  },
  {
    title: 'Data Visualization',
    description: 'Communicate findings through clear charts, dashboards and visual reports.',
  },
  {
    title: 'Custom Reports and Advisory',
    description: 'Request focused reports and guidance for a defined business need.',
  },
];

const SERVICE_OPTIONS = [
  'Custom Data Research',
  'Market and Industry Analysis',
  'Data Cleaning and Preparation',
  'Statistical Analysis',
  'Data Visualization',
  'Custom Reports and Advisory',
  'Other',
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

export const ConsultingPage: React.FC<ConsultingPageProps> = ({ onNavigateHome }) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [projectRequirements, setProjectRequirements] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Searchable Country Dropdown state
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Form Validation & Submission state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Image load & fallback states
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [processImgLoaded, setProcessImgLoaded] = useState(false);
  const [processImgError, setProcessImgError] = useState(false);

  // Scroll to form smoothly
  const scrollToForm = () => {
    const el = document.getElementById('consulting-enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceFromSection = (serviceTitle: string) => {
    setServiceRequired(serviceTitle);
    if (errors.serviceRequired) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.serviceRequired;
        return next;
      });
    }
    scrollToForm();
  };

  // Close country dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    if (countryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [countryDropdownOpen]);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        supportingDocument: 'File exceeds 10MB limit. Please upload a smaller document.',
      }));
      setAttachedFile(null);
      return;
    }

    // Validate format (PDF or CSV)
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'csv') {
      setErrors((prev) => ({
        ...prev,
        supportingDocument: 'Only PDF and CSV file formats are supported.',
      }));
      setAttachedFile(null);
      return;
    }

    // Valid
    setErrors((prev) => {
      const next = { ...prev };
      delete next.supportingDocument;
      return next;
    });
    setAttachedFile(file);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.supportingDocument;
      return next;
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please provide a valid email address.';
      }
    }

    if (!country.trim()) {
      newErrors.country = 'Please select your country.';
    }

    if (!serviceRequired.trim()) {
      newErrors.serviceRequired = 'Please select the service required.';
    }

    if (preferredDate) {
      const selected = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.preferredDate = 'Preferred completion date must be in the future.';
      }
    }

    if (!projectRequirements.trim()) {
      newErrors.projectRequirements = 'Please describe your project requirements.';
    }

    if (!agreedToPolicy) {
      newErrors.agreedToPolicy = 'You must agree to the Privacy Policy to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      scrollToForm();
    }
  };

  // Filter countries in dropdown
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white min-h-[70vh] py-8 md:py-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* TOP BREADCRUMB */}
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
          <span className="text-[#111827] font-semibold">Consulting</span>
        </nav>

        {/* 1. BALANCED SPLIT HERO */}
        <section aria-label="Consulting Overview" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: Heading, Description & Primary Action */}
            <div className="flex flex-col justify-center">
              <div className="mb-3.5">
                <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                  Specialist Research &amp; Advisory
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.12] mb-4">
                Research and insights for your next decision.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-7">
                Request specialist support with data research, analysis and reporting.
              </p>

              <div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  <span>Discuss Your Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Realistic Landscape Photograph of Professionals Reviewing Data */}
            <div className="w-full">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[390px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!heroImgLoaded || heroImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Research &amp; Analysis
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Professionals reviewing research and data analytics together
                      </p>
                    </div>
                  )}

                  {!heroImgError && (
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80"
                      alt="African professionals and researchers reviewing data and reports together in a collaborative office"
                      loading="eager"
                      onLoad={() => setHeroImgLoaded(true)}
                      onError={() => setHeroImgError(true)}
                      className={`w-full h-full object-cover object-center transition-opacity duration-300 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <figcaption className="mt-2 text-[11px] sm:text-xs text-[#64748B] font-sans px-0.5">
                  Research consultation, analytical reporting and project review
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 2. CONSULTING SERVICES: 6 Services in 3 Columns */}
        <section aria-labelledby="services-heading" className="mb-14 md:mb-20">
          <div className="mb-8">
            <h2
              id="services-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              How we can help
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-12 gap-y-8 md:gap-y-10">
            {CONSULTING_SERVICES.map((service, index) => (
              <div
                key={service.title}
                className="flex flex-col justify-between p-5 md:p-6 bg-[#F9FBFA] hover:bg-[#F2F8F5] border border-[#E2E8F0]/80 rounded-md transition-colors group"
              >
                <div>
                  <span className="text-xs font-mono font-medium text-[#0A3D36] block mb-2">
                    0{index + 1}
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight mb-2.5 group-hover:text-[#0A3D36] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectServiceFromSection(service.title)}
                    className="inline-flex items-center gap-1.5 text-xs md:text-[13px] font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                    aria-label={`Select ${service.title} and discuss requirements`}
                  >
                    <span>Request this service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW THE ENGAGEMENT WORKS: Alternating Image & Process */}
        <section aria-labelledby="process-heading" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Second Large Photograph (Reviewing printed reports / findings) */}
            <div className="lg:col-span-5 w-full order-2 lg:order-1">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[240px] sm:h-[280px] md:h-[340px] lg:h-[370px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!processImgLoaded || processImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Practical Research
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Reviewing analytical findings and scoping project deliverables
                      </p>
                    </div>
                  )}

                  {!processImgError && (
                    <img
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
                      alt="Practical research and data analysis activity reviewing printed findings and data reports"
                      loading="lazy"
                      onLoad={() => setProcessImgLoaded(true)}
                      onError={() => setProcessImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${processImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <figcaption className="mt-2 text-[11px] sm:text-xs text-[#64748B] font-sans px-0.5">
                  Reviewing research documentation, data tables and project findings
                </figcaption>
              </figure>
            </div>

            {/* Right: 3-step Clean Process with number beside title */}
            <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
              <h2
                id="process-heading"
                className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-6"
              >
                From your question to a defined project
              </h2>

              <div className="space-y-6 sm:space-y-7">
                {/* Step 1 */}
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                    <span className="text-[#0A3D36] mr-2">1.</span>
                    <span>Share Your Requirements</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                    Tell us what you need and the outcome you are working towards.
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                    <span className="text-[#0A3D36] mr-2">2.</span>
                    <span>Agree the Scope</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                    The team reviews your request and prepares a proposed scope, timeline and quotation.
                  </p>
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                    <span className="text-[#0A3D36] mr-2">3.</span>
                    <span>Review the Deliverables</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                    Work proceeds after approval, with deliverables reviewed against the agreed scope.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONSULTING ENQUIRY FORM */}
        <section
          id="consulting-enquiry-form"
          aria-labelledby="enquiry-form-heading"
          className="scroll-mt-24 pt-4"
        >
          <div className="mb-6">
            <h2
              id="enquiry-form-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-2"
            >
              Discuss Your Requirements
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              Complete the form below to outline your research, analysis or reporting requirements. Our specialist team will review your specifications.
            </p>
          </div>

          {/* Submission Success Screen (in-memory preview) */}
          {isSubmitted ? (
            <div className="bg-[#F2F8F5] border border-[#DDEBE5] rounded-md p-6 sm:p-8 md:p-10 text-center max-w-2xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-[#0A3D36] text-white flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#111827] mb-3">
                Preview complete. Your enquiry has not been sent.
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 font-sans max-w-md mx-auto">
                This website is currently an illustrative frontend prototype. Your submitted parameters have been retained in local browser memory.
              </p>

              <div className="text-left bg-white p-4 sm:p-5 rounded-sm border border-[#E5E9E7] mb-6 text-xs sm:text-sm space-y-2">
                <div>
                  <span className="font-semibold text-[#111827]">Contact:</span> {fullName} ({email})
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
                  <span className="font-semibold text-[#111827]">Service:</span> {serviceRequired}
                </div>
                {preferredDate && (
                  <div>
                    <span className="font-semibold text-[#111827]">Preferred Date:</span> {preferredDate}
                  </div>
                )}
                {attachedFile && (
                  <div>
                    <span className="font-semibold text-[#111827]">Attached:</span> {attachedFile.name} ({(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
                <div className="pt-2 border-t border-[#F1F5F9] text-[#475569]">
                  <span className="font-semibold text-[#111827] block mb-1">Requirements Summary:</span>
                  <p className="line-clamp-3 italic font-sans">{projectRequirements}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#0A3D36] hover:text-[#072C27] bg-white border border-[#CBD5E1] rounded-sm transition-colors cursor-pointer hover:bg-[#F8FAFC]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Full Name <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <input
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
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Email Address <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <input
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
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.email}</p>
                  )}
                </div>

                {/* Organization (Optional) */}
                <div>
                  <label htmlFor="organization" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Organization <span className="text-xs text-[#64748B] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Institution, company or university"
                    className="w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none transition-colors"
                  />
                </div>

                {/* Country (Required, Searchable selection) */}
                <div className="relative" ref={countryDropdownRef}>
                  <label htmlFor="country-btn" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Country <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <button
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
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.country}</p>
                  )}
                </div>

                {/* Service Required (Required, 6 services + Other, not preselected) */}
                <div>
                  <label htmlFor="serviceRequired" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Service Required <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <select
                    id="serviceRequired"
                    value={serviceRequired}
                    onChange={(e) => {
                      setServiceRequired(e.target.value);
                      if (errors.serviceRequired) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.serviceRequired;
                          return n;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-sm outline-none transition-colors cursor-pointer ${
                      serviceRequired ? 'text-[#111827]' : 'text-[#64748B]'
                    } ${
                      errors.serviceRequired
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  >
                    <option value="" disabled>
                      Select a consulting service
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="text-[#111827]">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.serviceRequired && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.serviceRequired}</p>
                  )}
                </div>

                {/* Preferred Completion Date (Optional, Future Date) */}
                <div>
                  <label htmlFor="preferredDate" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Preferred Completion Date <span className="text-xs text-[#64748B] font-normal normal-case">(optional, future date)</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.preferredDate) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.preferredDate;
                          return n;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors cursor-pointer ${
                      errors.preferredDate
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.preferredDate}</p>
                  )}
                </div>
              </div>

              {/* Project Requirements (Required, Full-width Textarea) */}
              <div>
                <label htmlFor="projectRequirements" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                  Project Requirements <span className="text-[#0A3D36] font-bold">*</span>
                </label>
                <textarea
                  id="projectRequirements"
                  rows={5}
                  value={projectRequirements}
                  onChange={(e) => {
                    setProjectRequirements(e.target.value);
                    if (errors.projectRequirements) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.projectRequirements;
                        return n;
                      });
                    }
                  }}
                  placeholder="Outline your research questions, datasets of interest, expected deliverables and timeline objectives."
                  className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                    errors.projectRequirements
                      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                      : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                  }`}
                />
                {errors.projectRequirements && (
                  <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.projectRequirements}</p>
                )}
              </div>

              {/* Supporting Document (Optional, PDF or CSV, max 10MB) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                  Supporting Document <span className="text-xs text-[#64748B] font-normal normal-case">(optional, PDF or CSV, max 10MB)</span>
                </label>

                {attachedFile ? (
                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-sm max-w-md">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-semibold uppercase text-[#0A3D36] bg-[#E0ECE6] px-2 py-0.5 rounded-xs font-mono">
                        {attachedFile.name.split('.').pop()?.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#111827] font-medium truncate">
                        {attachedFile.name}
                      </span>
                      <span className="text-xs text-[#64748B] shrink-0 font-sans">
                        ({(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachedFile}
                      className="p-1 text-[#64748B] hover:text-[#111827] cursor-pointer"
                      aria-label="Remove attached document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="supportingDocument"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-sm transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0A3D36]" />
                      <span>Choose File</span>
                    </label>
                    <input
                      type="file"
                      id="supportingDocument"
                      accept=".pdf,.csv"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <span className="text-xs text-[#64748B]">No file chosen</span>
                  </div>
                )}
                {errors.supportingDocument && (
                  <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.supportingDocument}</p>
                )}
              </div>

              {/* Privacy Policy Checkbox (Required) */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => {
                      setAgreedToPolicy(e.target.checked);
                      if (errors.agreedToPolicy) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.agreedToPolicy;
                          return n;
                        });
                      }
                    }}
                    className="w-4 h-4 mt-0.5 rounded-xs border-[#CBD5E1] text-[#0A3D36] focus:ring-[#0A3D36] accent-[#0A3D36] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    I agree to the Privacy Policy.
                  </span>
                </label>
                {errors.agreedToPolicy && (
                  <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.agreedToPolicy}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
