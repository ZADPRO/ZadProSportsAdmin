import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  users: number;
  owners: number;
}

// export default function UserBarChart({ users, owners }: Props) {
//   const data = {
//     labels: ["Users", "Owners"],
//     datasets: [
//       {
//         label: "Account Type",
//         data: [users, owners],
//         backgroundColor: ["#F59E0B", "#EF4444"],
//       },
//     ],
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Users vs Owners</h2>
//       <Bar data={data} />
//     </div>
//   );
// }

export default function UserBarChart({ users, owners }: Props) {
  const data = {
    labels: ["Users", "Owners"],
    datasets: [
      {
        label: "Account Type",
        data: [users, owners],
        backgroundColor: ["#00CEC9", "#FFEAA7"], // amber + red
        borderColor: ["#D97706", "#DC2626"],     // darker shades
        hoverBackgroundColor: ["#FBBF24", "#F87171"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Users vs Owners</h2>
      <Bar data={data} />
    </div>
  );
}