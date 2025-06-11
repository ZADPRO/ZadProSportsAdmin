import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import GroundSidebar from "../../components/ground sidebar/GroundSidebar";
import { Trash2 } from "lucide-react";
import EditGroundSidebar from "../../components/ground sidebar/EditGroundSidebar";
import { Toast } from "primereact/toast";

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
  const [sidebarForEditData, setSidebarForEditData] = useState<{
    visible: boolean;
    index: number | null;
  }>({
    visible: false,
    index: null,
  });

  const toast = useRef<Toast>(null);

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
          // console.log(data);
          setGetListGroundApi(data.result);
        }
      });
  };

  const handleClick = (index: number) => {
    setSidebarForEditData({
      visible: true,
      index: index,
    });
  };

  useEffect(() => {
    listGroundApi();
  }, []);

  const handleEditSuccess = () => {
    setSidebarForEditData({ visible: false, index: null }); // close sidebar
    setVisibleRight(false); // close modal)
    listGroundApi(); // refetch or run any function
  };

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
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Deleted successfully!",
            life: 3000,
          });
          listGroundApi(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  console.log(getListGroundApi);

  return (
    <div>
      {/* <Button label="Add New Groud" onClick={() => setVisibleRight(true)} /> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <h1 className="font-bold text-3xl text-black mt-4">Grounds</h1>
        <Button label="Add New Ground" onClick={() => setVisibleRight(true)} />
      </div>

      <DataTable
        scrollable
        showGridlines
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
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
          body={(rowData, options) => (
            <span
              onClick={() => handleClick(options.rowIndex)}
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
        {/* <Column
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
        ></Column> */}
        <Column
          field="refDescription"
          header="Description"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          header="Delete"
          body={(rowData) => (
            <div className="flex gap-5">
              <button
                className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full cursor-pointer"
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
        style={{ width: "60%" }}
      >
        <GroundSidebar onSuccess={handleEditSuccess} />
      </Sidebar>

      <Sidebar
        visible={sidebarForEditData.visible}
        onHide={() => setSidebarForEditData({ visible: false, index: null })}
        position="right"
        style={{ width: "60%" }}
      >
        {typeof sidebarForEditData.index === "number" &&
          getListGroundApi[sidebarForEditData.index] && (
            <EditGroundSidebar
              groundData={getListGroundApi[sidebarForEditData.index]}
              onSuccess={handleEditSuccess} // <<< pass the callback here
            />
          )}
      </Sidebar>
      <Toast ref={toast} />
    </div>
  );
};

export default Ground;
