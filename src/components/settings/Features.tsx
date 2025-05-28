import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Trash2 } from "lucide-react";

interface FeaturesResult {
  refFeaturesId: number;
  refFeaturesName: string;
}

const Features: React.FC = () => {
  const [getFeaturesResult, setGetFeaturesResult] = useState<
    FeaturesResult[] | []
  >([]);
  const [featureInputs, setFeatureInputs] = useState<string[]>([""]);

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
  //   const [addFeatures, setAddFeatures] = useState<string>();
  // const handleEdit = (rowData: any) => {
  //   console.log("Edit clicked", rowData);
  //   // Open modal or navigate
  // };

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
          {/* <DataTable
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
              body={(rowData) => (
                <span
                  // onClick={() =>
                  //    handleClick(rowData)
                  //   }
                  style={{
                    cursor: "pointer",
                    color: " black",
                    // textDecoration: "underline",
                  }}
                >
                  {rowData.refFeaturesName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            >
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
                      onClick={() => handleDelete(rowData)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                      title="Delete"
                    >
                      <Trash2 size={18} color="#dc2626" />
                    </button>
                  </div>
                )}
                style={{ minWidth: "8rem" }}
              />
            </Column>
          </DataTable> */}
          <DataTable
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
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refFeaturesName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-3">
                  {/* <button
                    onClick={() => handleEdit(rowData)}
                    className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18} color="#2563eb" />
                  </button> */}
                  <button
                    onClick={() => deleteFeatures(rowData.refFeaturesId)}
                    className="bg-red-100 hover:bg-red-200 p-2 rounded-full"
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

export default Features;
