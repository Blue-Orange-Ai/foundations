// @ts-ignore
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css';
import 'animate.css';
import '@blue-orange-ai/foundations-core/dist/style.css';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Gallery } from "./development/gallery/Gallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
