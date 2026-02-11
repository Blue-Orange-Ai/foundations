// @ts-ignore
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'
import 'animate.css';
import '@blue-orange-ai/foundations-core/dist/style.css'
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SearchIndexes} from "./components/search-indexes/SearchIndexes";
import {IndexManagement} from "./components/index-management/IndexManagement";
import {SearchProvider} from "./components/providers/SearchProvider";
import {ToastProvider} from "@blue-orange-ai/foundations-core";

function App() {
  return (
      <ToastProvider>
          <SearchProvider uri="http://localhost:8091" authCookie="authorization">
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<SearchIndexes />}></Route>
                      <Route path="/index/:indexName" element={<IndexManagement />}></Route>
                  </Routes>
              </BrowserRouter>
          </SearchProvider>
      </ToastProvider>
  );
}

export default App;
