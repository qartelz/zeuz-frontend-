import React, { useEffect, useState } from 'react';

const AdminPage = () => {

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (token) {
      setMessage(`Token submitted: ${token}`);
      // Add functionality to handle the token submission, e.g., API call.
    } else {
      setMessage("Please paste a token.");
    }
  };



  const callbackUrl = 'https://uat-frontend.enrichmoney.in:3018/partner/login?partner=KE0070'; 
  const [jwtToken, setJwtToken] = useState(null);

  const handleButtonClick = () => {
    window.location.href = callbackUrl;
  };

  useEffect(() => {
    // Extract the JWT token from the URL's search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('x-authorization'); // Get the token from "x-authorization"
    if (token) {
      setJwtToken(token);
    }
  }, [window.location.search]);
  

  return (

    <main>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
        <button
          onClick={handleButtonClick}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200 mb-4"
        >
          Go to Callback URL
        </button>
        
        {jwtToken && (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-6 bg-white rounded shadow-lg border border-gray-300">
      <p className="text-center text-gray-700 break-all">{jwtToken}</p>
    </div>
  </div>
)}

      </div>
    </div>

<div className="flex justify-center items-center h-screen bg-gray-100">
<div className="p-6 bg-white rounded shadow-md w-96">
  <h2 className="text-2xl font-bold mb-4">Submit Token</h2>
  <form onSubmit={handleTokenSubmit}>
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">Token</label>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full border rounded px-3 py-2 h-32"
        placeholder="Paste your token here"
      ></textarea>
    </div>
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    >
      Submit Token
    </button>
  </form>
  {message && <p className="mt-4 text-green-500">{message}</p>}
</div>
</div>
</main>
  );
};

export default AdminPage;

