
import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const OptionChain = ({ optionsData, currentPrice }) => {
//   const [currentPrice] = useState(23532.7);

  const [selectedDate, setSelectedDate] = useState("2025-01-05"); 
  const [isOpen, setIsOpen] = useState(false);

  const dates = optionsData.unique_expiry_dates


  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectDate = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

 

  if (!optionsData || !optionsData.grouped_data) {
        return <p>Loading data...</p>;
      }
    
      console.log(optionsData,"testing option chain data ")

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Options Chain </h2>

        {/* Date Selector */}
        <div className="relative z-10">
          <div
            className="flex items-center gap-2  cursor-pointer text-gray-700 font-medium"
            onClick={toggleDropdown}
          >
            <span>Expiry:</span>
            <span>{selectedDate}</span>
            <ChevronDown size={18} />
          </div>
          {isOpen && (
            <div className="absolute top-full mt-2 w-40 bg-white border rounded-md shadow-lg">
              <ul
                className="py-2 max-h-40 overflow-y-auto"
                style={{ maxHeight: "20rem" }}
              >
                {dates.map((date) => (
                  <li
                    key={date}
                    className={`px-4 py-2 cursor-pointer ${
                      date === selectedDate ? "bg-gray-100 font-bold" : ""
                    } hover:bg-gray-200`}
                    onClick={() => selectDate(date)}
                  >
                    {date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <span className="font-medium">
          Current Price: ₹{currentPrice.toFixed(2)}
        </span>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th colSpan={3} className="text-center text-red-600 bg-blue-50 p-2">
              CALLS
            </th>
            <th className="text-center bg-gray-50 p-2">Strike</th>
            <th colSpan={3} className="text-center text-green-600 bg-blue-50 p-2">
              PUTS
            </th>
          </tr>
          <tr className="text-xs border-b">

            <th className="p-2">Ol Chg%</th>
            <th className="p-2">OI</th>
            <th className="p-2">LTP</th>
            {/* <th className="p-2">STOCKNAME</th> */}
            <th className="p-2">Strike</th>
            {/* <th className="p-2">STOCKNAME</th> */}
            <th className="p-2">LTP</th>
            <th className="p-2">OI</th>           
             <th className="p-2">Ol Chg%</th>
          </tr>
       </thead>
       <tbody>
          {optionsData.grouped_data.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <tr className="bg-gray-200 ">
                <td colSpan={7} className="text-center font-bold p-2 ">
                  Expiry Date: {group.expiry_date}
                </td>
              </tr>
              {group.options.map((row, index) => {
                const isLowerStrike = row.strike_price < currentPrice;
                const isCurrentPriceRow = row.strike_price === currentPrice;

                return (
                  <tr
                    key={index}
                    className={`border-b text-center ${
                      isCurrentPriceRow ? 'font-bold bg-yellow-100' : ''
                    }`}
                  >
                    {/* Call Section */}
                    
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-red-100'
                          : 'bg-white'
                      }`}
                    >
                      {row.call?.olchg || '-'}
                    </td>
                    
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-red-100'
                          : 'bg-white'
                      }`}
                    >
                      {row.call?.oi || '-'}
                    </td>
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-red-100'
                          : 'bg-white'
                      }`}
                    >
                      {row.call?.price?.toFixed(2) || '-'}
                    </td>
                    {/* #for testing purposes */}
                    {/* <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-red-100'
                          : 'bg-white'
                      }`}
                    >
                     {row.call.display_name}
                    </td> */}

                    {/* Strike Price */}
                    <td className="p-2 bg-gray-50 font-medium">
                      {row.strike_price.toFixed(2)}
                    </td>

                    {/* Put Section */}
                    {/* #for testing purposes */}
                    {/* <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-red-100'
                          : 'bg-white'
                      }`}
                    >
                     {row.put.display_name}
                    </td> */}
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-white'
                          : 'bg-red-100'
                      }`}
                    >
                      {row.put?.price?.toFixed(2) || '-'}
                    </td>
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-white'
                          : 'bg-red-100'
                      }`}
                    >
                      {row.put?.oi || '-'}
                    </td>
                    <td
                      className={`p-2 ${
                        isCurrentPriceRow
                          ? 'bg-blue-100'
                          : isLowerStrike
                          ? 'bg-white'
                          : 'bg-red-100'
                      }`}
                    >
                      {row.put?.olchg || '-'}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default OptionChain;