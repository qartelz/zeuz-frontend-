import React, { useState, useEffect } from "react";

const OrderMargin = () => {
  const [margin, setMargin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderMargin = async () => {
      try {
        const response = await fetch("https://orca-uatapi.enrichmoney.in/order-api/v1/order/margin", {
          method: "POST",
          headers: {
            "Authorization":"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MTcyNjMxLCJleHAiOjE3MzQyMjI2MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MTcyNjMxNzI0LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.K2v9XnfeFnqPt0mNXvqUDlGpS6B5dap38IzuQt7vVfU",
            "user-Id": "KE0070",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "KE0070",
            exchange: "NFO",
            trading_symbol: "NIFTY26DEC24F",
            price: "24860.00",
            quantity: "25",
            price_type: "LMT",
            product_type: "I",
            transaction_type: "B",
            trigger_price: "",
            book_loss_price: "",
            book_profit_price: "",
            original_price: "",
            original_quantity: "",
            original_trigger_price: "",
            oms_partner_order_no: "",
            secondary_order_no: "",
            oms_partner_source: "kambala"
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMargin(data.data.order_margin);
        } else {
          setError("Failed to fetch order margin");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderMargin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Order Margin: {margin}</h3>
    </div>
  );
};

export default OrderMargin;
