import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Navbar from "../components/Navbar";
import PracticeSvg from "../assets/svg/PracticeSvg";
import EquitySvg from "../assets/svg/EquitySvg";
import FutureSvg from "../assets/svg/FuturesSvg";
import OptionSvg from "../assets/svg/OptionsSvg";

const PracticePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    svgIcon: null,  
    title: "",
    content: "",
    buttonColor: "",
    buttonText: "",
    contentLast: "",
  });
  const navigate = useNavigate();

  const closeModal = () => setIsModalOpen(false);

  const openModal = (svgIcon,title, content, buttonColor, buttonText, contentLast) => {
    setModalContent({svgIcon, title, content, buttonColor, buttonText, contentLast });
    setIsModalOpen(true);
  };

  const handleButtonClick = () => {
    // Map the modal buttonText to a specific state value for the LearnPage
    let buttonTextValue = "";
    switch (modalContent.buttonText) {
      case "Start Equity Trading":
        buttonTextValue = "Equity Trading";
        break;
      case "Start Futures Trading":
        buttonTextValue = "Futures Trading";
        break;
      case "Start Options Trading":
        buttonTextValue = "Options Trading";
        break;
    }

    // Pass the mapped value as state to the LearnPage
    navigate("/markets/learn", { state: { heading: buttonTextValue } });
  };

  return (
    <div className="h-screen font-poppins">
      <Navbar />
      <div className="flex flex-row h-screen items-center justify-between">
        <div className="flex  items-center h-screen">
          <PracticeSvg className="w-full " />
        </div>

        <div className="flex flex-col   w-full  p-4 md:p-8">
          <h1 className="text-xl md:text-4xl w-full font-bold">
            Start a New Trade.
          </h1>
          <h2 className="text-lg md:text-lg text-gray-700">
            Choose a trade type to learn and practice.
          </h2>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={() =>
                openModal(
                 <EquitySvg/>,
                  "Equity Trading: Build Ownership",
                  "Equity trading is all about buying and selling shares of companies. It's a great way to learn how to evaluate companies and understand how your investments grow.",
                  "bg-[#4CAF50] hover:bg-[#45a049] transition-all duration-300",
                  "Start Equity Trading",
                  "Ready to get started?" 
                )
              }
              className="px-4 py-2 w-36 font-bold bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-all duration-300"
            >
              Equity
            </button>

            <button
              onClick={() =>
                openModal(
                  <FutureSvg/>,
                  "Futures Trading: Predict the Future",
                  "Futures allow you to trade contracts based on the future prices of commodities, stocks, and more. You'll learn how to predict market trends and hedge risks.",
                  "bg-[#2196F3] hover:bg-[#1e88e5] transition-all duration-300",
                  "Start Futures Trading",
                  "Dive in and start learning now!"
                )
              }
              className="px-4 py-2 w-36 font-bold bg-[#2196F3] text-white rounded-lg hover:bg-[#1e88e5] transition-all duration-300"
            >
              Futures
            </button>

            <button
              onClick={() =>
                openModal(
                  <OptionSvg/>,
                  "Options Trading: Flexible Contracts",
                  "Options trading lets you buy or sell contracts that give the right—but not the obligation—to trade at a specific price. It’s perfect for learning flexibility in trading strategies.",
                  "bg-[#FFC107] hover:bg-[#e0a800] transition-all duration-300",
                  "Start Options Trading",
                  "Get started with options today!"
                )
              }
              className="px-4 py-2 w-36 font-bold bg-[#FFC107] text-white rounded-lg hover:bg-[#e0a800] transition-all duration-300"
            >
              Options
            </button>
          </div>
        </div>

        <div className="w-1/2 h-[70vh] flex items-center justify-center"></div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-[90%] max-w-[400px] h-auto p-4 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="flex flex-col items-center justify-center text-center flex-grow mt-4">
            {modalContent.svgIcon && <div className="mb-4">{modalContent.svgIcon}</div>}
           
              <h2 className="text-xl font-bold mb-2">{modalContent.title}</h2>
              <p className="text-gray-700 mb-4">{modalContent.content}</p>
              <p className="text-gray-700 mb-4">{modalContent.contentLast}</p>
            </div>

            <button
              className={`px-4 py-2 text-white rounded-lg ${modalContent.buttonColor} mt-4`}
              onClick={handleButtonClick} 
            >
              {modalContent.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
