import React, { useEffect, useState } from "react";
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
  totalCommission: string;
  totalEarnings: string;
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

const FinancePage: React.FC = () => {
  const [listBooking, setListBooking] = useState<history[]>([]);
  const [listPayouts, setListPayouts] = useState<payoutshistory[]>([]);
  const [weekStartDate, setWeekStartDate] = useState<Nullable<Date>>(null);
  const [weekEndDate, setWeekEndDate] = useState<Nullable<Date>>(null);
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
        localStorage.setItem("JWTtoken", data.token);
        if (data.success) {
          setListPayouts(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch payouts:", error);
      });
  };

  const recordBookingFinanceAPI = () => {
    if (!weekStartDate || !weekEndDate) {
      alert("Please select both week start and end date");
      return;
    }

    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/financeRoutes/recordBookingFinance`,
        {
          weekStartDate: weekStartDate.toISOString(),
          weekEndDate: weekEndDate.toISOString(),
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
        console.log("data", data);
        if (data.success) {
          setListPayouts(data.insertResults.rows || []);
        } else {
          alert("Something went wrong.");
        }
      })
      .catch((error) => {
        console.error("Failed to record payouts:", error);
        alert("API call failed.");
      })
      .finally(() => setLoading(false));
  };

  const handleMarkAsPaid = (payoutId: number) => {
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/financeRoutes/getWeeklyPayouts`,
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
          setListPayouts((prevList) =>
            prevList.map((item) =>
              item.payoutId === payoutId
                ? { ...item, payoutStatus: "paid" }
                : item
            )
          );
        } else {
          alert("Failed to update payout.");
        }
      })
      .catch((error) => {
        console.error("API call failed:", error);
        alert("Something went wrong.");
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
    <div className="m-5">
      <h1 className="font-bold text-3xl text-black mt-4">Finance </h1>
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

          <div className="m-3">
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
                body={(_, { rowIndex }) => rowIndex + 1}
                style={{ minWidth: "5rem" }}
              />
              <Column
                field="refOwnerCustId"
                header="Owner CustId"
                style={{ minWidth: "10rem", textAlign: "center" }}
              />
              <Column
                field="refOwnerFname"
                header="Owner Name"
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="refGroundName"
                header="Ground Name"
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="totalEarnings"
                header="Total Earnings"
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="totalCommission"
                header="Total Commission"
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="ownerReceivable"
                header="Receivable Amount"
                style={{ minWidth: "12rem" }}
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
                  onChange={(e) => setWeekStartDate(e.value)}
                  showIcon
                  dateFormat="dd-mm-yy"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Week End Date</label>
                <Calendar
                  value={weekEndDate}
                  onChange={(e) => setWeekEndDate(e.value)}
                  showIcon
                  dateFormat="dd-mm-yy"
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
                body={(_, { rowIndex }) => rowIndex + 1}
                style={{ minWidth: "5rem" }}
              />
              <Column
                field="refOwnerFname"
                header="Owner Name"
                style={{ minWidth: "12rem", textAlign: "center" }}
              />
              <Column
                field="totalEarnings"
                header="Total Earnings"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="totalCommission"
                header="Total Commission"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="ownerReceivable"
                header="Receivable Amount"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="weekStartDate"
                header="Week Start Date"
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
                headerStyle={{ textAlign: "center" }}
              />

              <Column
                header="Delete"
                body={(rowData) => (
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full"
                    title="Delete"
                    onClick={() => handleDeleteClick(rowData.payoutId)}
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </button>
                )}
                style={{ minWidth: "8rem" }}
              />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default FinancePage;
