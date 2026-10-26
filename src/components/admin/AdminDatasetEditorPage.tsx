import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  RotateCcw,
  Menu,
} from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminFooter } from './AdminFooter';
import { AdminDataset, ALL_ADMIN_DATASETS } from '../../data/adminDatasets';
import {
  DatasetItem,
  DatasetField,
  DatasetImage,
  FILTER_CATEGORIES,
  FILTER_LOCATIONS,
} from '../../data/datasets';

export interface StagedDatasetFile {
  id: string;
  name: string;
  format: 'CSV' | 'PDF';
  sizeFormatted: string;
  file?: File;
  isExistingSample?: boolean;
}

export interface AdminDatasetEditorPageProps {
  mode: 'create' | 'edit';
  datasetId?: string;
  datasets?: AdminDataset[];
  onSaveDraft: (savedDataset: AdminDataset, isNew: boolean) => void;
  onPublishDataset: (publishedDataset: AdminDataset) => void;
  onUnpublishDataset?: (datasetId: string) => void;
  onPreviewDraft: (draftToPreview: AdminDataset) => void;
  onCancel: () => void;
  onNavigateDashboard: () => void;
  onNavigateDatasets: () => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
}

// Searchable country and region selector using existing location options
interface SearchableCountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchableCountrySelector: React.FC<SearchableCountrySelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredLocations = FILTER_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const trimmedSearch = searchTerm.trim();
  const hasExactMatch = FILTER_LOCATIONS.some(
    (loc) => loc.toLowerCase() === trimmedSearch.toLowerCase()
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id="field-country"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-left flex items-center justify-between focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors cursor-pointer"
      >
        <span className={value ? 'text-[#111827] font-medium' : 'text-[#64748B]'}>
          {value || 'Select Country / Region'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#64748B] transition-transform ${
            isOpen ? 'rotate-180 text-[#0A3D36]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-md shadow-lg max-h-64 flex flex-col overflow-hidden text-sm"
        >
          {/* Search filter input */}
          <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country or region..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#111827] focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-48 py-1 divide-y divide-[#F1F5F9]">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => {
                const isSelected = loc === value;
                return (
                  <button
                    key={loc}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(loc)}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-[#F1F7F4] transition-colors cursor-pointer ${
                      isSelected ? 'font-semibold text-[#0A3D36] bg-[#F1F7F4]' : 'text-[#111827]'
                    }`}
                  >
                    <span>{loc}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A3D36]" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-2 text-xs text-[#64748B]">
                No predefined regions match &quot;{searchTerm}&quot;
              </div>
            )}

            {/* Custom entry if user typed a specific country/region not in standard list */}
            {trimmedSearch && !hasExactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(trimmedSearch)}
                className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-[#0A3D36] font-medium hover:bg-[#F1F7F4] transition-colors cursor-pointer flex items-center gap-1.5 border-t border-[#E2E8F0]"
              >
                <span>Use &ldquo;{trimmedSearch}&rdquo;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminDatasetEditorPage: React.FC<AdminDatasetEditorPageProps> = ({
  mode,
  datasetId,
  datasets,
  onSaveDraft,
  onPublishDataset,
  onUnpublishDataset,
  onPreviewDraft,
  onCancel,
  onNavigateDashboard,
  onNavigateDatasets,
  onNavigateHome,
  onSignOut,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  // Locate existing dataset if in edit mode
  const datasetsList = datasets || ALL_ADMIN_DATASETS;
  const existingRecord =
    mode === 'edit' && datasetId
      ? datasetsList.find((d) => d.id === datasetId)
      : undefined;

  // Track if this record was originally Published
  const isOriginallyPublished = existingRecord?.status === 'Published';
  const [currentStatus, setCurrentStatus] = useState<'Published' | 'Draft'>(
    existingRecord?.status || 'Draft'
  );
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(
    Boolean(existingRecord?.hasPendingChanges)
  );

  // Stable record ID: preserved across drafts, edits, and publishing without duplication
  const [generatedNewId] = useState(() => `draft-ds-${Date.now().toString(36)}`);
  const stableId = existingRecord ? existingRecord.id : generatedNewId;

  // SECTION 1: BASIC DETAILS
  // Clean new-dataset state starts with unselected empty strings
  const [title, setTitle] = useState(existingRecord?.title || '');
  const [category, setCategory] = useState(existingRecord?.category || '');
  const [country, setCountry] = useState(existingRecord?.country || '');
  const [shortSummary, setShortSummary] = useState(
    existingRecord?.datasetItem.description || ''
  );
  const [overview, setOverview] = useState(
    existingRecord?.datasetItem.overview || ''
  );

  // SECTION 2: COVERAGE AND STRUCTURE
  const [geographicCoverage, setGeographicCoverage] = useState(
    existingRecord?.datasetItem.coverage || ''
  );
  const [coveragePeriod, setCoveragePeriod] = useState(
    existingRecord?.datasetItem.reportingPeriod || ''
  );
  const [updateFrequency, setUpdateFrequency] = useState(
    existingRecord?.datasetItem.updateFrequency || ''
  );

  // Repeatable Field Structure
  const [isFieldStructureOpen, setIsFieldStructureOpen] = useState(
    () => (existingRecord?.datasetItem.fields && existingRecord.datasetItem.fields.length > 0) || false
  );
  const [fields, setFields] = useState<DatasetField[]>(() => {
    if (existingRecord?.datasetItem.fields && existingRecord.datasetItem.fields.length > 0) {
      return [...existingRecord.datasetItem.fields];
    }
    return [];
  });

  // SECTION 3: DATASET FILES (CSV and PDF only)
  const [stagedFiles, setStagedFiles] = useState<StagedDatasetFile[]>(() => {
    if (existingRecord) {
      const result: StagedDatasetFile[] = [];
      const safeId = existingRecord.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (existingRecord.formats.includes('CSV')) {
        result.push({
          id: `file-csv-${safeId}`,
          name: `${safeId}_records.csv`,
          format: 'CSV',
          sizeFormatted: '2.4 MB',
          isExistingSample: true,
        });
      }
      if (existingRecord.formats.includes('PDF')) {
        result.push({
          id: `file-pdf-${safeId}`,
          name: `${safeId}_documentation.pdf`,
          format: 'PDF',
          sizeFormatted: '1.1 MB',
          isExistingSample: true,
        });
      }
      return result;
    }
    return [];
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetFormatRef = useRef<'CSV' | 'PDF' | null>(null);

  // SECTION 4: PHOTOGRAPHS
  // Start BOTH photograph selectors empty on a fresh Add Dataset form.
  // Preserve existing photographs and credits when editing.
  const [primaryImage, setPrimaryImage] = useState<DatasetImage | null>(() => {
    if (existingRecord?.datasetItem.primaryImage && existingRecord.datasetItem.primaryImage.url) {
      return { ...existingRecord.datasetItem.primaryImage };
    }
    return null;
  });
  const [secondaryImage, setSecondaryImage] = useState<DatasetImage | null>(() => {
    if (existingRecord?.datasetItem.secondaryImage && existingRecord.datasetItem.secondaryImage.url) {
      return { ...existingRecord.datasetItem.secondaryImage };
    }
    return null;
  });
  const primaryImageInputRef = useRef<HTMLInputElement>(null);
  const secondaryImageInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageToRemove, setImageToRemove] = useState<'primary' | 'secondary' | null>(null);

  // SECTION 5: SOURCE AND LICENSING
  const [source, setSource] = useState(existingRecord?.datasetItem.source || '');
  const [sourceUrl, setSourceUrl] = useState(existingRecord?.datasetItem.sourceUrl || '');
  const [accessLicensing, setAccessLicensing] = useState(
    existingRecord?.datasetItem.accessLicensing && existingRecord.datasetItem.accessLicensing !== 'To be confirmed'
      ? existingRecord.datasetItem.accessLicensing
      : ''
  );
  const [scopeDetails, setScopeDetails] = useState(
    existingRecord?.datasetItem.scopeDetails || ''
  );

  // FORM STATUS & VALIDATION
  const [titleError, setTitleError] = useState<string | null>(null);
  const [publishErrors, setPublishErrors] = useState<Record<string, string>>({});
  const [saveConfirmation, setSaveConfirmation] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [pendingPublishRecord, setPendingPublishRecord] = useState<AdminDataset | null>(null);

  // Keyboard shortcut: Escape to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPublishModal) setShowPublishModal(false);
        if (showUnpublishModal) setShowUnpublishModal(false);
        if (showDiscardModal) setShowDiscardModal(false);
        if (imageToRemove) setImageToRemove(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPublishModal, showUnpublishModal, showDiscardModal, imageToRemove]);

  // Track user edits to set dirty flag
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (saveConfirmation) setSaveConfirmation(null);
  };

  const handleModuleClick = (moduleName: string) => {
    setComingSoonToast(`${moduleName} module is planned for a subsequent development step.`);
    setTimeout(() => {
      setComingSoonToast((current) => (current?.startsWith(moduleName) ? null : current));
    }, 3200);
  };

  // Derive format badges dynamically from selected files
  const derivedFormats = React.useMemo(() => {
    const list: ('CSV' | 'PDF')[] = [];
    if (stagedFiles.some((f) => f.format === 'CSV')) list.push('CSV');
    if (stagedFiles.some((f) => f.format === 'PDF')) list.push('PDF');
    return list;
  }, [stagedFiles]);

  // Section 2: Repeatable field structure actions
  const handleAddField = () => {
    markDirty();
    setFields((prev) => [
      ...prev,
      {
        name: `field_${prev.length + 1}`,
        dataType: 'String',
        description: '',
      },
    ]);
    if (!isFieldStructureOpen) setIsFieldStructureOpen(true);
  };

  const handleRemoveField = (index: number) => {
    markDirty();
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    key: keyof DatasetField,
    val: string
  ) => {
    markDirty();
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: val } : field))
    );
  };

  // Section 3: File Selection (CSV / PDF only)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const nameLower = file.name.toLowerCase();
    const isCsv = nameLower.endsWith('.csv') || file.type === 'text/csv';
    const isPdf = nameLower.endsWith('.pdf') || file.type === 'application/pdf';

    if (!isCsv && !isPdf) {
      setFileError('Unsupported file type. Only CSV and PDF files are supported.');
      e.target.value = '';
      return;
    }

    const format: 'CSV' | 'PDF' = isCsv ? 'CSV' : 'PDF';
    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    markDirty();
    if (publishErrors.files) {
      setPublishErrors((prev) => ({ ...prev, files: '' }));
    }

    setStagedFiles((prev) => {
      const targetFormat = replaceTargetFormatRef.current || format;
      const filtered = prev.filter((f) => f.format !== targetFormat);
      return [
        ...filtered,
        {
          id: `file-${format.toLowerCase()}-${Date.now()}`,
          name: file.name,
          format,
          sizeFormatted,
          file,
          isExistingSample: false,
        },
      ];
    });

    replaceTargetFormatRef.current = null;
    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    markDirty();
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleTriggerReplaceFile = (format: 'CSV' | 'PDF') => {
    replaceTargetFormatRef.current = format;
    fileInputRef.current?.click();
  };

  // Section 4: Image Handling
  const handleImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'primary' | 'secondary'
  ) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const nameLower = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => nameLower.endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setImageError('Unsupported image format. Please select a JPG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    markDirty();

    if (target === 'primary') {
      setPrimaryImage((prev) => ({
        url: objectUrl,
        alt: prev?.alt || file.name.replace(/\.[^/.]+$/, ''),
        caption: prev?.caption || '',
        attribution: prev?.attribution || '',
      }));
    } else {
      setSecondaryImage((prev) => ({
        url: objectUrl,
        alt: prev?.alt || file.name.replace(/\.[^/.]+$/, ''),
        caption: prev?.caption || '',
        attribution: prev?.attribution || '',
      }));
    }

    e.target.value = '';
  };

  // Confirm image removal and clear details
  const handleConfirmRemoveImage = () => {
    if (imageToRemove === 'primary') {
      setPrimaryImage(null);
      markDirty();
    } else if (imageToRemove === 'secondary') {
      setSecondaryImage(null);
      markDirty();
    }
    setImageToRemove(null);
  };

  // Compile full AdminDataset object from in-memory state
  const assembleAdminDatasetRecord = (publishMode: boolean = false): AdminDataset => {
    const trimmedTitle = title.trim();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const datasetItem: DatasetItem = {
      id: stableId,
      title: trimmedTitle,
      location: country.trim() || 'Africa',
      coverage: geographicCoverage.trim() || country.trim() || 'Regional',
      category: category || 'General',
      formats: derivedFormats.length > 0 ? derivedFormats : ['CSV'],
      description: shortSummary.trim() || `Administrative dataset record for ${trimmedTitle}.`,
      overview: overview.trim() || undefined,
      topics: existingRecord?.datasetItem.topics || [category || 'General', country.trim() || 'Africa'].filter(Boolean),
      sampleAttributes:
        fields.length > 0
          ? fields.map((f) => f.name)
          : existingRecord?.datasetItem.sampleAttributes || [],
      fields: fields.map((f) => ({
        name: f.name.trim() || 'field',
        dataType: f.dataType || 'String',
        description: f.description.trim() || 'Field attribute description',
      })),
      scopeDetails: scopeDetails.trim() || (existingRecord?.datasetItem.scopeDetails || ''),
      source: source.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      reportingPeriod: coveragePeriod.trim() || undefined,
      updateFrequency: updateFrequency.trim() || undefined,
      accessLicensing: accessLicensing.trim() || 'To be confirmed',
      primaryImage: primaryImage || {
        url: '',
        alt: '',
        caption: '',
        attribution: '',
      },
      secondaryImage: secondaryImage || {
        url: '',
        alt: '',
        caption: '',
        attribution: '',
      },
    };

    if (publishMode) {
      return {
        id: stableId,
        title: trimmedTitle,
        country: country.trim() || 'Africa',
        category: category || 'General',
        formats: derivedFormats.length > 0 ? derivedFormats : ['CSV'],
        status: 'Published',
        updated: formattedDate,
        datasetItem,
        publishedDatasetItem: datasetItem,
        hasPendingChanges: false,
      };
    }

    // Draft mode: if record was already published, retain published snapshot while flagging draft changes
    const isPublishedDraft = currentStatus === 'Published';
    return {
      id: stableId,
      title: trimmedTitle,
      country: country.trim() || 'Africa',
      category: category || 'General',
      formats: derivedFormats.length > 0 ? derivedFormats : ['CSV'],
      status: isPublishedDraft ? 'Published' : 'Draft',
      updated: formattedDate,
      datasetItem,
      publishedDatasetItem: isPublishedDraft
        ? (existingRecord?.publishedDatasetItem || existingRecord?.datasetItem)
        : undefined,
      hasPendingChanges: isPublishedDraft,
    };
  };

  // Validate form for saving a draft: only requires title
  const validateForDraft = (): boolean => {
    if (!title.trim()) {
      setTitleError('Dataset title is required to save a draft.');
      const titleEl = document.getElementById('field-title');
      if (titleEl) {
        titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        titleEl.focus();
      }
      return false;
    }
    setTitleError(null);
    return true;
  };

  // Validate form for publishing: requires title, category, country, short summary, overview, and >=1 CSV or PDF
  const validateForPublish = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Dataset title is required to publish.';
    }
    if (!category.trim() || category === 'Select Category') {
      errors.category = 'Category is required to publish.';
    }
    if (!country.trim() || country === 'Select Country / Region') {
      errors.country = 'Country / Region is required to publish.';
    }
    if (!shortSummary.trim()) {
      errors.summary = 'Short summary is required to publish.';
    }
    if (!overview.trim()) {
      errors.overview = 'Overview is required to publish.';
    }
    if (stagedFiles.length === 0) {
      errors.files = 'At least one CSV or PDF file is required to publish.';
    }

    setPublishErrors(errors);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      // Focus and scroll to first invalid field
      const fieldIdMap: Record<string, string> = {
        title: 'field-title',
        category: 'field-category',
        country: 'field-country',
        summary: 'field-summary',
        overview: 'field-overview',
        files: 'field-files-attach',
      };
      const firstFieldId = fieldIdMap[errorKeys[0]];
      if (firstFieldId) {
        const el = document.getElementById(firstFieldId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      return false;
    }

    return true;
  };

  // Primary Action: Save Draft (never automatically publishes)
  const handleSaveDraft = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForDraft()) return;

    const record = assembleAdminDatasetRecord(false);
    const isNew = mode === 'create';

    onSaveDraft(record, isNew);
    setIsDirty(false);
    if (currentStatus === 'Published') {
      setHasPendingChanges(true);
    }
    setSaveConfirmation('Draft saved for preview.');

    setTimeout(() => {
      setSaveConfirmation((prev) => (prev === 'Draft saved for preview.' ? null : prev));
    }, 4500);
  };

  // Secondary Action: Preview (continues to show current form content without publishing)
  const handlePreview = () => {
    if (!validateForDraft()) return;
    const record = assembleAdminDatasetRecord(false);
    const isNew = mode === 'create';
    onSaveDraft(record, isNew);
    setIsDirty(false);
    onPreviewDraft(record);
  };

  // Publish Button click: validates required fields and opens confirmation dialog
  const handlePublishClick = () => {
    if (!validateForPublish()) return;
    const record = assembleAdminDatasetRecord(true);
    setPendingPublishRecord(record);
    setShowPublishModal(true);
  };

  // Confirm Publish in modal: updates shared data and shows "Published in preview."
  const handleConfirmPublish = () => {
    if (!pendingPublishRecord) return;
    onPublishDataset(pendingPublishRecord);
    setCurrentStatus('Published');
    setHasPendingChanges(false);
    setIsDirty(false);
    setShowPublishModal(false);
    setSaveConfirmation('Published in preview.');

    setTimeout(() => {
      setSaveConfirmation((prev) => (prev === 'Published in preview.' ? null : prev));
    }, 4500);
  };

  // Unpublish Button click: opens unpublish confirmation modal
  const handleUnpublishClick = () => {
    setShowUnpublishModal(true);
  };

  // Confirm Unpublish in modal: returns dataset to Draft status and shows "Unpublished in preview."
  const handleConfirmUnpublish = () => {
    if (onUnpublishDataset) {
      onUnpublishDataset(stableId);
    }
    setCurrentStatus('Draft');
    setHasPendingChanges(false);
    setIsDirty(false);
    setShowUnpublishModal(false);
    setSaveConfirmation('Unpublished in preview.');

    setTimeout(() => {
      setSaveConfirmation((prev) => (prev === 'Unpublished in preview.' ? null : prev));
    }, 4500);
  };

  // Text Action: Cancel
  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    setIsDirty(false);
    onCancel();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans selection:bg-[#0A3D36]/10 selection:text-[#0A3D36]">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.pdf,text/csv,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={primaryImageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => handleImageFileSelect(e, 'primary')}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={secondaryImageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => handleImageFileSelect(e, 'secondary')}
        className="hidden"
        aria-hidden="true"
      />

      {/* Screen Layout: Anchored Sidebar + Scrollable Main Content */}
      <div className="flex-1 flex w-full relative items-start">
        {/* Admin Navigation Sidebar (Datasets highlighted) */}
        <AdminSidebar
          activeTab="datasets"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateDatasets={onNavigateDatasets}
          onNavigateHome={onNavigateHome}
          onSignOut={onSignOut}
          onModuleClick={handleModuleClick}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#F8FAFC]">
          {/* Module Toast */}
          {comingSoonToast && (
            <div
              role="status"
              aria-live="polite"
              className="bg-[#0A3D36] text-white text-xs py-2 px-4 text-center font-medium transition-all"
            >
              {comingSoonToast}
            </div>
          )}

          {/* 1. COMPACT STICKY HEADER */}
          {/* Unifies Page Heading, Draft Badge, Discreet Preview Note, Back to Datasets, and Form Actions in one row */}
          <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xs w-full">
            <div className="flex items-center justify-between gap-3 w-full">
              {/* Left: Mobile Toggle + Back to Datasets + Heading + Draft badge */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile Sidebar Hamburger Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-1.5 text-[#4B5563] hover:text-[#111827] rounded-md hover:bg-[#F1F5F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  aria-label="Open navigation sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Back to Datasets Action */}
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded px-1 py-1 shrink-0"
                  title="Return to Datasets listing"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Datasets</span>
                </button>

                <div className="hidden sm:block h-4 w-px bg-[#CBD5E1]" aria-hidden="true" />

                {/* Page Heading & Draft Badge */}
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="font-schoolbook font-bold text-lg sm:text-xl text-[#111827] truncate">
                    {mode === 'create' ? 'Add Dataset' : 'Edit Dataset'}
                  </h1>
                  {currentStatus === 'Published' ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#0A3D36] border border-[#DCFCE7]"
                        title={`Published dataset (${datasetId})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                        Published
                      </span>
                      {(hasPendingChanges || isDirty) && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                          title="Pending changes exist that are not yet published to the customer catalogue"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          Unpublished changes
                        </span>
                      )}
                    </div>
                  ) : (
                    <span
                      className="text-[11px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] shrink-0"
                      title={mode === 'create' ? 'New dataset draft' : `Dataset ID: ${datasetId}`}
                    >
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Discreet preview indicator + Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* Discreet preview indicator */}
                <span className="hidden xl:inline-flex items-center text-xs text-[#0A3D36] bg-[#0A3D36]/5 px-2.5 py-1 rounded-full border border-[#0A3D36]/15 font-sans">
                  Preview only — changes are temporary.
                </span>

                {/* Preview Action (Secondary) */}
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  title="Preview form content in full customer detail page layout"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0A3D36]" />
                  <span>Preview</span>
                </button>

                {/* Save Draft Action */}
                <button
                  type="button"
                  onClick={() => handleSaveDraft()}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  title="Save draft without publishing to customer catalogue"
                >
                  <span>Save Draft</span>
                </button>

                {/* Publish / Publish Changes Action (Primary Oceanic Green) */}
                <button
                  type="button"
                  onClick={handlePublishClick}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                >
                  <span>{currentStatus === 'Published' ? 'Publish Changes' : 'Publish'}</span>
                </button>

                {/* Unpublish Action (if published) */}
                {currentStatus === 'Published' && (
                  <button
                    type="button"
                    onClick={handleUnpublishClick}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors cursor-pointer border border-[#E2E8F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                    title="Remove from customer catalogue while keeping in admin"
                  >
                    <span>Unpublish</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile-only discreet preview indicator line */}
            <div className="md:hidden pt-1.5 text-[11px] text-[#0A3D36] font-medium flex items-center justify-between border-t border-[#F1F5F9] mt-2">
              <span>Preview only — changes are temporary.</span>
            </div>
          </header>

          {/* Main Editor Content Area (Full width matching header edges with 16px mobile / 24px desktop outer padding) */}
          <main className="flex-1 w-full px-4 sm:px-6 py-6 space-y-6 min-w-0">
            {/* Small confirmation alert */}
            {saveConfirmation && (
              <div
                role="status"
                aria-live="polite"
                className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#0A3D36] px-4 py-3 rounded-md text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs scroll-mt-24"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0A3D36] shrink-0" />
                  <span className="font-medium">{saveConfirmation}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveConfirmation(null)}
                  className="text-[#0A3D36] hover:text-[#072C27] p-1 rounded cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSaveDraft} className="w-full space-y-6 min-w-0">
              {/* SECTION 1 — BASIC DETAILS */}
              <section
                aria-labelledby="section-basic-details"
                className="w-full bg-white rounded-md border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-20"
              >
                <div>
                  <h2
                    id="section-basic-details"
                    className="font-schoolbook font-bold text-lg text-[#111827]"
                  >
                    1. Basic Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Dataset Title (Required) */}
                  <div className="md:col-span-2 scroll-mt-24">
                    <label
                      htmlFor="field-title"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Dataset Title <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      id="field-title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        markDirty();
                        if (titleError) setTitleError(null);
                        if (publishErrors.title) {
                          setPublishErrors((prev) => ({ ...prev, title: '' }));
                        }
                      }}
                      placeholder="e.g. Kenya Agricultural Crop Production Time Series"
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border rounded-md text-[#111827] focus:outline-none focus:bg-white focus:ring-1 transition-colors ${
                        publishErrors.title || titleError
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-[#0A3D36]'
                      }`}
                      aria-required="true"
                      aria-invalid={Boolean(publishErrors.title || titleError)}
                      aria-describedby={
                        publishErrors.title || titleError ? 'title-error-msg' : undefined
                      }
                    />
                    {(publishErrors.title || titleError) && (
                      <p
                        id="title-error-msg"
                        className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium scroll-mt-24"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{publishErrors.title || titleError}</span>
                      </p>
                    )}
                  </div>

                  {/* Category (Starts with 'Select Category') */}
                  <div className="scroll-mt-24">
                    <label
                      htmlFor="field-category"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Category <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      id="field-category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        markDirty();
                        if (publishErrors.category) {
                          setPublishErrors((prev) => ({ ...prev, category: '' }));
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border rounded-md focus:outline-none focus:bg-white focus:ring-1 transition-colors cursor-pointer ${
                        publishErrors.category
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-[#0A3D36]'
                      } ${category ? 'text-[#111827]' : 'text-[#64748B]'}`}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {FILTER_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="text-[#111827]">
                          {cat}
                        </option>
                      ))}
                    </select>
                    {publishErrors.category && (
                      <p className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{publishErrors.category}</span>
                      </p>
                    )}
                  </div>

                  {/* Country / Region (Searchable Selector, starts with 'Select Country / Region') */}
                  <div className="scroll-mt-24">
                    <label
                      htmlFor="field-country"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Country / Region <span className="text-[#DC2626]">*</span>
                    </label>
                    <SearchableCountrySelector
                      value={country}
                      onChange={(newVal) => {
                        setCountry(newVal);
                        markDirty();
                        if (publishErrors.country) {
                          setPublishErrors((prev) => ({ ...prev, country: '' }));
                        }
                      }}
                    />
                    {publishErrors.country && (
                      <p className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{publishErrors.country}</span>
                      </p>
                    )}
                  </div>

                  {/* Short Summary (Catalogue Cards) */}
                  <div className="md:col-span-2 scroll-mt-24">
                    <label
                      htmlFor="field-summary"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Short Summary <span className="text-[#DC2626]">*</span>{' '}
                      <span className="text-[#64748B] font-normal text-xs">
                        (Concise text for marketplace cards)
                      </span>
                    </label>
                    <textarea
                      id="field-summary"
                      rows={2}
                      value={shortSummary}
                      onChange={(e) => {
                        setShortSummary(e.target.value);
                        markDirty();
                        if (publishErrors.summary) {
                          setPublishErrors((prev) => ({ ...prev, summary: '' }));
                        }
                      }}
                      placeholder="Brief summary displayed on marketplace cards and catalogue search results..."
                      className={`w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border rounded-md text-[#111827] focus:outline-none focus:bg-white focus:ring-1 transition-colors ${
                        publishErrors.summary
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-[#0A3D36]'
                      }`}
                    />
                    {publishErrors.summary && (
                      <p className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{publishErrors.summary}</span>
                      </p>
                    )}
                  </div>

                  {/* Overview (Detail Page) */}
                  <div className="md:col-span-2 scroll-mt-24">
                    <label
                      htmlFor="field-overview"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Overview <span className="text-[#DC2626]">*</span>{' '}
                      <span className="text-[#64748B] font-normal text-xs">
                        (Full content for dataset detail page)
                      </span>
                    </label>
                    <textarea
                      id="field-overview"
                      rows={4}
                      value={overview}
                      onChange={(e) => {
                        setOverview(e.target.value);
                        markDirty();
                        if (publishErrors.overview) {
                          setPublishErrors((prev) => ({ ...prev, overview: '' }));
                        }
                      }}
                      placeholder="Comprehensive narrative overview, methodologies, indicators, and historical context..."
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border rounded-md text-[#111827] focus:outline-none focus:bg-white focus:ring-1 transition-colors ${
                        publishErrors.overview
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                          : 'border-[#CBD5E1] focus:border-[#0A3D36] focus:ring-[#0A3D36]'
                      }`}
                    />
                    {publishErrors.overview && (
                      <p className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{publishErrors.overview}</span>
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 2 — COVERAGE AND STRUCTURE */}
              <section
                aria-labelledby="section-coverage"
                className="bg-white rounded-md border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-20"
              >
                <div>
                  <h2
                    id="section-coverage"
                    className="font-schoolbook font-bold text-lg text-[#111827]"
                  >
                    2. Coverage and Structure
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {/* Geographic Coverage */}
                  <div>
                    <label
                      htmlFor="field-geo-coverage"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Geographic Coverage
                    </label>
                    <input
                      id="field-geo-coverage"
                      type="text"
                      value={geographicCoverage}
                      onChange={(e) => {
                        setGeographicCoverage(e.target.value);
                        markDirty();
                      }}
                      placeholder="e.g. Kenya (47 Counties & Urban Corridors)"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                    />
                  </div>

                  {/* Coverage Period */}
                  <div>
                    <label
                      htmlFor="field-period"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Coverage Period
                    </label>
                    <input
                      id="field-period"
                      type="text"
                      value={coveragePeriod}
                      onChange={(e) => {
                        setCoveragePeriod(e.target.value);
                        markDirty();
                      }}
                      placeholder="e.g. 2015 – 2026"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                    />
                  </div>

                  {/* Update Frequency (Starts with 'Select Update Frequency') */}
                  <div>
                    <label
                      htmlFor="field-frequency"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Update Frequency
                    </label>
                    <select
                      id="field-frequency"
                      value={updateFrequency}
                      onChange={(e) => {
                        setUpdateFrequency(e.target.value);
                        markDirty();
                      }}
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors cursor-pointer ${
                        updateFrequency ? 'text-[#111827]' : 'text-[#64748B]'
                      }`}
                    >
                      <option value="" disabled>
                        Select Update Frequency
                      </option>
                      <option value="Continuous" className="text-[#111827]">Continuous / Real-time</option>
                      <option value="Monthly" className="text-[#111827]">Monthly</option>
                      <option value="Quarterly" className="text-[#111827]">Quarterly</option>
                      <option value="Bi-annual" className="text-[#111827]">Bi-annual</option>
                      <option value="Annual" className="text-[#111827]">Annual</option>
                      <option value="Irregular" className="text-[#111827]">Irregular</option>
                      <option value="Historical Archive" className="text-[#111827]">Historical Archive</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible Field Structure Section */}
                <div className="pt-2">
                  <div className="border border-[#E2E8F0] rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsFieldStructureOpen(!isFieldStructureOpen)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-[#111827]">
                          Field Structure Table
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[#475569]">
                          {fields.length === 0 ? 'Optional (0 fields)' : `${fields.length} ${fields.length === 1 ? 'field' : 'fields'}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <span>{isFieldStructureOpen ? 'Collapse' : 'Expand'}</span>
                        {isFieldStructureOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isFieldStructureOpen && (
                      <div className="p-4 bg-white space-y-3">
                        {fields.length === 0 ? (
                          <div className="py-6 px-4 text-center border border-dashed border-[#CBD5E1] rounded-md">
                            <p className="text-xs text-[#64748B] mb-2.5">
                              No fields defined. Specifying column definitions is optional.
                            </p>
                            <button
                              type="button"
                              onClick={handleAddField}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0A3D36] bg-[#F1F7F4] hover:bg-[#E5F0EB] rounded-md transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add First Field</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                                <thead>
                                  <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                                    <th className="pb-2 w-[28%]">Field Name</th>
                                    <th className="pb-2 w-[22%]">Data Type</th>
                                    <th className="pb-2 w-[42%]">Description</th>
                                    <th className="pb-2 w-[8%] text-right">Remove</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                  {fields.map((f, idx) => (
                                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                                      <td className="py-2 pr-2">
                                        <input
                                          type="text"
                                          value={f.name}
                                          onChange={(e) =>
                                            handleFieldChange(idx, 'name', e.target.value)
                                          }
                                          placeholder="attribute_name"
                                          className="w-full px-2.5 py-1.5 font-mono text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[#111827] focus:bg-white focus:outline-none focus:border-[#0A3D36]"
                                        />
                                      </td>
                                      <td className="py-2 pr-2">
                                        <select
                                          value={f.dataType}
                                          onChange={(e) =>
                                            handleFieldChange(idx, 'dataType', e.target.value)
                                          }
                                          className="w-full px-2 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[#111827] focus:bg-white focus:outline-none focus:border-[#0A3D36] cursor-pointer"
                                        >
                                          <option value="String">String</option>
                                          <option value="Integer">Integer</option>
                                          <option value="Float">Float</option>
                                          <option value="Date">Date</option>
                                          <option value="Boolean">Boolean</option>
                                          <option value="Percentage">Percentage</option>
                                          <option value="GeoJSON">GeoJSON</option>
                                        </select>
                                      </td>
                                      <td className="py-2 pr-2">
                                        <input
                                          type="text"
                                          value={f.description}
                                          onChange={(e) =>
                                            handleFieldChange(idx, 'description', e.target.value)
                                          }
                                          placeholder="Description of field..."
                                          className="w-full px-2.5 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[#111827] focus:bg-white focus:outline-none focus:border-[#0A3D36]"
                                        />
                                      </td>
                                      <td className="py-2 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveField(idx)}
                                          className="text-[#94A3B8] hover:text-[#DC2626] p-1 rounded transition-colors cursor-pointer"
                                          title="Remove field"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddField}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0A3D36] hover:bg-[#F1F7F4] rounded-md transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Field</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 3 — DATASET FILES (CSV and PDF only) */}
              <section
                aria-labelledby="section-files"
                className="bg-white rounded-md border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2
                      id="section-files"
                      className="font-schoolbook font-bold text-lg text-[#111827]"
                    >
                      3. Dataset Files
                    </h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Accepts CSV and PDF formats only. Available catalogue badges are derived automatically.
                    </p>
                  </div>

                  {/* Derived format badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#64748B]">Derived Formats:</span>
                    {derivedFormats.length === 0 ? (
                      <span className="text-xs text-[#94A3B8] italic">None selected</span>
                    ) : (
                      derivedFormats.map((fmt) => (
                        <span
                          key={fmt}
                          className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#0A3D36] border border-[#CBD5E1]"
                        >
                          {fmt}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Inline file error */}
                {fileError && (
                  <div
                    role="alert"
                    className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md text-xs text-[#DC2626] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileError(null)}
                      className="p-0.5 text-[#DC2626] hover:opacity-80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Staged files list */}
                {stagedFiles.length > 0 && (
                  <div className="space-y-2">
                    {stagedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`px-2 py-0.5 font-mono font-bold rounded text-[11px] shrink-0 border ${
                              f.format === 'CSV'
                                ? 'bg-[#ECFDF5] text-[#0A3D36] border-[#A7F3D0]'
                                : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                            }`}
                          >
                            {f.format}
                          </span>
                          <span className="font-medium text-[#111827] truncate font-mono">
                            {f.name}
                          </span>
                          <span className="text-[#64748B] shrink-0">({f.sizeFormatted})</span>
                          {f.isExistingSample && (
                            <span className="text-[10px] font-sans text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] shrink-0 hidden sm:inline">
                              Preserved sample
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTriggerReplaceFile(f.format)}
                            className="text-[#0A3D36] hover:text-[#072C27] hover:underline font-medium text-xs cursor-pointer"
                          >
                            Replace
                          </button>
                          <span className="text-[#CBD5E1]">|</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(f.id)}
                            className="text-[#94A3B8] hover:text-[#DC2626] p-1 rounded transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attach file action */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {(!stagedFiles.some((f) => f.format === 'CSV') ||
                    !stagedFiles.some((f) => f.format === 'PDF')) && (
                    <button
                      type="button"
                      id="field-files-attach"
                      onClick={() => {
                        replaceTargetFormatRef.current = null;
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0A3D36] bg-[#F1F7F4] hover:bg-[#E2EFE9] border border-[#CBD5E1] rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Attach CSV or PDF File</span>
                    </button>
                  )}
                  <span className="text-[11px] text-[#64748B]">
                    Max size: 50 MB per file · Stored temporarily in browser memory
                  </span>
                </div>

                {/* Inline publish error for files */}
                {publishErrors.files && (
                  <p
                    id="files-error-msg"
                    className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{publishErrors.files}</span>
                  </p>
                )}
              </section>

              {/* SECTION 4 — PHOTOGRAPHS */}
              <section
                aria-labelledby="section-photos"
                className="bg-white rounded-md border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-20"
              >
                <div>
                  <h2
                    id="section-photos"
                    className="font-schoolbook font-bold text-lg text-[#111827]"
                  >
                    4. Photographs
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Select main photograph and optional second image (JPG, PNG, WebP). Existing photographs and credits are preserved when editing.
                  </p>
                </div>

                {/* Inline image error */}
                {imageError && (
                  <div
                    role="alert"
                    className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md text-xs text-[#DC2626] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{imageError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageError(null)}
                      className="p-0.5 text-[#DC2626] hover:opacity-80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Primary Photograph */}
                  <div className="border border-[#E2E8F0] rounded-md p-4 bg-[#FAFCFB] space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36]">
                        Main Photograph
                      </span>
                      {primaryImage?.url && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => primaryImageInputRef.current?.click()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Replace Image</span>
                          </button>
                          <span className="text-[#CBD5E1]">|</span>
                          <button
                            type="button"
                            onClick={() => setImageToRemove('primary')}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {primaryImage?.url ? (
                      <>
                        {/* Thumbnail preview */}
                        <div className="h-40 w-full rounded bg-[#E2E8F0] overflow-hidden relative border border-[#CBD5E1]">
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.alt || 'Main photograph reference'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Alt Text (Shown after image is attached) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={primaryImage.alt || ''}
                            onChange={(e) => {
                              setPrimaryImage((prev) =>
                                prev ? { ...prev, alt: e.target.value } : null
                              );
                              markDirty();
                            }}
                            placeholder="Descriptive scene alternative text"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                          />
                        </div>

                        {/* Photo Credit (Shown after image is attached, blank unless provided) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5">
                            Photo Credit / Attribution
                          </label>
                          <input
                            type="text"
                            value={primaryImage.attribution || ''}
                            onChange={(e) => {
                              setPrimaryImage((prev) =>
                                prev ? { ...prev, attribution: e.target.value } : null
                              );
                              markDirty();
                            }}
                            placeholder="Leave blank unless attribution is required"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                          />
                        </div>
                      </>
                    ) : (
                      /* Clean empty state for new dataset or cleared photo */
                      <div className="h-48 border border-dashed border-[#CBD5E1] rounded-md flex flex-col items-center justify-center p-4 text-center bg-white">
                        <ImageIcon className="w-8 h-8 text-[#94A3B8] mb-2" />
                        <p className="text-xs text-[#64748B] mb-3">
                          No photograph attached.
                        </p>
                        <button
                          type="button"
                          onClick={() => primaryImageInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0A3D36] bg-[#F1F7F4] hover:bg-[#E2EFE9] border border-[#CBD5E1] rounded-md transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Attach Main Image</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Secondary Photograph (Optional) */}
                  <div className="border border-[#E2E8F0] rounded-md p-4 bg-[#FAFCFB] space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                        Second Photograph <span className="text-[#94A3B8] font-normal">(Optional)</span>
                      </span>
                      {secondaryImage?.url && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => secondaryImageInputRef.current?.click()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Replace Image</span>
                          </button>
                          <span className="text-[#CBD5E1]">|</span>
                          <button
                            type="button"
                            onClick={() => setImageToRemove('secondary')}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {secondaryImage?.url ? (
                      <>
                        {/* Thumbnail preview */}
                        <div className="h-40 w-full rounded bg-[#E2E8F0] overflow-hidden relative border border-[#CBD5E1]">
                          <img
                            src={secondaryImage.url}
                            alt={secondaryImage.alt || 'Secondary photograph reference'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Alt Text (Shown after image is attached) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={secondaryImage.alt || ''}
                            onChange={(e) => {
                              setSecondaryImage((prev) =>
                                prev ? { ...prev, alt: e.target.value } : null
                              );
                              markDirty();
                            }}
                            placeholder="Descriptive scene alternative text"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                          />
                        </div>

                        {/* Photo Credit (Shown after image is attached, blank unless provided) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5">
                            Photo Credit / Attribution
                          </label>
                          <input
                            type="text"
                            value={secondaryImage.attribution || ''}
                            onChange={(e) => {
                              setSecondaryImage((prev) =>
                                prev ? { ...prev, attribution: e.target.value } : null
                              );
                              markDirty();
                            }}
                            placeholder="Leave blank unless attribution is required"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                          />
                        </div>
                      </>
                    ) : (
                      /* Clean empty state for new dataset or cleared photo */
                      <div className="h-48 border border-dashed border-[#CBD5E1] rounded-md flex flex-col items-center justify-center p-4 text-center bg-white">
                        <ImageIcon className="w-8 h-8 text-[#94A3B8] mb-2" />
                        <p className="text-xs text-[#64748B] mb-3">
                          No second photograph attached.
                        </p>
                        <button
                          type="button"
                          onClick={() => secondaryImageInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0A3D36] bg-[#F1F7F4] hover:bg-[#E2EFE9] border border-[#CBD5E1] rounded-md transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Attach Second Image</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 5 — SOURCE AND LICENSING */}
              <section
                aria-labelledby="section-source"
                className="bg-white rounded-md border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-20"
              >
                <div>
                  <h2
                    id="section-source"
                    className="font-schoolbook font-bold text-lg text-[#111827]"
                  >
                    5. Source and Licensing
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Omitted fields display &lsquo;To be confirmed&rsquo; in the detail preview.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Source / Publisher (Single-line field) */}
                  <div>
                    <label
                      htmlFor="field-source"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Source / Publisher
                    </label>
                    <input
                      id="field-source"
                      type="text"
                      value={source}
                      onChange={(e) => {
                        setSource(e.target.value);
                        markDirty();
                      }}
                      placeholder="e.g. National Bureau of Statistics"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                    />
                  </div>

                  {/* Source URL (Single-line field) */}
                  <div>
                    <label
                      htmlFor="field-source-url"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Source URL
                    </label>
                    <input
                      id="field-source-url"
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => {
                        setSourceUrl(e.target.value);
                        markDirty();
                      }}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                    />
                  </div>

                  {/* Licence / Usage Terms (Compact resizable text area, ~3 lines) */}
                  <div>
                    <label
                      htmlFor="field-licence"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Licence / Usage Terms
                    </label>
                    <textarea
                      id="field-licence"
                      rows={3}
                      value={accessLicensing}
                      onChange={(e) => {
                        setAccessLicensing(e.target.value);
                        markDirty();
                      }}
                      placeholder="e.g. Open Data, Institutional Review, Commercial Research License"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors resize-y"
                    />
                  </div>

                  {/* Additional Access Notes (Compact resizable text area, ~3 lines) */}
                  <div>
                    <label
                      htmlFor="field-access-notes"
                      className="block text-xs sm:text-sm font-medium text-[#334155] mb-1.5"
                    >
                      Additional Access Notes
                    </label>
                    <textarea
                      id="field-access-notes"
                      rows={3}
                      value={scopeDetails}
                      onChange={(e) => {
                        setScopeDetails(e.target.value);
                        markDirty();
                      }}
                      placeholder="Special access stipulations or redistribution terms..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors resize-y"
                    />
                  </div>
                </div>
              </section>

              {/* BOTTOM ACTIONS BAR */}
              <div className="bg-white p-4 sm:p-5 rounded-md border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Publish / Publish Changes (Primary Oceanic Green) */}
                  <button
                    type="button"
                    onClick={handlePublishClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  >
                    <span>{currentStatus === 'Published' ? 'Publish Changes' : 'Publish'}</span>
                  </button>

                  {/* Save Draft */}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  >
                    <span>Save Draft</span>
                  </button>

                  {/* Preview (Secondary) */}
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  >
                    <Eye className="w-4 h-4 text-[#0A3D36]" />
                    <span>Preview</span>
                  </button>

                  {/* Unpublish (if published) */}
                  {currentStatus === 'Published' && (
                    <button
                      type="button"
                      onClick={handleUnpublishClick}
                      className="px-3.5 py-2.5 text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] border border-[#FECACA] rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                    >
                      Unpublish
                    </button>
                  )}

                  {/* Cancel (Text Action) */}
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="px-3 py-2.5 text-sm font-medium text-[#64748B] hover:text-[#111827] hover:underline transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-xs text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                  <span>Draft requires only title · Full details &amp; files required to publish</span>
                </div>
              </div>
            </form>
          </main>

          <AdminFooter />
        </div>
      </div>

      {/* Confirmation Modal: Remove Photograph */}
      {imageToRemove && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-image-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="remove-image-title" className="font-schoolbook font-bold text-lg text-[#111827]">
                  Remove photograph?
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                  Are you sure you want to remove the {imageToRemove === 'primary' ? 'main' : 'second'} photograph? Its alternative text and credit details will also be cleared.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setImageToRemove(null)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
              >
                Keep Photograph
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveImage}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md transition-colors cursor-pointer"
              >
                Remove Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Confirmation Modal */}
      {showDiscardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="discard-modal-title" className="font-schoolbook font-bold text-lg text-[#111827]">
                  Discard unsaved changes?
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                  You have unsaved changes in this dataset draft. If you leave now, any entered values and temporary file selections will be lost.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3
                id="publish-modal-title"
                className="font-schoolbook font-bold text-lg text-[#111827]"
              >
                {currentStatus === 'Published' ? 'Publish Changes' : 'Publish Dataset'}
              </h3>
              <p className="text-xs text-[#0A3D36] font-medium mt-0.5">
                Preview only — changes are temporary.
              </p>
            </div>

            {/* Dataset Details Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3.5 space-y-2.5 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px] uppercase tracking-wider font-semibold">
                  Dataset Title
                </span>
                <span className="font-semibold text-[#111827] text-sm leading-snug block mt-0.5">
                  {title.trim()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]/70">
                <div>
                  <span className="text-[#64748B] block text-[11px] uppercase tracking-wider font-semibold">
                    Country / Region
                  </span>
                  <span className="text-[#334155] font-medium block mt-0.5">
                    {country.trim() || 'Pan-African'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px] uppercase tracking-wider font-semibold">
                    Available Formats
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    {derivedFormats.map((fmt) => (
                      <span
                        key={fmt}
                        className="font-mono text-[11px] font-semibold bg-white px-1.5 py-0.5 rounded text-[#0A3D36] border border-[#CBD5E1]"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#334155] leading-relaxed">
              {currentStatus === 'Published'
                ? 'Publish these changes to the customer catalogue?'
                : 'Publish this dataset to the customer catalogue?'}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs"
              >
                {currentStatus === 'Published' ? 'Publish Changes' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublish Confirmation Modal */}
      {showUnpublishModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unpublish-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="unpublish-modal-title"
                  className="font-schoolbook font-bold text-lg text-[#111827]"
                >
                  Unpublish Dataset
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {title.trim()}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#334155] leading-relaxed">
              Remove this dataset from the customer catalogue? Its information and files will remain available in Admin.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUnpublishModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUnpublish}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md transition-colors cursor-pointer shadow-xs"
              >
                Unpublish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
