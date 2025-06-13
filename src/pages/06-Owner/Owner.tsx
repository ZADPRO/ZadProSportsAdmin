import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../common/helper";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Trash2 } from "lucide-react";
// import EditOwner from "../06-Owner/EditOwner";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import EditOwner from "./EditOwner";

interface OwnerDetails {
  refFName: string;
  refLName: string;
  refAadharId: string;
  refUserEmail: string;
  refMoblile: string;
  refAadharPath: string;
  refuserId: string;
  refStatus?: string;
}

interface SportCategory {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

interface GroundSport {
  id: number;
  sportsName: string;
  groundAddress?: string;
}

const Onwer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState<OwnerDetails[]>([]);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [ownerupdateID, setOwnerupdateID] = useState("");
  const toast = useRef<Toast>(null);
  const [aadharImage, setAadharImage] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    SportCategory[]
  >([]);
  // const [selectedUserId, setSelectedUserId] = useState(null);
  const [sportsType, setSportsType] = useState<SportCategory[]>([]);
  // const [showDialog, setShowDialog] = useState(false);

  // FIXED: Updated state type definition to use Record<number, string>
  const [addressOption, setAddressOption] = useState<"default" | "category">(
    "default"
  );
  const [categoryAddresses, setCategoryAddresses] = useState<
    Record<number, string>
  >({});

  const [inputs, setInputs] = useState({
    refFName: "",
    refLName: "",
    refAadharId: "",
    refUserEmail: "",
    refMoblile: "",
    refAadharPath: "",
    groundAddress: "",
  });

