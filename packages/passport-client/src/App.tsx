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
import {UserState} from "@blue-orange-ai/foundations-clients";
import {UserProfileMe} from "./components/pages/user-management/user-profile-me/UserProfileMe";
import {ToastProvider} from "@blue-orange-ai/foundations-core";
import { UserProfileAdmin } from './components/pages/user-management/user-profile-admin/UserProfileAdmin';
import {GroupPage} from "./components/pages/group-management/group-page/GroupPage";
import {GroupSearch} from "./components/pages/group-management/group-search/GroupSearch";
import {UserSearch} from "./components/pages/user-management/user-search/UserSearch";

function App() {
  return (
      <ToastProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={<LoginPagePlain />}></Route>
                  <Route path="/register" element={<RegistrationPage />}></Route>
                  <Route path="/user" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/me" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/groups" element={<GroupSearch></GroupSearch>}></Route>
                  <Route path="/groups/:groupId" element={<GroupPage></GroupPage>}></Route>
                  <Route path="/users/:userId" element={<UserProfileAdmin></UserProfileAdmin>}></Route>
                  <Route path="/users" element={<UserSearch></UserSearch>}></Route>
              </Routes>
          </BrowserRouter>
      </ToastProvider>


  );
}

export default App;
