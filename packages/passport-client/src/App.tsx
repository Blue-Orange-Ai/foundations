import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css'

import 'animate.css';
import '../node_modules/@blue-orange-ai/foundations-core/dist/style.css'

import {LoginWindow} from "./components/login/loginwindow/LoginWindow";
import {ManagementPage} from "./components/management/usermanagement/managementpage/ManagementPage";
import {ProfileWindow} from "./components/management/profilemanagment/profilewindow/ProfileWindow";
import {DefaultInput} from "./components/utils/defaultinput/DefaultInput";
import {Avatar} from "./components/utils/avatar/avatar/Avatar";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import {LoginPageImageBackground} from "./components/pages/login/login-page-image-background/LoginPageImageBackground";
import { LoginPagePlain } from './components/pages/login/login-page-plain/LoginPagePlain';
import {RegistrationPage} from "./components/pages/registrations/registration-page/RegistrationPage";
import { UserProfile } from './components/pages/user-management/user-profile/UserProfile';
import {UserState} from "@blue-orange-ai/foundations-clients";
import Cookies from 'js-cookie';
import {UserProfileMe} from "./components/pages/user-management/user-profile-me/UserProfileMe";
import {ToastProvider} from "@blue-orange-ai/foundations-core";
import { UserProfileAdmin } from './components/pages/user-management/user-profile-admin/UserProfileAdmin';
import {GroupPage} from "./components/pages/group-management/group-page/GroupPage";
import {GroupSearch} from "./components/pages/group-management/group-search/GroupSearch";
import {UserSearch} from "./components/pages/user-management/user-search/UserSearch";


const demoUser = {
    "id": "63d13704-43a3-448c-9231-44c152a5cd26",
    "name": "",
    "username": "admin",
    "email": "",
    "color": "",
    "avatar": {
        "id": "c06df5bc-458c-49fb-aa0f-7fa612911c25",
        "uri": undefined,
        "mediaId": -1,
        "enabled": false
    },
    "telephone": undefined,
    "address": undefined,
    "lastActive": new Date("2024-08-27T07:05:14.221+00:00"),
    "created": new Date("2024-08-27T07:05:14.221+00:00"),
    "state": UserState.ACTIVE,
    "forcePasswordReset": false,
    "domain": "root",
    "notes": "",
    "serviceUser": false,
    "defaultUser": true
}

// const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZGViZWFjOC1kZjVjLTQ2ZTEtYTk4Ni0zYWU5NTMzMGMxZDkiLCJleHAiOjE3Mjc5NTM2NDl9.7VL8uYrZrTsNFSUjhhMSOX2oChTVhxufcnGUewq_mFNDOV7MpaEumvsuaEMPT3Qk1nB3ngw3_jjnhYzgAvUoBg";
//
// Cookies.set("authorization",token)

function App() {
  return (
      <ToastProvider>
          <BrowserRouter>
              <Routes>
                  {/*<Route path="/" element={<LoginPageImageBackground />}></Route>*/}
                  <Route path="/login" element={<LoginPagePlain />}></Route>
                  <Route path="/register" element={<RegistrationPage />}></Route>
                  <Route path="/user" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/me" element={<UserProfileMe></UserProfileMe>}></Route>
                  <Route path="/groups" element={<GroupSearch></GroupSearch>}></Route>
                  <Route path="/groups/:groupId" element={<GroupPage></GroupPage>}></Route>
                  <Route path="/users/:userId" element={<UserProfileAdmin></UserProfileAdmin>}></Route>
                  <Route path="/users" element={<UserSearch></UserSearch>}></Route>
                  {/*<LoginWindow></LoginWindow>*/}
                  {/*  <ManagementPage></ManagementPage>*/}

                  {/*  <DefaultInput placeholder={"Test"}></DefaultInput>*/}
                  {/*  <div className={"dev-window"}>*/}
                  {/*      <Avatar edit={true}></Avatar>*/}
                  {/*  </div>*/}
              </Routes>
          </BrowserRouter>
      </ToastProvider>


  );
}

export default App;
