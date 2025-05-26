import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import GroundSidebar from "../../components/ground sidebar/GroundSidebar";
import { Trash2 } from "lucide-react";

interface GroundResult {
  refGroundId: number;
  refGroundName: string;
  refGroundCustId: string;
  isRoomAvailable: boolean;
  refRoomImage: string;
  refFeaturesId: string; // stored as PostgreSQL array string, e.g. "{1,2}"
  refUserGuidelinesId: string;
  refAdditionalTipsId: string;
  refSportsCategoryId: string;
  refFacilitiesId: string;
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  refStatus: boolean;
  refFeaturesName: string[];
  refFacilitiesName: string[];
  refUserGuidelinesName: string[];
  refAdditionalTipsName: string[];
  refSportsCategoryName: string[];
}

const Ground: React.FC = () => {
  const [getListGroundApi, setGetListGroundApi] = useState<GroundResult[] | []>(
    []
  );
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [sidebarForEditData, setSidebarForEditData] = useState<boolean>(false);

  const listGroundApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/groundRoutes/listGround`, {
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
          setGetListGroundApi(data.result);
        }
      });
  };

  const handleClick = (rowData: any) => {
    console.log("rowData", rowData);
    setSidebarForEditData(true);
  };

  useEffect(() => {
    listGroundApi();
  }, []);

  const deleteGround = (refGroundId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/groundRoutes/deleteGround`,
        { refGroundId },
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
          listGroundApi(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  return (
    <div>
      {/* <Button label="Add New Groud" onClick={() => setVisibleRight(true)} /> */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}
      >
        <Button label="Add New Ground" onClick={() => setVisibleRight(true)} />
      </div>

      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={getListGroundApi}
        tableStyle={{ margin: "10px" }}
      >
        <Column
          field="sno"
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
        />
        <Column
          field="refGroundName"
          header="Ground Name"
          filter
          sortable
          frozen
          body={(rowData) => (
            <span
              onClick={() => handleClick(rowData)}
              style={{
                cursor: "pointer",
                color: "#007ad9",
                textDecoration: "underline",
              }}
            >
              {rowData.refGroundName}
            </span>
          )}
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="refGroundCustId"
          header="Ground Cust Id"
          frozen
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="refGroundPrice"
          header="Ground Price"
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="refGroundLocation"
          header="Ground Location"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="refSportsCategoryName"
          header="Sports Category"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="refFeaturesName"
          header="Features"
          style={{ minWidth: "18rem" }}
        ></Column>
        <Column
          field="refUserGuidelinesName"
          header="User Guidelines"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          field="refAdditionalTipsName"
          header="Additional Tips"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          header="Delete"
          body={(rowData) => (
            <div className="flex gap-5">
              <button
                className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                title="Delete"
                onClick={() => deleteGround(rowData.refGroundId)}
              >
                <Trash2 size={18} color="#dc2626" />
              </button>
            </div>
          )}
          style={{ minWidth: "8rem" }}
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
        style={{ width: "50%" }}
      >
        <GroundSidebar />
      </Sidebar>
    </div>
  );
};

export default Ground;
