import axios from 'axios';
import xlsx from 'xlsx';
// import clone from 'clone';

export const onInitializeOvermind = async ({ state, actions, effects }) => {
  state.isLoading = true;

  // Init the router
  effects.router.initialize({
    '/stage/:stageName': actions.stageUrlChanged,
    '': actions.clearUrl,
  });

  const result = await axios.get('https://api.github.com/repos/earthhistoryviz/geowhen/contents/data/MasterData.xlsx', {
    headers: {
      Accept: 'application/vnd.github.v3.raw'
    },
    responseType: 'arraybuffer'
  });
  const spreadsheet = xlsx.read(new Uint8Array(result.data), { type: 'array' });
  console.log('spreadsheet = ', spreadsheet);
  const masterdata = xlsx.utils.sheet_to_json(spreadsheet.Sheets['Geological stages']).slice(1);
  // console.log(masterdata);

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

  // Populate colors
  const colorsResult = await axios.get('https://api.github.com/repos/earthhistoryviz/geowhen/contents/data/default_timescale.xlsx', {
    headers: {
      Accept: 'application/vnd.github.v3.raw'
    },
    responseType: 'arraybuffer'
  });
  const colorsSpreadsheet = xlsx.read(new Uint8Array(colorsResult.data), { type: 'array' });
  const colorsMasterdata = xlsx.utils.sheet_to_json(colorsSpreadsheet.Sheets.MasterChronostrat).slice(1);
  console.log(colorsMasterdata);

  // const colorLookup = colorsMasterdata.reduce((acc, row) => {
  //   const rgb = row['Color (internat)'].split('/');
  //   acc[row.Ma] = 'rgb(' + rgb.join(', ') + ')';
  //   return acc;
  // }, {});

  const colorLookup = colorsMasterdata.map((row) => {
    const rgb = row['Color (internat)'].split('/');
    return { topAge: row.Ma, color: 'rgb(' + rgb.join(', ') + ')' };
  });

  console.log(colorLookup);

  state.view.stageColors = colorLookup;

  state.isLoading = false;

  // If we already have a stageName, then the URL mapper ran before
  // initialization finished loading all the stages.  Re-run it as if
  // they just navigated here.
  if (state.page.stageName) {
    console.log('Re-calling stageUrlChanged after initialization');
    actions.stageUrlChanged(state.page);
  }
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
        console.log('query string denies inclusion of ' + stageData.STAGE);
        return false;
      }
      console.log('region type is: ', typeof stageData.Region);
      if (filter.region && ((typeof stageData.Region !== 'string') || !stageData.Region.toUpperCase().includes(filter.region.toUpperCase()))) {
        console.log('filter region denies inclusion of ' + stageData.STAGE);
        return false;
      }

      if (filter.period && ((typeof stageData.Period !== 'string') || !stageData.Period.toUpperCase().includes(filter.period.toUpperCase()))) {
        return false;
      }

      if (filter.topAge && filter.bottomAge && (stageData.Base < parseFloat(filter.topAge) || stageData.TOP > parseFloat(filter.bottomAge))) {
        return false;
      }
      return true;
    });

    if (filter.sortBy === 'alphabet') {
      filteredPeriods[periodName].sort((a, b) => {
        if (a.STAGE < b.STAGE) return -1;
        else if (a.STAGE > b.STAGE) return 1;
        else return 0;
      });
    } else if (filter.sortBy === 'age') {
      filteredPeriods[periodName].sort((a, b) => {
        if (a.Base < b.Base) return -1;
        else if (a.Base > b.Base) return 1;
        else return 0;
      });
    } else if (filter.sortBy === 'region') {
      // might need to change UI for this
    }
  });

  state.masterdata.displayedStages = filteredPeriods;
};

export const mergeFilter = ({ state, actions }, toMerge) => {
  state.filter = {
    ...state.filter,
    ...toMerge
  };

  actions.doFilter();
  console.log(state.filter);
};

export const mergeStagingFilter = ({ state }, toMerge) => {
  state.view.filterModal.stagingFilter = {
    ...state.view.filterModal.stagingFilter,
    ...toMerge
  };
};

export const applyFilters = ({ state, actions }) => {
  const sf = state.view.filterModal.stagingFilter;
  state.view.filterModal.visible = !state.view.filterModal.visible;
  if (sf.bottomAge && !sf.topAge) {
    sf.topAge = sf.bottomAge;
  }
  state.filter = { ...sf };
  actions.doFilter();
};

export const resetFilters = ({ state }) => {
  state.view.filterModal.stagingFilter = {
    period: false,
    region: false,
    topAge: false,
    bottomAge: false,
    sortBy: false,
    queryStr: ''
  };
};

export const toggleFilterModal = ({ state }) => {
  if (!state.view.filterModal.visible) {
    state.view.filterModal.stagingFilter = { ...state.filter };
  }
  state.view.filterModal.visible = !state.view.filterModal.visible;
};

export const selectItem = ({ state, effects }, selected) => {
  if (selected === false) state.selectedItem = false;
  else state.selectedItem = { ...selected };
  effects.router.navigateTo('/stage/'+selected.STAGE);
};

export const showStageModal = async ({ state, effects, actions }, { stageName }) => {
  const byperiod = state.masterdata.byperiod;
  let selectedStage = null;
  Object.keys(byperiod).forEach(period => {
    byperiod[period].forEach((stage) => {
      if (stage.STAGE === stageName) {
        console.log('Found selectedStage = ', stage);
        selectedStage = stage;
      }
    });
  });
  actions.selectItem(selectedStage);
};

// Note: the page router sends us the stageName parameter since the route defined it
// It only send us that parameter.  We know it's a /stage/* URL because this 
// particular action was called which was registered for the route.
export const stageUrlChanged = ({ state, actions }, { stageName }) => {
  state.page.stageName = stageName ? stageName.toUpperCase() : false;
  if (!state.masterdata || !state.masterdata.displayedStages) {
    console.log('WARNING: trying to set page URL BEFORE displayedStages are available');
    return;
  }

  // Find the stage that matches this
  let foundstage = false;
  for (const period in state.masterdata.displayedStages) {
    const stages = state.masterdata.displayedStages[period];
    for (const stageindex in stages) {
      const stage = stages[stageindex];
      const name = stage.STAGE || '';
      if (name.toUpperCase().replace(/ /g,'') === stageName) {
        foundstage = name;
        break;
      }
    }
    if (foundstage) break;
  }

  if (!foundstage) {
    console.log('WARNING: stage ', stageName, ' requested, but no stage could be found for that name');
    return;
  }

  // Is this already the selected stage?
  if (state.selectedItem && state.selectedItem.STAGE === foundstage) {
    console.log('Stage ', foundstage, ' is already the selected stage.');
    return;
  }

  // Otherwise, select this stage:
  actions.showStageModal({ stageName: foundstage });
}

export const clearUrl = ({ state }) => {
  state.page.stageName = false;
}
