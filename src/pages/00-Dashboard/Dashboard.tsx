

import React, { useEffect, useState } from "react";
// import DashboardCard from "./DashboardCard";
import EarningsPieChart from "./EarningsPieChart";
import UserBarChart from "./UserBarChart";
import axios from "axios";
import decrypt from "../../common/helper";
import DashboardStats from "./DashboardCard";
// import { Card } from "primereact/card";

interface DashboardData {
  BookingCount: number;
  GroundCount: number;
  UsersCount: number;
  OwnerCount: number;
  TotalGroundEarnings: number;
  ownerReceivable: number;
  totalCommission: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/adminRoutes/dashboard`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", data.token);
      console.log("data", data);

      if (data.success) {
        setData(data.result);
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } catch (err: any) {
      console.error("API error:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false); // ✅ Stop loading in all cases
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 ">
            <DashboardStats
              BookingCount={data?.BookingCount ?? 0}
              GroundCount={data?.GroundCount ?? 0}
              UsersCount={data?.UsersCount ?? 0}
              OwnerCount={data?.OwnerCount ?? 0}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 m-7 ml-30">
            <EarningsPieChart
              ownerReceivable={data?.ownerReceivable || 0}
              commission={data?.totalCommission || 0}
              TotalGroundEarnings={data?.TotalGroundEarnings || 0}
            />
            <UserBarChart
              users={data?.UsersCount || 0}
              owners={data?.OwnerCount || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
