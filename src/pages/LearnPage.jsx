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
import CardRow from "../components/CardRow";
import axios from "axios";
import { MdOutlineLink } from "react-icons/md";


const LearnPage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [chartData, setChartData] = useState([]);

  console.log(chartData, "fdhgdufgdfjdfjgdujgdbbdfjgdfgdfbdfjghdfgdfg");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical",
          {
            start_time: "2024-11-19T03:45:00.000Z",
            end_time: "2024-11-19T09:15:00.000Z",
            interval: "1minute",
            ticker: "TCS.NSE",
            source: "nse",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "user-id": "KE0070",
              Authorization:
                "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzMyMTU4Mjc2LCJleHAiOjE3MzIxNjg4MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzMyMTU4Mjc2MDA3LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.8Gir-2o5Ta6JJ81Tcu9DuQdBEi2SAMb6d6_lbvWHfTo",
            },
          }
        );

        console.log(response, "Response Data");

        if (response.data.success) {
          setChartData(response.data.data);
        } else {
          console.error(
            "Failed to fetch chart data:",
            response.data.systemMessage
          );
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();

    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch(
    //         "https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical",
    //         {
    //           method: "POST",

    //           headers: {
    //             "Content-Type": "application/json",
    //             "user-id": "KE0070",
    //             Authorization:
    //               "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzMyMTU4Mjc2LCJleHAiOjE3MzIxNjg4MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzMyMTU4Mjc2MDA3LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.8Gir-2o5Ta6JJ81Tcu9DuQdBEi2SAMb6d6_lbvWHfTo",
    //           },
    //           body: JSON.stringify({
    //             start_time: "2024-11-19T03:45:00.000Z",
    //             end_time: "2024-11-19T09:15:00.000Z",
    //             interval: "1minute",
    //             ticker: "TCS.NSE",
    //             source: "nse",
    //           }),
    //         }
    //       );
    //       console.log(response,"hhhhhhhsssssssssssssssssssssssssssssssssssssss");

    //       const result = await response.json();
    //       console.log(result,"hhhhhhhssssssssssssssssssssssssssssssssssssss####s");

    //       if (result.success) {
    //         setChartData(result.data);
    //       } else {
    //         console.error("Failed to fetch chart data:", result.systemMessage);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching chart data:", error);
    //     }
    //   };

    //   fetchData();
  }, []);

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]); //ok

  const [selectedData, setSelectedData] = useState(null);

  const { heading } = location.state || {};

  const [stocks, setStocks] = useState([]);
  const [showOptionChain, setShowOptionChain] = useState(false);

  // for testin the search
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState(null);

  const getApiEndpoint = () => {
    if (heading === "Equity Trading") {
      return `${baseUrl}/instrument/searchh/?exchange=NSE`;
    } else if (heading === "Futures Trading") {
      return `${baseUrl}/instrument/searchh/?exchange=NFO&segment=FUT`;
    } else if (heading === "Options Trading") {
      return `${baseUrl}/instrument/searchh/?exchange=NFO&segment=OPT`;
    }
    return null;
  };

  const fetchInstruments = async (searchTerm, pageNumber) => {
    const endpoint = getApiEndpoint(heading);
    if (!endpoint) {
      console.error("Invalid heading provided. Cannot fetch data.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(endpoint, {
        params: { q: searchTerm, page: pageNumber },
      });

      // const response = await axios.get(`${baseUrl}/instrument/searchh/`, {
      //   params: { q: searchTerm, page: pageNumber, exchange: "NSE", segment: "" },
      // });
      const data = response.data;

      setResults((prevResults) =>
        pageNumber === 1 ? data.results : [...prevResults, ...data.results]
      );
      setHasMore(data.next !== null);
    } catch (err) {
      setError("Failed to fetch instruments. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Reset selected data if user starts a new search
    // if (selectedData) setSelectedData(null);

    // handleSearch(query);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setPage(1);
      setHasMore(true);
      fetchInstruments(searchQuery, 1);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMore &&
      !isLoading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInstruments(searchQuery, nextPage);
    }
  };

  // const handleSelectStock = (stock) => {setSelectedStock(stock)};
  const handleSelectStock = (stock) => {
    setSelectedData(stock);
    setSearchQuery("");
    setResults([]);
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

      <div className="flex flex-col justify-center  items-center">
        {!selectedData && <BeetleBalance />}

        <SearchBar
          searchQuery={searchQuery}
          handleChange={handleChange}
          // handleSearch={handleSearch}
        />

        <p className="mt-4 text-center text-sm text-gray-500">
          or change{" "}
          <a className="text-black" href="/markets">
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
                  Showing {results.length} results for "{searchQuery}"
                </p>
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-scroll"
                  style={{ maxHeight: "1300px" }}
                  onScroll={handleScroll}
                >
                  {results.map((stock, index) => (
                    <div
                      key={index}
                      className="p-10 bg-white shadow rounded-lg cursor-pointer"
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
      {selectedData && !searchQuery && heading === "Options Trading" && (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
          <div className="space-y-6">
            {/* Button to toggle Option Chain */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-cyan-700 text-white rounded shadow hover:bg-cyan-900"
              onClick={() => setShowOptionChain(true)} // Set state to show Option Chain
            >
              <MdOutlineLink />
              Option Chain
            </button>
          </div>
          <div></div>
        </div>
      )}
      
      

      {/* {selectedData && !searchQuery && heading !== "Options Trading" && ( */}
      {selectedData && !searchQuery &&  (
        <div className="grid grid-cols-1 md:grid-cols-[70%_25%] gap-6 p-0 mt-0 md:mt-4 md:p-6">
          <div>
            <StockInfo
              selectedData={selectedData}
              stocks={stocks}
              results={results}
            />
            
            {heading === "Options Trading" && (
              <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
                <div className="space-y-6">
                  {/* Replace the text with an icon */}
                  {/* <button
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-700 text-white rounded shadow hover:bg-cyan-900"
                    onClick={() => console.log("Option Chain Clicked")}
                  >
                    <MdOutlineLink />
                    
                    Option Chain
                  </button> */}
                </div>
                <div></div>
              </div>
            )}
            <TradingViewWidget data={chartData} />
          </div>

          <div>
            <BuySellPanel selectedData={selectedData} />
          </div>
        </div>
      )}

      {/* {heading === "Options Trading" && (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 p-6">
          <div className="space-y-6">
            <OptionChain />
          </div>
          <div></div>
        </div>
      )} */}
    </div>
  );
};

export default LearnPage;
