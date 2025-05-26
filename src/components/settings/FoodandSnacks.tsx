import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Pencil, Trash2 } from "lucide-react";
import { InputText } from "primereact/inputtext";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";

interface FoodItem {
  refFoodAndSnacksId?: number;
  refFoodName?: string;
  refFoodImage?: string;
  refPrice?: string;
  refQuantity?: string;
  refFoodCategory?: string;
}

interface FoodCategory {
  refFoodCategoryId: number;
  refFoodCategory: string;
}

interface option {
  label: string;
  value: number;
}

const FoodandSnacks: React.FC = () => {
  const [getFoodandSnacks, setGetFoodandSnacks] = useState<FoodItem[]>([]);

  const listFoodandSnacks = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listFoodAndSnacks`, {
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
          console.log("data", data);
          setGetFoodandSnacks(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch foods:", error);
      });
  };

  const [getFoodCategory, setGetFoodCategory] = useState<FoodCategory[]>([]);
  const [option, setOption] = useState<option[]>([]);

  const listFoodCategory = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listFoodCategory`, {
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
        if (data.success) {
          console.log(data);
          localStorage.setItem("JWTtoken", data.token);

          setGetFoodCategory(data.result);
          const datas: option[] = data.result.map((data: any) => ({
            label: data.refFoodCategory,
            value: data.refFoodCategoryId,
          }));
          setOption(datas);
        }
      });
  };

  const deleteFoodAndSnacks = (refFoodAndSnacksId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteFoodAndSnacks`,
        { refFoodAndSnacksId },
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
          listFoodandSnacks(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  useEffect(() => {
    listFoodandSnacks();
    listFoodCategory();
  }, []);

  return (
    <div className="overallcontainer ">
      <div className="addfoods flex gap-4">
        {/* Food Name */}
        <div className="flex-1">
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="FoodName"
          >
            Food Name:
          </label>
          <InputText
            id="FoodName"
            className="w-full"
            placeholder="Enter Food Name"
            // value={newFacility}
            // onChange={(e) => setNewFacility(e.target.value)}
          />
        </div>

        {/* Food Price */}
        <div className="flex-1">
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="FoodPrice"
          >
            Food Price:
          </label>
          <InputText
            id="FoodPrice"
            className="w-full"
            placeholder="Enter Food Price"
            // value={newFacility}
            // onChange={(e) => setNewFacility(e.target.value)}
          />
        </div>
      </div>

      <div className="addfoods flex gap-4">
        {/* Food Name */}
        <div className="flex-1">
          <label
            className="block mb-1 font-medium text-black mt-3"
            htmlFor="quantity"
          >
            Food Quantity:
          </label>
          <InputText
            id="quantity"
            className="w-full "
            placeholder="Enter quantity Name"
            // value={newFacility}
            // onChange={(e) => setNewFacility(e.target.value)}
          />
        </div>

        {/* Food Price */}
        <div className="flex-1">
          <label
            className="block mb-1 font-medium text-black mt-3"
            htmlFor="category"
          >
            Food category:
          </label>
          <MultiSelect
            value={getFoodCategory}
            onChange={(e: MultiSelectChangeEvent) => {
              setGetFoodCategory(e.value);
              console.log("e.value", e.value);
            }}
            options={option}
            optionLabel="label"
            id="groundFeatures"
            placeholder="Select Food category"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
        </div>
      </div>
      <div className="card">
        <FileUpload
          name="Image"
          url={`${import.meta.env.VITE_API_URL}/settingRoutes/uploadFoodImage`}
          multiple
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Drag and drop files to here to upload.</p>
          }
        />
      </div>

      <div className="card flex justify-content-center mt-3">
        <Button
          label="Add"
          //  onClick={addFacility}
        />
      </div>
      <div className="listfoods flex">
        <div className="flex-1 gap-3 mt-3">
          <DataTable
            scrollable
            showGridlines
            stripedRows
            value={getFoodandSnacks}
            className="p-mt-4"
            paginator
            rows={5}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refFoodName"
              header="Food Name"
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refFoodName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="refPrice"
              header="Price"
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refPrice}
                </span>
              )}
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="refQuantity"
              header="Quantity"
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refQuantity}
                </span>
              )}
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="foodCategoryName"
              header="Category"
              body={(rowData) => (
                <span style={{ cursor: "pointer", color: "black" }}>
                  {rowData.refFoodCategory}
                </span>
              )}
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="refFoodImagePath"
              header="Image"
              body={(rowData) => (
                <img
                  src={rowData.refFoodImagePath}
                  alt="Food"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              style={{ minWidth: "7rem" }}
            />

            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-5">
                  <button
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18} color="#2563eb" />
                  </button>
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                    title="Delete"
                    onClick={() =>
                      deleteFoodAndSnacks(rowData.refFoodAndSnacksId)
                    }
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

export default FoodandSnacks;
