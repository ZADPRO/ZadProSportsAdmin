import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { Sidebar } from "primereact/sidebar";

interface UserData {
  refCustId: string;
  refDoB: string;
  refEmail: string;
  refMobileNumber: string;
  refUserFname: string;
  refUserLname: string;
  refUserName: string;
  refUserTypeId: number;
  refuserId: number;
}

const Userlist: React.FC = () => {
  const [getListUserApi, setGetListUserApi] = useState<UserData[] | []>([]);
  //   const [visibleRight, setVisibleRight] = useState<boolean>(false);

  const ListUserApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/adminRoutes/listSignUpUsers`, {
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
    ListUserApi();
  }, []);
  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
     <Button label="Add New Groud" onClick={() => setVisibleRight(true)} />
</div> */}

      <div className=" ml-3 mr-3">
        <h1 className="font-bold text-3xl text-black mt-4">
          Signed Up Users List
        </h1>
        <DataTable
          scrollable
          showGridlines
          stripedRows
          value={getListUserApi}
          tableStyle={{ marginTop: "2.5rem", padding: "1px" }}
        >
          <Column
            field="sno"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
          />
          <Column field="refCustId" header="User Id"></Column>
          <Column field="refUserFname" header="First name"></Column>
          <Column field="refUserLname" header="Last name"></Column>
          <Column field="refMobileNumber" header="Mobile Number"></Column>
          <Column field="refEmail" header="Email"></Column>
          <Column field="refDoB" header="Date of Birth"></Column>
        </DataTable>
      </div>
      {/* <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <h2>Right Sidebar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </Sidebar> */}
    </div>
  );
};

export default Userlist;
