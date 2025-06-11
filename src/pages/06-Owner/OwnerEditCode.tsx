import axios from "axios";
import React, { useState } from "react";
import decrypt from "../../common/helper";

import { Button } from "primereact/button";

import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
// import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

interface EditSidebarProps {
  ownerData: string;
  onSuccess: () => void;
}

const OwnerEditCode: React.FC<EditSidebarProps> = ({
  ownerData,
  onSuccess,
}) => {
  const [inputs, setInputs] = useState<{
    refuserId: string;
    refUserFname: string;
    refUserLname: string;
    refAadharId: string;
    refEmail: string;
    refMobileNumber: string;
    refAadharPath: {
      filename: string;
      contentType: string;
      content: string;
    } | null;
  }>({
    refuserId: ownerData,
    refUserFname: "",
    refUserLname: "",
    refAadharId: "",
    refEmail: "",
    refMobileNumber: "",
    refAadharPath: null,
  });
  const [_editStaffId, setEditStaffId] = useState<number | null>(null);



  const [aadharImage, setAadharImage] = useState(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const UpdateOwner = async () => {
    const token = localStorage.getItem("JWTtoken");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/ownerRoutes/updateOwners",
        {
          userId: inputs.refuserId,
          refFName: inputs.refUserFname,
          refLName: inputs.refUserLname,
          refAadharId: inputs.refAadharId,
          refUserEmail: inputs.refEmail,
          refMoblile: inputs.refMobileNumber,
          refAadharPath:
            aadharImage === ""
              ? inputs.refAadharPath?.filename ?? ""
              : aadharImage,
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("token line 126======", token);

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("data---------->Parking data", data);
      if (data.success) {
        localStorage.setItem("JWTtoken", "Bearer " + data.token);
        onSuccess();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.log("Error adding staff:", e);
    }
  };

  const deleteParkingimage = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/ownerRoutes/deleteAadhar",
        {
          userId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("JWTtoken", "Bearer " + data.token);
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error updating package:", e);

      setEditStaffId(null);
    }
  };
  // useEffect(() => {
  //   fetchOwnerDetails();
  // }, []);

  // const fetchOwnerDetails = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/ownerRoutes/getOwners`,
  //       { userId: ownerData },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("JWTtoken"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     console.log("data---->Owner", data);

  //     if (data.success) {
  //       setInputs(data.result[0]);
  //     } else {
  //       setError("Failed to fetch package details.");
  //     }
  //   } catch (err) {
  //     setError("Error fetching package details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
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
            Authorization: localStorage.getItem("JWTtoken"),
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", "Bearer " + data.token);
      console.log("data==============", data);

      if (data.success) {
        console.log("data+", data);
        handleUploadSuccessMap(data);
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
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
    // Add your failure handling logic here
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          UpdateOwner();
        }}
        className="m-3"
      >
        <h1 className="text-[20px] font-bold uppercase text-black">
          Update New Owner {ownerData}
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
                  name="refUserFname"
                  className="w-full"
                  placeholder="First Name"
                  value={inputs.refUserFname}
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
                  name="refUserLname"
                  className="w-full"
                  value={inputs.refUserLname}
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
                  placeholder="Aadhar ID"
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
                  name="refMobileNumber"
                  value={inputs.refMobileNumber}
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
                  name="refEmail"
                  value={inputs.refEmail}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>
            <div className="w-[30%] h-[30%] relative cursor-pointer">
              {inputs?.refAadharPath && (
                <>
                  <img
                    src={`data:${inputs.refAadharPath.contentType};base64,${inputs.refAadharPath.content}`}
                    alt="Staff Profile Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      deleteParkingimage(inputs.refuserId);
                      setInputs({ ...inputs, refAadharPath: null });
                    }}
                    className="absolute top-1 cursor-pointer right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
            <div
              className="flex flex-col items-center gap-2 m-4 p-2 rounded-xl shadow-inset"
              style={{
                background: "lightgrey",
              }}
            >
              {" "}
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
              <Button type="submit" onClick={onSuccess} label="Create" />
            </div>
          </TabPanel>
        </TabView>
      </form>
    </div>
  );
};

export default OwnerEditCode;
