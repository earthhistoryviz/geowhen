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
    }
  }
};
