import { ILLUSTRATIVE_DATASETS, DatasetItem } from './datasets';

export interface AdminDataset {
  id: string;
  title: string;
  country: string;
  category: string;
  formats: ('CSV' | 'PDF')[];
  status: 'Published' | 'Draft';
  updated?: string; // If undefined, UI displays "Not recorded"
  datasetItem: DatasetItem;
  hasPendingChanges?: boolean;
  publishedDatasetItem?: DatasetItem;
}

// Full draft datasets with complete specifications for admin preview
export const DRAFT_DATASETS: AdminDataset[] = [
  {
    id: 'draft-ghana-mining-concessions',
    title: 'Ghana Mineral Extraction Concessions',
    country: 'Ghana',
    category: 'Economy',
    formats: ['CSV'],
    status: 'Draft',
    updated: 'Oct 16, 2026',
    datasetItem: {
      id: 'draft-ghana-mining-concessions',
      title: 'Ghana Mineral Extraction Concessions',
      location: 'Ghana',
      coverage: 'Ghana (Ashanti, Western & Eastern Mining Belts)',
      category: 'Economy',
      formats: ['CSV'],
      description:
        'Geospatial concessions, mineral lease boundaries, and extraction volumes for active mining operations across Ghana.',
      overview:
        'Compiles spatial boundaries, operational concession statuses, concession holder registries, and mineral commodity classifications for gold, bauxite, manganese, and diamond concessions in Ghana.',
      topics: ['Mining', 'Resources', 'Ghana', 'Concessions', 'Economy'],
      sampleAttributes: [
        'concession_id',
        'concession_name',
        'mineral_commodity',
        'region_district',
        'license_type',
        'surface_area_sq_km',
        'operational_status',
      ],
      fields: [
        {
          name: 'concession_id',
          description: 'Unique national cadastral concession identification code',
          dataType: 'String',
        },
        {
          name: 'concession_name',
          description: 'Official registered name of the commercial extraction concession',
          dataType: 'String',
        },
        {
          name: 'mineral_commodity',
          description: 'Primary mineral extracted (e.g. Gold, Bauxite, Manganese)',
          dataType: 'String',
        },
        {
          name: 'region_district',
          description: 'Administrative region and district jurisdiction in Ghana',
          dataType: 'String',
        },
        {
          name: 'license_type',
          description: 'Regulatory license classification (e.g. Mining Lease, Prospecting License)',
          dataType: 'String',
        },
        {
          name: 'surface_area_sq_km',
          description: 'Total demarcated surface concession area in square kilometres',
          dataType: 'Float',
        },
        {
          name: 'operational_status',
          description: 'Active operational regulatory status with regulatory oversight',
          dataType: 'String',
        },
      ],
      scopeDetails:
        'Covers active commercial mining leases and exploration concessions recorded by regulatory authorities in Ghana.',
      source: 'Minerals Commission of Ghana (Draft Registration)',
      reportingPeriod: '2026 Fiscal Review',
      updateFrequency: 'Bi-annual',
      accessLicensing: 'Institutional Review',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1400&q=80',
        alt: 'Mineral extraction site and industrial operations',
        caption: 'Mineral extraction concession and heavy industrial works',
        attribution: 'Editorial industry scene',
      },
      secondaryImage: {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80',
        alt: 'Geological survey and cadastral cartography analysis',
        caption: 'Geological cadastral cartography and concession boundaries',
        attribution: 'Editorial geological survey',
      },
    },
  },
  {
    id: 'draft-rwanda-health-coverage',
    title: 'Rwanda Primary Health Facility Network',
    country: 'Rwanda',
    category: 'Infrastructure',
    formats: ['PDF'],
    status: 'Draft',
    updated: 'Oct 14, 2026',
    datasetItem: {
      id: 'draft-rwanda-health-coverage',
      title: 'Rwanda Primary Health Facility Network',
      location: 'Rwanda',
      coverage: 'Rwanda (All 30 Districts & 416 Sectors)',
      category: 'Infrastructure',
      formats: ['PDF'],
      description:
        'Spatial distribution, facility tiers, and clinical service capacities for primary and referral health facilities across Rwanda.',
      overview:
        'Comprehensive administrative inventory of health centres, district hospitals, referral medical institutions, and specialized health posts across Rwanda’s provincial health networks.',
      topics: ['Healthcare', 'Rwanda', 'Health Infrastructure', 'Public Health'],
      sampleAttributes: [
        'facility_code',
        'facility_name',
        'facility_tier',
        'district_name',
        'sector_name',
        'bed_capacity',
        'ambulance_coverage',
      ],
      fields: [
        {
          name: 'facility_code',
          description: 'Ministry of Health standardized facility registry code',
          dataType: 'String',
        },
        {
          name: 'facility_name',
          description: 'Official registered facility appellation',
          dataType: 'String',
        },
        {
          name: 'facility_tier',
          description: 'Institutional classification tier (e.g. Health Center, District Hospital)',
          dataType: 'String',
        },
        {
          name: 'district_name',
          description: 'Administrative district of facility location',
          dataType: 'String',
        },
        {
          name: 'sector_name',
          description: 'Administrative sector jurisdiction',
          dataType: 'String',
        },
        {
          name: 'bed_capacity',
          description: 'Designated inpatient capacity count',
          dataType: 'Integer',
        },
        {
          name: 'ambulance_coverage',
          description: 'Emergency medical transit affiliation status',
          dataType: 'Boolean',
        },
      ],
      scopeDetails:
        'National administrative audit covering primary, secondary, and tertiary public healthcare assets in Rwanda.',
      source: 'Ministry of Health Infrastructure Audit (Draft)',
      reportingPeriod: '2026 Assessment',
      updateFrequency: 'Annual',
      accessLicensing: 'Institutional Review',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80',
        alt: 'Clinical health facility and hospital campus',
        caption: 'Regional health center and clinical medical pavilion',
        attribution: 'Editorial clinical facility',
      },
      secondaryImage: {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
        alt: 'Public health diagnostics laboratory',
        caption: 'Clinical diagnostic and healthcare logistics suite',
        attribution: 'Editorial medical laboratory',
      },
    },
  },
];

