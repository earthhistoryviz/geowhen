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

  const { isLoading, masterdata } = state;

  const searchUpdated = (evt) => {
    actions.mergeFilter({ queryStr: evt.target.value });
  };

  return (
    <div className='mx-auto mt-4' style={{ width: '90%' }}>
      {/* Will show "loading..." when the stages data is not loaded */}
      {!isLoading
        ? (
          <>
            <Search onChange={searchUpdated}/>
            <div
              className='mt-3 border shadow-sm'
              style={{ height: '400px', overflowX: 'scroll' }}
            >
              <div className='mx-auto row px-2 w-100'>

                {Object.keys(masterdata.displayedStages).map((periodName, index) => (
                  <div className='row' key={index}>
                    <strong>{periodName}</strong>
                    {masterdata.displayedStages[periodName].map((stage, index) => (
                      <div key={index} className='my-2 col-2 d-flex justify-content-center'>

                        <Button>
                          {stage.STAGE}
                        </Button>
                      </div>

                    ))}
                  </div>
                ))}

              </div>

            </div>
          </>
          )
        : <p>Loading...</p>}

    </div>
  );
}

export default App;
