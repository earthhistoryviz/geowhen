import axios from 'axios';
import xlsx from 'xlsx';

export const onInitializeOvermind = async ({ state }) => {
  state.isLoading = true;
  const result = await axios.get('https://api.github.com/repos/earthhistoryviz/geowhen/contents/data/MasterData.xlsx', {
    headers: {
      Accept: 'application/vnd.github.v3.raw'
    },
    responseType: 'arraybuffer'
  });
  const spreadsheet = xlsx.read(new Uint8Array(result.data), { type: 'array' });
  const masterdata = xlsx.utils.sheet_to_json(spreadsheet.Sheets['Geological stages']).slice(1);
  console.log(masterdata);

  // Note from Aaron: we stopped here, we were debugging any period names that show up in
  // the byperiod variable which didn't make sense ("undefined", "era", etc.).  All of them
  // found thus far we errors in the spreadsheet itself, so no need for code to deal with them.
  const byperiod = masterdata.reduce((acc, row) => {
    if (!acc[row.Period]) acc[row.Period] = [];
    acc[row.Period].push(row);
    return acc;
  }, {});

  // Populate options for periods and regions in the filtering menu
  const options = masterdata.reduce((acc, row) => {
    acc.periods.add(row.Period);
    if (row.Region && row.Region !== ' ') acc.regions.add(row.Region);

    return acc;
  }, { periods: new Set(), regions: new Set() });

  console.log('byperiod = ', byperiod);
  state.masterdata.byperiod = byperiod;
  state.masterdata.displayedStages = byperiod;

  state.view.filterOptions.periods = Array.from(options.periods);
  state.view.filterOptions.regions = Array.from(options.regions);

  state.isLoading = false;
};

/****************************************************************************
 *
 * Filtering
 *
 ***************************************************************************/

export const doFilter = ({ state }) => {
  const filteredPeriods = {};
  const filter = state.filter;
  Object.keys(state.masterdata.byperiod).forEach((periodName) => {
    const bp = state.masterdata.byperiod[periodName];
    filteredPeriods[periodName] = bp.filter(stageData => {
      if (!stageData.STAGE.toUpperCase().includes(filter.queryStr.toUpperCase())) {
        console.log('query string denies inclusion of '+stageData.STAGE);
        return false;
      }
      console.log('region type is: ', typeof stageData.Region);
      if (filter.region && ((typeof stageData.Region !== 'string') || !stageData.Region.toUpperCase().includes(filter.region.toUpperCase()))) {
        console.log('filter region denies inclusion of '+stageData.STAGE);
        return false;
      }
      if (filter.period && ((typeof stageData.Period !== 'string') || !stageData.Period.toUpperCase().includes(filter.period.toUpperCase()))){
        return false;
      }
      return true;
    });
  });
  state.masterdata.displayedStages = filteredPeriods;
};

export const mergeFilter = ({ state, actions }, toMerge) => {
  state.filter = {
    ...state.filter,
    ...toMerge
  };

  actions.doFilter();
  
  console.log(state);
};

export const applyFilters = ({ state }) => {
  state.view.filterModal.visible = !state.view.filterModal.visible;
  alert('Im going to filter using: \n' + JSON.stringify(state.filter));
};

export const toggleFilterModal = ({ state }) => {
  state.view.filterModal.visible = !state.view.filterModal.visible;
};