// Published datasets derived from ILLUSTRATIVE_DATASETS
// Note: Per requirements, update dates are not invented; undefined will display "Not recorded"
export const PUBLISHED_ADMIN_DATASETS: AdminDataset[] = ILLUSTRATIVE_DATASETS.map((ds) => ({
  id: ds.id,
  title: ds.title,
  country: ds.location,
  category: ds.category,
  formats: ds.formats.filter((f): f is 'CSV' | 'PDF' => f === 'CSV' || f === 'PDF'),
  status: 'Published',
  updated: undefined, // UI displays "Not recorded"
  datasetItem: ds,
  publishedDatasetItem: ds,
  hasPendingChanges: false,
}));

// Complete shared admin dataset collection (10 records: 8 Published, 2 Draft)
export const ALL_ADMIN_DATASETS: AdminDataset[] = [
  ...DRAFT_DATASETS,
  ...PUBLISHED_ADMIN_DATASETS,
];

// Shared operational counts
export const PUBLISHED_DATASETS_COUNT = PUBLISHED_ADMIN_DATASETS.length; // 8
export const DRAFT_DATASETS_COUNT = DRAFT_DATASETS.length; // 2
export const TOTAL_ADMIN_DATASETS_COUNT = ALL_ADMIN_DATASETS.length; // 10

// Unique Countries/Regions across all admin datasets for filtering
export const ADMIN_DATASET_LOCATIONS: string[] = Array.from(
  new Set(ALL_ADMIN_DATASETS.map((d) => d.country))
).sort();

// Unique Categories across all admin datasets for display and reference
export const ADMIN_DATASET_CATEGORIES: string[] = Array.from(
  new Set(ALL_ADMIN_DATASETS.map((d) => d.category))
).sort();
