/**
 * Illustrative dataset catalogue for Datalytics.
 * Structured to be easily swapped with backend API responses.
 *
 * NOTE: As per specifications, no prices, record counts, update dates,
 * source institutions, or availability claims are invented.
 */

export interface DatasetField {
  name: string;
  description: string;
  dataType: string;
}

export interface DatasetImage {
  url: string;
  alt: string;
  caption?: string;
  attribution?: string;
  cropPosition?: string;
}

export interface DatasetItem {
  id: string;
  title: string;
  location: string;
  coverage: string;
  category: string;
  formats: string[];
  description: string;
  overview?: string;
  topics: string[];
  sampleAttributes: string[];
  fields: DatasetField[];
  scopeDetails: string;
  source?: string;
  sourceUrl?: string;
  reportingPeriod?: string;
  updateFrequency?: string;
  accessLicensing: string;
  primaryImage: DatasetImage;
  secondaryImage: DatasetImage;
}

export const ILLUSTRATIVE_DATASETS: DatasetItem[] = [
  {
    id: 'zambia-population-by-province',
    title: 'Zambia Population by Province',
    location: 'Zambia',
    coverage: 'Zambia (National & Provincial)',
    category: 'Population',
    formats: ['CSV', 'PDF'],
    description:
      'Explore population patterns and demographic information across Zambia’s provinces.',
    overview:
      'Provides aggregated demographic metrics, population density indicators, urban-rural distributions, and geographic boundary identifiers across all ten provinces of Zambia.',
    topics: ['Population', 'Demographics', 'Zambia'],
    sampleAttributes: [
      'province_code',
      'province_name',
      'total_population',
      'density_sq_km',
      'urban_share',
      'rural_share',
      'administrative_geometry',
    ],
    fields: [
      {
        name: 'province_code',
        description: 'Standardized administrative code for Zambia’s provincial jurisdictions',
        dataType: 'String',
      },
      {
        name: 'province_name',
        description: 'Official provincial designation (e.g., Lusaka, Copperbelt, Southern)',
        dataType: 'String',
      },
      {
        name: 'total_population',
        description: 'Total enumerated population count across the provincial territory',
        dataType: 'Integer',
      },
      {
        name: 'density_sq_km',
        description: 'Average population density measured per square kilometre',
        dataType: 'Float',
      },
      {
        name: 'urban_share',
        description: 'Proportion of provincial residents living within designated urban wards',
        dataType: 'Percentage',
      },
      {
        name: 'rural_share',
        description: 'Proportion of provincial residents living within rural jurisdictions',
        dataType: 'Percentage',
      },
      {
        name: 'administrative_geometry',
        description: 'Spatial boundary vector polygon formatted according to OGC GeoJSON specifications',
        dataType: 'GeoJSON Geometry',
      },
    ],
    scopeDetails:
      'Covers national and provincial administrative tiers across all 10 provinces of Zambia.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1400&q=80',
      alt: 'Zambian urban street and commercial district in Lusaka',
      caption: 'Urban activity and municipal streetscape in Zambia',
      attribution: 'Editorial urban scene',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80',
      alt: 'Provincial residential community and settlement in Zambia',
      caption: 'Community settlement and provincial residential area',
      attribution: 'Editorial community landscape',
    },
  },
  {
    id: 'agricultural-production-east-africa',
    title: 'Agricultural Production Across East Africa',
    location: 'East Africa',
    coverage: 'East Africa (Kenya, Uganda, Tanzania, Rwanda, Ethiopia)',
    category: 'Agriculture',
    formats: ['CSV', 'PDF'],
    description:
      'Compare crop production and agricultural trends across selected East African countries.',
    overview:
      'Harmonises multi-country agricultural statistics covering harvested crop volumes, cultivated land area, productivity yield indices, and primary seasonal harvest cycles across East Africa.',
    topics: ['Agriculture', 'Economy', 'East Africa', 'Crops'],
    sampleAttributes: [
      'iso3_country',
      'basin_region',
      'crop_commodity',
      'cultivated_area_hectares',
      'harvest_volume_metric_tonnes',
      'yield_index',
      'seasonal_cycle',
    ],
    fields: [
      {
        name: 'iso3_country',
        description: 'Three-letter ISO 3166-1 alpha-3 sovereign country code',
        dataType: 'String',
      },
      {
        name: 'basin_region',
        description: 'Major agricultural or river basin agro-ecological zone identifier',
        dataType: 'String',
      },
      {
        name: 'crop_commodity',
        description: 'Agricultural commodity identifier (e.g. maize, tea, coffee, sorghum)',
        dataType: 'String',
      },
      {
        name: 'cultivated_area_hectares',
        description: 'Total land area under active seasonal crop cultivation in hectares',
        dataType: 'Float',
      },
      {
        name: 'harvest_volume_metric_tonnes',
        description: 'Gross harvested crop volume measured in metric tonnes',
        dataType: 'Float',
      },
      {
        name: 'yield_index',
        description: 'Normalized productivity index relative to regional baseline benchmarks',
        dataType: 'Float',
      },
      {
        name: 'seasonal_cycle',
        description: 'Primary planting and harvesting agricultural calendar phase',
        dataType: 'String',
      },
    ],
    scopeDetails:
      'Agricultural indicators across major farming regions in East Africa.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80',
      alt: 'Cultivated highland agricultural farmland across East Africa',
      caption: 'Cultivated farmland and highland agricultural valleys',
      attribution: 'Editorial agricultural landscape',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1400&q=80',
      alt: 'Agricultural harvesting and crop processing in East Africa',
      caption: 'Agricultural harvesting and crop yield production',
      attribution: 'Editorial agricultural production',
    },
  },
  {
    id: 'regional-trade-indicators',
    title: 'Regional Trade Indicators',
    location: 'Sub-Saharan Africa',
    coverage: 'Sub-Saharan Africa (ECOWAS, SADC, EAC)',
    category: 'Trade',
    formats: ['CSV', 'PDF'],
    description:
      'Explore trade patterns and economic indicators across selected African markets.',
    overview:
      'Tracks bilateral merchandise flow indicators, customs transit clearance duration, regional economic bloc alignments, and applicable tariff metrics across major Sub-Saharan African transit corridors.',
    topics: ['Trade', 'Economy', 'Regional Integration'],
    sampleAttributes: [
      'origin_iso',
      'destination_iso',
      'economic_bloc',
      'hs_section_code',
      'trade_direction',
      'customs_transit_days',
      'harmonised_tariff_rate',
    ],
    fields: [
      {
        name: 'origin_iso',
        description: 'ISO 3166-1 alpha-3 code of exporting origin country',
        dataType: 'String',
      },
      {
        name: 'destination_iso',
        description: 'ISO 3166-1 alpha-3 code of destination import market',
        dataType: 'String',
      },
      {
        name: 'economic_bloc',
        description: 'Regional economic community (e.g. SADC, EAC, ECOWAS)',
        dataType: 'String',
      },
      {
        name: 'hs_section_code',
        description: 'Harmonized Commodity Description and Coding System 2-digit chapter code',
        dataType: 'String',
      },
      {
        name: 'trade_direction',
        description: 'Classification of trade transit flow (Export, Import, or Corridor Transit)',
        dataType: 'String',
      },
      {
        name: 'customs_transit_days',
        description: 'Documented average cargo transit and border clearance duration in days',
        dataType: 'Float',
      },
      {
        name: 'harmonised_tariff_rate',
        description: 'Applicable preferential or Most Favored Nation ad-valorem tariff percentage',
        dataType: 'Percentage',
      },
    ],
    scopeDetails:
      'Cross-border trade indicators covering key transport corridors and bilateral exchanges.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80',
      alt: 'Commercial maritime shipping and container freight terminal',
      caption: 'Maritime freight hub and container handling facility',
      attribution: 'Editorial logistics facility',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80',
      alt: 'Commercial freight haulage and transit logistics corridor',
      caption: 'Cross-border road freight haulage and trade corridor',
      attribution: 'Editorial commercial transit',
    },
  },
  {
    id: 'urban-infrastructure-and-access',
    title: 'Urban Infrastructure and Access',
    location: 'Africa',
    coverage: 'Continental Metropolitan Areas',
    category: 'Infrastructure',
    formats: ['CSV', 'PDF'],
    description:
      'Explore indicators related to electricity, transport, water and urban services.',
    overview:
      'Compiles spatial indicators and municipal benchmarks detailing electrification coverage, road surface quality, potable water accessibility, and public transit catchment distances across metropolitan African centres.',
    topics: ['Infrastructure', 'Energy', 'Population', 'Urban'],
    sampleAttributes: [
      'metro_identifier',
      'ward_zone_id',
      'grid_electrification_rate',
      'paved_road_ratio',
      'potable_water_access_pct',
      'transit_catchment_km',
      'spatial_polygon',
    ],
    fields: [
      {
        name: 'metro_identifier',
        description: 'Standardized metropolitan urban agglomeration identifier',
        dataType: 'String',
      },
      {
        name: 'ward_zone_id',
        description: 'Municipal cadastral ward or planning district identifier',
        dataType: 'String',
      },
      {
        name: 'grid_electrification_rate',
        description: 'Proportion of municipal households with direct electrical grid connection',
        dataType: 'Percentage',
      },
      {
        name: 'paved_road_ratio',
        description: 'Percentage of municipal vehicular road network constructed with bitumen or concrete',
        dataType: 'Percentage',
      },
      {
        name: 'potable_water_access_pct',
        description: 'Proportion of dwellings within access distance to treated drinking water',
        dataType: 'Percentage',
      },
      {
        name: 'transit_catchment_km',
        description: 'Radial distance from ward center to closest formal public transit terminal in km',
        dataType: 'Float',
      },
      {
        name: 'spatial_polygon',
        description: 'Spatial vector polygon boundary representing urban planning zone',
        dataType: 'GeoJSON Polygon',
      },
    ],
    scopeDetails:
      'Urban spatial and statistical data detailing basic infrastructure access metrics across African municipal centers.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80',
      alt: 'Metropolitan highway interchange and municipal transit infrastructure',
      caption: 'Urban highway transit and metropolitan road network',
      attribution: 'Editorial urban transport',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80',
      alt: 'Municipal public utilities and electrical transmission infrastructure',
      caption: 'Public utilities and electrical transmission infrastructure',
      attribution: 'Editorial public infrastructure',
    },
  },
  {
    id: 'kenya-agricultural-indicators',
    title: 'Kenya Agricultural Indicators',
    location: 'Kenya',
    coverage: 'Kenya (National & County)',
    category: 'Agriculture',
    formats: ['CSV'],
    description:
      'Examine national crop yields, rainfall patterns, and agricultural market indices across Kenya.',
    overview:
      'Aggregates county-level agricultural performance data across Kenya, detailing seasonal rainfall totals, harvested yields for staple crops, and normalized wholesale commodity price trends.',
    topics: ['Agriculture', 'Kenya', 'Food Systems'],
    sampleAttributes: [
      'county_code',
      'crop_type',
      'seasonal_rainfall_mm',
      'production_metric_tonnes',
      'wholesale_price_index',
    ],
    fields: [
      {
        name: 'county_code',
        description: 'Official two-digit county administrative identifier code (01-47)',
        dataType: 'String',
      },
      {
        name: 'crop_type',
        description: 'Primary staple or commercial crop evaluated within county boundaries',
        dataType: 'String',
      },
      {
        name: 'seasonal_rainfall_mm',
        description: 'Cumulative precipitation recorded across agricultural weather stations in millimetres',
        dataType: 'Float',
      },
      {
        name: 'production_metric_tonnes',
        description: 'Total harvested commodity weight recorded in metric tonnes',
        dataType: 'Float',
      },
      {
        name: 'wholesale_price_index',
        description: 'Normalized wholesale farm-gate commodity price index relative to national base',
        dataType: 'Float',
      },
    ],
    scopeDetails:
      'Harmonised agricultural statistics covering counties and major farming corridors in Kenya.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1400&q=80',
      alt: 'Kenyan highland agricultural tea cultivation',
      caption: 'Highland agricultural cultivation in Kenya',
      attribution: 'Editorial agricultural landscape',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1400&q=80',
      alt: 'Fresh agricultural produce harvesting and sorting in Kenya',
      caption: 'Agricultural harvest aggregation and market supply',
      attribution: 'Editorial crop harvest',
    },
  },
  {
    id: 'south-africa-energy-indicators',
    title: 'South Africa Energy Indicators',
    location: 'South Africa',
    coverage: 'South Africa (National & Provincial)',
    category: 'Energy',
    formats: ['CSV', 'PDF'],
    description:
      'Review electricity generation capacity, grid supply metrics, and energy sector indicators across South Africa.',
    overview:
      'Features power generation asset metrics, installed nameplate capacity, system peak availability rates, grid transmission loss percentages, and delivered provincial electricity consumption figures across South Africa.',
    topics: ['Energy', 'South Africa', 'Utilities', 'Infrastructure'],
    sampleAttributes: [
      'generation_source',
      'installed_capacity_mw',
      'peak_availability_factor',
      'transmission_loss_pct',
      'provincial_consumption_gwh',
    ],
    fields: [
      {
        name: 'generation_source',
        description: 'Primary generation technology (Coal, Wind, Solar PV, Nuclear, Hydro)',
        dataType: 'String',
      },
      {
        name: 'installed_capacity_mw',
        description: 'Total rated nameplate generation capacity in megawatts (MW)',
        dataType: 'Float',
      },
      {
        name: 'peak_availability_factor',
        description: 'Generation fleet energy availability factor during high-demand system peaks',
        dataType: 'Percentage',
      },
      {
        name: 'transmission_loss_pct',
        description: 'Grid transmission and distribution technical electrical dissipation rate',
        dataType: 'Percentage',
      },
      {
        name: 'provincial_consumption_gwh',
        description: 'Aggregate electrical energy delivered to provincial consumers in gigawatt-hours',
        dataType: 'Float',
      },
    ],
    scopeDetails:
      'Energy sector metrics and grid transmission indicators compiled across South African provincial regions.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=80',
      alt: 'Utility-scale solar power generation facility in South Africa',
      caption: 'Utility-scale photovoltaic generation facility',
      attribution: 'Editorial renewable generation',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&q=80',
      alt: 'High-voltage electrical power transmission pylons and grid lines',
      caption: 'High-voltage transmission grid lines and electrical delivery',
      attribution: 'Editorial power transmission',
    },
  },
  {
    id: 'zambia-economic-indicators',
    title: 'Zambia Economic Indicators',
    location: 'Zambia',
    coverage: 'Zambia (National)',
    category: 'Economy',
    formats: ['CSV', 'PDF'],
    description:
      'Track key macroeconomic trends, inflation rates, and sectoral economic measures across Zambia.',
    overview:
      'Monitors national macroeconomic metrics for Zambia, documenting real GDP growth rates, composite consumer price inflation indices, mining sector production volumes, and central bank foreign currency reference rates.',
    topics: ['Economy', 'Zambia', 'Trade', 'Finance'],
    sampleAttributes: [
      'reporting_quarter',
      'gdp_growth_rate',
      'consumer_price_index',
      'mining_output_index',
      'foreign_exchange_reference',
    ],
    fields: [
      {
        name: 'reporting_quarter',
        description: 'Standard calendar reporting quarter identifier (e.g. 2024-Q1)',
        dataType: 'String',
      },
      {
        name: 'gdp_growth_rate',
        description: 'Real annualized gross domestic product expansion rate percentage',
        dataType: 'Percentage',
      },
      {
        name: 'consumer_price_index',
        description: 'Headline nationwide composite consumer price index benchmark',
        dataType: 'Float',
      },
      {
        name: 'mining_output_index',
        description: 'Physical volume extraction index for copper and base mineral commodities',
        dataType: 'Float',
      },
      {
        name: 'foreign_exchange_reference',
        description: 'Bank of Zambia mid-market reference exchange rate against US Dollar',
        dataType: 'Float',
      },
    ],
    scopeDetails:
      'Macroeconomic indicators tracking national performance and key sector metrics in Zambia.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      alt: 'Commercial district and corporate financial buildings in Zambia',
      caption: 'Commercial financial district and corporate institutions',
      attribution: 'Editorial corporate district',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80',
      alt: 'Industrial processing and manufacturing facility',
      caption: 'Industrial manufacturing and commodity production facility',
      attribution: 'Editorial industrial production',
    },
  },
  {
    id: 'east-africa-population-trends',
    title: 'East Africa Population Trends',
    location: 'East Africa',
    coverage: 'East Africa (Regional)',
    category: 'Population',
    formats: ['CSV', 'PDF'],
    description:
      'Analyze demographic projections, urbanization rates, and age distribution metrics across East Africa.',
    overview:
      'Examines regional demographic transitions across East African urban clusters, documenting mid-year population projections, compound annual urbanization rates, and median population age distributions.',
    topics: ['Population', 'East Africa', 'Demographics', 'Urban'],
    sampleAttributes: [
      'country_iso',
      'metropolitan_cluster',
      'projected_population',
      'urban_growth_rate',
      'median_age',
    ],
    fields: [
      {
        name: 'country_iso',
        description: 'Three-letter ISO 3166-1 alpha-3 sovereign country identifier',
        dataType: 'String',
      },
      {
        name: 'metropolitan_cluster',
        description: 'Name or identifier of designated metropolitan urban cluster',
        dataType: 'String',
      },
      {
        name: 'projected_population',
        description: 'Mid-year demographic population estimate for designated cluster',
        dataType: 'Integer',
      },
      {
        name: 'urban_growth_rate',
        description: 'Compound annual population growth rate of metropolitan cluster',
        dataType: 'Percentage',
      },
      {
        name: 'median_age',
        description: 'Statistical median age of resident demographic cohort in years',
        dataType: 'Float',
      },
    ],
    scopeDetails:
      'Regional demographic projections and urbanization indicators covering member states in East Africa.',
    accessLicensing: 'To be confirmed',
    primaryImage: {
      url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80',
      alt: 'Metropolitan urban skyline and central commercial environment in East Africa',
      caption: 'Metropolitan urban agglomeration and commercial core',
      attribution: 'Editorial urban skyline',
    },
    secondaryImage: {
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80',
      alt: 'Residential community neighbourhood and residential housing in East Africa',
      caption: 'Residential community neighbourhood and suburban housing',
      attribution: 'Editorial residential community',
    },
  },
];

export const FILTER_LOCATIONS = [
  'Zambia',
  'Kenya',
  'South Africa',
  'East Africa',
  'Sub-Saharan Africa',
  'Africa',
] as const;

export const FILTER_CATEGORIES = [
  'Population',
  'Agriculture',
  'Economy',
  'Trade',
  'Energy',
  'Infrastructure',
] as const;

export const FILTER_FORMATS = [
  'CSV',
  'PDF',
] as const;

export const TOPIC_SUGGESTIONS = [
  'Economy',
  'Agriculture',
  'Population',
  'Energy',
] as const;
