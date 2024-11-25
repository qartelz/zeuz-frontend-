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
import { WebSocketStock } from "./components/WebSocketStock";
import { WebSocketTrade } from "./components/WebSocketTrade";

function App() {
  return (  
    <WebSocketStock>
      <WebSocketTrade>
        <div className="relative overflow-hidden bg-slate-50">
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
                <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />   
                <Route path="/practice" element={<PrivateRoute element={<PracticePage />} />} />        
                <Route path="/practice/learn" element={<PrivateRoute element={<LearnPage />} />} />
                <Route path="/my-trades" element={<PrivateRoute element={<TradesPage />} />} />
                <Route path="/my-profile" element={<PrivateRoute element={<UserProfile />} />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </WebSocketTrade>
    </WebSocketStock>
  );
}

export default App;
