import React, { useEffect, useState } from "react";

const LmtOrder = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Mock API response
    const mockResponse = {
      data: [
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 148,
          token_id: "14366",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: true,
          trade_status: "incomplete",
          status: "LMT Order Placed",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
        {
          id: 149, // Changed ID to avoid duplication
          token_id: "14367",
          exchange: "NSE",
          trading_symbol: "IDEA-EQ",
          series: "EQ",
          lot_size: 1,
          quantity: 1,
          display_name: "IDEA EQ",
          company_name: "VODAFONE IDEA LIMITED",
          expiry_date: null,
          product_type: "Intraday",
          segment: "EQUITY",
          option_type: null,
          trade_type: "Buy",
          avg_price: 6.5,
          prctype: "LMT",
          invested_coin: 7.01,
          executed: false,
          trade_status: "incomplete",
          status: "NOT EXECUTED",
          ticker: "IDEA.NSE",
          created_at: "2024-12-23T21:33:37.276532+05:30",
          updated_at: "2024-12-23T21:33:37.276551+05:30",
          user: 1,
        },
      ],
    };

    setOrderData(mockResponse.data); // Set data directly
  }, []);

  return (
    <div className="mb-4">
      {/* Header Row */}
      <div className="grid grid-cols-10 text-center gap-2 text-xs md:text-sm bg-gray-100 px-2 md:px-4 py-2 font-semibold text-gray-800">
      <div className="truncate">Executed </div>
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
            {/* <div className="truncate">
              {new Date(order.created_at).toLocaleString()}
            </div> */}
            <div className="text-xs  md:text-md font-medium text-gray-800">
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="text-xs  md:text-md font-medium text-gray-800">
                    {new Date(order.updated_at).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
            {/* <div className="truncate">
              {new Date(order.updated_at).toLocaleString()}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LmtOrder;
