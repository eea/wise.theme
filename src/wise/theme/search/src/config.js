import { suiFacet, mergeConfig } from '@eeacms/search';
import WiseLayout from './components/WiseLayout';

const wise_config = {
  layoutComponent: 'WiseLayout',
  searchBoxComponent: 'SimpleSearchInput',
  facets: [
    suiFacet({
      field: 'Origin of the measure',
      label: 'Origin of the measure',
    }),
    suiFacet({ field: 'Sector', isMulti: true }),
    suiFacet({ field: 'Descriptors' }),
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
      Measure_name: {},
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
    columns: [
      {
        title: 'Measure name',
        field: 'Measure name',
      },
      {
        title: 'Origin of the measure',
        field: 'Origin of the measure',
      },
    ],
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
        field: 'Nature of the measure',
        label: 'Nature of the measure',
      },
      {
        field: 'Spatial scope',
        label: 'Spatial scope',
      },
    ],
    details: {
      titleField: 'Measure name',
      extraFields: [
        {
          field: 'Origin of the measure',
          label: 'Origin of the measure',
        },
        {
          field: 'Nature of the measure',
          label: 'Nature of the measure',
        },
        {
          field: 'Spatial scope',
          label: 'Spatial scope',
        },
      ],
      sections: [
        {
          fields: [
            {
              field: 'Use or activity',
              label: 'Use or activity',
            },
            {
              field: 'Measure Impacts to',
              label: 'Measure impacts',
            },
          ],
        },
        {
          title: 'Main',
          fields: [
            {
              field: 'Origin of the measure',
              label: 'Origin of the measure',
            },
            {
              field: 'Nature of the measure',
              label: 'Nature of the measure',
            },
          ],
        },
      ],
    },
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

