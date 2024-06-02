import React from 'react';
import logo from './logo.svg';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import 'animate.css';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Workspace} from "./development/workspace/Workspace";
import { ToastProvider } from './components/alerts/toast/toastcontext/ToastContext';
import {SocketWorkspace} from "./development/socket-workspace/SocketWorkspace";

function App() {
  return (
      <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SocketWorkspace />}></Route>
              </Routes>
            </BrowserRouter>
      </ToastProvider>
  );
}

export default App;
