/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ExploreDatasets } from './components/ExploreDatasets';
import { ServiceAreas } from './components/ServiceAreas';
import { HowItWorks } from './components/HowItWorks';
import { DatasetInfoSection } from './components/DatasetInfoSection';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { PreviewNoticeModal } from './components/PreviewNoticeModal';
import {
  DatasetsMarketplace,
  MarketplaceSavedState,
} from './components/DatasetsMarketplace';
import { DatasetDetailPage } from './components/DatasetDetailPage';
import { ConsultingPage } from './components/ConsultingPage';
import { DataStoragePage } from './components/DataStoragePage';
import { PricingPage } from './components/PricingPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { SignInPage } from './components/SignInPage';
import { CreateAccountPage } from './components/CreateAccountPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { AdminSignInPage } from './components/admin/AdminSignInPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDatasetsPage, DatasetsFilterState } from './components/admin/AdminDatasetsPage';
import { AdminDatasetPreviewPage } from './components/admin/AdminDatasetPreviewPage';
import { AdminDatasetEditorPage } from './components/admin/AdminDatasetEditorPage';
import { ALL_ADMIN_DATASETS, AdminDataset } from './data/adminDatasets';
import { ILLUSTRATIVE_DATASETS, DatasetItem } from './data/datasets';

