import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Navbar from "../components/Navbar";

const PracticePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    buttonColor: "",
    buttonText: "",
    contentLast: "",
  });
  const navigate = useNavigate();

  const closeModal = () => setIsModalOpen(false);

  const openModal = (title, content, buttonColor, buttonText, contentLast) => {
    setModalContent({ title, content, buttonColor, buttonText, contentLast });
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
    navigate('/practice/learn', { state: { heading: buttonTextValue } });
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-row h-screen items-center justify-between">
        <div className="flex flex-col justify-end space-y-4 w-1/2 p-8">
          <h1 className="text-4xl font-bold">Start a New Trade</h1>
          <h2 className="text-xl text-gray-700">
            Choose a trade type to learn and practice.
          </h2>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={() =>
                openModal(
                  "Equity Trading: Build Ownership",
                  "Equity trading is all about buying and selling shares of companies. It's a great way to learn how to evaluate companies and understand how your investments grow.",
                  "bg-blue-500",
                  "Start Equity Trading",
                  "Ready to get started?"
                )
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Equity
            </button>

            <button
              onClick={() =>
                openModal(
                  "Futures Trading: Predict the Future",
                  "Futures allow you to trade contracts based on the future prices of commodities, stocks, and more. You'll learn how to predict market trends and hedge risks.",
                  "bg-green-500",
                  "Start Futures Trading",
                  "Dive in and start learning now!"
                )
              }
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Futures
            </button>

            <button
              onClick={() =>
                openModal(
                  "Options Trading: Flexible Contracts",
                  "Options trading lets you buy or sell contracts that give the right—but not the obligation—to trade at a specific price. It’s perfect for learning flexibility in trading strategies.",
                  "bg-red-500",
                  "Start Options Trading",
                  "Get started with options today!"
                )
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
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
          onClick={closeModal} // Close the modal when clicking outside
        >
          <div
            className="bg-white rounded-lg w-[90%] max-w-[400px] h-auto p-4 flex flex-col relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Content Section */}
            <div className="flex flex-col items-center justify-center text-center flex-grow mt-4">
              <h2 className="text-xl font-bold mb-2">{modalContent.title}</h2>
              <p className="text-gray-700 mb-4">{modalContent.content}</p>
              <p className="text-gray-700 mb-4">{modalContent.contentLast}</p>
            </div>

            {/* Button */}
            <button
              className={`px-4 py-2 text-white rounded-lg ${modalContent.buttonColor} mt-4`}
              onClick={handleButtonClick} // Navigate on button click
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
