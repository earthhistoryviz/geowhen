import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'overmind-react';
import './index.css';
import App from './App';

import { overmind } from './overmind';

ReactDOM.render(
  <Provider value={overmind}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
