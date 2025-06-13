
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
        className="bg-[#000]  shadow-lg rounded-lg"
        style={{ height: "160px", minWidth: "15rem" }}
      >
        <div className="flex flex-col justify-center items-center h-full  text-purple-600">
          <p className="text-5xl font-bold m-0 leading-tight  text-purple-600">
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
        className="bg-[#a887a1] text-[#000] shadow-lg rounded-lg"
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
        className="bg-[#7bbda3]  text-[#000] shadow-lg rounded-lg"
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
