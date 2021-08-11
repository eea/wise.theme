import { suiFacet, mergeConfig } from '@eeacms/search';   // multiTermFacet,
import WiseLayout from './components/WiseLayout';

const details = {
  titleField: 'Measure name',
  extraFields: [
    {
      field: 'Origin of the measure',
      label: 'Origin of the measure',
    },
    {
      field: 'Descriptors',
      label: 'MSFD Descriptors',
    },
    {
      field: 'Sector',
      label: 'Sector',
    },
  ],
  sections: [
    {
      fields: [
        { field: 'Measure name', },
        { field: 'Sector', },
        { field: 'Use or activity', },
        { field: 'Origin of the measure', },
        { field: 'Nature of the measure', },
        { field: 'Status', },
        {
          field: 'Measure Impacts to',
          label: 'Measure impacts to',
        },
        {
          field: 'Measure Impacts to (further details)',
          label: 'Measure impacts to, further details ',
        },
        { field: 'Water body category', },
        { field: 'Spatial scope', },
        { field: 'Country', label: 'Country coverage'},
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => rec['Origin of the measure']?.raw === 'WFD (Directive 2000/60/EC)',
      fields: [
        { field: 'Nature of physical modification', },
        { field: 'Effect on hydromorphology', },
        { field: 'Ecological impacts', },
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => rec['Origin of the measure']?.raw === 'MSFD (Directive 2008/56/EC)',
      fields: [
        {field: 'Link to existing policies', },
        {field: 'KTMs it links to', },
        {field: 'Relevant targets', },
        {field: 'Relevant features from MSFD Annex III', },
        {field: 'Spatial  scope_MSFD', label: "MSFD Spatial scope"},
        {field: 'Keywords', },
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => {
        return rec['Origin of the measure']?.raw === 'HD (Directive 92/43/EEC)' && rec['MeasureCode'] && rec['MeasureCode'].raw.startsWith('HDH');
      },
      fields: [
        {field: 'Measure purpose', },
        {field: 'Measure type recommended to address E02 and/or E03', },
        {field: 'Measure location', },
        {field: 'Measure response', },
        {field: 'Measure additional info', },
        {field: 'Pressure type', label: 'Type of pressure'},
        {field: 'Pressure name', },
        {field: 'Ranking', },
        {field: 'Region', },
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => {
        return rec['Origin of the measure']?.raw === 'HD (Directive 92/43/EEC)' && rec['MeasureCode'] && rec['MeasureCode'].raw.startsWith('HDSP');
      },
      fields: [
        {field: 'Measure purpose', },
        {field: 'Measure type recommended to address E02 and/or E03', },
        {field: 'Measure location', },
        {field: 'Measure response', },
        {field: 'Measure additional info', },
        {field: 'Pressure type', label: 'Type of pressure'},
        {field: 'Pressure name', },
        {field: 'Ranking', },
        {field: 'Region', label: "Marine region"},
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => rec['Origin of the measure']?.raw === 'BD (Directive 79/409/EEC)',
      fields: [
        {field: 'Measure purpose', },
        {field: 'Measure type recommended to address E02 and/or E03', },
        {field: 'Measure location', },
        {field: 'Measure response', },
        {field: 'Measure additional info', },
        {field: 'Pressure type', label: 'Type of pressure'},
        {field: 'Pressure name', },
        {field: 'Ranking', },
        {field: 'Season', },
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => rec['Origin of the measure']?.raw === 'MSPD (Directive 2008/56/EC)',
      fields: [
        { field: 'Nature of physical modification', },
        { field: 'MSPD implementation status', },
        { field: 'Shipping Tackled', },
        { field: 'Traffic separation scheme', },
        { field: 'Priority Areas', },
        { field: 'Approaching Areas', },
        { field: 'Precautionary areas', },
        { field: 'Areas to be avoided', },
        { field: 'Future Scenarios', },
        { field: 'Source', },
        { field: 'Keywords', },
        { field: 'Authority', },
        { field: 'General View', },
        { field: 'Ports', },
        { field: 'Future Expectations', },
        { field: 'Safety manner', },
        { field: 'Objective', },
        { field: 'Categories', },
      ],
    },
    {
      title: 'Further information',
      condition: (rec) => rec['Origin of the measure']?.raw === 'Sectorial',
      fields: [
        { field: 'Impacts', },
        { field: 'Spatial scale', },
        { field: 'Source', label: 'Source(s)'},
      ],
    },
  ],
};


const wise_config = {
  layoutComponent: 'WiseLayout',
  searchBoxComponent: 'SimpleSearchInput',
  facets: [
    suiFacet({
      field: 'Origin of the measure',
      label: 'Origin of the measure',
      isFilterable: false
    }),
    suiFacet({ field: 'Sector', isMulti: true, isFilterable: false }),
    suiFacet({ field: 'Descriptors', isFilterable: false }),
    // suiFacet({ field: 'Country', isFilterable: true, isMulti: true }),
    // suiFacet({ field: 'Use_or_activity', label: 'Use or activity' }),
    // suiFacet({ field: 'Status' }),
    // suiFacet({
    //   field: 'Nature_of_the_measure',
    //   label: 'Nature of the measure',
    // }),
    // suiFacet({ field: 'Water_body_category', label: 'Water body category' }),
    // suiFacet({ field: 'Spatial_scope', label: 'Spatial scope' }),
    // suiFacet({ field: 'Measure_Impacts_to', label: 'Measure impacts' }),
  ],
  highlight: {
    fields: {
      // Measure_name: {},
    },
  },
  sortOptions: [
    {
      name: 'Title',
      value: 'Measure name',
      direction: 'asc',
    },
  ],
  tableViewParams: {
    titleField: 'Measure name',
    columns: [
      {
        title: 'Measure name',
        field: 'Measure name',
      },
      {
        title: 'Code',
        field: 'id',
      },
      {
        title: 'Origin of the measure',
        field: 'Origin of the measure',
      },
      {
        field: 'Descriptors',
        label: 'MSFD Descriptors',
      },
      {
        field: 'Sector',
        label: 'Sector',
      },
    ],
    details,
  },
  listingViewParams: {
    titleField: 'Measure name',
    // urlField: 'CodeCatalogue',
    extraFields: [
      {
        field: 'Origin of the measure',
        label: 'Origin of the measure',
      },
      {
        field: 'Descriptors',
        label: 'MSFD Descriptors',
      },
      {
        field: 'Sector',
        label: 'Sector',
      },
    ],
    details,
  },
};


const wise_resolve = {
  WiseLayout: {
    component: WiseLayout
  }

};

export default function installDemo(config) {
  config.searchui.wise = mergeConfig(wise_config, config.searchui.default);

  config.searchui.minimal = mergeConfig(config.searchui.default, wise_config);
  config.searchui.minimal.facets = [
    suiFacet({ field: 'Sector' }),
    suiFacet({
      field: 'Origin of the measure',
      label: 'Origin of the measure',
    }),
  ];

  config.resolve = mergeConfig(wise_resolve, config.resolve);

  return config;
}

