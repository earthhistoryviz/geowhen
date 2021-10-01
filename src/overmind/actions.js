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

  // Note from Aaron: we stopped here, we were debugging any period names that show up in
  // the byperiod variable which didn't make sense ("undefined", "era", etc.).  All of them
  // found thus far we errors in the spreadsheet itself, so no need for code to deal with them.
  const byperiod = masterdata.reduce((acc, row) => {
    if (!acc[row.Period]) acc[row.Period] = [];
    acc[row.Period].push(row);
    return acc;
  }, {});

  console.log('byperiod = ', byperiod);
  state.masterdata.byperiod = byperiod;
  state.masterdata.displayedStages = byperiod;
  state.isLoading = false;
}


/****************************************************************************
 *
 * Filtering
 *
 ***************************************************************************/

export const filterByName = ({ state }, queryStr) => {
  const filteredPeriods = {};
  Object.keys(state.masterdata.byperiod).forEach((periodName) => {
    const bp = state.masterdata.byperiod[periodName];
    filteredPeriods[periodName] = bp.filter(stageData => stageData.STAGE.includes(queryStr));
  });
  state.masterdata.displayedStages = filteredPeriods;
}

export const mergeFilter = ({ state }, tomerge) => {
  state.filter = {
    ...state.filter,
    tomerge,
  };
};

export const toggleFilterModal = ({state}) => {
  state.view.filterModal.visible = !state.view.filterModal.visible;
}
