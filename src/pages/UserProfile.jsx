import { useEffect, useState } from "react";
import BagSvg from "../assets/svg/BagSvg";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSelector } from "react-redux";

export default function UserProfile() {

  const { name} = useSelector((state) => state.auth);
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;

  const [totalProfitLoss, setTotalProfitLoss] = useState(null);
  const [totalAvbl, setTotalAvbl] = useState(null);
  const [totalInvested, setTotalInvested] = useState(null);
  console.log(totalInvested, "setTotalInvested");

  useEffect(() => {
    const fetchProfitLoss = async () => {
      try {
        const response = await axios.get(
          "https://backend.beetlezeuz.in/account/trade-summary/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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

  return (
    <main>
      <Navbar />

      <div className="flex flex-col items-center p-8  min-h-screen">
        <h1 className="text-xl font-bold text-[#026E78] self-start mb-8">
          My Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            {/* Placeholder for user profile image SVG */}
            <svg
              className="w-16 h-16 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
            </svg>
          </div>

          {/* User Details */}
          <h2 className="text-2xl font-semibold mb-2">{name || "User Name"}</h2>
          <p className="text-gray-600 mb-4">Location</p>
          <p className="text-center text-gray-500 max-w-md mb-8">
            A brief paragraph about the user, detailing interests, background,
            or anything else.
          </p>
          {/* Toggle Button for Portfolio/Profit-Loss */}
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
              Profit/Loss
            </button>
          </div>

          {/* Content for Portfolio Tab */}
          {activeTab === "Portfolio" && (
            <div className="w-full flex flex-col items-center">
              {/* Total Portfolio Value */}
              {/* <InfoBox
                title="Total"
                subtitle="Portfolio Value"
                amount="12,345.67"
              /> */}

              <div className="flex flex-col md:grid grid-cols-3 gap-4">
              <InfoBox
  title="BEETLE"
  subtitle="Available"
  amount={
    totalAvbl !== null && totalAvbl !== undefined
      ? Number(totalAvbl).toFixed(2).toLocaleString()
      : "Loading..."
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
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Left Box - Trade Summary */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-lg font-semibold mb-4">Trade Summary</h2>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p>
                      Your trade summary will be displayed here. Add more
                      details as needed.
                    </p>
                  </div>
                </div>

                {/* Right Box - Trade History */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-lg font-semibold mb-4">Trade History</h2>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
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

                    {/* Weekdays */}
                    <div className="grid grid-cols-6 text-center font-medium text-gray-600">
                      {weekDays.map((day, index) => (
                        <span key={index}>{day}</span>
                      ))}
                    </div>

                    {/* Dates */}
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
