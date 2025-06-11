import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  ownerReceivable: number;
  commission: number;
  TotalGroundEarnings: number;
}

export default function EarningsPieChart({
  ownerReceivable,
  commission,
  TotalGroundEarnings,
}: Props) {
  const data = {
    labels: ["Owner Earnings", "Admin Commission", "Total Ground Earnings"],
    datasets: [
      {
        label: "Earnings Breakdown",
        data: [ownerReceivable, commission, TotalGroundEarnings],
        // backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        backgroundColor: ["#4E79A7", "#F28E2B", "#E15759"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Earnings Distribution
      </h2>
      <Pie data={data} />
    </div>
  );
}
