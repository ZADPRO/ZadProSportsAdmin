import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import decrypt from "../../common/helper";
import { Trash2 } from "lucide-react";

interface GroundBooking {
  refUserBookingId: number;
  refUserFname: string;
  refEmail: string;
  refMobileNumber: string;
  refGroundName: string;
  refBookingStartDate: string;
  refBookingEndDate: string;
  refNoOfPersons?: number;
  refBookingAmount?: string;
  refCGSTAmount?: string;
  refSGSTAmount?: string;
  retTotalAmount?: string;
  refAddOns?: {
    refAddOnsId: number;
    refLabel?: string;
    selectedDates: string[];
    refPersonCount: number;
    isSubaddonNeeded: boolean;
    refSubaddons: {
      refSubaddonId: number;
      refSubaddonLabel?: string;
      isItemsNeeded: boolean;
      refItems: {
        refItemsId: number;
        refItemsLabel?: { refItemsLabel: string }[];
        refItemsPrice?: { refItemsPrice: number }[];
      }[];
      refSubaddonprice?: number;
    }[];
    refPrice?: number;
  }[];
}

function getDatesInRange(fromDate: any, toDate: any) {
  const result = [];
  const currentDate = new Date(fromDate);
  const endDate = new Date(toDate);

  while (currentDate <= endDate) {
    const formattedDate = currentDate
      .toLocaleDateString("en-GB") // DD/MM/YYYY
      .split("/")
      .join("-"); // Convert to DD-MM-YYYY
    result.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

function groupDatesByMonth(dates: any) {
  const groups: any = {};

  console.log(dates);

  if (dates) {
    dates.forEach((dateStr: any) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [day, month, year] = dateStr.split("-");
        const jsDate = new Date(`${year}-${month}-${day}`);
        const monthName = jsDate.toLocaleString("default", {
          month: "short",
        });
        if (!groups[monthName]) groups[monthName] = [];
        groups[monthName].push(day);
      }
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a: any, b: any) => a - b);
    });

    return groups;
  } else {
    return groups;
  }
}

function getInclusiveDayCount(fromDateStr: any, toDateStr: any) {
  const fromDate: any = new Date(fromDateStr);
  const toDate: any = new Date(toDateStr);

  // Get the time difference in milliseconds
  const diffTime = toDate - fromDate;

  // Convert milliseconds to days and add 1 to include both start and end dates
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
}

