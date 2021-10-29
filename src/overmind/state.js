export const state = {
  isLoading: true,
  selectedItem: false,
  masterdata: {
    byperiod: {},
    displayedStages: {}, // same format as byperiod
    raw: []
  },
  filter: {
    period: false,
    region: false,
    topAge: false,
    bottomAge: false,
    sortBy: false,
    queryStr: ''
  },
  view: {
    filterModal: {
      visible: false,
      stagingFilter: {} // same as filter above
    },
    filterOptions: {
      periods: [],
      regions: []
    },
    periodColors: {
      ARCHEAN: 'red',
      CAMBRIAN: 'black',
      CARBONIFEROUS: 'green',
      CRETACEOUS: 'blue',
      DEVONIAN: 'yellow',
      JURASSIC: 'pink',
      NEOGENE: 'orange',
      ORDOVICIAN: 'maroon',
      PALEOGENE: 'lime',
      PERMIAN: 'olive',
      PROTERO: 'navy',
      QUATERNARY: 'beige',
      SILURIAN: 'coral',
      TRIASSIC: 'cyan'
    }
  }
};
