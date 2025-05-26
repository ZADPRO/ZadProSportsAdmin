import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Pencil, Trash2 } from "lucide-react";

interface SportCategoryResult {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}
const SportCategory: React.FC = () => {
  const [getListSportCategory, setGetListSportCategory] = useState<
    SportCategoryResult[] | []
  >([]);
  // const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const listSportApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listSportCategory`, {
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
          setGetListSportCategory(data.result);
        }
      });
  };

  useEffect(() => {
    listSportApi();
  }, []);

  const [addSportCategory, setAddSportCategory] = useState<string>();
  // const [visibleRight, setVisibleRight] = useState<boolean>(false);

  const addSportApi = () => {
  
    console.log("addSportCategory?.refSportsCategoryName", addSportCategory);
    console.log(
      `${import.meta.env.VITE_API_URL}/settingRoutes/addSportCategory`,
      `${import.meta.env.VITE_API_URL}/settingRoutes/addSportCategory`
    );
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/addSportCategory`,
        {
          refSportsCategoryName: addSportCategory,
        },
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
          listSportApi();
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

  const handleEdit = (rowData: any) => {
    console.log("Edit clicked", rowData);
    // Open modal or navigate
  };

   const deleteSport = (refSportsCategoryId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/settingRoutes/deleteSportCategory`,
        { refSportsCategoryId },
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
          listSportApi(); // Refresh list after delete
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
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="sportname"
          >
            Sport Name:
          </label>
          <div className="flex gap-2">
            <InputText
              id="sportname"
              className="flex-1"
              placeholder="Enter Sport Name"
              value={addSportCategory}
              onChange={(e) => setAddSportCategory(e.target.value)}
            />
            <Button label="Add" onClick={addSportApi} />
          </div>
        </div>

        <div className="flex-1 mt-3">
          {/* <DataTable
            scrollable
            showGridlines
            stripedRows
            value={getListSportCategory}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refSportsCategoryName"
              header="Sport Name"
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
                  {rowData.refSportsCategoryName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            >
              <Column
                header="Actions"
                body={(rowData) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(rowData)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rowData)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
            value={getListSportCategory}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
            />
            <Column
              field="refSportsCategoryName"
              header="Sport Name"
              body={(rowData) => (
                <span
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  {rowData.refSportsCategoryName}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            {/* ✅ Move this OUTSIDE the above Column */}
            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-5">
                  <button
                    onClick={() => handleEdit(rowData)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18}  color="#2563eb" />
                  </button>
                  <button
                    onClick={() => deleteSport(rowData.refSportsCategoryId)}
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

export default SportCategory;
