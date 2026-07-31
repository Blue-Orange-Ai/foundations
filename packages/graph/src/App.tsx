// @ts-ignore
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import 'animate.css';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Workspace} from "./development/workspace/Workspace";
import {DiagramWorkspace} from "./development/diagram-workspace/DiagramWorkspace";
import {ERDiagramWorkspace} from "./development/er-diagram-workspace/ERDiagramWorkspace";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Workspace />}></Route>
              <Route path="/diagram" element={<DiagramWorkspace />}></Route>
              <Route path="/er-diagram" element={<ERDiagramWorkspace />}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
