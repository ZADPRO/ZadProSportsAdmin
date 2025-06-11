// interface Props {
//   title: string;
//   count: number;
//   color?: string;
// }

// export default function DashboardCard({
//   title,
//   count,
//   color = "bg-gray-500",
// }: Props) {
//   return (
//     <div className={`rounded-xl shadow-lg p-6 text-white ${color}`}>
//       <h3 className="text-lg font-medium">{title}</h3>
//       {/* <p className="text-4xl font-bold mt-2">{count}</p> */}
//       <p className="text-3xl font-bold mt-2">
//         {!isNaN(count) ? count.toLocaleString() : "0"}
//       </p>
//     </div>
//   );
// }

import React from "react";
import { Card } from "primereact/card";

interface DashboardProps {
  BookingCount: number;
  GroundCount: number;
  UsersCount: number;
  OwnerCount: number;
}

const DashboardStats: React.FC<DashboardProps> = ({
  BookingCount,
  GroundCount,
  UsersCount,
  OwnerCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card
        title="Bookings"
        className="bg-blue-500  text-purple-600 shadow-lg rounded-lg"
        style={{ height: "160px", minWidth: "15rem" }}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-5xl font-bold m-0 leading-tight">
            {BookingCount.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card
        title="Grounds"
        className="bg-green-500 to-yellow-500 shadow-lg rounded-lg"
        style={{ minHeight: "160px", minWidth: "15rem" }}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-5xl font-bold m-0 leading-tight">
            {GroundCount.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card
        title="Users"
        className="bg-[#b03f98] text-[#b03f98] shadow-lg rounded-lg"
        style={{ minHeight: "160px", minWidth: "15rem" }}
      >
        <div className="flex flex-col justify-center items-center h-full text-[#b03f98">
          <p className="text-5xl font-bold m-0 leading-tight">
            {UsersCount.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card
        title="Owners"
        className="bg-[#c1d113]  text-[#b03f98] shadow-lg rounded-lg"
        style={{ minHeight: "160px", minWidth: "15rem" }}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-5xl font-bold m-0 leading-tight">
            {OwnerCount.toLocaleString()}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
