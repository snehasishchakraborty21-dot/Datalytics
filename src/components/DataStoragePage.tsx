import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronDown, Check, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface DataStoragePageProps {
  onNavigateHome: () => void;
}

const STORAGE_SERVICES = [
  {
    title: 'Cloud Storage',
    description: 'Discuss storage requirements for your files and business data.',
  },
  {
    title: 'Backup and Recovery',
    description: 'Explore backup arrangements and recovery requirements.',
  },
  {
    title: 'Data Archiving',
    description: 'Plan storage for records that need to be retained over time.',
  },
  {
    title: 'Database Hosting',
    description: 'Discuss hosting requirements for your application databases.',
  },
  {
    title: 'Data Migration',
    description: 'Request support with moving data between systems or providers.',
  },
  {
    title: 'Managed Storage',
    description: 'Discuss monitoring, access management and ongoing storage support.',
  },
];

const SERVICE_OPTIONS = [
  'Cloud Storage',
  'Backup and Recovery',
  'Data Archiving',
  'Database Hosting',
  'Data Migration',
  'Managed Storage',
  'Other',
];

const CAPACITY_OPTIONS = [
  'Under 100GB',
  '100GB–1TB',
  '1TB–10TB',
  'Above 10TB',
  'Not Sure',
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

export const DataStoragePage: React.FC<DataStoragePageProps> = ({ onNavigateHome }) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [storageCapacity, setStorageCapacity] = useState('');
  const [hostingRegion, setHostingRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

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
  const [planningImgLoaded, setPlanningImgLoaded] = useState(false);
  const [planningImgError, setPlanningImgError] = useState(false);

  // Scroll to form smoothly accounting for sticky header offset
  const scrollToForm = () => {
    const el = document.getElementById('storage-enquiry-form');
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
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

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
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

    if (!storageCapacity.trim()) {
      newErrors.storageCapacity = 'Please select estimated storage capacity.';
    }

    if (startDate) {
      const selected = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.startDate = 'Preferred start date must be in the future.';
      }
    }

    if (!requirements.trim()) {
      newErrors.requirements = 'Please describe your storage requirements.';
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
          <span className="text-[#111827] font-semibold">Data Storage</span>
        </nav>

        {/* 1. BALANCED SPLIT HERO */}
        <section aria-label="Data Storage Overview" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: Heading, Description & Primary Action */}
            <div className="flex flex-col justify-center">
              <div className="mb-3.5">
                <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                  Infrastructure &amp; Storage
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.12] mb-4">
                Storage solutions for your data.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-7">
                Discuss your storage, backup and archiving requirements with the Datalytics team.
              </p>

              <div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  <span>Discuss Storage Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Realistic Landscape Photograph of Server Infrastructure (Bright, Natural Lighting) */}
            <div className="w-full">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[390px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!heroImgLoaded || heroImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 3h13.5m-13.5 3h13.5M6 6.75h12M6 9.75h12M6 3.75h12" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Server Infrastructure
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Commercial enterprise server racks and storage infrastructure
                      </p>
                    </div>
                  )}

                  {!heroImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Ontario_Datacenter_California_7.jpg/1280px-Ontario_Datacenter_California_7.jpg"
                      alt="Modern enterprise server racks with balanced natural lighting in a commercial data center facility"
                      loading="eager"
                      onLoad={() => setHeroImgLoaded(true)}
                      onError={() => setHeroImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: Ontariodatacenter (CC BY-SA 4.0)
                </p>
              </figure>
            </div>
          </div>
        </section>

        {/* 2. STORAGE SERVICES: 6 Services in 3 Columns */}
        <section aria-labelledby="storage-services-heading" className="mb-14 md:mb-20">
          <div className="mb-8">
            <h2
              id="storage-services-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              How we can help
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-12 gap-y-8 md:gap-y-10">
            {STORAGE_SERVICES.map((service, index) => (
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
                    aria-label={`Select ${service.title} and discuss storage requirements`}
                  >
                    <span>Request this service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. REQUIREMENTS AND PLANNING: Alternating Image-Left, Text-Right */}
        <section aria-labelledby="planning-heading" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Second Large Photograph (Engineer inspecting and maintaining server rack equipment) */}
            <div className="lg:col-span-5 w-full order-2 lg:order-1">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[370px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!planningImgLoaded || planningImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Equipment Maintenance
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Systems technician inspecting server racks and infrastructure hardware
                      </p>
                    </div>
                  )}

                  {!planningImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Technician_with_laptop_working_on_server_rack_at_NERSC.jpg/1280px-Technician_with_laptop_working_on_server_rack_at_NERSC.jpg"
                      alt="Systems technician using a laptop to inspect hardware and maintain server rack equipment in a data center facility"
                      loading="lazy"
                      onLoad={() => setPlanningImgLoaded(true)}
                      onError={() => setPlanningImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${planningImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: Derrick Coetzee (CC0)
                </p>
              </figure>
            </div>

            {/* Right: Requirements and Planning Details (No "Workflow" label) */}
            <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
              <h2
                id="planning-heading"
                className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-6"
              >
                Plan the right storage arrangement.
              </h2>

              <ul className="space-y-3.5 mb-6 text-sm md:text-base text-[#334155]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] mt-2 shrink-0" aria-hidden="true" />
                  <span>Required storage capacity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] mt-2 shrink-0" aria-hidden="true" />
                  <span>Access and sharing needs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] mt-2 shrink-0" aria-hidden="true" />
                  <span>Backup and retention requirements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] mt-2 shrink-0" aria-hidden="true" />
                  <span>Preferred hosting location.</span>
                </li>
              </ul>

              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Solutions will depend on your requirements and the capabilities of the selected infrastructure provider.
              </p>
            </div>
          </div>
        </section>

        {/* 4. REQUEST PROCESS: Compact 3-column section */}
        <section aria-labelledby="storage-process-heading" className="mb-14 md:mb-20">
          <div className="mb-6">
            <h2
              id="storage-process-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                <span className="text-[#0A3D36] mr-2">1.</span>
                <span>Share Your Requirements</span>
              </h3>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Tell us what you need to store and how it will be used.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                <span className="text-[#0A3D36] mr-2">2.</span>
                <span>Review the Options</span>
              </h3>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                The team reviews suitable arrangements and prepares a proposed scope and quotation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                <span className="text-[#0A3D36] mr-2">3.</span>
                <span>Agree the Setup</span>
              </h3>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Provisioning and service terms are confirmed before implementation.
              </p>
            </div>
          </div>
        </section>

        {/* 5. STORAGE ENQUIRY FORM */}
        <section
          id="storage-enquiry-form"
          aria-labelledby="storage-form-heading"
          className="scroll-mt-24 pt-4"
        >
          {/* Heading free of supporting paragraphs */}
          <div className="mb-6">
            <h2
              id="storage-form-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              Discuss Storage Requirements
            </h2>
          </div>

          {/* Submission Success Preview */}
          {isSubmitted ? (
            <div className="bg-[#F2F8F5] border border-[#DDEBE5] rounded-md p-6 sm:p-8 md:p-10 text-center max-w-2xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-[#0A3D36] text-white flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#111827] mb-3">
                Preview complete. Your storage enquiry has not been sent.
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
                  <span className="font-semibold text-[#111827]">Service Required:</span> {serviceRequired}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">Estimated Storage Capacity:</span> {storageCapacity}
                </div>
                {hostingRegion && (
                  <div>
                    <span className="font-semibold text-[#111827]">Preferred Hosting Location:</span> {hostingRegion}
                  </div>
                )}
                {startDate && (
                  <div>
                    <span className="font-semibold text-[#111827]">Preferred Start Date:</span> {startDate}
                  </div>
                )}
                <div className="pt-2 border-t border-[#F1F5F9] text-[#475569]">
                  <span className="font-semibold text-[#111827] block mb-1">Requirements Summary:</span>
                  <p className="italic font-sans whitespace-pre-wrap">{requirements}</p>
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

                {/* Service Required (Required, not preselected) */}
                <div>
                  <label htmlFor="serviceRequired" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Service Required <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <div className="relative">
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
                      className={`w-full appearance-none px-3.5 py-2.5 text-sm bg-white border rounded-sm outline-none transition-colors cursor-pointer ${
                        errors.serviceRequired
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      } ${serviceRequired ? 'text-[#111827]' : 'text-[#94A3B8]'}`}
                    >
                      <option value="" disabled>
                        Select a service area
                      </option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s} className="text-[#111827]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.serviceRequired && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.serviceRequired}</p>
                  )}
                </div>

                {/* Estimated Storage Capacity (Required, not preselected) */}
                <div>
                  <label htmlFor="storageCapacity" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Estimated Storage Capacity <span className="text-[#0A3D36] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="storageCapacity"
                      value={storageCapacity}
                      onChange={(e) => {
                        setStorageCapacity(e.target.value);
                        if (errors.storageCapacity) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.storageCapacity;
                            return n;
                          });
                        }
                      }}
                      className={`w-full appearance-none px-3.5 py-2.5 text-sm bg-white border rounded-sm outline-none transition-colors cursor-pointer ${
                        errors.storageCapacity
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      } ${storageCapacity ? 'text-[#111827]' : 'text-[#94A3B8]'}`}
                    >
                      <option value="" disabled>
                        Select estimated capacity
                      </option>
                      {CAPACITY_OPTIONS.map((cap) => (
                        <option key={cap} value={cap} className="text-[#111827]">
                          {cap}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.storageCapacity && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.storageCapacity}</p>
                  )}
                </div>

                {/* Preferred Hosting Country or Region (Optional) */}
                <div>
                  <label htmlFor="hostingRegion" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Preferred Hosting Country or Region <span className="text-xs text-[#64748B] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="hostingRegion"
                    value={hostingRegion}
                    onChange={(e) => setHostingRegion(e.target.value)}
                    placeholder="e.g., South Africa or Europe"
                    className="w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none transition-colors"
                  />
                </div>

                {/* Preferred Start Date (Optional, Future Date) */}
                <div>
                  <label htmlFor="startDate" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                    Preferred Start Date <span className="text-xs text-[#64748B] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.startDate;
                          return n;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                      errors.startDate
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                        : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.startDate}</p>
                  )}
                </div>
              </div>

              {/* Requirements (Full Width Textarea, Required) */}
              <div>
                <label htmlFor="requirements" className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans">
                  Requirements <span className="text-[#0A3D36] font-bold">*</span>
                </label>
                <textarea
                  id="requirements"
                  rows={4}
                  value={requirements}
                  onChange={(e) => {
                    setRequirements(e.target.value);
                    if (errors.requirements) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.requirements;
                        return n;
                      });
                    }
                  }}
                  placeholder="Outline your data storage needs, expected file types, sharing requirements or existing setup..."
                  className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors resize-y ${
                    errors.requirements
                      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                      : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                  }`}
                />
                {errors.requirements && (
                  <p className="mt-1 text-xs text-red-600 font-medium font-sans">{errors.requirements}</p>
                )}
              </div>

              {/* Required Privacy Policy Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
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
                    className="mt-0.5 w-4 h-4 text-[#0A3D36] border-[#CBD5E1] rounded-xs focus:ring-[#0A3D36] cursor-pointer"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  <span>Submit Storage Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
