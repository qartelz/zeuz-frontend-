import React, { useEffect, useState } from "react";
import axios from "axios";

const LmtOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/trades/limit-orders/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setOrderData(response.data); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, [baseUrl, accessToken]);

  console.log(orderData, "the order data");

  return (
    <div>
      {orderData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="mb-4">
          {/* Header Row */}
          <div className="grid grid-cols-10 text-center gap-2 text-xs md:text-sm bg-gray-100 px-2 md:px-4 py-2 font-semibold text-gray-800">
            <div className="truncate">Executed</div>
            <div className="truncate">Stock Name</div>
            <div className="truncate">Buy/Sell</div>
            <div className="truncate">Order Type</div>
            <div className="truncate">Entry Price</div>
            <div className="truncate">Quantity</div>
            <div className="truncate">Product Type</div>
            <div className="truncate">Status</div>
            <div className="truncate">Order Placed</div>
            <div className="truncate">Executed On</div>
          </div>

          {/* Orders */}
          <div
            className="overflow-y-auto max-h-96 bg-white"
            style={{ scrollbarWidth: "thin", scrollbarColor: "gray lightgray" }}
          >
            {orderData.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-10 text-center gap-2 text-xs md:text-sm px-2 md:px-4 py-2 border-b"
              >
                <div className="truncate">
                  {order.executed ? (
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                  ) : (
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                  )}
                </div>
                <div className="truncate">{order.display_name}</div>
                <div className="truncate">{order.trade_type}</div>
                <div className="truncate">{order.prctype}</div>
                <div className="truncate">{order.avg_price}</div>
                <div className="truncate">{order.quantity}</div>
                <div className="truncate">{order.product_type}</div>
                <div className="truncate">{order.status}</div>
                <div className="text-xs md:text-md font-medium text-gray-800">
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-xs md:text-md font-medium text-gray-800">
                  {new Date(order.updated_at).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LmtOrder;
