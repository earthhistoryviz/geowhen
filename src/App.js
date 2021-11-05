import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Search from './components/Search';
import { useAppState, useActions } from './overmind';

if (!window.processGithubResponse) {
  window.processGithubResponse = (data) => {
    console.log('Callback was called w/ data: ', data);
  };
}

function imageExists (image_url) {
  const http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}

function App () {
  const state = useAppState();
  const actions = useActions();

  const stageColors = state.view.stageColors;

  // const result = masterdata.displayedStages("Quaternary");
  const { isLoading, masterdata } = state;

  const searchUpdated = (evt) => {
    actions.mergeFilter({ queryStr: evt.target.value });
  };

  let stageimage = false;
  if (state.selectedItem) {
    stageimage = `/geowhen/stage-charts/${state.selectedItem.Period.toUpperCase()}_regional.jpg`;
    if (!imageExists(stageimage)) {
      stageimage = false;
    }
  }

  return (
    <div className='mx-auto mt-4' style={{ width: '90%' }}>
      {/* Will show "loading..." when the stages data is not loaded */}
      {!isLoading
        ? (
          <>
            <Search onChange={searchUpdated} />
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
                    <div className='col' align='center' style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }} key={index}>
                      <strong>{periodName}</strong>
                      {masterdata.displayedStages[periodName].map((stage, index) => {
                        let currColor = stageColors[0].color;

                        for (let i = 0; i < stageColors.length; i++) {
                          if (stage.Base > stageColors[i].baseAge) {
                            currColor = stageColors[i].color;
                          } else {
                            break;
                          }
                        }

                        return (
                          <div key={index} className='my-2 col-8 d-flex justify-content-center'>

                            <Button style={{ backgroundColor: currColor }} onClick={() => { actions.selectItem(stage); }}>
                              {stage.STAGE}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

              </div>

            </div>

            {/* Main content */}
            {!state.selectedItem ? ''
              : <div className='mt-5 border shadow-sm row flex-nowrap mt-4 pb-4 pt-2' style={{ border: '20px solid ', borderRadius: '10px' }}>
                <div style={{ width: '500px' }} align='center'>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontSize: '34px' }}>
                      {state.selectedItem.STAGE}
                    </div>
                    <div style={{ fontWeight: 'normal' }}>
                      (Period: {state.selectedItem.Period})
                    </div>
                  </div>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: '' }}>
                      Region:
                    </div>
                    <div>
                      {state.selectedItem.Region}
                    </div>
                  </div>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Top Age:
                    </div>
                    <div>
                      {+(state.selectedItem.TOP).toFixed(3)}
                    </div>
                  </div>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Base Age:
                    </div>
                    <div>
                      {+(state.selectedItem.Base).toFixed(3)}
                    </div>
                  </div>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Top Calibration:
                    </div>
                    <div>
                      {state.selectedItem['Top calibration']}
                    </div>
                  </div>
                  <div style={{ width: '480px', border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Base Calibration:
                    </div>
                    <div>
                      {state.selectedItem['Base calibration']}
                    </div>
                  </div>

                </div>
                <div>
                  {stageimage ? <img src={stageimage} /> : ''}
                </div>
                </div>}

          </>
          )
        : <p>Loading...</p>}

    </div>
  );
}

export default App;
