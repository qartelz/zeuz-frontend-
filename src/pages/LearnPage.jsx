import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TradingViewWidget from "../components/TradingViewWidget";
import StockInfo from "../components/StockInfo";
import BuySellPanel from "../components/BuySellPanel";
import BeetleBalance from "../components/BeetleBalance";
import OptionChain from "../components/OptionChain";
import { WebSocketStock } from "../components/WebSocketStock";

const LearnPage = () => {
  const [chartData, setChartData] = useState([]);
  console.log(chartData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              "user-id": "KE0070",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzMyMTU4Mjc2LCJleHAiOjE3MzIxNjg4MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzMyMTU4Mjc2MDA3LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.8Gir-2o5Ta6JJ81Tcu9DuQdBEi2SAMb6d6_lbvWHfTo",
            },
            body: JSON.stringify({
              start_time: "2024-11-19T03:45:00.000Z",
              end_time: "2024-11-19T09:15:00.000Z",
              interval: "1minute",
              ticker: "TCS.NSE",
              source: "nse",
            }),
          }
        );
        console.log(response);

        const result = await response.json();

        if (result.success) {
          setChartData(result.data);
        } else {
          console.error("Failed to fetch chart data:", result.systemMessage);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]);
  
  const [selectedData, setSelectedData] = useState(null);

  const { heading } = location.state || {};

  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    
    const getApiEndpoint = () => {
      if (heading === "Equity Trading") {
        return "https://backend.beetlezeuz.in/instrument/search/?exchange=NSE";
      } else if (heading === "Futures Trading") {
        return "https://backend.beetlezeuz.in/instrument/search/?exchange=NFO&segment=FUT";
      } else if (heading === "Options Trading") {
        return "https://backend.beetlezeuz.in/instrument/search-options/?exchange=NFO&segment=OPT";
      }
      return null;
    };

    const fetchStocks = async () => {
      try {
        const endpoint = getApiEndpoint();
        if (!endpoint) return; // Exit if no API endpoint is determined

        const response = await fetch(endpoint);
        const data = await response.json(); // assuming the backend returns a JSON array
        console.log(data);
        setStocks(data); // update the state with the fetched data
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    // Fetch data when the component mounts or when the heading changes
    fetchStocks();
  }, [heading]);

  const handleSearch = (query) => {
    const filteredResults = stocks.filter((stock) => {
      if (heading === "Options Trading") {
        return stock.script_name.toLowerCase().includes(query.toLowerCase());
      } else {
        return stock.display_name.toLowerCase().includes(query.toLowerCase());
      }
    });
    setResults(filteredResults);
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Reset selected data if user starts a new search
    if (selectedData) setSelectedData(null);

    handleSearch(query);
  };

  const handleSelectStock = (stock) => {
    setSelectedData(stock); // Set the selected stock
    setSearchQuery(""); // Clear the search input
    setResults([]); // Clear the search results
  };

  return (
    <div className="p-4 text-gray-800 min-h-screen">
      <Navbar />

      <div className="flex items-center gap-2 p-10">
        <span>Practice</span>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="font-bold text-[#026E78]">{heading}</span>
      </div>

      <div className="flex flex-col items-center mt-12">
        {!selectedData && <BeetleBalance />}

        <SearchBar
          searchQuery={searchQuery}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />

        <p className="mt-4 text-center text-sm text-gray-500">
          or change{" "}
          <a className="text-black" href="/practice">
            <strong>
              <u>Trade Type</u>
            </strong>
          </a>
        </p>

        {!selectedData && (
          <>
            {searchQuery && results.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-xl font-semibold mb-4">
                  {results.length} results found for "{searchQuery}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {results.map((stock, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white shadow rounded-lg cursor-pointer"
                      onClick={() => handleSelectStock(stock)}
                    >
                      <div className="text-lg font-bold">
                        {stock.display_name}
                      </div>
                      <div className="text-gray-600">
                        Exchange: {stock.exchange}
                      </div>
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
          </>
        )}
      </div>

      {selectedData && !searchQuery && heading !== "Options Trading" && (
        <WebSocketStock selectedData={selectedData}>
          <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
            <div className="space-y-6">
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
        </WebSocketStock>
      )}

      {heading === "Options Trading" && (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
          <div className="space-y-6">
            <OptionChain />
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default LearnPage;