function parseRouteFromLocation(): {
  route:
    | 'home'
    | 'datasets'
    | 'dataset-detail'
    | 'consulting'
    | 'data-storage'
    | 'pricing'
    | 'about'
    | 'contact'
    | 'signin'
    | 'create-account'
    | 'verify-email'
    | 'admin-login'
    | 'admin-dashboard'
    | 'admin-datasets'
    | 'admin-dataset-new'
    | 'admin-dataset-edit'
    | 'admin-dataset-preview';
  datasetId?: string;
  adminDatasetId?: string;
} {
  if (typeof window === 'undefined') {
    return { route: 'home' };
  }
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Check admin dataset new route (/admin/datasets/new)
  if (pathname === '/admin/datasets/new' || pathname === '/admin/datasets/new/') {
    return { route: 'admin-dataset-new' };
  }

  // Check admin dataset edit route (/admin/datasets/:id/edit)
  if (pathname.startsWith('/admin/datasets/') && pathname.includes('/edit')) {
    const rawId = pathname
      .replace('/admin/datasets/', '')
      .split('/edit')[0]
      .replace(/\/$/, '')
      .trim();
    if (rawId) {
      return { route: 'admin-dataset-edit', adminDatasetId: rawId };
    }
  }

  // Check admin dataset preview route (/admin/datasets/:id/preview)
  if (pathname.startsWith('/admin/datasets/') && pathname.includes('/preview')) {
    const rawId = pathname
      .replace('/admin/datasets/', '')
      .split('/preview')[0]
      .replace(/\/$/, '')
      .trim();
    if (rawId) {
      return { route: 'admin-dataset-preview', adminDatasetId: rawId };
    }
  }

  // Check admin datasets route (/admin/datasets)
  if (pathname === '/admin/datasets' || pathname === '/admin/datasets/') {
    return { route: 'admin-datasets' };
  }

  // Check admin routes (/admin, /admin/login, /admin/dashboard)
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/') ||
    pathname === '/admin' ||
    pathname === '/admin/'
  ) {
    return { route: 'admin-login' };
  }
  if (pathname === '/admin/dashboard' || pathname.startsWith('/admin/dashboard/')) {
    return { route: 'admin-dashboard' };
  }

  // Check verify-email route (/verify-email or /verify)
  if (
    pathname === '/verify-email' ||
    pathname.startsWith('/verify-email/') ||
    pathname === '/verify' ||
    pathname.startsWith('/verify/')
  ) {
    return { route: 'verify-email' };
  }

  // Check create-account route (/create-account or /register or /signup)
  if (
    pathname === '/create-account' ||
    pathname.startsWith('/create-account/') ||
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/signup' ||
    pathname.startsWith('/signup/')
  ) {
    return { route: 'create-account' };
  }

  // Check signin route (/signin or /login)
  if (
    pathname === '/signin' ||
    pathname.startsWith('/signin/') ||
    pathname === '/login' ||
    pathname.startsWith('/login/')
  ) {
    return { route: 'signin' };
  }

  // Check contact route (/contact)
  if (pathname === '/contact' || pathname.startsWith('/contact/')) {
    return { route: 'contact' };
  }

  // Check about route (/about)
  if (pathname === '/about' || pathname.startsWith('/about/')) {
    return { route: 'about' };
  }

  // Check pricing route (/pricing)
  if (pathname === '/pricing' || pathname.startsWith('/pricing/')) {
    return { route: 'pricing' };
  }

  // Check data storage route (/data-storage or /storage)
  if (
    pathname === '/data-storage' ||
    pathname.startsWith('/data-storage/') ||
    pathname === '/storage' ||
    pathname.startsWith('/storage/')
  ) {
    return { route: 'data-storage' };
  }

  // Check consulting route (/consulting)
  if (pathname === '/consulting' || pathname.startsWith('/consulting/')) {
    return { route: 'consulting' };
  }

  // Check pathname routing (/datasets/:id or /datasets)
  if (pathname.startsWith('/datasets/')) {
    const id = pathname.replace('/datasets/', '').replace(/\/$/, '').trim();
    if (id) {
      return { route: 'dataset-detail', datasetId: id };
    }
    return { route: 'datasets' };
  }
  if (pathname === '/datasets') {
    return { route: 'datasets' };
  }

  // Check hash fallback
  const cleanHash = hash.replace(/^#\/?/, '');
  if (cleanHash === 'admin/datasets/new' || cleanHash === 'admin/datasets/new/') {
    return { route: 'admin-dataset-new' };
  }
  if (cleanHash.startsWith('admin/datasets/') && cleanHash.includes('/edit')) {
    const rawId = cleanHash
      .replace('admin/datasets/', '')
      .split('/edit')[0]
      .replace(/\/$/, '')
      .trim();
    if (rawId) {
      return { route: 'admin-dataset-edit', adminDatasetId: rawId };
    }
  }
  if (cleanHash.startsWith('admin/datasets/') && cleanHash.includes('/preview')) {
    const rawId = cleanHash
      .replace('admin/datasets/', '')
      .split('/preview')[0]
      .replace(/\/$/, '')
      .trim();
    if (rawId) {
      return { route: 'admin-dataset-preview', adminDatasetId: rawId };
    }
  }
  if (cleanHash === 'admin/datasets' || cleanHash === 'admin/datasets/') {
    return { route: 'admin-datasets' };
  }
  if (
    cleanHash === 'admin/login' ||
    cleanHash.startsWith('admin/login/') ||
    cleanHash === 'admin' ||
    cleanHash === 'admin/'
  ) {
    return { route: 'admin-login' };
  }
  if (cleanHash === 'admin/dashboard' || cleanHash.startsWith('admin/dashboard/')) {
    return { route: 'admin-dashboard' };
  }
  if (
    cleanHash === 'verify-email' ||
    cleanHash.startsWith('verify-email/') ||
    cleanHash === 'verify' ||
    cleanHash.startsWith('verify/')
  ) {
    return { route: 'verify-email' };
  }
  if (
    cleanHash === 'create-account' ||
    cleanHash.startsWith('create-account/') ||
    cleanHash === 'register' ||
    cleanHash.startsWith('register/') ||
    cleanHash === 'signup' ||
    cleanHash.startsWith('signup/')
  ) {
    return { route: 'create-account' };
  }
  if (
    cleanHash === 'signin' ||
    cleanHash.startsWith('signin/') ||
    cleanHash === 'login' ||
    cleanHash.startsWith('login/')
  ) {
    return { route: 'signin' };
  }
  if (cleanHash === 'contact' || cleanHash.startsWith('contact/')) {
    return { route: 'contact' };
  }
  if (cleanHash === 'about' || cleanHash.startsWith('about/')) {
    return { route: 'about' };
  }
  if (cleanHash === 'pricing' || cleanHash.startsWith('pricing/')) {
    return { route: 'pricing' };
  }
  if (
    cleanHash === 'data-storage' ||
    cleanHash.startsWith('data-storage/') ||
    cleanHash === 'storage' ||
    cleanHash.startsWith('storage/')
  ) {
    return { route: 'data-storage' };
  }
  if (cleanHash === 'consulting' || cleanHash.startsWith('consulting/')) {
    return { route: 'consulting' };
  }
  if (cleanHash.startsWith('datasets/')) {
    const id = cleanHash.replace('datasets/', '').replace(/\/$/, '').trim();
    if (id) {
      return { route: 'dataset-detail', datasetId: id };
    }
    return { route: 'datasets' };
  }
  if (cleanHash === 'datasets') {
    return { route: 'datasets' };
  }

  return { route: 'home' };
}

