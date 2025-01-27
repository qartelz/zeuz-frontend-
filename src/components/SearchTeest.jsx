// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SearchTeest = () => {
//     const baseUrl = process.env.REACT_APP_BASE_URL;
//     console.log(baseUrl,"this is the base URL")
//     const [query, setQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const [page, setPage] = useState(1);
//     const [isLoading, setIsLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
  
//     const fetchInstruments = async (searchTerm, pageNumber) => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${baseUrl}/instrument/searchh/?exchange=NFO&segment=FUT`, {
//           params: { q: searchTerm, page: pageNumber },
//         });
  
//         const data = response.data;
//         console.log(data,"tetsing results search ")
//         setResults((prevResults) => [...prevResults, ...data.results]);
//         setHasMore(data.next !== null); // Assuming API sends `next` in paginated response
//       } catch (error) {
//         console.error('Error fetching instruments:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     useEffect(() => {
//       if (query) {
//         setResults([]); // Clear old results on new query
//         setPage(1);
//         setHasMore(true);
//         fetchInstruments(query, 1);
//       }
//     }, [query]);
  
//     const handleScroll = (e) => {
//       const { scrollTop, scrollHeight, clientHeight } = e.target;
//       if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
//         setPage((prevPage) => {
//           const nextPage = prevPage + 1;
//           fetchInstruments(query, nextPage);
//           return nextPage;
//         });
//       }
//     };
  
//     return (
//       <div>
//         <input
//           type="text"
//           placeholder="Search Trading Instruments..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         {isLoading && <p>Loading...</p>}
//         <ul
//           style={{ height: '300px', overflowY: 'scroll' }}
//           onScroll={handleScroll}
//         >
//           {results.map((instrument) => (
//             <li key={instrument.id}>
//               <p>{instrument.trading_symbol} ({instrument.exchange})</p>
//               <p>{instrument.script_name}</p>
//             </li>
//           ))}
//         </ul>
//         {!hasMore && !isLoading && <p>No more results</p>}
//       </div>
//     );
//   };
  
// export default SearchTeest
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SearchTeest = () => {
//   const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL from environment variable
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch instruments from the API
//   const fetchInstruments = async (searchTerm, pageNumber) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${baseUrl}/instrument/searchh/`, // Adjusted the endpoint path
//         {
//           params: {
//             q: searchTerm,
//             page: pageNumber,
//             exchange: "NFO",
//             segment: "FUT",
//           },
//         }
//       );

//       const data = response.data;
//       setResults((prevResults) =>
//         pageNumber === 1 ? data.results : [...prevResults, ...data.results]
//       ); // Reset results on new query, append otherwise
//       setHasMore(data.next !== null); // Determine if more data is available
//     } catch (error) {
//       console.error("Error fetching instruments:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle query changes
//   useEffect(() => {
//     if (query) {
//       setPage(1); // Reset page when query changes
//       setHasMore(true); // Allow fetching new results
//       fetchInstruments(query, 1); // Fetch for the first page
//     }
//   }, [query]);

//   // Handle scroll event for infinite scrolling
//   const handleScroll = (e) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.target;
//     if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isLoading) {
//       setPage((prevPage) => {
//         const nextPage = prevPage + 1;
//         fetchInstruments(query, nextPage);
//         return nextPage;
//       });
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Search Input */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search Trading Instruments..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border rounded-md p-2 w-full"
//         />
//       </div>

//       {/* Loading Indicator */}
//       {isLoading && page === 1 && <p>Loading...</p>}

//       {/* Results List */}
//       <ul
//         style={{ height: "300px", overflowY: "scroll" }}
//         onScroll={handleScroll}
//         className="border rounded-md p-2"
//       >
//         {results.map((instrument) => (
//           <li key={instrument.id} className="mb-2">
//             <p>
//               <strong>{instrument.trading_symbol}</strong> (
//               {instrument.exchange})
//             </p>
//             <p>{instrument.script_name}</p>
//           </li>
//         ))}
//       </ul>

//       {/* No More Results Indicator */}
//       {!hasMore && results.length > 0 && !isLoading && <p>No more results</p>}

//       {/* No Results Message */}
//       {results.length === 0 && !isLoading && <p>No results found</p>}
//     </div>
//   );
// };

// export default SearchTeest;
import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchTeest = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [query, setQuery] = useState("");
  


  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState(null);

  // Fetch trading instruments
  const fetchInstruments = async (searchTerm, pageNumber) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/instrument/searchh/`, {
        params: { q: searchTerm, page: pageNumber, exchange: "NSE", segment: "" },
      });
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

  // Handle query changes
  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      setHasMore(true);
      fetchInstruments(query, 1);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle scroll for pagination
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInstruments(query, nextPage);
    }
  };

  // Handle stock selection
  const handleSelectStock = (stock) => setSelectedStock(stock);

  // Render
  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Trading Instruments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-md p-2 w-full"
          aria-label="Search Trading Instruments"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {isLoading && page === 1 && <p>Loading...</p>}

      {/* Stock Grid */}
      {!selectedStock && (
        <>
          {query && results.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold mb-4">
                {results.length} results found for "{query}"
              </p>
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-scroll"
                style={{ maxHeight: "300px" }}
                onScroll={handleScroll}
              >
                {results.map((stock) => (
                  <div
                    key={stock.id}
                    className="p-4 bg-white shadow rounded-lg cursor-pointer stock-item"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="text-lg font-bold">{stock.display_name}</div>
                    <div className="text-gray-600">Exchange: {stock.exchange}</div>
                  </div>
                ))}
              </div>
              {isLoading && page > 1 && <p>Loading more...</p>}
            </div>
          )}

          {/* No Results */}
          {results.length === 0 && !isLoading && query && <p>No results found</p>}
        </>
      )}

      {/* Selected Stock Details */}
      {selectedStock && (
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Selected Stock</h2>
          <p>Display Name: {selectedStock.display_name}</p>
          <p>Exchange: {selectedStock.exchange}</p>
          <button
            onClick={() => setSelectedStock(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Back to Results
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTeest;
