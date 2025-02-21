import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import { useSelector } from 'react-redux';
import axios from 'axios';




const DashboardPage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { name} = useSelector((state) => state.auth);
  
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;

  

  const [trades, setTrades] = useState([]);

  


  useEffect(() => {
    const fetchOpenOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/trades/trades/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

         



        if (response.data && Array.isArray(response.data)) {
          
          const completedTrades = response.data.filter(
            (trade) => trade.trade_status === "incomplete"
          );
          setTrades(completedTrades);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching open orders data:", error);
      }
    };

    fetchOpenOrders();
  }, [accessToken]);

  

  
  return (
    <div className='font-poppins '  >
     
    
        <Navbar/>

        < div className='px-6 lg:px-0'>
        <HeroSection 
        trades={trades}
        username={name}
        welcomemsg=" Welcome to Beetle ZeuZ,"
        question="Ready to start trading? "
        answers="With ZeuZ, you can learn by doing in a Risk-Free environment. Let’s get started on your journey to becoming a confident trader!"
        
      />

      </div>
    
    
      
    </div>
  )
}

export default DashboardPage
