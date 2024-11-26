import React, { useEffect, useState } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";
import CoinSvg from '../assets/svg/CoinSvg';
import axios from "axios";

const BeetleBalance = () => {
  
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const [totalAvbl, setTotalAvbl] = useState(null); 


  useEffect(() => {
    
    const fetchProfitLoss = async () => {
      try {
        const response = await axios.get(
          "https://backend.beetlezeuz.in/account/trade-summary/", 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          }
        );
        
        setTotalAvbl(response.data.beetle_coins.coins);
        



      } catch (error) {
        console.error("Error fetching profit/loss data:", error);
      }
    };

    fetchProfitLoss();
  }, []); 
  

  return (
    <div className="flex items-center justify-between p-6 w-full max-w-md">
      <div className="bg-gray-200 rounded-full h-20 w-20 flex items-center justify-center">
        <CoinSvg />
      </div>

      <div className="ml-4">
        <div className="text-4xl text-[#BF9900] font-extrabold">
          Beetle Balance
        </div>
        <div className="text-4xl flex items-center font-extrabold">
         {totalAvbl}
          <div className="flex items-end">
          
          </div>
          <div className="flex items-center">
            <PlusIcon className="h-6 w-6 text-blue-500 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeetleBalance;
