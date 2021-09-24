import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import xlsx from 'xlsx';

import Button from 'react-bootstrap/Button';
import Search from './components/Search';
import { useEffect, useState } from 'react';

if (!window.processGithubResponse) {
  window.processGithubResponse = (data) => {
    console.log('Callback was called w/ data: ', data);
  };
}

function App () {
  const getMasterData = async () => {
    const result = await axios.get('https://api.github.com/repos/earthhistoryviz/geowhen/contents/data/MasterData.xlsx', {
      headers: {
        Accept: 'application/vnd.github.v3.raw'
      },
      responseType: 'arraybuffer',
    });
    const spreadsheet = xlsx.read(new Uint8Array(result.data), { type: 'array' });
    const masterdata = xlsx.utils.sheet_to_json(spreadsheet.Sheets['Geological stages']).slice(1);

    // Note from Aaron: we stopped here, we were debugging any period names that show up in 
    // the byperiod variable which didn't make sense ("undefined", "era", etc.).  All of them
    // found thus far we errors in the spreadsheet itself, so no need for code to deal with them.
    const byperiod = masterdata.reduce((acc,row) => {
      if (!acc[row.Period]) acc[row.Period] = [];
      acc[row.Period].push(row);
      return acc;
    }, {});

    console.log('byperiod = ', byperiod);
  };

  const [testData, setTestData] = useState([
    {
      stageName: 'test data 111',
      age: 240
    },
    {
      stageName: 'test111 data 222',
      age: 250
    },
    {
      stageName: 'test data 333 111',
      age: 260
    },
    {
      stageName: 'test data 444',
      age: 260
    },
    {
      stageName: 'test data 555',
      age: 260
    },
    {
      stageName: 'test data 666',
      age: 260
    },
    {
      stageName: 'test data 777',
      age: 260
    }
  ]);

  const [displayedStages, setDisplayedStages] = useState(testData);
  const [queryStr, setQueryStr] = useState('');

  // Runs everytime the user types in the search bar and filters stages
  useEffect(() => {
    const filteredStages = testData.filter(stageData => stageData.stageName.includes(queryStr));
    setDisplayedStages(filteredStages);
  }, [queryStr]);

  return (
    <div className='mx-auto mt-4' style={{ width: '90%' }}>
      <Button onClick={getMasterData}>Get the master data</Button>

      {/* Will show "loading..." when the stages data is not loaded */}
      {displayedStages
        ? (
          <>
            <Search onChange={(e) => { setQueryStr(e.target.value); }} />
            <div
              className='mt-3 border shadow-sm'
              style={{ height: '400px', overflowY: 'scroll' }}
            >
              <div className='mx-auto row px-2 w-100'>
                {displayedStages.map((stage, index) => (
                  <div key={index} className='my-2 col-lg-2 col-sm-3 col-6 d-flex justify-content-center'>
                    <Button>
                      {stage.stageName}
                    </Button>
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
