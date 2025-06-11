import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";


interface Tip {
  refAdditionalTipsId: number;
  refAdditionalTipsName: string;
}

const AdditionalTips: React.FC = () => {
  const [tipsList, setTipsList] = useState<Tip[]>([]);
  const [tipInput, setTipInput] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

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

  // const handleEdit = (rowData: Tip) => {
  //   console.log("Edit clicked", rowData);
  //   // Implement edit logic here
  // };

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

  // update Tips
  const UpdateTips = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/updateAdditionalTips`,
        {
          refAdditionalTipsId: editActivityId, // Ensure correct ID is sent
          refAdditionalTipsName: editActivityValue, // Ensure correct field name
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
          setTipsList(
            tipsList.map((activity) =>
              activity.refAdditionalTipsId === editActivityId
                ? { ...activity, refAdditionalTipsName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          fetchTips();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const actionTemplate = (rowData: Tip) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refAdditionalTipsId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateTips}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditActivityClick(rowData)}
        />
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteTips(rowData.refAdditionalTipsId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: Tip) => {
    setEditActivityId(rowData.refAdditionalTipsId);
    setEditActivityValue(rowData.refAdditionalTipsName);
  };
  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  return (
    <div className="overallcontainer flex">
      <Toast ref={toast} />
      <div className="flex-1 gap-3 mt-3">
        <div className="flex flex-col">
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="tipname"
          >
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
          <DataTable
            cellMemo={false}
            scrollable
            showGridlines
            stripedRows
            value={tipsList}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refAdditionalTipsName"
              header="Features Name"
              body={(rowData) =>
                editActivityId === rowData.refAdditionalTipsId ? (
                  <InputText
                    value={editActivityValue}
                    onChange={handleActivityInputChange}
                  />
                ) : (
                  rowData.refAdditionalTipsName
                )
              }
            />

            <Column body={actionTemplate} header="Actions" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AdditionalTips;
