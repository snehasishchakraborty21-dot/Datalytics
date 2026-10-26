import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Check, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface SubscriptionPlan {
  id: string;
  name: string;
  billingPeriod: string;
  priceStatus: string;
  description: string;
  enquiryValue: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    billingPeriod: 'Every month',
    priceStatus: 'Pricing to be confirmed',
    description: 'For short-term or changing data needs.',
    enquiryValue: 'Monthly Subscription',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    billingPeriod: 'Every three months',
    priceStatus: 'Pricing to be confirmed',
    description: 'For projects requiring access over a quarter.',
    enquiryValue: 'Quarterly Subscription',
  },
  {
    id: 'annual',
    name: 'Annual',
    billingPeriod: 'Every year',
    priceStatus: 'Pricing to be confirmed',
    description: 'For ongoing research and regular data needs.',
    enquiryValue: 'Annual Subscription',
  },
];

export const PLAN_ENQUIRY_OPTIONS = [
  'Monthly Subscription',
  'Quarterly Subscription',
  'Annual Subscription',
  'Enterprise Requirements',
  'Custom / Other Pricing Enquiry',
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Can I purchase a dataset without a subscription?',
    answer:
      'Datalytics is being designed to support individual dataset purchases as well as subscriptions. Availability and terms will be shown for each published dataset.',
  },
  {
    question: 'Which datasets are included in a subscription?',
    answer:
      'Included datasets and access conditions will be confirmed in the published plan details.',
  },
  {
    question: 'Are consulting and storage included?',
    answer:
      'Consulting and storage services are quoted separately unless expressly included in an agreed package.',
  },
  {
    question: 'Where can I confirm licensing terms?',
    answer:
      'Review the dataset’s licensing information or enquire before purchasing.',
  },
];

