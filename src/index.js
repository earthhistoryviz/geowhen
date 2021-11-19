import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'overmind-react';
import './index.css';
import App from './App';

import { overmind } from './overmind';

if (process.env.NODE_ENV !== 'development') {
  console.log = function () { };
}

ReactDOM.render(
  <Provider value={overmind}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
