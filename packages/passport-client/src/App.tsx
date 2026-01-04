import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'

import 'animate.css';
import '@blue-orange-ai/foundations-core/dist/style.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { LoginPagePlain } from './components/pages/login/login-page-plain/LoginPagePlain';
import {RegistrationPage} from "./components/pages/registrations/registration-page/RegistrationPage";
import {UserProfileMe} from "./components/pages/user-management/user-profile-me/UserProfileMe";
import {ToastProvider} from "@blue-orange-ai/foundations-core";
import { UserProfileAdmin } from './components/pages/user-management/user-profile-admin/UserProfileAdmin';
import {GroupPage} from "./components/pages/group-management/group-page/GroupPage";
import {GroupSearch} from "./components/pages/group-management/group-search/GroupSearch";
import {PassportManagement} from "./components/pages/passport-management/PassportManagement";
import {PassportProvider} from "./components/providers/PassportProvider";

function App() {
  return (
      <PassportProvider uri="http://localhost:8080">
      <ToastProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={<LoginPagePlain defaultRedirectUri="/passport/management" />}></Route>
                  <Route path="/register" element={<RegistrationPage defaultRedirectUri="/passport/management" />}></Route>
                  <Route path="/passport/management" element={<PassportManagement></PassportManagement>}></Route>
                  <Route path="/user" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/me" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/groups" element={<GroupSearch></GroupSearch>}></Route>
                  <Route path="/groups/:groupId" element={<GroupPage></GroupPage>}></Route>
                  <Route path="/users/:userId" element={<UserProfileAdmin></UserProfileAdmin>}></Route>
              </Routes>
          </BrowserRouter>
      </ToastProvider>
      </PassportProvider>
  );
}

export default App;