interface PricingPageProps {
  onNavigateHome: () => void;
  onExploreDatasets: () => void;
  onNavigateConsulting: () => void;
  onNavigateStorage: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateHome,
  onExploreDatasets,
  onNavigateConsulting,
  onNavigateStorage,
}) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEnquiryType, setModalEnquiryType] = useState('Monthly Subscription');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [requirements, setRequirements] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Validation & Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Accordion State (can toggle individually, none open by default or first open)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Modal ref for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Open modal with prefilled plan or enquiry type
  const handleOpenModal = (enquiryType: string, event?: React.MouseEvent) => {
    if (event?.currentTarget instanceof HTMLElement) {
      triggerRef.current = event.currentTarget;
    } else if (document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
    setModalEnquiryType(enquiryType);
    setErrors({});
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  // Close modal and restore focus
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  };

  // Close modal on Escape key, trap focus, manage overflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 50);
        return;
      }

      if (e.key === 'Tab' && isModalOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        if (modalRef.current) {
          const firstInput = modalRef.current.querySelector<HTMLElement>('input, button');
          firstInput?.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Validate fields inline
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!modalEnquiryType) {
      newErrors.modalEnquiryType = 'Please select a plan or enquiry type.';
    }

    if (!requirements.trim()) {
      newErrors.requirements = 'Please describe your requirements.';
    }

    if (!agreedToPolicy) {
      newErrors.agreedToPolicy = 'You must agree to the Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full bg-white pt-8 md:pt-12 pb-8 md:pb-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* 1. PAGE HEADING & BREADCRUMB */}
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
          <span className="text-[#111827] font-semibold">Pricing</span>
        </nav>

        <section aria-labelledby="pricing-heading" className="mb-10 md:mb-12">
          <div className="max-w-2xl">
            <h1
              id="pricing-heading"
              className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.15] mb-3"
            >
              Choose how you access data.
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Purchase individual datasets or explore subscription options.
            </p>
          </div>
        </section>

        {/* 2. INDIVIDUAL DATASET PURCHASES: Compact introductory panel with restrained pale-mint background */}
        <section aria-labelledby="individual-datasets-heading" className="mb-12 md:mb-16">
          <div className="w-full p-7 md:p-8 bg-[#F1F7F4] border border-[#E2E8F0]/80 rounded-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
              <div className="max-w-2xl">
                <h2
                  id="individual-datasets-heading"
                  className="font-editorial text-2xl sm:text-3xl text-[#111827] font-medium tracking-tight mb-2"
                >
                  Need a specific dataset?
                </h2>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                  Browse the catalogue and review the available purchase and licensing options for each dataset.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onExploreDatasets}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2 whitespace-nowrap"
                >
                  <span>Explore Datasets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SUBSCRIPTION OPTIONS: Three equal-width plan cards */}
        <section aria-labelledby="subscription-heading" className="mb-12 md:mb-16">
          <div className="mb-6 md:mb-8">
            <h2
              id="subscription-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              Subscription Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col justify-between p-6 sm:p-7 md:p-8 bg-[#F9FBFA] hover:bg-[#F2F8F5] border border-[#E2E8F0]/80 rounded-md transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight">
                      {plan.name}
                    </h3>
                    <span className="text-[13px] md:text-sm text-[#525B66] font-normal">
                      {plan.billingPeriod}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-[#111827] tracking-tight">
                      {plan.priceStatus}
                    </div>
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed mb-6">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleOpenModal(plan.enquiryValue, e)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                  >
                    <span>Enquire About This Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ENTERPRISE REQUIREMENTS: Compact two-column section */}
        <section aria-labelledby="enterprise-heading" className="mb-12 md:mb-16">
          <div className="p-6 sm:p-8 md:p-9 bg-[#FAFCFB] border border-[#E2E8F0]/80 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <h3
                  id="enterprise-heading"
                  className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#111827] font-medium tracking-tight mb-2"
                >
                  Have organization-wide requirements?
                </h3>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                  Discuss your team’s data needs and request a tailored proposal.
                </p>
              </div>
              <div className="md:col-span-4 md:flex md:justify-end">
                <button
                  type="button"
                  onClick={(e) => handleOpenModal('Enterprise Requirements', e)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2 whitespace-nowrap"
                >
                  <span>Discuss Enterprise Requirements</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CONSULTING AND STORAGE: Two simple side-by-side blocks */}
        <section aria-labelledby="consulting-storage-heading" className="mb-14 md:mb-20">
          <div className="sr-only">
            <h2 id="consulting-storage-heading">Additional Services: Consulting and Storage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Consulting */}
            <div className="p-6 sm:p-8 bg-[#F9FBFA] border border-[#E2E8F0]/80 rounded-md flex flex-col justify-between">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight mb-2">
                  Consulting
                </h3>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                  Research and advisory projects are quoted according to the agreed scope.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onNavigateConsulting}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  <span>Explore Consulting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Data Storage */}
            <div className="p-6 sm:p-8 bg-[#F9FBFA] border border-[#E2E8F0]/80 rounded-md flex flex-col justify-between">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight mb-2">
                  Data Storage
                </h3>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                  Storage arrangements are quoted according to capacity, access and service requirements.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onNavigateStorage}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  <span>Explore Data Storage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FREQUENT QUESTIONS: Compact accessible accordion */}
        <section aria-labelledby="faq-heading">
          <div className="mb-6 md:mb-8">
            <h2
              id="faq-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const buttonId = `faq-btn-${index}`;
              const regionId = `faq-panel-${index}`;

              return (
                <div
                  key={faq.question}
                  className="border border-[#E2E8F0]/80 rounded-md overflow-hidden bg-white transition-colors"
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={regionId}
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left p-4 sm:p-5 hover:bg-[#F9FBFA] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] transition-colors"
                  >
                    <span className="font-editorial text-base sm:text-lg text-[#111827] font-medium pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#0A3D36] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={regionId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-sm md:text-[15px] text-[#475569] leading-relaxed border-t border-[#F1F5F9]"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 7. SHARED ENQUIRY MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pricing-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-xl bg-white rounded-md shadow-xl border border-[#E2E8F0] my-8 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E2E8F0]/80 bg-[#FAFCFB]">
              <div>
                <h3
                  id="pricing-modal-title"
                  className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight"
                >
                  {isSubmitted ? 'Enquiry Submitted' : 'Enquire About Pricing & Plans'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isSubmitted
                    ? 'Frontend Preview Submission'
                    : 'Share your requirements and our team will get in touch.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
              {isSubmitted ? (
                /* Submission confirmation with Back to Form */
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAF5F0] text-[#0A3D36] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-editorial text-xl text-[#111827] font-medium mb-2">
                    Preview complete. Your pricing enquiry has not been sent.
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-md mb-6 leading-relaxed">
                    This is an interactive preview. The information you entered has been validated and retained in memory only.
                  </p>

                  {/* Summary of entered values */}
                  <div className="w-full text-left bg-[#F9FBFA] border border-[#E2E8F0] rounded-sm p-4 text-xs space-y-2 mb-6">
                    <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-1.5">
                      <span className="font-semibold text-[#334155]">Full Name:</span>
                      <span className="text-[#111827]">{fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-1.5">
                      <span className="font-semibold text-[#334155]">Email:</span>
                      <span className="text-[#111827]">{email}</span>
                    </div>
                    {organization && (
                      <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-1.5">
                        <span className="font-semibold text-[#334155]">Organization:</span>
                        <span className="text-[#111827]">{organization}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-1.5">
                      <span className="font-semibold text-[#334155]">Selected Plan / Enquiry:</span>
                      <span className="text-[#0A3D36] font-medium">{modalEnquiryType}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#334155] block mb-1">Requirements:</span>
                      <p className="text-[#475569] whitespace-pre-wrap">{requirements}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-1/2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#0A3D36] bg-[#EAF5F0] hover:bg-[#D8ECE3] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full sm:w-1/2 inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Enquiry Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="modalFullName"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="modalFullName"
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
                      placeholder="e.g., Alexandra Mwangi"
                      className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                        errors.fullName
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 font-medium font-sans">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="modalEmail"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="modalEmail"
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
                      placeholder="e.g., a.mwangi@example.com"
                      className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors ${
                        errors.email
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium font-sans">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Organization (Optional) */}
                  <div>
                    <label
                      htmlFor="modalOrganization"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans"
                    >
                      Organization <span className="text-xs text-[#64748B] font-normal normal-case">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="modalOrganization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g., Pan-African Economic Institute"
                      className="w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none transition-colors"
                    />
                  </div>

                  {/* Plan or Enquiry Type (Editable, prefilled) */}
                  <div>
                    <label
                      htmlFor="modalEnquiryType"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans"
                    >
                      Plan or Enquiry Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="modalEnquiryType"
                        value={modalEnquiryType}
                        onChange={(e) => {
                          setModalEnquiryType(e.target.value);
                          if (errors.modalEnquiryType) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.modalEnquiryType;
                              return n;
                            });
                          }
                        }}
                        className={`w-full appearance-none px-3.5 py-2.5 text-sm bg-white border rounded-sm outline-none transition-colors cursor-pointer text-[#111827] ${
                          errors.modalEnquiryType
                            ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                            : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                        }`}
                      >
                        {PLAN_ENQUIRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.modalEnquiryType && (
                      <p className="mt-1 text-xs text-red-600 font-medium font-sans">
                        {errors.modalEnquiryType}
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div>
                    <label
                      htmlFor="modalRequirements"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-sans"
                    >
                      Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="modalRequirements"
                      rows={3}
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
                      placeholder="Outline your dataset access requirements, team size or project timelines..."
                      className={`w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border rounded-sm outline-none transition-colors resize-y ${
                        errors.requirements
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]'
                      }`}
                    />
                    {errors.requirements && (
                      <p className="mt-1 text-xs text-red-600 font-medium font-sans">
                        {errors.requirements}
                      </p>
                    )}
                  </div>

                  {/* Required Privacy Policy Checkbox */}
                  <div className="pt-1">
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
                        className="mt-0.5 h-4 w-4 rounded-xs border-gray-300 text-[#0A3D36] focus:ring-[#0A3D36] cursor-pointer"
                      />
                      <span className="text-xs text-[#475569] leading-snug">
                        I agree to the <span className="text-[#0A3D36] font-medium underline">Privacy Policy</span>. <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.agreedToPolicy && (
                      <p className="mt-1 text-xs text-red-600 font-medium font-sans">
                        {errors.agreedToPolicy}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                    >
                      <span>Submit Enquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
