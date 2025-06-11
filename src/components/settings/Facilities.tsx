import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";


interface Facility {
  refFacilitiesId: number;
  refFacilitiesName: string;
}

const Facilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  const fetchFacilities = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listFacilities`, {
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
          console.log("data.success", data);
          setFacilities(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch facilities:", error);
      });
  };

  const addFacility = () => {
    if (!newFacility.trim()) return;

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/addFacilities`,
        {
          refFacilitiesName: [{ refFacilitiesName: newFacility }],
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
        console.log(data);
        if (data.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          fetchFacilities();
          setNewFacility("");
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
          detail: "Failed to add facility",
          life: 3000,
        });
        console.error("Add facility error:", error);
      });
  };

  // const handleEdit = (rowData: Facility) => {
  //   console.log("Edit clicked", rowData);
  //   // Implement edit logic or open modal
  // };

  const deleteFacilities = (refFacilitiesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteFacilities`,
        { refFacilitiesId }, // ✅ this matches the payload structure
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
          fetchFacilities(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // update

  const UpdateFacility = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/updateFacilities`,
        {
          refFacilitiesId: editActivityId, // Ensure correct ID is sent
          refFacilitiesName: editActivityValue, // Ensure correct field name
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
          setFacilities(
            facilities.map((activity) =>
              activity.refFacilitiesId === editActivityId
                ? { ...activity, refFacilitiesName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          fetchFacilities();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const actionTemplate = (rowData: Facility) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refFacilitiesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateFacility}
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
        onClick={() => deleteFacilities(rowData.refFacilitiesId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: Facility) => {
    setEditActivityId(rowData.refFacilitiesId);
    setEditActivityValue(rowData.refFacilitiesName);
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
            htmlFor="facilityName"
          >
            Facility Name:
          </label>
          <div className="flex gap-2">
            <InputText
              id="facilityName"
              className="flex-1"
              placeholder="Enter Facility Name"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
            />
            <Button label="Add" onClick={addFacility} />
          </div>
        </div>

        <div className="flex-1 mt-3">
          <DataTable cellMemo={false} scrollable showGridlines stripedRows value={facilities}>
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refFacilitiesName"
              header="Facility Name"
              body={(rowData) =>
                editActivityId === rowData.refFacilitiesId ? (
                  <InputText
                    value={editActivityValue}
                    onChange={handleActivityInputChange}
                  />
                ) : (
                  rowData.refFacilitiesName
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

export default Facilities;