  const [statusData, setstatusData] = useState({
    refOwnerId: "",
    newStatus: "",
    content: "",
  });
  const statusOptions = [
    { label: "Draft", value: "DRAFT" },
    { label: "Pending Review", value: "PENDING" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Onboarded", value: "ONBOARDED" },
    { label: "Suspended", value: "SUSPENDED" },
  ];

  const [ownerupdatesidebar, setOwnerupdatesidebar] = useState(false);
  const [approve, setApprove] = useState(false);

  const onSuccess = () => {
    setOwnerupdatesidebar(false);
  };

  const Addstatus = async () => {
    try {
      let payload: any = {
        refOwnerId: statusData.refOwnerId,
        newStatus: statusData.newStatus,
        content: statusData.content,
      };
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/ownerRoutes/ownerStatus",
        payload,
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

      console.log("data---------->Owner", data);
      if (data.success) {
        Display();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        localStorage.setItem("JWTtoken", data.token);
        setApprove(false);
        resetForm();
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Owner",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding Owner:", e);
    }
  };

  // FIXED: Handle category address input with proper typing
  const handleCategoryAddressChange = (categoryId: number, address: string) => {
    console.log(`Updating address for category ${categoryId}:`, address);

    setCategoryAddresses((prev) => ({ ...prev, [categoryId]: address }));
    // setCategoryAddresses((prevAddresses) => {
    //       const newAddresses: Record<number, string> = {};

    //       Object.keys(prevAddresses).forEach((key) => {
    //     const numKey = parseInt(key);
    //     newAddresses[numKey] = prevAddresses[numKey];
    //   });

    //   newAddresses[categoryId] = address;

    //   console.log("Updated addresses state:", newAddresses);
    //   return newAddresses;
    // });
  };

  // Reset form function
  const resetForm = () => {
    setInputs({
      refFName: "",
      refLName: "",
      refAadharId: "",
      refUserEmail: "",
      refMoblile: "",
      refAadharPath: "",
      groundAddress: "",
    });
    setstatusData({
      refOwnerId: "",
      newStatus: "",
      content: "",
    });
    setSelectedCategoryType([]);
    setCategoryAddresses({});
    setAddressOption("default");
    setAadharImage("");
  };

  const AddOwner = async () => {
    try {
      let payload: any = {
        refFName: inputs.refFName,
        refLName: inputs.refLName,
        refAadharId: inputs.refAadharId,
        refUserEmail: inputs.refUserEmail,
        refMoblile: inputs.refMoblile,
        refAadharPath: aadharImage,
      };

      // Build refGroundSports array based on address option
      const refGroundSports: GroundSport[] = selectedCategoryType.map(
        (category) => {
          const groundSport: GroundSport = {
            id: category.refSportsCategoryId,
            sportsName: category.refSportsCategoryName,
          };

          if (addressOption === "category") {
            groundSport.groundAddress =
              categoryAddresses[category.refSportsCategoryId] || "";
          }

          return groundSport;
        }
      );

      payload.refGroundSports = refGroundSports;

      // Add groundAddress only for default option
      if (addressOption === "default") {
        payload.groundAddress = inputs.groundAddress;
      }

      console.log("Payload to send:", payload);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/ownerRoutes/addOwners",
        payload,
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

      console.log("data---------->Owner", data);
      if (data.success) {
        Display();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        localStorage.setItem("JWTtoken", data.token);
        setVisible(false);
        resetForm();
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Owner",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding Owner:", e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value", e.target.value);
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log("-------->______________", pair[0] + ":", pair[1]);
    }

    console.log("formData------------>", formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/ownerRoutes/uploadAadhar",
        formData,
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
      console.log("data==============", data);

      if (data.success) {
        console.log("data+", data);
        handleUploadSuccessMap(data);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Profile",
          life: 3000,
        });
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setAadharImage(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
  };

  const Display = async () => {
    try {
      const response = await axios.get(
        // import.meta.env.VITE_API_URL + "/ownerRoutes/listOwners"
        `${import.meta.env.VITE_API_URL}/ownerRoutes/listOwners`,
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
        // localStorage.setItem("JWTtoken", data.token);
        console.log("data -------------->", data);
        setDisplay(data.result);
      } else {
        console.log("error passed from backend", data.message);
      }
    } catch (e: any) {
      console.log("Error fetching :", e);
    }
  };

  useEffect(() => {
    Display();
    listSportApi();
  }, []);

  const deleteOwner = async (refuserId: number) => {
    console.log("refUserId", refuserId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ownerRoutes/deleteOwners`,
        { refUserId: refuserId },
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
        console.log("Deleted Successfully");
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Deleted successfully!",
          life: 3000,
        });
        Display();
      } else {
        console.error("Failed to delete item");
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "Failed to delete owner",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting owner",
        life: 3000,
      });
    }
  };

  const fetchOwnerDetails = async (OwnerId: string) => {
    setLoading(true);
    setError(null);
    console.log("local storage token", localStorage.getItem("JWTtoken"));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ownerRoutes/getOwners`,
        { refOwnerId: OwnerId },
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

      console.log("data---->Owner", data);
      localStorage.setItem("JWTtoken", data.token);

      if (data.success) {
        // localStorage.setItem("JWTtoken", data.token);
        console.log("data", data);
        // Handle success case if needed
      } else {
        setError("Failed to fetch package details.");
      }
    } catch (err) {
      setError("Error fetching package details.");
    } finally {
      setLoading(false);
    }
  };

  // const approveOwner = async (UserId: number) => {
  //   try {
  //     console.log("Approving owner with ID:", UserId);

  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/ownerRoutes/approveOwners",
  //       {
  //         refUserId: UserId,
  //       },
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

  //     console.log("Approval response:", data);

  //     if (data.success) {
  //       localStorage.setItem("JWTtoken", data.token);

  //       toast.current?.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Owner approved successfully!",
  //         life: 3000,
  //       });

  //       const updated = display.map((owner) =>
  //         parseInt(owner.refuserId) === UserId
  //           ? { ...owner, refStatus: "Approved" }
  //           : owner
  //       );
  //       setDisplay(updated);
  //     } else {
  //       console.error("API update failed:", data);
  //       toast.current?.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: data.error || "Failed to approve owner",
  //         life: 3000,
  //       });
  //     }
  //   } catch (e) {
  //     console.error("Error approving owner:", e);
  //     toast.current?.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Error approving owner",
  //       life: 3000,
  //     });
  //   }
  // };

  // const actionRead = (rowData: any) => {
  //   const isApproved = rowData.refStatus === "Approved";

  //   return (
  //     <div className="flex items-center gap-2">
  //       <button
  //         className={`${
  //           isApproved
  //             ? "bg-[#1da750] cursor-not-allowed"
  //             : "bg-[#ffcb28] hover:bg-[#ffc928b9] cursor-pointer"
  //         } text-white py-1 px-2 rounded transition-colors`}
  //         onClick={() => {
  //           if (!isApproved) {
  //             console.log("Approving owner:", rowData.refOwnerId);
  //             approveOwner(parseInt(rowData.refOwnerId));
  //           }
  //         }}
  //         disabled={isApproved}
  //       >
  //         {isApproved ? "Approved" : "Approve"}
  //       </button>
  //     </div>
  //   );
  // };

  const listSportApi = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listSportCategory`, {
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
          console.log(data);
          setSportsType(data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching sports categories:", error);
      });
  };

  // FIXED: Handle category selection change with proper typing
  const handleCategoryChange = (e: any) => {
    const newCategories = e.value;
    console.log("Selected categories changed:", newCategories);

    if (newCategories.length < selectedCategoryType.length) {
    }

    setSelectedCategoryType(newCategories);

    // // Completely reset and rebuild the addresses state with proper typing
    const freshAddresses: Record<number, string> = {};

    newCategories.forEach((category: SportCategory) => {
      // Initialize each category with empty string - no carryover from previous state
      freshAddresses[category.refSportsCategoryId] = "";
    });

    // console.log("Setting fresh addresses:", freshAddresses);
    setCategoryAddresses(freshAddresses);
  };

  const approvalBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          label="Status"
          className="p-button-success p-button-sm"
          onClick={() => {
            setstatusData((prev) => ({
              ...prev,
              refOwnerId: rowData.refOwnerId,
            }));
            setApprove(true);
          }}
        />
      </>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <h1 className="font-bold text-3xl text-black mt-4">Owner </h1>
        {/* <Button label="Add New Ground" onClick={() => setVisible(true)} /> */}
      </div>
      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={display}
        rows={10}
        tableStyle={{ margin: "10px" }}
      >
        <Column
          field="sno"
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
        />
        <Column
          className="underline text-[#0a5c9c] cursor-pointer"
          headerStyle={{ width: "25rem" }}
          field="refOwnerCustId"
          header="Owner Id"
          frozen
          style={{ minWidth: "20rem" }}
          body={(rowData) => {
            console.log("rowData -->", rowData);
            return (
              <div
                onClick={() => {
                  console.log("rowData.refUserId", rowData.refOwnerId);
                  setOwnerupdateID(rowData.refOwnerId);
                  setOwnerupdatesidebar(true);
                  fetchOwnerDetails(rowData.refOwnerId);
                }}
              >
                {rowData.refOwnerCustId}
              </div>
            );
          }}
        ></Column>
        <Column
          field="refOwnerFname"
          header="First Name"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="refOwnerLname"
          header="Last Name"
          
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
          header="Update Status"
          body={approvalBodyTemplate}
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="refStatus"
          header="Status"
          style={{ minWidth: "14rem" }}
        ></Column>

        <Column
          header="Delete"
          body={(rowData) => {
            console.log("Full rowData:", rowData);
            return (
              <div className="flex gap-5">
                <button
                  className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full cursor-pointer"
                  title="Delete"
                  onClick={() => {
                    console.log("rowData.refuserId", rowData);
                    deleteOwner(rowData.refuserId);
                  }}
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              </div>
            );
          }}
          style={{ minWidth: "8rem" }}
        />
      </DataTable>

      <Sidebar
        visible={visible}
        style={{ width: "60%" }}
        onHide={() => {
          setVisible(false);
          resetForm();
        }}
        position="right"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            AddOwner();
          }}
          className="m-3"
        >
          <h1 className="text-[20px] font-bold uppercase text-black">
            Add New Owner
          </h1>

          <TabView>
            <TabPanel header="Basic Details">
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="firstName"
                  >
                    First Name:
                  </label>
                  <InputText
                    id="firstName"
                    name="refFName"
                    className="w-full"
                    placeholder="First Name"
                    value={inputs.refFName}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="LastName"
                  >
                    Last Name:
                  </label>
                  <InputText
                    id="LastName"
                    name="refLName"
                    className="w-full"
                    value={inputs.refLName}
                    onChange={handleInput}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="AadharNo"
                  >
                    Aadhar ID:
                  </label>
                  <InputText
                    id="AadharNo"
                    className="w-full"
                    name="refAadharId"
                    value={inputs.refAadharId}
                    onChange={handleInput}
                    placeholder=" Aadhar ID"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="MobileNo"
                  >
                    Mobile No:
                  </label>
                  <InputText
                    id="MobileNo"
                    className="w-full"
                    name="refMoblile"
                    value={inputs.refMoblile}
                    onChange={handleInput}
                    placeholder=" Mobile No"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="Email"
                  >
                    Email ID:
                  </label>
                  <InputText
                    id="Email"
                    className="w-full"
                    placeholder="Email ID"
                    name="refUserEmail"
                    value={inputs.refUserEmail}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="sportsCategory"
                  >
                    Sports Category :
                  </label>
                  <MultiSelect
                    value={selectedCategoryType}
                    onChange={handleCategoryChange}
                    options={sportsType}
                    optionLabel="refSportsCategoryName"
                    display="chip"
                    required
                    placeholder="Select sports categories"
                    maxSelectedLabels={3}
                    className="w-full md:w-20rem"
                  />
                </div>
              </div>

              {/* Address Option Selection */}
              <div className="mt-4">
                <label className="block mb-2 font-medium text-black">
                  Address Configuration:
                </label>
                <div className="flex gap-4 mb-3">
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="defaultAddress"
                      name="addressOption"
                      value="default"
                      onChange={(e) => setAddressOption(e.value)}
                      checked={addressOption === "default"}
                    />
                    <label htmlFor="defaultAddress" className="ml-2">
                      Use Default Address for All Sports
                    </label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="categoryAddress"
                      name="addressOption"
                      value="category"
                      onChange={(e) => setAddressOption(e.value)}
                      checked={addressOption === "category"}
                    />
                    <label htmlFor="categoryAddress" className="ml-2">
                      Different Address for Each Sport
                    </label>
                  </div>
                </div>
              </div>

              {/* Address Input Section */}
              {addressOption === "default" ? (
                <div className="flex gap-3 mt-3">
                  <div className="flex-1">
                    <label
                      className="block mb-1 font-medium text-black"
                      htmlFor="defaultAddress"
                    >
                      Default Address :
                    </label>
                    <InputText
                      id="defaultAddress"
                      className="w-full"
                      placeholder="Default Address for all sports"
                      name="groundAddress"
                      value={inputs.groundAddress}
                      onChange={handleInput}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="block mb-2 font-medium text-black">
                    Sports Category Addresses:
                  </label>
                  {selectedCategoryType.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Please select sports categories first
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedCategoryType.map((category) => (
                        <div
                          key={`category-${category.refSportsCategoryId}`}
                          data-id={`category-${category.refSportsCategoryId}`}
                          className="flex gap-3 items-center"
                        >
                          <div className="w-40">
                            <span className="text-sm font-medium text-black">
                              {category.refSportsCategoryName}:
                              {category.refSportsCategoryId}
                            </span>
                          </div>
                          <div className="flex-1">
                            <InputText
                              key={`address-input-${category.refSportsCategoryId}-${selectedCategoryType.length}`}
                              id={`category-address-${category.refSportsCategoryId}`}
                              name={`categoryAddress_${category.refSportsCategoryId}`}
                              className="w-full"
                              placeholder={`Address for ${category.refSportsCategoryName}`}
                              // FIXED: Using nullish coalescing for safer access
                              value={
                                categoryAddresses[
                                  category.refSportsCategoryId
                                ] ?? ""
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                const inputValue = e.target.value;
                                console.log(
                                  `Input change for category ${category.refSportsCategoryId}:`,
                                  inputValue
                                );
                                handleCategoryAddressChange(
                                  category.refSportsCategoryId,
                                  inputValue
                                );
                              }}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className="flex flex-col items-center gap-2 m-4 p-2 rounded-xl shadow-inset"
                style={{
                  background: "lightgrey",
                }}
              >
                <FileUpload
                  name="logo"
                  customUpload
                  className="mt-3"
                  uploadHandler={profile}
                  accept="image/*"
                  maxFileSize={10000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop your Image here to upload in Kb.
                    </p>
                  }
                />
              </div>

              <div className="card flex justify-content-center mt-3">
                <Button type="submit" label="Create" />
              </div>
            </TabPanel>
          </TabView>
        </form>
      </Sidebar>
      <Sidebar
        visible={approve}
        style={{ width: "50%" }}
        onHide={() => setApprove(false)}
        position="right"
      >
        <div>
          <h1 className="text-[20px] font-bold uppercase text-black">
            Owner Status – {statusData.refOwnerId}
          </h1>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                Addstatus();
              }}
              className="m-3"
            >
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label className="block mb-1 font-medium text-black">
                    New Status
                  </label>
                  <Dropdown
                    id="newStatus"
                    name="newStatus"
                    className="w-full"
                    value={statusData.newStatus}
                    options={statusOptions}
                    onChange={(e) =>
                      setstatusData({ ...statusData, newStatus: e.value })
                    }
                    placeholder="Select Status"
                    optionLabel="label"
                  />
                </div>

                <div className="flex-1">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="content"
                  >
                    Content:
                  </label>
                  <InputText
                    id="content"
                    name="content"
                    className="w-full"
                    value={statusData.content}
                    onChange={(e) =>
                      setstatusData({ ...statusData, content: e.target.value })
                    }
                    placeholder="Enter Content"
                    required
                  />
                </div>
              </div>
              <div className="card flex justify-content-center mt-3">
                <Button type="submit" label="Create" />
              </div>
            </form>
          </div>
        </div>
      </Sidebar>

      <Sidebar
        visible={ownerupdatesidebar}
        style={{ width: "80%" }}
        onHide={() => setOwnerupdatesidebar(false)}
        position="right"
      >
        <EditOwner onSuccess={onSuccess} ownerData={ownerupdateID} />
      </Sidebar>
    </div>
  );
};

export default Onwer;
