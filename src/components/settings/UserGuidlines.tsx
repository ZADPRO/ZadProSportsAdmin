import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

interface UserGuideline {
  refUserGuidelinesName: string;
  refUserGuidelinesId: number;
}

const UserGuidelines: React.FC = () => {
  const [guidelinesList, setGuidelinesList] = useState<UserGuideline[]>([]);
  const [newGuideline, setNewGuideline] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

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

  const deleteGuidelines = (refUserGuidelinesId: number) => {
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
          toast.current?.show({
            severity: "success",
            summary: "Deleted",
            detail: data.message,
            life: 3000,
          });
          listGuidelinesApi();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const updateGuidelines = () => {
    if (!editActivityId || !editActivityValue.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter a valid guideline to update",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/updateUserGuidelines`,
        {
          refUserGuidelinesId: editActivityId,
          refUserGuidelinesName: editActivityValue,
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
            summary: "Updated",
            detail: data.message,
            life: 3000,
          });
          setEditActivityId(null);
          setEditActivityValue("");
          listGuidelinesApi();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Update Failed",
            detail: data.error || "Unknown error",
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update guideline",
          life: 3000,
        });
      });
  };

  const handleEditActivityClick = (rowData: UserGuideline) => {
    setEditActivityId(rowData.refUserGuidelinesId);
    setEditActivityValue(rowData.refUserGuidelinesName);
  };

  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  const actionTemplate = (rowData: UserGuideline) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refUserGuidelinesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={updateGuidelines}
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
        onClick={() => deleteGuidelines(rowData.refUserGuidelinesId)}
      />
    </div>
  );

  useEffect(() => {
    listGuidelinesApi();
  }, []);

  return (
    <div className="overallcontainer flex">
      <Toast ref={toast} />

      <div className="flex-1 gap-3 mt-3">
        <div className="flex flex-col">
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="guideline"
          >
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
          <DataTable
            cellMemo={false}
            scrollable
            showGridlines
            stripedRows
            value={guidelinesList}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refUserGuidelinesName"
              header="Guidelines Name"
              body={(rowData) =>
                editActivityId === rowData.refUserGuidelinesId ? (
                  <InputText
                    value={editActivityValue}
                    onChange={handleActivityInputChange}
                  />
                ) : (
                  rowData.refUserGuidelinesName
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

export default UserGuidelines;
