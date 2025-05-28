import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Trash2 } from "lucide-react";

interface UserGuideline {
  refUserGuidelinesName: string;
}

const UserGuidelines: React.FC = () => {
  const [guidelinesList, setGuidelinesList] = useState<UserGuideline[]>([]);
  const [newGuideline, setNewGuideline] = useState<string>("");
  const toast = useRef<Toast>(null);

  const listGuidelinesApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listUserGuidelines`, {
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
          setGuidelinesList(data.result);
        }
      })
      .catch((error) => {
        console.error("Fetch guidelines error:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load guidelines",
          life: 3000,
        });
      });
  };

  const addGuidelineApi = () => {
    if (!newGuideline.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter a guideline",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/addUserGuidelines`,
        {
          refUserGuidelinesName: [{ refUserGuidelinesName: newGuideline }],
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
          setNewGuideline("");
          listGuidelinesApi();
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
        console.error("Add guideline error:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add guideline",
          life: 3000,
        });
      });
  };

 const deleteGuidlines = (refUserGuidelinesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteUserGuidelines`,
        { refUserGuidelinesId },
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
          listGuidelinesApi(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };


  useEffect(() => {
    listGuidelinesApi();
  }, []);

  // const handleEdit = (rowData: UserGuideline) => {
  //   console.log("Edit guideline:", rowData);
  // };



  return (
    <div className="overallcontainer flex">
      <Toast ref={toast} />

      <div className="flex-1 gap-3 mt-3">
        <div className="flex flex-col">
          <label className="block mb-1 font-medium text-black" htmlFor="guideline">
            User Guideline:
          </label>
          <div className="flex gap-2">
            <InputText
              id="guideline"
              className="flex-1"
              placeholder="Enter guideline"
              value={newGuideline}
              onChange={(e) => setNewGuideline(e.target.value)}
            />
            <Button label="Add" onClick={addGuidelineApi} />
          </div>
        </div>

        <div className="flex-1 mt-3">
          <DataTable scrollable showGridlines stripedRows value={guidelinesList}>
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refUserGuidelinesName"
              header="Guideline"
              style={{ minWidth: "14rem" }}
            />
            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-5">
                  {/* <button
                    onClick={() => handleEdit(rowData)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18} color="#2563eb" />
                  </button> */}
                  <button
                    onClick={() => deleteGuidlines(rowData.refUserGuidelinesId)}
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

export default UserGuidelines;
