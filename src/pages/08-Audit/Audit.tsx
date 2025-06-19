import axios from "axios";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState ,useRef} from "react";
import decrypt from "../../common/helper";
import { Trash2 } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface groundAudit {
  refTransData: string;
  refTransactionType: string;
  refUserFname: string;
  updatedAt: string;
}

const Auditpage: React.FC = () => {
  const [groundAudit, setGroundAudit] = useState<groundAudit[]>([]);
  const [audit, setAudit] = useState<groundAudit[]>([]);
  const [listOwnerAudit, setListOwnerAuditApi] = useState<groundAudit[]>([]);
  const toast = useRef<Toast>(null);

  const listGroundAuditApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/adminRoutes/ownerAudit`, {
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
        console.log("data", data);
        if (data.success) {
          setGroundAudit(data.groundAudit);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch ground history:", error);
      });
  };

  const listOwnerAuditApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/adminRoutes/ownerAudit`, {
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
        console.log("data", data);
        if (data.success) {
          setListOwnerAuditApi(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch owner history:", error);
      });
  };

  const listOverallAuditApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/adminRoutes/listOverallAudit`, {
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
        console.log("data", data);
        if (data.success) {
          setAudit(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch owner history:", error);
      });
  };

  const handleDeleteClick = (
    refTxnHistoryId: number,
    type: "ground" | "owner" | "overall"
  ) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/deleteAudit`,
        { refTxnHistoryId },
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
            detail: "Deleted successfully!",
            life: 3000,
          });
          // Refresh correct list
          //  based on type
          if (type === "ground") {
            listGroundAuditApi();
          } else if (type === "owner") {
            listOwnerAuditApi();
          } else if (type === "overall") {
            listOverallAuditApi();
          }
        }
      })
      .catch((error) => {
        console.error("Error deleting audit entry:", error);
      });
  };

  useEffect(() => {
    listGroundAuditApi();
    listOwnerAuditApi();
    listOverallAuditApi();
  }, []);

  const exportExcel = (data: object[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}_${Date.now()}.xlsx`);
  };

  return (
    <div className="container m-3 gap-3">
        <Toast ref={toast} />
      <h1 className="text-2xl font-bold mb-2">Audit Page</h1>
      <TabView>

        <TabPanel header="Ground Audit">
          <div className="flex justify-end gap-2 mb-2 mr-5">
            <Button
              icon="pi pi-file-excel"
              severity="success"
              rounded
              onClick={() => exportExcel(groundAudit, "groundAudit")}
              tooltip="Excel"
            />
          </div>
          <DataTable
            scrollable
            showGridlines
            stripedRows
            value={groundAudit}
            paginator
            rows={10}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="refTransactionType"
              header="Transaction Type"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="refTransData"
              header="TransData"
              style={{ minWidth: "10rem", textAlign: "center" }}
            />

            <Column
              field="refUserFname"
              header="Updated By"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="updatedAt"
              header="updated At"
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="Delete"
              body={(rowData) => (
                <button
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                  title="Delete"
                  onClick={() =>
                    handleDeleteClick(rowData.refTxnHistoryId, "ground")
                  }
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              )}
              style={{ minWidth: "6rem" }}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Owner Audit">
          <div className="flex justify-end gap-2 mb-2 mr-5">
            <Button
              icon="pi pi-file-excel"
              severity="success"
              rounded
              onClick={() => exportExcel(listOwnerAudit, "OwnerAudit")}
              tooltip="Excel"
            />
          </div>
          <DataTable
            scrollable
            showGridlines
            stripedRows
            value={listOwnerAudit}
            paginator
            rows={10}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="refTransactionType"
              header="Transaction Type"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="refTransData"
              header="TransData"
              style={{ minWidth: "10rem", textAlign: "center" }}
            />

            <Column
              field="refUserFname"
              header="Updated By"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="updatedAt"
              header="updated At"
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="Delete"
              body={(rowData) => (
                <button
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                  title="Delete"
                  onClick={() =>
                    handleDeleteClick(rowData.refTxnHistoryId, "owner")
                  }
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              )}
              style={{ minWidth: "6rem" }}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Overall Audit">
          <div className="flex justify-end gap-2 mb-2 mr-5">
            <Button
              icon="pi pi-file-excel"
              severity="success"
              rounded
              onClick={() => exportExcel(audit, "overallAudit")}
              tooltip="Excel"
            />
          </div>
          <DataTable
            scrollable
            showGridlines
            stripedRows
            value={audit}
            paginator
            rows={10}
          >
            <Column
              field="sno"
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="refTransactionType"
              header="Transaction Type"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="refTransData"
              header="TransData"
              style={{ minWidth: "10rem", textAlign: "center" }}
            />

            <Column
              field="refUserFname"
              header="Updated By"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="updatedAt"
              header="updated At"
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="Delete"
              body={(rowData) => (
                <button
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                  title="Delete"
                  onClick={() =>
                    handleDeleteClick(rowData.refTxnHistoryId, "overall")
                  }
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              )}
              style={{ minWidth: "6rem" }}
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Auditpage;
