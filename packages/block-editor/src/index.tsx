// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {installBenignEditorErrorSuppressor} from './development/suppressBenignEditorErrors';

// Dev-only: silence the known benign primitives bubble-toolbar error so the
// CRA error overlay stops interrupting (the operations still complete).
installBenignEditorErrorSuppressor();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

