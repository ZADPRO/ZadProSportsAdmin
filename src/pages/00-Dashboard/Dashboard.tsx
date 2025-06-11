// import React, { useEffect, useState } from "react";
// import { Card } from "primereact/card";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import decrypt from "../../common/helper";
// import { ArrowRight } from "lucide-react";
// import { useUser } from "../../context/UserContext";

// const Dashboard: React.FC = () => {
//   // language, flagEN, flagDE are not defined in your original snippet, so removed getFlag and handleChangeLang

//   const [dashboard, setDashboard] = useState<any>({});

//   const navigate = useNavigate();

//   const userRole = useUser().user.role || "owner";

//   const fetchDashboard = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/adminRoutes/dashboard`,
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = decrypt(
//         response.data[1],
//         response.data[0],
//         import.meta.env.VITE_ENCRYPTION_KEY
//       );
//       if (data.success) {
//         // localStorage.setItem("JWTtoken", "Bearer " + data.token);
//         localStorage.setItem("JWTtoken", data.token);

//         console.log("data------------------>dashboard", data);
//         setDashboard(data.result[0]);
//       }
//     } catch (e: any) {
//       console.log("Error fetching dashboard:", e);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const cardConfigs = [
//     {
//       key: "GroundCount",
//       title: "Total Grounds",
//       tabIndex: 1,
//       path: "/ground",
//       roles: ["admin", "owner"],
//     },
//     {
//       key: "BookingCount",
//       title: "Total Bookings",
//       tabIndex: 1,
//       path: "/booking",
//       roles: ["admin", "owner"],
//     },

//   ];

//   const visibleCards = cardConfigs.filter((card) =>
//     card.roles.includes(userRole)
//   );

//   return (
//     <div>
//       <div>
//         <div className="text-2xl font-semibold p-3">Dashboard</div>

//         <div className="flex flex-wrap gap-6 mt-3 px-5 justify-center">
//           {visibleCards.map((card) => (
//             <div
//               key={card.key}
//               onClick={() =>
//                 navigate(card.path, { state: { tabIndex: card.tabIndex } })
//               }
//               className="cursor-pointer transition-transform transform hover:scale-105 flex-1 min-w-[260px] max-w-[300px]"
//             >
//               <Card
//                 title={card.title}
//                 className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-2xl transition-shadow"
//                 style={{
//                   borderRadius: "1.5rem",
//                   background: "#f9fafe",
//                   padding: "1.2rem",
//                 }}
//               >
//                 <div className="flex items-center justify-start mb-5 text-[#1b2e59] text-lg font-semibold">
//                   <span>Count: </span>
//                   <span className="text-xl font-bold">
//                     {dashboard[card.key]}
//                   </span>
//                 </div>
//                 <div className="flex justify-end">
//                   <div className=" rounded-full bg-[#202d71] flex items-center justify-center text-white">
//                     {/* <FiArrowRight className="text-lg" /> */}
//                     <ArrowRight className="text-lg" />
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
