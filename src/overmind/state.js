export const state = {
  isLoading: true,
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
    queryStr: '',
  },
  view: {
    filterModal: {
      visible: false
    },
    filterOptions: {
      periods: [],
      regions: []
    }
  }
};
