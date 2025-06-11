import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
// import GroundSidebar from "../../components/ground sidebar/GroundSidebar";
import { Trash2 } from "lucide-react";
// import EditGroundSidebar from "../../components/ground sidebar/EditGroundSidebar";
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

  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [groundupdateID, setgroundupdateID] = useState("");
  const [groundupdatesidebar, setGroundupdatesidebar] = useState(false);

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

  // const handleClick = (index: number) => {
  //   setSidebarForEditData({
  //     visible: true,
  //     index: index,
  //   });
  // };

  const handleClick = async (GroundId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/groundRoutes/getGround`,
        { refGroundId: GroundId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", data.token);

      if (data.success) {
        console.log("Fetched data:", data);
        // Set any state from `data` if needed here

        // ✅ Show the sidebar now
        setGroundupdatesidebar(true);
      } else {
        setError("Failed to fetch ground details.");
      }
    } catch (err) {
      setError("Error fetching ground details.");
    } finally {
      setLoading(false);
    }
  };


  // const handleClick = async (GroundId: string) => {
  //   setLoading(true);
  //   setError(null);
  //   console.log("local storage token", localStorage.getItem("JWTtoken"));
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/groundRoutes/getGround`,
  //       { refGroundId: GroundId },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     localStorage.setItem("JWTtoken", data.token);

  //     if (data.success) {
  //       localStorage.setItem("JWTtoken", data.token);
  //       console.log("data", data);
  //       // Handle success case if needed
  //     } else {
  //       setError("Failed to fetch package details.");
  //     }
  //   } catch (err) {
  //     setError("Error fetching package details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const approveGround = async (
    refGroundId: number | string,
    currentStatus: "Approved" | "Rejected" | "Pending"
  ) => {
    const newStatus = currentStatus === "Approved" ? "Rejected" : "Approved";

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/approveGround`,
        { refGroundId, status: newStatus },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(`Ground status changed to: ${newStatus}`);
        listGroundApi(); // refresh the table data after update
      } else {
        console.error("API error:", response.data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

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
        {/* <Button label="Add New Ground" onClick={() => setVisibleRight(true)} /> */}
      </div>

      <DataTable
        scrollable
        showGridlines
        paginator
        rows={10}
        // rowsPerPageOptions={[5, 10, 25, 50]}
        value={getListGroundApi}
        tableStyle={{ margin: "10px" }}
      >
        <Column
          field="sno"
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
        />
        {/* <Column
          field="refGroundName"
          header="Ground Name"
          // filter
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
        ></Column> */}

        <Column
          className="underline text-[#0a5c9c] cursor-pointer"
          field="refGroundName"
          header="Ground Name"
          sortable
          frozen
          body={(rowData) => {
            const actualGroundId =
              typeof rowData.refGroundId === "object"
                ? rowData.refGroundId.refGroundId
                : rowData.refGroundId;

            return (
              <div
                onClick={() => {
                  setgroundupdateID(actualGroundId);
                  handleClick(actualGroundId); // This fetches data
                  setVisibleRight(true); // This opens the sidebar
                }}
              >
                {rowData.refGroundName}
              </div>
            );
          }}
          style={{ minWidth: "14rem" }}
        ></Column>

        {/* <Column
          className="underline text-[#0a5c9c] cursor-pointer"
          field="refGroundName"
          header="Ground Name"
          sortable
          frozen
          body={(rowData) => {
            console.log("rowData -->", rowData);
            return (
              <div
                onClick={() => {
                  console.log("rowData.refGroundId", rowData.refGroundId);
                  setgroundupdateID(rowData.refGroundId);
                  setGroundupdatesidebar(true);
                  handleClick(rowData.refGroundId);
                }}
              >
                {rowData.refGroundName}
              </div>
            );
          }}
          style={{ minWidth: "14rem" }}
        ></Column> */}

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
          field="refDescription"
          header="Description"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          header="Action"
          body={(rowData) => {
            const currentStatus = rowData.approveGround ?? "Pending"; // default to "Pending"
            const nextStatus =
              currentStatus === "Approved" ? "Rejected" : "Approved";

            // Button label color based on current status
            const buttonClass =
              currentStatus === "Approved"
                ? "p-button-warning"
                : currentStatus === "Rejected"
                ? "p-button-success"
                : "p-button-info";

            const buttonLabel =
              currentStatus === "Approved"
                ? "Reject"
                : currentStatus === "Rejected"
                ? "Approve"
                : "Approve";

            return (
              <div className="flex gap-2">
                <button
                  className={`p-button p-button-sm font-medium ${buttonClass}`}
                  onClick={() =>
                    approveGround(rowData.refGroundId, currentStatus)
                  }
                >
                  {buttonLabel}
                </button>
              </div>
            );
          }}
          style={{ minWidth: "10rem" }}
        />

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
        {/* <GroundSidebar onSuccess={handleEditSuccess} /> */}
      </Sidebar>

   

      {/* <Sidebar
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
       */}
      <Toast ref={toast} />
    </div>
  );
};

export default Ground;
