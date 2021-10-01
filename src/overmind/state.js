export const state = {
  isLoading: true,
  masterdata: {
    byperiod: {},
    displaysStages: {}, // same format as byperiod
    raw: [],
  },
  filter: {
    querystr: '',
    period: false,
    region: false,
    topage: false,
    bottomage: false,
    sortby: false,
  },
  view: {
    filterModal: {
      visible: false,
    }
  }
}
