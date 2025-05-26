import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Pencil, Trash2 } from "lucide-react";

interface Tip {
  refAdditionalTipsId: number;
  refAdditionalTipsName: string;
}

const AdditionalTips: React.FC = () => {
  const [tipsList, setTipsList] = useState<Tip[]>([]);
  const [tipInput, setTipInput] = useState<string>("");
  const toast = useRef<Toast>(null);

  const fetchTips = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listAdditionalTips`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          setTipsList(data.result);
        }
      });
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const addTip = () => {
    if (!tipInput) return;

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/addAdditionalTips`,
        {
          refAdditionalTipsName: [{ refAdditionalTipsName: tipInput }],
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          fetchTips();
          setTipInput("");
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: data.error,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add tip",
          life: 3000,
        });
        console.error(error);
      });
  };

  const handleEdit = (rowData: Tip) => {
    console.log("Edit clicked", rowData);
    // Implement edit logic here
  };



 const deleteTips = (refAdditionalTipsId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteAdditionalTips`,
        { refAdditionalTipsId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          console.log("Deleted Successfully");
          fetchTips(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };
  return (
    <div className="overallcontainer flex">
      <Toast ref={toast} />
      <div className="flex-1 gap-3 mt-3">
        <div className="flex flex-col">
          <label className="block mb-1 font-medium text-black" htmlFor="tipname">
            Tip Name:
          </label>
          <div className="flex gap-2">
            <InputText
              id="tipname"
              className="flex-1"
              placeholder="Enter Tip"
              value={tipInput}
              onChange={(e) => setTipInput(e.target.value)}
            />
            <Button label="Add" onClick={addTip} />
          </div>
        </div>

        <div className="flex-1 mt-3">
          <DataTable scrollable showGridlines stripedRows value={tipsList}>
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refAdditionalTipsName"
              header="Tip Name"
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refAdditionalTipsName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-5">
                  <button
                    onClick={() => handleEdit(rowData)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18} color="#2563eb" />
                  </button>
                  <button
                    onClick={() => deleteTips(rowData.refAdditionalTipsId)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                    title="Delete"
                    
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </button>
                </div>
              )}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AdditionalTips;
