import React, { useEffect, useState } from 'react';

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
          `${process.env.REACT_APP_BASE_URL}/account/trade-summary/`, 
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
  }, [accessToken]); 
  

  return (
    <div className="flex items-center justify-center   mb-3 w-full max-w-md">
      <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center">
        <CoinSvg />
      </div>

      <div className="ml-4">
        <div className="text-2xl text-[#BF9900] font-extrabold">
          Beetle Balance
        </div>
        <div className="text-3xl flex items-center font-extrabold">
         {totalAvbl}
          <div className="flex items-end">
          
          </div>
          <div className="flex items-center">
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeetleBalance;
