// TradesPage.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ClosedOrders from "../components/ClosedOrders";
import OpenOrders from "../components/OpenOrders";
import axios from "axios";


const TradesPage = () => {

  
  const [activeTab, setActiveTab] = useState("Open Positions");
  const [trades, setTrades] = useState([]);
  

  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;


    const fetchTrades = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/trades/trades/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setTrades(response.data);
          console.log(response,"the trade response")
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
      
    };
    useEffect(() => {
      fetchTrades();
    }, [accessToken]);

   

    
  
    
    const refreshTrades = () => {
      fetchTrades();
    };
  

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 p-4 min-h-screen">
        <div className="flex items-center w-fit justify-start border rounded-full px-2 py-1 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Open Positions"
                ? "bg-[#026E78] text-white"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("Open Positions")}
          >
            Open Positions
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Closed Positions"
                ? "bg-[#026E78] text-white"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("Closed Positions")}
          >
            Closed Positions
          </button>
        </div>

        {activeTab === "Open Positions" && (

          <OpenOrders trades={trades} refreshTrades={refreshTrades} />
        )}

        {activeTab === "Closed Positions" && (
          <ClosedOrders />
        )}
      </div>
    </>
  );
};

export default TradesPage;
