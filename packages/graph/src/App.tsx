// @ts-ignore
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import 'animate.css';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Workspace} from "./development/workspace/Workspace";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Workspace />}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
