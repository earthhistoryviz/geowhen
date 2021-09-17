import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import xlsx from 'xlsx';

import Button from 'react-bootstrap/Button';

if (!window.processGithubResponse) {
  window.processGithubResponse = (data) => {
    console.log('Callback was called w/ data: ', data);
  }
}

function App () {

  const getMasterData = async () => {
    const result = await axios.get('https://api.github.com/repos/earthhistoryviz/geowhen/contents/data/MasterData.xlsx', {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    const spreadsheet = xlsx.read(result.data, {type:"array"});
    console.log('spreadsheet = ', spreadsheet);    
  };

  return (
    <div>
      <Button onClick={getMasterData}>Get the master data</Button>

    </div>
  );
}

export default App;
