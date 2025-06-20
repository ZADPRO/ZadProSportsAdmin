import React, { useEffect, useState, useRef } from "react";
import decrypt from "../../common/helper";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Trash2 } from "lucide-react";
import { TabPanel, TabView } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import { Button } from "primereact/button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

interface history {
  ownerReceivable: string;
  refEmailId: string;
  refGroundCustId: string;
  refGroundId: string;
  refGroundName: string;
  refMobileId: string;
  refOwnerCustId: string;
  refOwnerFname: string;
  refOwnerId: number;
  commission: string;
  retTotalAmount: string;
}

interface payoutshistory {
  ownerReceivable: string;
  payoutDate: string;
  payoutId: number;
  payoutStatus: string;
  refOwnerFname: string;
  totalCommission: string;
  totalEarnings: string;
  weekEndDate: string;
  weekStartDate: string;
}

interface owners {
  refOwnerCustId: string;
  refOwnerFname: string;
  refOwnerId: string;
  label?: string;
  value?: string;
}

const FinancePage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [listBooking, setListBooking] = useState<history[]>([]);
  const [listPayouts, setListPayouts] = useState<payoutshistory[]>([]);
  const [weekStartDate, setWeekStartDate] = useState<Nullable<Date>>(null);
  const [weekEndDate, setWeekEndDate] = useState<Nullable<Date>>(null);
  const [listOwners, setListOwners] = useState<owners[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  //   const bookingTableRef = useRef<DataTable<history[]>>(null);
  //   const payoutsTableRef = useRef<DataTable<payoutshistory[]>>(null);
  const listBookingsApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/financeRoutes/bookingList`, {
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
          setListBooking(data.earningsResult);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch booking history:", error);
      });
  };

  const listownersApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/financeRoutes/listOwners`, {
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
          const formattedOwners = data.result.map((owner: owners) => ({
            ...owner,
            label: `${owner.refOwnerFname} (${owner.refOwnerCustId})`,
            value: owner.refOwnerId,
          }));
          setListOwners(formattedOwners);
        }
      })
      .catch((error) => {
        console.error("Failed to  listOwners:", error);
      });
  };
  const listPayoutsApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/financeRoutes/listPayoutes`, {
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
        console.log("data", data);
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          setListPayouts(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch payouts:", error);
      });
  };

  // const recordBookingFinanceAPI = () => {
  //   if (!weekStartDate || !weekEndDate) {
  //     showToast("error", "false", "Please select both week start and end date");
  //     return;
  //   }

  //   setLoading(true);
  //   axios
  //     .post(
  //       `${import.meta.env.VITE_API_URL}/financeRoutes/findAmounts`,
  //       {
  //         weekStartDate: weekStartDate.toISOString(),
  //         weekEndDate: weekEndDate.toISOString(),
  //         refOwnerId: selectedOwnerId, // 👈 Include selected owner ID
  //       },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const data = decrypt(
  //         response.data[1],
  //         response.data[0],
  //         import.meta.env.VITE_ENCRYPTION_KEY
  //       );

  //       console.log("data----------->", data);
  //       if (data.success) {
  //         localStorage.setItem("JWTtoken", data.token);
  //         setListPayouts(data.insertResults.rows || []);
  //       } else {
  //         showToast(
  //           "error",
  //           "false",
  //           "The date is already selected or already paid"
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Failed to record payouts:", error);
  //     });
  // };

  const recordBookingFinanceAPI = () => {
    if (!weekStartDate || !weekEndDate) {
      showToast("error", "false", "Please select both week start and end date");
      return;
    }

    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/financeRoutes/findAmounts`,
        {
          weekStartDate: weekStartDate.toISOString(),
          weekEndDate: weekEndDate.toISOString(),
          refOwnerId: selectedOwnerId,
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

        console.log("data----------->", data);

        if (data.success) {
          localStorage.setItem("JWTtoken", data.token);

          // ✅ Just refresh the full payout list after insertion
          listPayoutsApi();
          showToast("success", "Success", "Finance recorded successfully");
        } 
        else {
             showToast("error", "Failed", data.message || "Something went wrong");

        }
      })
      .catch((error) => {
        console.error("Failed to record payouts:", error);

        let errorMessage = "Something went wrong";

        try {
          const decryptedError = decrypt(
            error.response.data[1],
            error.response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          if (decryptedError?.message) {
            errorMessage = decryptedError.message;
          }
        } catch (e) {
          console.error("Error decrypting error message:", e);
        }

        showToast("error", "Failed", errorMessage);
      });
  };

  const handleMarkAsPaid = (payoutId: number) => {
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/financeRoutes/markAsPaid`,
        { payoutId },
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
            detail: "Amount Paid Successfully",
            life: 3000,
          });
          setListPayouts((prevList) =>
            prevList.map((item) =>
              item.payoutId === payoutId
                ? { ...item, payoutStatus: "paid" }
                : item
            )
          );
          listPayoutsApi(); // ✅ re-fetch the latest data from backend
        } else {
          showToast("error", "false", "error");
        }
      })
      .catch((error) => {
        console.error("API call failed:", error);
        showToast("error", "false", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (payoutId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/financeRoutes/deletePayouts`,
        { payoutId },
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
          listPayoutsApi();
        }
      })
      .catch((error) => {
        console.error("Error deleting payout entry:", error);
      });
  };

  useEffect(() => {
    listBookingsApi();
    listPayoutsApi();
    listownersApi();
  }, []);

  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

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
    <div className="m-5">
      <h1 className="font-bold text-3xl text-black mt-4">Finance </h1>
      <Toast ref={toast} />
      <TabView>
        {/* Bookings Tab */}
        <TabPanel header="Bookings">
          <div className="flex justify-end gap-2 mb-2 mr-5">
            <Button
              icon="pi pi-file-excel"
              severity="success"
              rounded
              onClick={() => exportExcel(listPayouts, "Payouts")}
              tooltip="Excel"
            />
          </div>

          <div className="m-3 align-items-centre">
            <DataTable
              scrollable
              showGridlines
              stripedRows
              value={listBooking}
              paginator
              rows={10}
            >
              <Column
                field="sno"
                header="S.No"
                headerStyle={{ textAlign: "center" }}
                body={(_, { rowIndex }) => rowIndex + 1}
                style={{ minWidth: "5rem" }}
                className="text-center"
              />
              <Column
                field="refOwnerCustId"
                header="Owner CustId"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "10rem", textAlign: "center" }}
                className="text-center"
              />
              <Column
                field="refOwnerFname"
                header="Owner Name"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem" }}
                className="text-center"
              />
              <Column
                field="refGroundName"
                header="Ground Name"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem" }}
                className="text-center"
              />
              <Column
                field="retTotalAmount"
                header="Total Earnings"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem" }}
                className="text-center"
              />
              <Column
                field="commission"
                header="Total Commission"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem" }}
                className="text-center"
              />
              <Column
                field="ownerReceivable"
                header="Receivable Amount"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem" }}
                className="text-center"
              />
              {/* <Column
                header="Delete"
                body={() => (
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                    title="Delete"
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </button>
                )}
                style={{ minWidth: "8rem" }}
              /> */}
            </DataTable>
          </div>
        </TabPanel>

        {/* Payouts Tab */}

        <TabPanel header="Payouts">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            {/* Left side: Date pickers + Record button */}

            <div className=" flex flex-wrap items-end gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Week Start Date</label>
                <Calendar
                  value={weekStartDate}
                  placeholder="Week Start Date"
                  onChange={(e) => setWeekStartDate(e.value)}
                  showIcon
                  dateFormat="dd-mm-yy"
                  maxDate={new Date()} // 👈 Disables future dates
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Week End Date</label>
                <Calendar
                  value={weekEndDate}
                  placeholder="Week End Date"
                  onChange={(e) => setWeekEndDate(e.value)}
                  showIcon
                  dateFormat="dd-mm-yy"
                  maxDate={new Date()} // 👈 Disables future dates
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Owner</label>

                <Dropdown
                  value={selectedOwnerId}
                  options={listOwners}
                  onChange={(e) => setSelectedOwnerId(e.value)}
                  placeholder="Select Owner"
                  optionLabel="refOwnerFname"
                  optionValue="refOwnerId" // Send this to API
                  className="w-full"
                />
              </div>

              <Button onClick={recordBookingFinanceAPI} disabled={loading}>
                {loading ? "Recording..." : "Record Finance"}
              </Button>
            </div>

            {/* Right side: Export buttons */}
            <div className="flex gap-2 mr-5">
              <Button
                icon="pi pi-file-excel"
                severity="success"
                rounded
                onClick={() => exportExcel(listBooking, "Bookings")}
                tooltip="Excel"
              />
            </div>
          </div>
          <div className="m-3">
            <DataTable
              scrollable
              showGridlines
              stripedRows
              value={listPayouts}
              paginator
              rows={10}
            >
              <Column
                field="sno"
                header="S.No"
                headerStyle={{ textAlign: "center" }}
                body={(_, { rowIndex }) => rowIndex + 1}
                style={{ minWidth: "5rem", textAlign: "center" }}
              />
              <Column
                field="refOwnerFname"
                header="Owner Name"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "12rem", textAlign: "center" }}
              />
              <Column
                field="totalEarnings"
                header="Total Earnings"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "14rem", textAlign: "center" }}
              />
              <Column
                field="totalCommission"
                header="Total Commission"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "14rem", textAlign: "center" }}
              />
              <Column
                field="ownerReceivable"
                header="Receivable Amount"
                headerStyle={{ textAlign: "center" }}
                style={{ minWidth: "14rem", textAlign: "center" }}
              />
              <Column
                field="weekStartDate"
                header="Week Start Date"
                headerStyle={{ textAlign: "center" }}
                body={(rowData) => {
                  const date = new Date(rowData.weekStartDate);
                  return (
                    <span>{`${date.getDate().toString().padStart(2, "0")}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`}</span>
                  );
                }}
                style={{ minWidth: "12rem", textAlign: "center" }}
              />
              <Column
                field="weekEndDate"
                header="Week End Date"
                headerStyle={{ textAlign: "center" }}
                body={(rowData) => {
                  const date = new Date(rowData.weekEndDate);
                  return (
                    <span>{`${date.getDate().toString().padStart(2, "0")}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`}</span>
                  );
                }}
                style={{ minWidth: "12rem", textAlign: "center" }}
              />
              {/* <Column
                field="payoutStatus"
                header="Payout Status"
                body={(rowData) => {
                  const isPaid = rowData.payoutStatus === "paid";
                  const backgroundColor = isPaid ? "#22c55e" : "#fdba74";
                  return (
                    <span
                      style={{
                        backgroundColor,
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        display: "inline-block",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {rowData.payoutStatus}
                    </span>
                  );
                }}
                style={{ minWidth: "12rem", textAlign: "center" }}
              /> */}
              <Column
                field="payoutStatus"
                header="Payout Status"
                headerStyle={{ textAlign: "center" }}
                body={(rowData) => {
                  const isPaid = rowData.payoutStatus === "paid";
                  const buttonStyle: React.CSSProperties = {
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isPaid ? "default" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#fff",
                    backgroundColor: isPaid ? "#22c55e" : "#f97316", // green or orange
                    textTransform: "capitalize",
                  };

                  return (
                    <div style={{ textAlign: "center" }}>
                      <button
                        style={buttonStyle}
                        disabled={isPaid}
                        onClick={() => {
                          if (!isPaid) handleMarkAsPaid(rowData.payoutId);
                        }}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </button>
                    </div>
                  );
                }}
                style={{ minWidth: "12rem", textAlign: "center" }}
              />

              <Column
                field="payoutDate"
                header="Payout Date"
                headerStyle={{ textAlign: "center" }}
                body={(rowData) => {
                  if (!rowData.payoutDate) {
                    return (
                      <span style={{ color: "#dc2626", fontWeight: 500 }}>
                        Unpaid
                      </span>
                    ); // red colored "Unpaid"
                  }

                  const date = new Date(rowData.payoutDate);
                  const formattedDate = `${String(date.getDate()).padStart(
                    2,
                    "0"
                  )}-${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}-${date.getFullYear()}`;

                  return <span>{formattedDate}</span>;
                }}
                style={{ minWidth: "14rem", textAlign: "center" }}
              />

              <Column
                header="Delete"
                headerStyle={{ textAlign: "center" }}
                body={(rowData) => (
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                    title="Delete"
                    onClick={() => handleDeleteClick(rowData.payoutId)}
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </button>
                )}
                style={{ minWidth: "8rem", textAlign: "center" }}
              />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default FinancePage;
