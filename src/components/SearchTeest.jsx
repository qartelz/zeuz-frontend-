import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchTeest = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    console.log(baseUrl,"this is the base URL")
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
  
    const fetchInstruments = async (searchTerm, pageNumber) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/instrument/searchh/`, {
          params: { q: searchTerm, page: pageNumber },
        });
  
        const data = response.data;
        console.log(data,"tetsing results search ")
        setResults((prevResults) => [...prevResults, ...data.results]);
        setHasMore(data.next !== null); // Assuming API sends `next` in paginated response
      } catch (error) {
        console.error('Error fetching instruments:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (query) {
        setResults([]); // Clear old results on new query
        setPage(1);
        setHasMore(true);
        fetchInstruments(query, 1);
      }
    }, [query]);
  
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchInstruments(query, nextPage);
          return nextPage;
        });
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Search Trading Instruments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        <ul
          style={{ height: '300px', overflowY: 'scroll' }}
          onScroll={handleScroll}
        >
          {results.map((instrument) => (
            <li key={instrument.id}>
              <p>{instrument.trading_symbol} ({instrument.exchange})</p>
              <p>{instrument.script_name}</p>
            </li>
          ))}
        </ul>
        {!hasMore && !isLoading && <p>No more results</p>}
      </div>
    );
  };
  
export default SearchTeest