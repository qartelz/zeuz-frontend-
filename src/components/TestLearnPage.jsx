// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { ChevronRightIcon } from "@heroicons/react/24/outline";
// import Navbar from "../components/Navbar";
// import SearchBar from "../components/SearchBar";
// import TradingViewWidget from "../components/TradingViewWidget";
// import StockInfo from "../components/StockInfo";
// import BuySellPanel from "../components/BuySellPanel";
// import BeetleBalance from "../components/BeetleBalance";
// import OptionChain from "../components/OptionChain";
// import CardRow from "../components/CardRow";


// const TestLearnPage = () => {
//   return (
//     <>
//     <div className="p-4 text-gray-800 min-h-screen font-poppins">
//       <Navbar />
//       <CardRow />
//       <div className="flex items-center gap-2 px-10 py-5">
//         <span>Markets</span>
//         <ChevronRightIcon className="h-4 w-4" />
//         <span className="font-bold text-[#026E78]">{heading}</span>
//       </div>
      

//       <div className="flex flex-col justify-center  items-center">
//         {/* {!selectedData && <BeetleBalance />} */}

//         <SearchBar
//           searchQuery={searchQuery}
//           handleChange={handleChange}
//           handleSearch={handleSearch}
//         />

//         <p className="mt-4 text-center text-sm text-gray-500">
//           or change{" "}
//           <a className="text-black" href="/markets">
//             <strong>
//               <u>Trade Type</u>
//             </strong>
//           </a>
//         </p>

//         {/* {!selectedData && ( */}
//           <>
//             {/* {searchQuery && results.length > 0 && (
//               <div className="mt-6 text-center">
//                 <p className="text-xl font-semibold mb-4">
//                   {results.length} results found for "{searchQuery}"
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {results.map((stock, index) => (
//                     <div
//                       key={index}
//                       className="p-10 bg-white shadow rounded-lg cursor-pointer"
//                       onClick={() => handleSelectStock(stock)}
//                     >
//                       <div className="text-lg font-bold">
//                         {stock.display_name}
//                       </div>
//                       <div className="text-gray-600">
//                         Exchange: {stock.exchange}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )} */}

//             {/* {searchQuery && results.length === 0 && (
//               <div className="mt-6 text-center text-gray-600">
//                 No results found for "{searchQuery}"
//               </div>
//             )} */}
//           </>
//         {/* )} */}
//       </div>

//       {selectedData && !searchQuery  && (
        
//           <div className="grid grid-cols-1 md:grid-cols-[70%_25%] gap-6 p-0 mt-0 md:mt-4 md:p-6">
//             <div >
//               <StockInfo
//                 selectedData={selectedData}
//                 stocks={stocks}
//                 results={results}
//               />
//               {/* <TradingViewWidget data={chartData} /> */}
//             </div>

//             <div>
//               <BuySellPanel selectedData={selectedData} />
//             </div>
//           </div>
        
//       )}

//   {selectedData && !searchQuery  && (
        
//         <div className="grid grid-cols-1 md:grid-cols-[70%_25%] gap-6 p-0 mt-0 md:mt-4 md:p-6">
//           <div >
//             <StockInfo
//               selectedData={selectedData}
//               stocks={stocks}
//               results={results}
//             />
//             <TradingViewWidget data={chartData} />
//           </div>

//           <div>
//             <BuySellPanel selectedData={selectedData} />
//           </div>
//         </div>
      
//     )}

//       {/* {heading === "Options Trading" && (
//         <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
//           <div className="space-y-6">
//             <OptionChain />
//           </div>
//           <div></div>
//         </div>
//       )} */}
//     </div>
//   );
    
    
//     </>
//   )
// }

// export default TestLearnPage

import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Navbar from "./Navbar"; // Import your Navbar component
import CardRow from "./CardRow"; // Import your CardRow component
import SearchBar from "./SearchBar"; // Import your SearchBar component
import StockInfo from "./StockInfo"; // Import your StockInfo component
import BuySellPanel from "./BuySellPanel"; // Import your BuySellPanel component
import TradingViewWidget from "./TradingViewWidget"; // Import your TradingViewWidget component

const TestLearnPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [stocks, setStocks] = useState([]); // Initialize stocks if needed
  const [chartData, setChartData] = useState([]); // Initialize chart data if needed
  const heading = "Stocks"; // Replace with dynamic heading if needed

  // Handle search query change
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search action
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    // Simulate a search API call (replace with your actual API call)
    const mockResults = [
      { id: 1, display_name: "AAPL", exchange: "NASDAQ" },
      { id: 2, display_name: "GOOGL", exchange: "NASDAQ" },
      { id: 3, display_name: "TSLA", exchange: "NASDAQ" },
    ];

    // Filter results based on the query (case-insensitive)
    const filteredResults = mockResults.filter((stock) =>
      stock.display_name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
  };

  // Handle selecting a stock from the results
  const handleSelectStock = (stock) => {
    setSelectedData(stock);
  };

  return (
    <div className="p-4 text-gray-800 min-h-screen font-poppins">
      <Navbar />
      <CardRow />
      <div className="flex items-center gap-2 px-10 py-5">
        <span>Markets</span>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="font-bold text-[#026E78]">{heading}</span>
      </div>

      <div className="flex flex-col justify-center items-center">
        <SearchBar
          searchQuery={searchQuery}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />

        <p className="mt-4 text-center text-sm text-gray-500">
          or change{" "}
          <a className="text-black" href="/markets">
            <strong>
              <u>Trade Type</u>
            </strong>
          </a>
        </p>

        {searchQuery && results.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold mb-4">
              {results.length} results found for "{searchQuery}"
            </p>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{ height: "300px", overflowY: "scroll" }}
            >
              {results.map((stock, index) => (
                <div
                  key={index}
                  className="p-10 bg-white shadow rounded-lg cursor-pointer"
                  onClick={() => handleSelectStock(stock)}
                >
                  <div className="text-lg font-bold">{stock.display_name}</div>
                  <div className="text-gray-600">Exchange: {stock.exchange}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && results.length === 0 && (
          <div className="mt-6 text-center text-gray-600">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>

      {selectedData && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-[70%_25%] gap-6 p-0 mt-0 md:mt-4 md:p-6">
          <div>
            <StockInfo
              selectedData={selectedData}
              stocks={stocks}
              results={results}
            />
            <TradingViewWidget data={chartData} />
          </div>

          <div>
            <BuySellPanel selectedData={selectedData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestLearnPage;
