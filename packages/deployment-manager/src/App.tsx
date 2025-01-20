// @ts-ignore
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import 'animate.css';
import '@blue-orange-ai/foundations-core/dist/style.css'
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import {ConfigEditor} from "./components/application/config-editor/config-editor/ConfigEditor";
import {ServiceHome} from "./components/application/service-editor/service-home/ServiceHome";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<ServiceHome />}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
