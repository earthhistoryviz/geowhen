import 'bootstrap/dist/css/bootstrap.min.css';


import Button from 'react-bootstrap/Button';
import Search from './components/Search';
import { useAppState, useActions } from './overmind';

if (!window.processGithubResponse) {
  window.processGithubResponse = (data) => {
    console.log('Callback was called w/ data: ', data);
  };
}

function App () {

  const state = useAppState();
  const actions = useActions();
  //const result = masterdata.displayedStages("Quaternary");
  const { isLoading, masterdata } = state;

  const searchUpdated = (evt) => {
    actions.mergeFilter({ queryStr: evt.target.value });
  };

  let stageimage = false;
  if (state.selectedItem) {
    stageimage = `/geowhen/stage-charts/${state.selectedItem.Period.toUpperCase()}_regional.jpg`;
  }

  return (
    <div className='mx-auto mt-4' style={{ width: '90%' }}>
      {/* Will show "loading..." when the stages data is not loaded */}
      {!isLoading
        ? (
          <>
            <Search onChange={searchUpdated}/>
            <div
              className='mt-5 border shadow-sm'
              style={{ height: '400px', overflowX: 'scroll' }}
            >
              <div className='scrolling-wrapper row flex-row flex-nowrap mt-4 pb-4 pt-2'>

                {Object.keys(masterdata.displayedStages).map((periodName, index) => {
                  if (masterdata.displayedStages[periodName] && masterdata.displayedStages[periodName].length < 1) {
                    return '';
                  }
                  return (
                  <div className='col' align="center" style={{ border: "1px solid #DDDDDD", borderRadius: "3px", boxShadow: "3px 3px #CCCCC", margin: "5px 5px 5px 5px" }} key={index}>
                    <strong>{periodName}</strong>
                    {masterdata.displayedStages[periodName].map((stage, index) => (
                      <div key={index} className='my-2 col-8 d-flex justify-content-center'>

                        <Button onClick={() => { actions.selectItem(stage) }}>
                          {stage.STAGE}
                        </Button>
                      </div>

                    ))}
                  </div>
                )})}

              </div>
              
            </div>

            { /* Main content */ } 
            {!state.selectedItem ? '' : 
              <div className='mt-5 border shadow-sm'>

                <div>
                  { state.selectedItem.STAGE } (Period: { state.selectedItem.Period })
                </div>
                <div>
                  Region: { state.selectedItem.Region }
                </div>
                <div>
                  Top Age: { +(state.selectedItem.TOP).toFixed(3) }
                </div>
                <div>
                  Base Age: { +(state.selectedItem.Base).toFixed(3) }
                </div>
                <div>
                  Base Calibration: { state.selectedItem['Base calibration'] }
                </div>
                <div>
                  Top Calibration: { state.selectedItem['Top calibration'] }
                </div>
                Image path: {stageimage}
                
                <img src={stageimage} />
              </div>
            }
              
          </>
          )
        : <p>Loading...</p>}

    </div>
  );
}

export default App;
