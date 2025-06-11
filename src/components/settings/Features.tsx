import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";


interface FeaturesResult {
  refFeaturesId: number;
  refFeaturesName: string;
}

const Features: React.FC = () => {
  const [getFeaturesResult, setGetFeaturesResult] = useState<FeaturesResult[]>(
    []
  );
  const [featureInputs, setFeatureInputs] = useState<string[]>([""]);
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  // const toast = useRef<Toast>(null);
  const listFeatures = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listFeatures`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "Appliction/json",
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
          console.log(data);
          setGetFeaturesResult(data.result);
        }
      });
  };
  useEffect(() => {
    listFeatures();
  }, []);

  const handleAddInput = () => {
    setFeatureInputs([...featureInputs, ""]);
  };

  const handleRemoveInput = (index: number) => {
    const updatedInputs = [...featureInputs];
    updatedInputs.splice(index, 1);
    setFeatureInputs(updatedInputs);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...featureInputs];
    updatedInputs[index] = value;
    setFeatureInputs(updatedInputs);
  };

  const handleAddAllFeatures = () => {
    console.log("All Features:", featureInputs);
    // Optionally: loop and call `addSportApi` for each item.
    addSportApi();
  };

  const addSportApi = () => {
    const payload = {
      refFeaturesName: featureInputs
        .filter((name) => name.trim() !== "") // remove empty entries
        .map((name) => ({ refFeaturesName: name })),
    };
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/addFeatures`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json", // ✅ Fixed typo
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data", data);
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          console.log(data);
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          listFeatures();
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
        console.error("Failed to fetch sport categories:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error,
          life: 3000,
        });
      });
  };

  const UpdateFeatures = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/updateFeatures`,
        {
          refFeaturesId: editActivityId, // Ensure correct ID is sent
          refFeaturesName: editActivityValue, // Ensure correct field name
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
          setGetFeaturesResult(
            getFeaturesResult.map((activity) =>
              activity.refFeaturesId === editActivityId
                ? { ...activity, refFeaturesName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          listFeatures();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const deleteFeatures = (refFeaturesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteFeatures`,
        { refFeaturesId },
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
          listFeatures(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const actionTemplate = (rowData: FeaturesResult) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refFeaturesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateFeatures}
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
        onClick={() => deleteFeatures(rowData.refFeaturesId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: FeaturesResult) => {
    setEditActivityId(rowData.refFeaturesId);
    setEditActivityValue(rowData.refFeaturesName);
    // setGetFeaturesResult(prev=>([...prev]))
    console.log("rowData--->", rowData.refFeaturesId);
    console.log("rowData--->", rowData.refFeaturesName);
  };
  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  return (
    <div className="overallcontainer ">
      <Toast ref={toast} />
      <div className="flex">
        <div className="flex-1 gap-3 mt-3">
          <div className="flex flex-col">
            <label
              className="block mb-1 font-medium text-black"
              htmlFor="features"
            >
              Ground Features:
            </label>
            {featureInputs.map((feature, index) => (
              <div className="flex gap-2 mb-2" key={index}>
                <InputText
                  className="flex-1"
                  placeholder="Enter Ground Feature"
                  value={feature}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                <Button icon="pi pi-plus" onClick={handleAddInput} />
                {featureInputs.length > 1 && (
                  <Button
                    icon="pi pi-times"
                    className="p-button-danger"
                    onClick={() => handleRemoveInput(index)}
                  />
                )}
              </div>
            ))}

            <div className="flex-1 justify-content-center mt-3">
              <Button label="Add" onClick={handleAddAllFeatures} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 mt-3">
          <DataTable
            cellMemo={false}
            scrollable
            showGridlines
            stripedRows
            value={getFeaturesResult}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refFeaturesName"
              header="Features Name"
              body={(rowData) =>
                editActivityId === rowData.refFeaturesId ? (
                  <InputText
                    value={editActivityValue}
                    onChange={handleActivityInputChange}
                  />
                ) : (
                  rowData.refFeaturesName
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

export default Features;
