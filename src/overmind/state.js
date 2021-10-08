export const state = {
  isLoading: true,
  masterdata: {
    byperiod: {},
    displaysStages: {}, // same format as byperiod
    raw: []
  },
  filter: {
    period: false,
    region: false,
    topAge: false,
    bottomAge: false,
    sortBy: false
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
