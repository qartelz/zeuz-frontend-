// App.js
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import BgSvg from "./assets/svg/Bgsvg";
import UserProfile from "./pages/UserProfile";
import AdminPage from "./pages/AdminPage";
import LearnPage from "./pages/LearnPage";
import AdminLogin from "./pages/AdminLogin";
import TradesPage from "./pages/TradesPage";

import PrivateRoute from "./components/PrivateRoute"; 
import { WebSocketProvider } from "./utils/WebSocketContext";
import SearchTest from "./components/Searchtest";
import SearchTeest from "./components/SearchTeest";
import TestLearnPage from "./components/TestLearnPage";
import OptionsChains from "./components/OptionChains";

// import SearchTest from "./components/SearchTest";
function App() {
  return (  
    

    <WebSocketProvider>
  
        <div className="relative overflow-hidden bg-slate-50 ">
          <div className="absolute inset-0 z-0"></div>
          <div className="absolute scale-110 z-10 w-full h-full">
            <BgSvg />
          </div>
          <div className="relative z-20 font-oswald">
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/token" element={<AdminPage />} /> 
                
                <Route path = "/testsearch" element = {<SearchTeest />}/>
                <Route path = "/testchain" element = {<OptionsChains/>}/>
                


                <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />   
                <Route path="/markets" element={<PrivateRoute element={<PracticePage />} />} />        
                <Route path="/markets/learn" element={<PrivateRoute element={<LearnPage />} />} />
                <Route path="/portfolio" element={<PrivateRoute element={<TradesPage />} />} />
                <Route path="/my-profile" element={<PrivateRoute element={<UserProfile />} />} />

               


              </Routes>
            </BrowserRouter>
          </div>
        </div>
        </WebSocketProvider>
    
  );
}

export default App;
