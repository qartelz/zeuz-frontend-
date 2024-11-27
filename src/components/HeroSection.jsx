import React, { useEffect, useState } from "react";
import LearnSvg from "../assets/svg/LearnSvg";
import NewChartSvg from "../assets/svg/NewChartSvg";
import FirstTradeSvg from "../assets/svg/FirstTradeSvg";
import { useNavigate } from "react-router-dom";
import BagSvg from "../assets/svg/BagSvg";
import OverallSvg from "../assets/svg/OverallSvg";
import OpenOrders from "./OpenOrders";
import axios from "axios";


const HeroSection = ({ username, welcomemsg, question, answers, trades }) => {

  const navigate = useNavigate();

  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;

  

  
  const [totalProfitLoss, setTotalProfitLoss] = useState(null);
  const [totalInvested, setTotalInvested] = useState(null);

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
        setTotalProfitLoss(response.data.total_profit_loss);

        setTotalInvested(response.data.beetle_coins.used_coins);
      } catch (error) {
        console.error("Error fetching profit/loss data:", error);
      }
    };

    fetchProfitLoss();
  }, []);

  

  const navigateToAllTrades = () => {
    navigate("/portfolio");
  };

  const navigateToPractice = () => {
    navigate("/markets");
  };

  return (
    <div className="p-6">
      <div className="rounded-lg border border-gray-300 bg-[#DFF9FD] mx-auto sm:max-w-4xl shadow-md sm:flex relative">
        <div className="flex-1 sm:w-4/6 p-10">
          <h2 className="text-4xl font-extrabold  text-black">
            {welcomemsg}{" "}
            <span className="text-[#0E8190]">{username || "User"}!</span>
          </h2>
          <div className="mt-4">
            <p className="font-bold font  text-black">{question}</p>
            <p className="mt-2 space-y-1 sm:w-[80%] text-sm text-black">
              {answers}
            </p>

            {trades.length < 0 && (
              <button
              onClick={navigateToPractice}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg font-semibold transition-transform duration-400 hover:scale-105"
            >
              Start a New Trade
            </button>
            )}
          </div>
        </div>

        {/* SVG Container */}
        <div className="sm:w-1/3 flex justify-center items-center p-4">
          <LearnSvg className="w-full h-auto max-w-[200px]" />
        </div>
      </div>

      <div className="lg:px-24 py-6 w-full">
        <div className="mt-4 flex-col lg:flex-row sm:flex space-y-4 sm:space-y-0 space-x-4  mx-auto">
          <div className=" lg:flex-1 lg:w-2/4 ">
            <h3 className="text-3xl  font-bold text-black mb-4">
              Your Holdings.
            </h3>

            <div className="md:p-4 rounded-2xl border border-gray-300 bg-[#F6FEFF] shadow-md">
              {trades.length > 0 ? (
                <div className="max-w-4xl mx-auto md:mt-8 md:p-4">
                  <OpenOrders trades={trades} maxTrades={4} />
                  <div className="mt-6 text-right">
                    <button
                      onClick={navigateToAllTrades}
                      className="inline-flex items-center my-4 mx-4 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900"
                    >
                      All Trades <span className="ml-2">»</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center">
                  <div className="rounded-lg w-full flex items-center justify-center p-6">
                    <NewChartSvg />
                  </div>
                  <p className="mt-4 text-center text-3xl font-bold text-black">
                    You Haven’t Made <br />
                    Your{" "}
                    <span className="inline-block text-[#0E8190]">
                      First Trade <FirstTradeSvg />
                    </span>
                    Yet!
                  </p>
                 
                    <button
                    onClick={navigateToPractice}
                     className="mt-4 px-6 py-2 bg-black text-white rounded-lg font-semibold transition-transform duration-400 hover:scale-105">
                      Start a New Trade
                    </button>
                
                </div>
              )}
            </div>
          </div>

          <div className="  ">
            <h3 className="text-3xl  font-bold text-black  ">My Assets</h3>

            <div className="p-4 rounded-lg ">
              <div className="mt-0 flex-col justify-between space-y-4">
                {/* Total Portfolio */}
                <div className="flex-1  rounded-lg bg-white border shadow-md w-80 px-6 py-3 flex flex-col ">
                  <p className="text-lg   font-semibold text-[#0E8190]">
                    Total
                  </p>
                  <p className="text-3xl mb-4 font-semibold text-black">
                    Total Investment
                  </p>

                  {trades.length > 0 ? (
                     <div className="bg-[#F6FEFF] w-full rounded-md flex items-center p-2">
                     <div className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-4">
                       <BagSvg />
                     </div>
                     <p className="text-lg font-bold  text-left mr-2">
                       {totalInvested} BTLS.
                     </p>
                    
                   </div>
                    
                  ) : (

                    <p className="text-sm italic  text-center p-4  text-black">
                      Your portfolio is stocked with 10,00,000 BTLS. Ready to see
                      how they grow?
                    </p>


                   
                  )}
                </div>
                {/* Profit and Loss */}
                <div className="flex-1  rounded-lg bg-white border shadow-md w-80 px-6 py-3 flex flex-col ">
                  <p className="text-lg   font-semibold text-[#0E8190]">
                    Overall
                  </p>
                  <p className="text-3xl mb-4 font-semibold text-black">
                    Profit & Loss
                  </p>
                  {trades.length > 0 ?(

<div className="bg-[#F6FEFF] w-full rounded-md flex items-center p-2">
<div className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-4">
  <OverallSvg />
</div>
<p 
  className={`text-lg font-bold text-left mr-2 ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-600'}`}
>
  {totalProfitLoss < 0 ? Math.abs(totalProfitLoss) : totalProfitLoss} BTLS.
</p>
{totalProfitLoss > 0 ? (
  <p className="text-green-500">Profit</p>
) : totalProfitLoss < 0 ? (
  <p className="text-red-600">Loss</p>
) : null}
  
</div>
                    
                
                  ):(

                    <p className="text-sm italic  text-center p-4   text-black">
                    You haven't made any trades yet. Once you do, we'll track your profits and losses here!
                    </p> 

                    


                  )}
                  

                  

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
