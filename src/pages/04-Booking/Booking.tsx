import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { Sidebar } from "primereact/sidebar";

export interface GroundBooking {
  additionalNotes: string;
  isFoodNeeded: boolean;
  isRoomAvailable: boolean;
  isRoomNeeded: boolean;
  refAdditionalTipsId: string; // e.g. "{1,2}" — consider parsing to number[]
  refBookingEndDate: string; // e.g. "2025-05-25"
  refBookingStartDate: string; // e.g. "2025-05-22"
  refBookingTypeId: number;
  refComboCount: string; // e.g. "5" — can change to number if server supports
  refComboId: number;
  refCustId: string;
  refDescription: string;
  refDoB: string | null;
  refEndTime: string; // e.g. "10:00"
  refFacilitiesId: string; // e.g. "{1,4}" — consider parsing to number[]
  refFeaturesId: string; // e.g. "{1,2}" — consider parsing to number[]
  refGroundCustId: string;
  refGroundId: number;
  refGroundImage: string; // local path or image URL
  refGroundLocation: string;
  refGroundName: string;
  refGroundPincode: string;
  refGroundPrice: string; // e.g. "1500" — change to number if needed
  refGroundState: string;
  refRoomImage: string;
  refSportsCategoryId: string; // e.g. "{2}" — consider parsing to number[]
  refStartTime: string; // e.g. "08:00"
  refStatus: boolean;
  refUserBookingId: number;
  refUserFname: string;
  refUserGuidelinesId: string; // e.g. "{2}"
  refUserId: number;
  refUserLname: string | null;
  refuserId: number;
  refMobileNumber: string;
  refEmail: string;
}

const Booking: React.FC = () => {
  const [getListUserApi, setGetListUserApi] = useState<GroundBooking[] | []>(
    []
  );
  //   const [visibleRight, setVisibleRight] = useState<boolean>(false);

  const ListUserBookingApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/adminRoutes/listUserBookings`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "appliction/json",
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
          setGetListUserApi(data.result);
        }
      });
  };

  useEffect(() => {
    ListUserBookingApi();
  }, []);
  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
     <Button label="Add New Groud" onClick={() => setVisibleRight(true)} />
</div> */}
      <div className=" ml-3 mr-3">
        <DataTable
          scrollable
          showGridlines
          stripedRows
          value={getListUserApi}
          // tableStyle={{ margin: "10px" ,marginTop:"5rem"}}
          tableStyle={{ marginTop: "5rem", padding: "2px", justifyContent:"center"}}
        >
          <Column
            field="sno"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
          />
          <Column
            field="refCustId"
            header="User Id"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refUserFname"
            header="User First Name"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refUserLname"
            header="User Last Name"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refEmail"
            header="User Email"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refMobileNumber"
            header="User Mobile Number"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refGroundCustId"
            header="Ground CustId"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refGroundName"
            header="Ground Name"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refGroundLocation"
            header="Ground Location"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refGroundPrice"
            header="Ground Price"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refBookingTypeId"
            header="Booking Type"
            body={(rowData) => (
              <span>
                {rowData.refBookingTypeId === 1
                  ? "Day wise"
                  : "Tournament Wise"}
              </span>
            )}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="isFoodNeeded"
            header="is Food Needed"
            body={(rowData) => (
              <span>{rowData.isFoodNeeded ? "Yes" : "No"}</span>
            )}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="isRoomNeeded"
            header="is Room Needed"
            body={(rowData) => (
              <span>{rowData.isRoomNeeded ? "Yes" : "No"}</span>
            )}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refBookingStartDate"
            header="Booking StartDate"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refBookingEndDate"
            header="Booking EndDate"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refStartTime"
            header="StartTime"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refEndTime"
            header="EndTime"
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Booking;