const Booking: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedBooking, setSelectedBooking]: any =
    useState<GroundBooking | null>(null);
  const [selectedData, setSelectedData]: any = useState(null);
  const [bookingData, setBookingData]: any = useState<GroundBooking[]>([]);

  const fetchBookingList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/adminRoutes/listUserBookings`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );
      const decryptedData = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("JWTtoken", decryptedData.token);
      console.log(decryptedData);
      // if (Array.isArray(decryptedData)) {
      setBookingData(decryptedData);
      // }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const handleDeleteClick = (refUserBookingId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/deleteBookings`,
        { refUserBookingId },
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
        console.log('data', data)
        localStorage.setItem("JWTtoken", data.token);

        if (data.success) {
          fetchBookingList();
        }
      })
      .catch((error) => {
        console.error("Error deleting payout entry:", error);
      });
  };

  useEffect(() => {
    fetchBookingList();
  }, []);

  const openSidebar = (booking: any) => {
    setSelectedBooking(bookingData.parsedPayloadArray[booking]);
    setSelectedData(bookingData.result[booking]);
    console.log(bookingData.parsedPayloadArray[booking]);
    setVisible(true);
  };

  const renderSidebarContent = () => {
    return (
      <div className="p-4 text-sm">
        {selectedBooking && (
          <>
            <div className="ion-padding" slot="content">
              <div className="w-[100%]">
                <div className="w-[100%] flex justify-between text-[0.8rem] font-[poppins]">
                  <div
                    style={{
                      fontWeight: "bold",
                      fontStyle: "",
                      color: "",
                      fontSize: "16px",
                    }}
                  >
                    Booked Date (
                    {getInclusiveDayCount(
                      selectedBooking.refBookingStartDate
                        .split("-")
                        .reverse()
                        .join("-"),
                      selectedBooking.refBookingEndDate
                        .split("-")
                        .reverse()
                        .join("-")
                    )}{" "}
                    x{" "}
                    {parseInt(selectedData.refBookingAmount) /
                      getInclusiveDayCount(
                        selectedBooking.refBookingStartDate
                          .split("-")
                          .reverse()
                          .join("-"),
                        selectedBooking.refBookingEndDate
                          .split("-")
                          .reverse()
                          .join("-")
                      )}{" "}
                    = {selectedData.refBookingAmount})
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontStyle: "",
                      fontSize: "15px",
                    }}
                  >
                    {selectedData.createdAt
                      .split(" ")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </div>
                </div>
                <div
                  className={`mt-[10px] flex justify-between  fontSize: '15px' pb-[10px] text-[0.8rem] font-[poppins] ${
                    (selectedBooking.payload?.refAddOns || []).length > 0
                      ? "border-b-[1px]"
                      : ""
                  }`}
                >
                  <div style={{ fontSize: "15px" }}>
                    {Object.entries(
                      groupDatesByMonth(
                        getDatesInRange(
                          selectedBooking.refBookingStartDate
                            .split("-")
                            .reverse()
                            .join("-"),
                          selectedBooking.refBookingEndDate
                            .split("-")
                            .reverse()
                            .join("-")
                        )
                      )
                    ).map(([month, days]) => (
                      <div key={month}>
                        {month} {(days as string[]).join(", ")}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-[#ecfdf3] text-[#027a48] font-[600] rounded-[10px] px-[10px] text-[0.8rem]">
                      Paid ₹{" "}
                      {parseFloat(selectedData.retTotalAmount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Display Addons from payload */}
                {selectedBooking?.refAddOns?.length > 0 && (
                  <div className="mt-[10px] text-[0.9rem] font-[500]">
                    Addons
                  </div>
                )}

                {selectedBooking?.refAddOns?.map(
                  (addon: any, addonIndex: number) => (
                    <div key={addonIndex} className="mb-[15px]">
                      <div className="w-[100%] py-[10px] border-b-[1px] flex justify-between color-[black] font-[poppins]">
                        <div className="font-[600] py-[1px] flex-1">
                          <div className="font-[600] text-[0.875rem] mb-[5px]">
                            {addon.refLabel}
                            {!addon.refSubaddons?.some(
                              (s: any) => s.isItemsNeeded
                            ) && (
                              <>
                                {" "}
                                ({addon.selectedDates?.length || 0} days × ₹
                                {addon.refPrice || 0} ×{" "}
                                {addon.refPersonCount || 1} person)
                              </>
                            )}
                          </div>

                          {/* Show all Subaddons */}
                          <div className="ml-[10px]  mt-[8px] fontSize: '15px'">
                            {addon.refSubaddons?.map(
                              (subaddon: any, subIndex: number) => {
                                const showItems = subaddon.isItemsNeeded;

                                return (
                                  <div
                                    key={subIndex}
                                    className="mb-[8px] fontSize: '15px' "
                                  >
                                    <div className="text-[0.75rem] font-[500] text-[#666] mb-[3px]">
                                      {subaddon.refSubaddonLabel}
                                      {subaddon.refSubaddonprice && (
                                        <span>
                                          {" "}
                                          - ( ₹{
                                            subaddon.refSubaddonprice
                                          } × {addon.selectedDates?.length || 1}{" "}
                                          days × {addon.refPersonCount || 1} = ₹
                                          {(subaddon.refSubaddonprice || 0) *
                                            (addon.selectedDates?.length || 1) *
                                            (addon.refPersonCount || 1)}
                                          )
                                        </span>
                                      )}
                                    </div>

                                    {/* Show Items if isItemsNeeded is true */}
                                    {showItems &&
                                      subaddon.refItemsLabel?.length > 0 && (
                                        <div className="ml-[15px]">
                                          <div className="text-[0.7rem] fontSize: '15px' font-[600]text-[#888] mb-[2px]">
                                            Items:
                                          </div>
                                          {subaddon.refItemsLabel.map(
                                            (
                                              itemLabel: any,
                                              itemIndex: number
                                            ) => (
                                              <div
                                                key={itemIndex}
                                                className="text-[0.7rem] text-[#555] ml-[2px]"
                                              >
                                                •{" "}
                                                {itemLabel.refItemsLabel ||
                                                  itemLabel}
                                                {subaddon.refItemsPrice?.[
                                                  itemIndex
                                                ] && (
                                                  <span className="text-[#027a48] font-[600]font-[500]">
                                                    {" "}
                                                    (₹
                                                    {subaddon.refItemsPrice[
                                                      itemIndex
                                                    ].refItemsPrice ||
                                                      subaddon.refItemsPrice[
                                                        itemIndex
                                                      ]}{" "}
                                                    ×{" "}
                                                    {addon.selectedDates
                                                      ?.length || 1}{" "}
                                                    days ×{" "}
                                                    {addon.refPersonCount || 1}{" "}
                                                    = ₹
                                                    {(subaddon.refItemsPrice[
                                                      itemIndex
                                                    ].refItemsPrice ||
                                                      subaddon.refItemsPrice[
                                                        itemIndex
                                                      ]) *
                                                      (addon.selectedDates
                                                        ?.length || 1) *
                                                      (addon.refPersonCount ||
                                                        1)}
                                                    )
                                                  </span>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}

                                    {/* Fallback if items needed but not selected */}
                                    {showItems &&
                                      (!subaddon.refItemsLabel ||
                                        subaddon.refItemsLabel.length ===
                                          0) && (
                                        <div className="ml-[15px] text-[0.7rem] text-[#999]">
                                          No specific items selected
                                        </div>
                                      )}
                                  </div>
                                );
                              }
                            )}
                          </div>

                          {/* Total line */}
                          {/* <div className="mt-[8px] text-[0.75rem] font-[500] text-[#027a48]">
                                      Total: ₹{calculateAddonTotal(addon)}
                                    </div> */}
                        </div>

                        {/* Right side: Month-wise dates */}
                        <div className="flex-shrink-0 ml-[10px]">
                          {Object.entries(
                            groupDatesByMonth(addon.selectedDates || [])
                          ).map(([month, days]) => (
                            <div
                              key={month}
                              className="text-[0.75rem] text-right"
                            >
                              {month} {(days as string[]).join(", ")}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Pricing Summary */}
                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                  <div>Net Amount</div>
                  <div>
                    ₹{" "}
                    {(
                      parseInt(selectedData.retTotalAmount || 0) -
                      parseInt(selectedData.refSGSTAmount || 0) -
                      parseInt(selectedData.refCGSTAmount || 0)
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                  <div>SGST (9%)</div>
                  <div>
                    ₹ {parseFloat(selectedData.refSGSTAmount || 0).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                  <div>CGST (9%)</div>
                  <div>
                    ₹ {parseFloat(selectedData.refCGSTAmount || 0).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px] pt-[10px] border-t-[2px] border-[#027a48]">
                  <div className="font-[600]">Total Paid Amount</div>
                  <div className="font-[600] text-[#027a48]">
                    ₹ {parseFloat(selectedData.retTotalAmount || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>
      <DataTable
        value={bookingData.result}
        scrollable
        showGridlines
        stripedRows
        paginator
        rows={10}
        // paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="refUserFname" header="Name" />
        <Column field="refEmail" header="Email" />
        <Column field="refMobileNumber" header="Mobile" />
        <Column field="refGroundName" header="Ground" />
        <Column field="refBookingStartDate" header="Start Date" />
        <Column field="refBookingEndDate" header="End Date" />
        <Column
          header="Actions"
          body={(_, options: any) => (
            <button
              className="p-button p-button-sm p-button-info"
              onClick={() => openSidebar(options.rowIndex)}
            >
              View Details
            </button>
          )}
        />
        <Column
          header="Delete"
          body={(rowData) => (
            <button
              className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full justify-items-center"
              title="Delete"
                   onClick={() =>
                handleDeleteClick(rowData.refUserBookingId)
              }
            >
              <Trash2 size={18} color="#dc2626" />
            </button>
          )}
          style={{ minWidth: "5rem" }}
        />
      </DataTable>

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        style={{ width: "30rem" }}
      >
        {renderSidebarContent()}
      </Sidebar>
    </div>
  );
};

export default Booking;
