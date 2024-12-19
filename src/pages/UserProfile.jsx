import { useEffect, useRef, useState } from "react";
import BagSvg from "../assets/svg/BagSvg";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSelector } from "react-redux";
import { Edit, Check } from "lucide-react";

export default function UserProfile() {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { name } = useSelector((state) => state.auth);
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;

  const [totalProfitLoss, setTotalProfitLoss] = useState(null);
  const [totalAvbl, setTotalAvbl] = useState(null);
  const [totalInvested, setTotalInvested] = useState("0");
  console.log(totalInvested, "total j");
  console.log(totalInvested, "setTotalInvested");

  const [trades, setTrades] = useState([]);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(`${baseUrl}/trades/trades/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setTrades(response.data);
        console.log(response, "the trade response");
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [accessToken]);

  const refreshTrades = () => {
    fetchTrades();
  };

  useEffect(() => {
    const fetchProfitLoss = async () => {
      try {
        const response = await axios.get(`${baseUrl}/account/trade-summary/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTotalProfitLoss(response.data.total_profit_loss);
        setTotalAvbl(response.data.beetle_coins.coins);
        setTotalInvested(response.data.beetle_coins.used_coins);
      } catch (error) {
        console.error("Error fetching profit/loss data:", error);
      }
    };

    fetchProfitLoss();
  }, []);

  const [selectedDate, setSelectedDate] = useState(dayjs().date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(1, "day")
  );

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDates = weekDays.map((_, index) =>
    currentWeekStart.add(index, "day")
  );

  const goToPreviousWeek = () => {
    setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(7, "day"));
  };
  const [activeTab, setActiveTab] = useState("Portfolio");

  const InfoBox = ({ title, subtitle, amount }) => (
    <div className="bg-white rounded-lg shadow-md mb-6 px-10 py-3 w-lg max-w-sm">
      <h3 className="text-lg text-[#0E8190] font-semibold mb-2 text-left">
        {title}
      </h3>
      <h2 className="text-2xl font-bold mb-4 text-left">{subtitle}</h2>
      <div className="bg-[#F6FEFF] w-full rounded-md flex items-center p-2">
        <div className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-4">
          <BagSvg />
        </div>
        <p className="text-xl font-semibold text-left mr-2">{amount} BTLS.</p>
      </div>
    </div>
  );

  const [isEditing, setIsEditing] = useState(false);
  const [userParagraph, setUserParagraph] = useState(
    "A brief paragraph about you, detailing interests, background, or anything else."
  );

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const contentEditableRef = useRef(null);

  const handleInputChange = (e) => {
    const updatedParagraph = e.target.textContent;

    if (updatedParagraph.length <= 500) {
      setUserParagraph(updatedParagraph);
    } else {
      alert("The paragraph cannot exceed 500 characters.");
      e.target.textContent = updatedParagraph.substring(0, 500);
      setUserParagraph(updatedParagraph.substring(0, 500));
    }

    const element = contentEditableRef.current;
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const filteredTrades = trades.filter((trade) =>
    dayjs(trade.updated_at).isSame(dayjs().date(selectedDate), "day")
  );

  return (
    <main>
      <Navbar />

      <div className="flex flex-col font-poppins items-center  p-8  min-h-screen">
        <h1 className="text-xl font-bold text-[#026E78] self-start mb-8">
          My Profile
        </h1>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 md:w-16 md:h-16 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2">{name || "User Name"}</h2>

          <div className="flex items-center justify-between max-w-md mb-8">
            <div
              contentEditable={isEditing}
              ref={contentEditableRef}
              suppressContentEditableWarning={true}
              className={`text-center text-gray-500 ${
                isEditing
                  ? "border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#026E78]  w-96 overflow-y-auto"
                  : ""
              }`}
              onInput={handleInputChange}
            >
              {userParagraph}
            </div>

            <button
              className="ml-4 text-[#026E78] hover:text-[#014B52] transition"
              onClick={isEditing ? handleSave : handleEditToggle}
            >
              {isEditing ? <Check size={24} /> : <Edit size={24} />}
            </button>
          </div>
          <div className="flex items-center border rounded-full px-2 py-1 mb-8">
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "Portfolio"
                  ? "bg-[#026E78] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("Portfolio")}
            >
              Portfolio
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "Profit/Loss"
                  ? "bg-[#026E78] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("Profit/Loss")}
            >
              History
            </button>
          </div>

          {activeTab === "Portfolio" && (
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col md:grid grid-cols-3 gap-4">
                <InfoBox
                  title="BEETLE"
                  subtitle="Available"
                  amount={
                    totalAvbl !== null && totalAvbl !== undefined
                      ? Number(totalAvbl).toFixed(2).toLocaleString()
                      : "0"
                  }
                />

                <InfoBox
                  title="TOTAL BEETLE"
                  subtitle="Invested"
                  amount={totalInvested}
                  percentage="5"
                />

                <InfoBox
                  title="BEETLE"
                  subtitle="P/L"
                  amount={
                    totalProfitLoss ? (
                      <span
                        className={`text-xl font-semibold text-left ${
                          totalProfitLoss < 0
                            ? "text-red-600"
                            : "text-green-500"
                        }`}
                      >
                        {totalProfitLoss.toFixed(2)}
                      </span>
                    ) : (
                      "0"
                    )
                  }
                />
              </div>
            </div>
          )}
          {activeTab === "Profit/Loss" && (
            <div className="w-full flex flex-col justify-between gap-6">
              <div className="flex flex-col flex-1 md:flex-row justify-start items-start gap-20 w-full">
                <div className="w-full md:w-3/4">
                  <div className="p-4 bg-gray-100 rounded-lg w-[500px] shadow">
                    <div>
                      <div className="flex justify-between mb-3">
                        <h1 className="text-xl font-semibold mb-4">
                          Trades List
                        </h1>
                        <div className="flex-col justify-center text-xl text-gray-500 font-semibold items-center text-center">
                          <h1>Total {filteredTrades.length} trades. </h1>
                        </div>
                      </div>

                      {filteredTrades.length > 0 ? (
                        <div style={{ overflowY: "auto", maxHeight: "200px" }}>
                          <table className="min-w-full table-auto border-collapse">
                            <thead className="sticky top-0 bg-gray-100">
                              <tr className="text-left">
                                <th className="px-4 py-2 border-b">Sl. No.</th>
                                <th className="px-4 py-2 border-b">Name</th>
                                <th className="px-4 py-2 border-b">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTrades.map((trade, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 border-b">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-2 border-b">
                                    {trade.display_name}
                                  </td>
                                  <td className="px-4 py-2 border-b">
                                    {trade.product_type}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p>No trades found.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/4">
                  <h2 className="text-lg font-semibold mb-4">Trade History</h2>
                  <div className="p-4 bg-gray-100 rounded-lg w-[300px] shadow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium">
                        {currentWeekStart.format("MMMM YYYY")}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={goToPreviousWeek}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={goToNextWeek}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 text-center font-medium text-gray-600">
                      {weekDays.map((day, index) => (
                        <span key={index}>{day}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-6 text-center mt-2">
                      {weekDates.map((date, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedDate(date.date())}
                          className={`p-2 rounded-full cursor-pointer ${
                            date.date() === selectedDate &&
                            date.isSame(dayjs(), "month")
                              ? "bg-blue-500 text-white"
                              : "text-gray-700"
                          } hover:bg-blue-200`}
                        >
                          {date.date()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