export default function App() {
  // Navigation / Routing state with browser back/forward and refresh support
  const initialRouteInfo = useMemo(() => parseRouteFromLocation(), []);
  const [currentRoute, setCurrentRoute] = useState<
    | 'home'
    | 'datasets'
    | 'dataset-detail'
    | 'consulting'
    | 'data-storage'
    | 'pricing'
    | 'about'
    | 'contact'
    | 'signin'
    | 'create-account'
    | 'verify-email'
    | 'admin-login'
    | 'admin-dashboard'
    | 'admin-datasets'
    | 'admin-dataset-new'
    | 'admin-dataset-edit'
    | 'admin-dataset-preview'
  >(initialRouteInfo.route);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [contactPrefillType, setContactPrefillType] = useState<string | undefined>(undefined);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(
    initialRouteInfo.datasetId || null
  );
  const [activeAdminDatasetId, setActiveAdminDatasetId] = useState<string | null>(
    initialRouteInfo.adminDatasetId || null
  );

  // Shared Admin Datasets State across list, dashboard, editor, and preview
  const [adminDatasets, setAdminDatasets] = useState<AdminDataset[]>(() => ALL_ADMIN_DATASETS);
  const [previewFromEditor, setPreviewFromEditor] = useState<boolean>(false);

  // Preserved filter and pagination state for /admin/datasets
  const [adminDatasetsFilterState, setAdminDatasetsFilterState] = useState<DatasetsFilterState>({
    searchQuery: '',
    statusFilter: 'all',
    countryFilter: 'all',
    formatFilter: 'all',
    currentPage: 1,
    scrollPosition: 0,
  });

  // Admin Preview Mode state for design review (sample data only, no real permissions)
  const [isAdminPreviewMode, setIsAdminPreviewMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return (
        path === '/admin/dashboard' ||
        path.startsWith('/admin/dashboard/') ||
        path === '/admin/datasets' ||
        path.startsWith('/admin/datasets/') ||
        hash.includes('admin/dashboard') ||
        hash.includes('admin/datasets')
      );
    }
    return false;
  });

  // Saved marketplace state for back navigation
  const [savedMarketplaceState, setSavedMarketplaceState] = useState<MarketplaceSavedState | null>(null);

  // Initial search parameters for marketplace
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceCategory, setMarketplaceCategory] = useState<string | null>(null);

  // Homepage search & filter states
  const [homepageSearchQuery, setHomepageSearchQuery] = useState('');
  const [homepageSelectedTopic, setHomepageSelectedTopic] = useState<string | null>(null);

  // Modal states
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryServicePrefill, setEnquiryServicePrefill] = useState('Datasets');
  const [enquiryDatasetPrefill, setEnquiryDatasetPrefill] = useState<string | undefined>(undefined);

  const [previewNotice, setPreviewNotice] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Customer datasets: all published datasets from shared admin datasets state
  const customerDatasets = useMemo(() => {
    return adminDatasets
      .filter((d) => d.status === 'Published')
      .map((d) => d.publishedDatasetItem || d.datasetItem);
  }, [adminDatasets]);

  // Selected dataset for detail page (published live view or unavailable state for drafts/unpublished)
  const activeDatasetInfo = useMemo(() => {
    if (!activeDatasetId) return null;
    const adminRecord = adminDatasets.find(
      (d) => d.id.toLowerCase() === activeDatasetId.toLowerCase()
    );
    if (adminRecord) {
      if (adminRecord.status === 'Published') {
        return {
          dataset: adminRecord.publishedDatasetItem || adminRecord.datasetItem,
          isUnavailable: false,
        };
      }
      return {
        dataset: adminRecord.datasetItem,
        isUnavailable: true,
      };
    }
    const orig = ILLUSTRATIVE_DATASETS.find(
      (d) => d.id.toLowerCase() === activeDatasetId.toLowerCase()
    );
    if (orig) {
      return { dataset: orig, isUnavailable: false };
    }
    return null;
  }, [activeDatasetId, adminDatasets]);

  // Handle browser back and forward button events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const parsed = parseRouteFromLocation();
      if (
        parsed.route === 'admin-dataset-preview' ||
        event.state?.page === 'admin-dataset-preview'
      ) {
        setCurrentRoute('admin-dataset-preview');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(parsed.adminDatasetId || event.state?.adminDatasetId || null);
        setPreviewFromEditor(Boolean(event.state?.fromEditor));
      } else if (
        parsed.route === 'admin-dataset-new' ||
        event.state?.page === 'admin-dataset-new'
      ) {
        setCurrentRoute('admin-dataset-new');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(null);
      } else if (
        parsed.route === 'admin-dataset-edit' ||
        event.state?.page === 'admin-dataset-edit'
      ) {
        setCurrentRoute('admin-dataset-edit');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(parsed.adminDatasetId || event.state?.adminDatasetId || null);
      } else if (parsed.route === 'admin-datasets' || event.state?.page === 'admin-datasets') {
        setCurrentRoute('admin-datasets');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(null);
      } else if (parsed.route === 'admin-dashboard' || event.state?.page === 'admin-dashboard') {
        setCurrentRoute('admin-dashboard');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(null);
      } else if (parsed.route === 'admin-login' || event.state?.page === 'admin-login') {
        setCurrentRoute('admin-login');
        setActiveDatasetId(null);
        setActiveAdminDatasetId(null);
      } else if (parsed.route === 'verify-email' || event.state?.page === 'verify-email') {
        setCurrentRoute('verify-email');
        setActiveDatasetId(null);
        if (event.state?.email) {
          setVerificationEmail(event.state.email);
        }
      } else if (parsed.route === 'create-account' || event.state?.page === 'create-account') {
        setCurrentRoute('create-account');
        setActiveDatasetId(null);
      } else if (parsed.route === 'signin' || event.state?.page === 'signin') {
        setCurrentRoute('signin');
        setActiveDatasetId(null);
      } else if (parsed.route === 'contact' || event.state?.page === 'contact') {
        setCurrentRoute('contact');
        setActiveDatasetId(null);
        setContactPrefillType(event.state?.prefillType);
      } else if (parsed.route === 'about' || event.state?.page === 'about') {
        setCurrentRoute('about');
        setActiveDatasetId(null);
      } else if (parsed.route === 'pricing' || event.state?.page === 'pricing') {
        setCurrentRoute('pricing');
        setActiveDatasetId(null);
      } else if (parsed.route === 'data-storage' || event.state?.page === 'data-storage') {
        setCurrentRoute('data-storage');
        setActiveDatasetId(null);
      } else if (parsed.route === 'consulting' || event.state?.page === 'consulting') {
        setCurrentRoute('consulting');
        setActiveDatasetId(null);
      } else if (parsed.route === 'dataset-detail' && parsed.datasetId) {
        setActiveDatasetId(parsed.datasetId);
        setCurrentRoute('dataset-detail');
      } else if (parsed.route === 'datasets' || event.state?.page === 'datasets') {
        setCurrentRoute('datasets');
        setActiveDatasetId(null);
        if (event.state?.search !== undefined) {
          setMarketplaceSearch(event.state.search);
        }
        if (event.state?.category !== undefined) {
          setMarketplaceCategory(event.state.category);
        }
      } else {
        setCurrentRoute('home');
        setActiveDatasetId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handlers
  const navigateToHome = () => {
    setCurrentRoute('home');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'home' }, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDatasets = (
    searchQuery = '',
    categoryFilter: string | null = null,
    resetSavedState = false
  ) => {
    if (resetSavedState) {
      setSavedMarketplaceState(null);
    }
    setCurrentRoute('datasets');
    setActiveDatasetId(null);
    setMarketplaceSearch(searchQuery);
    setMarketplaceCategory(categoryFilter);
    window.history.pushState(
      { page: 'datasets', search: searchQuery, category: categoryFilter },
      '',
      '/datasets'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToConsulting = (scrollToForm = false) => {
    setCurrentRoute('consulting');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'consulting' }, '', '/consulting');
    if (scrollToForm) {
      setTimeout(() => {
        const formEl = document.getElementById('consulting-enquiry-form');
        if (formEl) {
          const yOffset = -80;
          const y = formEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStorage = () => {
    setCurrentRoute('data-storage');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'data-storage' }, '', '/data-storage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPricing = () => {
    setCurrentRoute('pricing');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'pricing' }, '', '/pricing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    setCurrentRoute('about');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'about' }, '', '/about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToContact = (prefillType?: string) => {
    setContactPrefillType(prefillType);
    setCurrentRoute('contact');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'contact', prefillType }, '', '/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSignIn = () => {
    setCurrentRoute('signin');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'signin' }, '', '/signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCreateAccount = () => {
    setCurrentRoute('create-account');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'create-account' }, '', '/create-account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVerifyEmail = (emailToVerify?: string) => {
    if (emailToVerify !== undefined) {
      setVerificationEmail(emailToVerify);
    }
    setCurrentRoute('verify-email');
    setActiveDatasetId(null);
    window.history.pushState(
      { page: 'verify-email', email: emailToVerify ?? verificationEmail },
      '',
      '/verify-email'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdminLogin = () => {
    setCurrentRoute('admin-login');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'admin-login' }, '', '/admin/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdminDashboard = () => {
    setCurrentRoute('admin-dashboard');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'admin-dashboard' }, '', '/admin/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterAdminPreview = () => {
    setIsAdminPreviewMode(true);
    navigateToAdminDashboard();
  };

  const handleAdminSignOut = () => {
    setIsAdminPreviewMode(false);
    navigateToAdminLogin();
  };

  const navigateToAdminDatasets = () => {
    setPreviewFromEditor(false);
    setCurrentRoute('admin-datasets');
    setActiveAdminDatasetId(null);
    window.history.pushState({ page: 'admin-datasets' }, '', '/admin/datasets');
  };

  const navigateToAdminDatasetNew = () => {
    setActiveAdminDatasetId(null);
    setCurrentRoute('admin-dataset-new');
    window.history.pushState({ page: 'admin-dataset-new' }, '', '/admin/datasets/new');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToAdminDatasetEdit = (datasetId: string, currentState?: DatasetsFilterState) => {
    if (currentState) {
      setAdminDatasetsFilterState(currentState);
    }
    setActiveAdminDatasetId(datasetId);
    setCurrentRoute('admin-dataset-edit');
    window.history.pushState(
      { page: 'admin-dataset-edit', adminDatasetId: datasetId },
      '',
      `/admin/datasets/${datasetId}/edit`
    );
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSaveAdminDraft = (savedDataset: AdminDataset, isNew: boolean) => {
    setAdminDatasets((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === savedDataset.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const existing = prev[existingIdx];
        const isPublished = existing.status === 'Published';
        copy[existingIdx] = {
          ...savedDataset,
          status: isPublished ? 'Published' : 'Draft',
          hasPendingChanges: isPublished,
          publishedDatasetItem: isPublished
            ? (existing.publishedDatasetItem || existing.datasetItem)
            : undefined,
        };
        return copy;
      }
      return [savedDataset, ...prev];
    });
  };

  const handlePublishDataset = (publishedDataset: AdminDataset) => {
    setAdminDatasets((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === publishedDataset.id);
      const recordToPublish: AdminDataset = {
        ...publishedDataset,
        status: 'Published',
        publishedDatasetItem: publishedDataset.datasetItem,
        hasPendingChanges: false,
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = recordToPublish;
        return copy;
      }
      return [recordToPublish, ...prev];
    });
  };

  const handleUnpublishDataset = (datasetId: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setAdminDatasets((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === datasetId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const existing = prev[existingIdx];
        copy[existingIdx] = {
          ...existing,
          status: 'Draft',
          hasPendingChanges: false,
          updated: formattedDate,
        };
        return copy;
      }
      return prev;
    });
  };

  const handlePreviewDraftFromEditor = (draftToPreview: AdminDataset) => {
    setPreviewFromEditor(true);
    handleSaveAdminDraft(draftToPreview, false);
    setActiveAdminDatasetId(draftToPreview.id);
    setCurrentRoute('admin-dataset-preview');
    window.history.pushState(
      { page: 'admin-dataset-preview', adminDatasetId: draftToPreview.id, fromEditor: true },
      '',
      `/admin/datasets/${draftToPreview.id}/preview`
    );
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToAdminDatasetPreview = (datasetId: string, currentState: DatasetsFilterState) => {
    setPreviewFromEditor(false);
    setAdminDatasetsFilterState(currentState);
    setActiveAdminDatasetId(datasetId);
    setCurrentRoute('admin-dataset-preview');
    window.history.pushState(
      { page: 'admin-dataset-preview', adminDatasetId: datasetId, fromEditor: false },
      '',
      `/admin/datasets/${datasetId}/preview`
    );
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateToDatasetDetail = (
    dataset: DatasetItem,
    marketplaceState?: MarketplaceSavedState
  ) => {
    if (marketplaceState) {
      setSavedMarketplaceState(marketplaceState);
    }
    setActiveDatasetId(dataset.id);
    setCurrentRoute('dataset-detail');
    window.history.pushState(
      { page: 'dataset-detail', datasetId: dataset.id },
      '',
      `/datasets/${dataset.id}`
    );
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToDatasets = () => {
    setCurrentRoute('datasets');
    setActiveDatasetId(null);
    window.history.pushState({ page: 'datasets' }, '', '/datasets');
    if (!savedMarketplaceState) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to section handler
  const handleScrollToSection = (sectionId: string) => {
    if (currentRoute !== 'home') {
      setCurrentRoute('home');
      setActiveDatasetId(null);
      window.history.pushState({ page: 'home' }, '', '/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const yOffset = -84;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 80);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -84;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Homepage 4 illustrative datasets filter from published catalogue
  const homepageCatalogueDatasets = useMemo(() => {
    const homepageSubset = customerDatasets.slice(0, 4);

    return homepageSubset.filter((item) => {
      if (homepageSelectedTopic) {
        const matchesTopic = item.topics.some(
          (t) => t.toLowerCase() === homepageSelectedTopic.toLowerCase()
        );
        if (!matchesTopic) return false;
      }

      if (homepageSearchQuery.trim()) {
        const query = homepageSearchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCoverage = item.coverage.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        const matchesTopic = item.topics.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesCoverage && !matchesCategory && !matchesDescription && !matchesTopic) {
          return false;
        }
      }

      return true;
    });
  }, [customerDatasets, homepageSearchQuery, homepageSelectedTopic]);

  const handleOpenStorageEnquiry = () => {
    setEnquiryServicePrefill('Data Storage');
    setEnquiryDatasetPrefill(undefined);
    setIsEnquiryOpen(true);
  };

  const handleOpenGeneralEnquiry = () => {
    setEnquiryServicePrefill('Datasets');
    setEnquiryDatasetPrefill(undefined);
    setIsEnquiryOpen(true);
  };

  const handleRequestDatasetAccess = (dataset: DatasetItem) => {
    setEnquiryServicePrefill('Datasets');
    setEnquiryDatasetPrefill(dataset.title);
    setIsEnquiryOpen(true);
  };

  const handleOpenPreviewNotice = (title: string, message: string) => {
    setPreviewNotice({
      isOpen: true,
      title,
      message,
    });
  };

  // Dedicated Admin Routes: Dashboard (preview mode), Datasets listing, Dataset preview, Add/Edit Dataset vs Admin Sign In
  if (currentRoute === 'admin-dashboard') {
    if (isAdminPreviewMode) {
      return (
        <AdminDashboard
          datasets={adminDatasets}
          onNavigateHome={navigateToHome}
          onSignOut={handleAdminSignOut}
          onNavigateDatasets={navigateToAdminDatasets}
        />
      );
    }
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  if (currentRoute === 'admin-datasets') {
    if (isAdminPreviewMode) {
      return (
        <AdminDatasetsPage
          datasets={adminDatasets}
          initialFilterState={adminDatasetsFilterState}
          onFilterStateChange={setAdminDatasetsFilterState}
          onNavigateDashboard={navigateToAdminDashboard}
          onNavigateHome={navigateToHome}
          onSignOut={handleAdminSignOut}
          onPreviewDataset={navigateToAdminDatasetPreview}
          onNewDataset={navigateToAdminDatasetNew}
          onEditDataset={navigateToAdminDatasetEdit}
          onUnpublishDataset={handleUnpublishDataset}
        />
      );
    }
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  if (currentRoute === 'admin-dataset-new') {
    if (isAdminPreviewMode) {
      return (
        <AdminDatasetEditorPage
          mode="create"
          datasets={adminDatasets}
          onSaveDraft={handleSaveAdminDraft}
          onPublishDataset={handlePublishDataset}
          onUnpublishDataset={handleUnpublishDataset}
          onPreviewDraft={handlePreviewDraftFromEditor}
          onCancel={navigateToAdminDatasets}
          onNavigateDashboard={navigateToAdminDashboard}
          onNavigateDatasets={navigateToAdminDatasets}
          onNavigateHome={navigateToHome}
          onSignOut={handleAdminSignOut}
        />
      );
    }
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  if (currentRoute === 'admin-dataset-edit') {
    if (isAdminPreviewMode) {
      return (
        <AdminDatasetEditorPage
          mode="edit"
          datasetId={activeAdminDatasetId || undefined}
          datasets={adminDatasets}
          onSaveDraft={handleSaveAdminDraft}
          onPublishDataset={handlePublishDataset}
          onUnpublishDataset={handleUnpublishDataset}
          onPreviewDraft={handlePreviewDraftFromEditor}
          onCancel={navigateToAdminDatasets}
          onNavigateDashboard={navigateToAdminDashboard}
          onNavigateDatasets={navigateToAdminDatasets}
          onNavigateHome={navigateToHome}
          onSignOut={handleAdminSignOut}
        />
      );
    }
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  if (currentRoute === 'admin-dataset-preview') {
    if (isAdminPreviewMode && activeAdminDatasetId) {
      return (
        <AdminDatasetPreviewPage
          datasetId={activeAdminDatasetId}
          datasets={adminDatasets}
          fromEditor={previewFromEditor}
          onBackToDatasets={() => {
            if (previewFromEditor && activeAdminDatasetId) {
              navigateToAdminDatasetEdit(activeAdminDatasetId);
            } else {
              navigateToAdminDatasets();
            }
          }}
          onEditDataset={(id) => navigateToAdminDatasetEdit(id)}
          onNavigateDashboard={navigateToAdminDashboard}
          onNavigateHome={navigateToHome}
          onSignOut={handleAdminSignOut}
        />
      );
    }
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  if (currentRoute === 'admin-login') {
    return (
      <AdminSignInPage
        onNavigateHome={navigateToHome}
        onNavigateDashboard={handleEnterAdminPreview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#0A3D36]/10 selection:text-[#0A3D36]">
      {/* Top Header with Route Highlighting */}
      <Header
        currentRoute={currentRoute}
        onNavigateHome={navigateToHome}
        onNavigateDatasets={() => navigateToDatasets('', null, true)}
        onNavigateConsulting={navigateToConsulting}
        onNavigateStorage={navigateToStorage}
        onNavigatePricing={navigateToPricing}
        onNavigateAbout={navigateToAbout}
        onNavigateContact={() => navigateToContact()}
        onNavigateSignIn={navigateToSignIn}
        onExploreDatasets={() => navigateToDatasets('', null, true)}
        onOpenEnquiry={handleOpenGeneralEnquiry}
        onOpenPreviewNotice={handleOpenPreviewNotice}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Page Flow based on Route */}
      <main className="flex-1 w-full">
        {currentRoute === 'verify-email' ? (
          /* Dedicated Customer Email Verification Page */
          <VerifyEmailPage
            email={verificationEmail}
            onEmailChange={(newEmail) => setVerificationEmail(newEmail)}
            onNavigateSignIn={navigateToSignIn}
            onNavigateCreateAccount={navigateToCreateAccount}
            onNavigateHome={navigateToHome}
          />
        ) : currentRoute === 'create-account' ? (
          /* Dedicated Customer Create Account Page */
          <CreateAccountPage
            onNavigateHome={navigateToHome}
            onNavigateSignIn={navigateToSignIn}
            onNavigateVerifyEmail={navigateToVerifyEmail}
          />
        ) : currentRoute === 'signin' ? (
          /* Dedicated Customer Sign In Page */
          <SignInPage
            onNavigateHome={navigateToHome}
            onNavigateCreateAccount={navigateToCreateAccount}
          />
        ) : currentRoute === 'home' ? (
          <>
            {/* Hero Section */}
            <Hero
              searchQuery={homepageSearchQuery}
              onSearchChange={setHomepageSearchQuery}
              onSearchSubmit={(query) => navigateToDatasets(query, null, true)}
              selectedTopic={homepageSelectedTopic}
              onTopicSelect={(topic) => navigateToDatasets('', topic, true)}
            />

            {/* Explore Datasets Section (Homepage 4 examples) */}
            <ExploreDatasets
              datasets={homepageCatalogueDatasets}
              allCount={4}
              selectedTopic={homepageSelectedTopic}
              searchQuery={homepageSearchQuery}
              onClearFilter={() => {
                setHomepageSearchQuery('');
                setHomepageSelectedTopic(null);
              }}
              onSelectDataset={(ds) => navigateToDatasetDetail(ds)}
              onBrowseAll={() => navigateToDatasets('', null, true)}
            />

            {/* Three Dedicated Service Areas */}
            <ServiceAreas
              onExploreDatasets={() => navigateToDatasets('', null, true)}
              onConsultingEnquiry={navigateToConsulting}
              onStorageEnquiry={navigateToStorage}
            />

            {/* How It Works */}
            <HowItWorks />

            {/* Dataset Information Section (Pale Mint Background) */}
            <DatasetInfoSection />

            {/* Final Call to Action - connected to Contact page */}
            <CallToAction
              onSubmitEnquiry={() => navigateToContact()}
              onBrowseDatasets={() => navigateToDatasets('', null, true)}
            />
          </>
        ) : currentRoute === 'contact' ? (
          /* Dedicated Contact Page */
          <ContactPage
            onNavigateHome={navigateToHome}
            onExploreDatasets={() => navigateToDatasets('', null, true)}
            onNavigateConsulting={() => navigateToConsulting(false)}
            onNavigateStorage={navigateToStorage}
            initialEnquiryType={contactPrefillType}
          />
        ) : currentRoute === 'about' ? (
          /* Dedicated About Page */
          <AboutPage
            onNavigateHome={navigateToHome}
            onExploreDatasets={() => navigateToDatasets('', null, true)}
            onNavigateConsulting={() => navigateToConsulting(true)}
          />
        ) : currentRoute === 'consulting' ? (
          /* Dedicated Consulting Services Page */
          <ConsultingPage onNavigateHome={navigateToHome} />
        ) : currentRoute === 'data-storage' ? (
          /* Dedicated Data Storage Services Page */
          <DataStoragePage onNavigateHome={navigateToHome} />
        ) : currentRoute === 'pricing' ? (
          /* Dedicated Pricing Page */
          <PricingPage
            onNavigateHome={navigateToHome}
            onExploreDatasets={() => navigateToDatasets('', null, true)}
            onNavigateConsulting={navigateToConsulting}
            onNavigateStorage={navigateToStorage}
          />
        ) : currentRoute === 'datasets' || !activeDatasetId ? (
          /* Datasets Marketplace Page */
          <DatasetsMarketplace
            datasets={customerDatasets}
            initialSearchQuery={marketplaceSearch}
            initialCategory={marketplaceCategory}
            savedState={savedMarketplaceState}
            onSelectDataset={(ds, state) => navigateToDatasetDetail(ds, state)}
            onNavigateHome={navigateToHome}
          />
        ) : (
          /* Dedicated Full-Width Dataset Details Page */
          <DatasetDetailPage
            dataset={activeDatasetInfo?.dataset}
            isUnavailable={activeDatasetInfo?.isUnavailable}
            onNavigateHome={navigateToHome}
            onBackToDatasets={handleBackToDatasets}
            onRequestAccess={handleRequestDatasetAccess}
          />
        )}
      </main>

      {/* Full-Width Footer */}
      <Footer
        onOpenPreviewNotice={handleOpenPreviewNotice}
        onExploreDatasets={() => navigateToDatasets('', null, true)}
        onNavigateConsulting={navigateToConsulting}
        onNavigateStorage={navigateToStorage}
        onNavigatePricing={navigateToPricing}
        onNavigateAbout={navigateToAbout}
        onNavigateContact={() => navigateToContact()}
        onNavigateAdminLogin={navigateToAdminLogin}
        onCustomDataRequests={() => navigateToContact('Custom Data Request')}
        onServicesClick={() => handleScrollToSection('services')}
        onEnquiryClick={handleOpenGeneralEnquiry}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefillService={enquiryServicePrefill}
        prefillDatasetTitle={enquiryDatasetPrefill}
      />

      {/* Generic Preview Notice Dialog for Future Pages */}
      <PreviewNoticeModal
        isOpen={previewNotice.isOpen}
        title={previewNotice.title}
        message={previewNotice.message}
        onClose={() =>
          setPreviewNotice((prev) => ({ ...prev, isOpen: false }))
        }
        onEnquire={handleOpenGeneralEnquiry}
      />
    </div>
  );
}
