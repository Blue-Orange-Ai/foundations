import React from 'react';
import logo from './logo.svg';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Workspace} from "./components/workspace/Workspace";

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
