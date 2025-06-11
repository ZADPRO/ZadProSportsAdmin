import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import decrypt from "../../common/helper";
import { ArrowRight } from "lucide-react";
import { useUser } from "../../context/UserContext";

const Dashboard: React.FC = () => {
  // language, flagEN, flagDE are not defined in your original snippet, so removed getFlag and handleChangeLang

  const [dashboard, setDashboard] = useState<any>({});

  const navigate = useNavigate();

  const userRole = useUser().user.role || "owner";

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/dashboard",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "Appliction/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      if (data.success) {
        localStorage.setItem("JWTtoken", "Bearer " + data.token);
        console.log("data------------------>dashboard", data);
        setDashboard(data.result[0]);
      }
    } catch (e: any) {
      console.log("Error fetching dashboard:", e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cardConfigs = [
    {
      key: "GroundCount",
      title: "Total Grounds",
      tabIndex: 1,
      path: "/ground",
      roles: ["admin", "owner"],
    },
    {
      key: "BookingCount",
      title: "Total Bookings",
      tabIndex: 1,
      path: "/booking",
      roles: ["admin", "owner"],
    },
    // {
    //   key: "OwenerCount",
    //   title: "Owner Ground",
    //   tabIndex: 1,
    //   path: "/booking",
    //   roles: ["admin", "owner"],
    // },
    // {
    //   key: "SportsCategory",
    //   title: "Sports Category",
    //   tabIndex: 1,
    //   path: "/booking",
    //   roles: ["admin", "owner"],
    // },
    // {
    //   key: "UserCount",
    //   title: "Signed Up Users",
    //   tabIndex: 1,
    //   path: "/Userlist",
    //   roles: ["admin"],
    // },
  ];

  const visibleCards = cardConfigs.filter((card) =>
    card.roles.includes(userRole)
  );

  return (
    <div>
      <div>
        <div className="text-2xl font-semibold p-3">Dashboard</div>

        <div className="flex flex-wrap gap-6 mt-3 px-5 justify-center">
          {visibleCards.map((card) => (
            <div
              key={card.key}
              onClick={() =>
                navigate(card.path, { state: { tabIndex: card.tabIndex } })
              }
              className="cursor-pointer transition-transform transform hover:scale-105 flex-1 min-w-[260px] max-w-[300px]"
            >
              <Card
                title={card.title}
                className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-2xl transition-shadow"
                style={{
                  borderRadius: "1.5rem",
                  background: "#f9fafe",
                  padding: "1.2rem",
                }}
              >
                <div className="flex items-center justify-start mb-5 text-[#1b2e59] text-lg font-semibold">
                  <span>Count: </span>
                  <span className="text-xl font-bold">
                    {dashboard[card.key]}
                  </span>
                </div>
                <div className="flex justify-end">
                  <div className=" rounded-full bg-[#202d71] flex items-center justify-center text-white">
                    {/* <FiArrowRight className="text-lg" /> */}
                    <ArrowRight className="text-lg" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
