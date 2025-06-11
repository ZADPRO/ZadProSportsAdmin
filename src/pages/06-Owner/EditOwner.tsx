import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface EditSidebarProps {
  ownerData: string;
  onSuccess: () => void;
}

const EditOwner: React.FC<EditSidebarProps> = ({ ownerData }) => {
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [display, setDisplay] = useState<any[]>([]);

  useEffect(() => {
    fetchOwnerDetails();
  }, []);

  const fetchOwnerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ownerRoutes/getOwners`,

        { refOwnerId: ownerData },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("running");

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("JWTtoken", data.token);

      console.log("data---->Owner", data);

      if (data.success) {
        localStorage.setItem("JWTtoken", data.token);
        console.log("data", data);
        setDisplay(data.result);
        setDisplay(data.result.ownersportsmappings[0]);
      } else {
        setError("Failed to fetch package details.");
      }
    } catch (err) {
      setError("Error fetching package details.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-[20px] px-3 font-bold uppercase text-black">
        Owner Details :
      </h1>

      <div>
        <DataTable
          scrollable
          showGridlines
          stripedRows
          value={display}
          tableStyle={{ margin: "10px" }}
        >
          <Column
            field="sno"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
          />

          <Column
            field="refOwnerFname"
            header="First Name"
            style={{ minWidth: "14rem" }}
          ></Column>
          <Column
            field="refOwnerLname"
            header="Last Name"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refEmailId"
            header="Email"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refMobileId"
            header="Mobile Number"
            style={{ minWidth: "14rem" }}
          ></Column>
          <Column
            field="refAadharId"
            header="Aadhar Number"
            style={{ minWidth: "14rem" }}
          ></Column>
          <Column
            field="refPANId"
            header="PAN Number"
            style={{ minWidth: "14rem" }}
          ></Column>
          <Column
            field="refGSTnumber"
            header="GST Number"
            style={{ minWidth: "14rem" }}
          ></Column>
        </DataTable>
      </div>

      <h1 className="text-[20px] mt-5 px-3 font-bold uppercase text-black">
        Bank Details :
      </h1>

      <div>
        <DataTable
          scrollable
          showGridlines
          stripedRows
          value={display}
          tableStyle={{ margin: "10px" }}
        >
          <Column
            field="sno"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
          />

          <Column
            field="refBankName"
            header="Bank Name"
            style={{ minWidth: "14rem" }}
          ></Column>
          <Column
            field="refAccountNumber"
            header="Account Number"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refAcHolderName"
            header="Account Holder Name"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="refBankBranch"
            header="Bank Branch"
            style={{ minWidth: "14rem" }}
          ></Column>
        </DataTable>
      </div>

      <h1 className="text-[20px] mt-5 px-3 font-bold uppercase text-black">
        Ground Details :
      </h1>

      <div>
        <DataTable
          scrollable
          showGridlines
          stripedRows
          value={display}
          tableStyle={{ margin: "10px" }}
        >
          <Column
            field="sno"
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
          />

          <Column
            field="isOwnGround"
            header="Ground Owner"
            style={{ minWidth: "14rem" }}
            body={(rowData) => (rowData.isOwnGround ? "Yes" : "No")}
          />

          <Column
            field="refGroundDescription"
            header="Ground Description"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="groundAddress"
            header="Default Ground Address"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            header="Document 1"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            header="Document 2"
            frozen
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default EditOwner;
