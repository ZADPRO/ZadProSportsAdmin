import React, { useEffect, useRef, useState } from "react";
import {
  createNewGround,
  fetchAdditionalTips,
  fetchGoundFacilities,
  fetchGroundFeatures,
  fetchSportCategories,
  fetchUserGuidelines,
  uploadGroundImage,
  type GroundAdd,
  type GroundResult,
} from "./GroundUtlis";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { InputSwitch } from "primereact/inputswitch";
import { Sidebar } from "primereact/sidebar";
import CreateAddOns from "./CreateAddOns";

interface AddGroundSidebarProps {
  onSuccess: () => void;
}

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

const GroundSidebar: React.FC<AddGroundSidebarProps> = ({ onSuccess }) => {
  const [groundDetails, setGroundDetails] = useState<GroundAdd>({
    refGroundName: "",
    isAddOnAvailable: true,
    refAddOns: [],
    refFeaturesId: [],
    refUserGuidelinesId: [],
    refFacilitiesId: [],
    refAdditionalTipsId: [],
    refSportsCategoryId: [],
    refTournamentPrice: "",
    refGroundPrice: "",
    refGroundImage: "",
    refGroundLocation: "",
    refGroundPincode: "",
    refGroundState: "",
    refDescription: "",
    IframeLink: "",
    groundLocationLink: "",
    refStatus: true,
  });
  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  const [newAddonSidebar, setNewAddonSidebar] = useState(false);
  const [editingAddon, setEditingAddon] = useState<string | null>(null); // or an AddOn object
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // To open for new add-on
  const handleAddNew = () => {
    setEditingAddon(null);
    setEditingIndex(null);
    setIsEditing(false);
    setNewAddonSidebar(true);
  };

  // To edit existing
  const handleEditAddon = (addon: any, index: number) => {
    setEditingAddon(JSON.stringify(addon));
    setEditingIndex(index);
    setIsEditing(true);
    setNewAddonSidebar(true);
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = [...groundDetails.refAddOns];
    updatedAddons.splice(index, 1);
    setGroundDetails({ ...groundDetails, refAddOns: updatedAddons });
  };

  const toast = useRef<Toast>(null);

  // const handleAddGround = async () => {
  //   const payload = {
  //     refGroundName: groundName,
  //     refGroundPrice: groundPrice,
  //     refGroundLocation: groundLocation,
  //     refGroundState: groundState,
  //     refGroundPincode: groundPincode,
  //     refDescription: groundDescription,
  //     refFeaturesIds: selectedFeatures,
  //     refSportsCategoryIds: selectedSportCategories,
  //   };

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/groundRoutes/addGround`, payload, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
  //         "Content-Type": "Application/json",
  //       },
  //     });
  //     const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
  //     if (data.success) {
  //       console.log("Ground added successfully:", data);
  //       // Optionally reset the form or show a success message
  //     }
  //   } catch (error) {
  //     console.error("Error adding ground:", error);
  //   }
  // };

  const GroundFeatures = async () => {
    try {
      const result: any = await fetchGroundFeatures();
      const options: any = result.map((data: any) => ({
        label: data.refFeaturesName,
        value: data.refFeaturesId,
      }));
      setGroundFeatures(options);
    } catch (error) {
      console.error("Error fetching sport categories:", error);
    }
  };

  const GroundSportCategory = async () => {
    try {
      const result: any = await fetchSportCategories();
      const options: any = result.map((item: any) => ({
        label: item.refSportsCategoryName,
        value: item.refSportsCategoryId,
      }));

      setSportOptions(options);
    } catch (error) {
      console.error("Error fetching sport categories:", error);
    }
  };

  const GroundUserGuideLines = async () => {
    try {
      const result: any = await fetchUserGuidelines();
      const options: any = result.map((item: any) => ({
        label: item.refUserGuidelinesName,
        value: item.refUserGuidelinesId,
      }));
      setUserGuidelines(options);
    } catch (error) {}
  };

  const GroundFacilities = async () => {
    try {
      const result: any = await fetchGoundFacilities();
      const options: any = result.map((item: any) => ({
        label: item.refFacilitiesName,
        value: item.refFacilitiesId,
      }));
      setFacilities(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GroundAdditionalTips = async () => {
    try {
      const result: any = await fetchAdditionalTips();
      const options: any = result.map((item: any) => ({
        label: item.refAdditionalTipsName,
        value: item.refAdditionalTipsId,
      }));
      setAdditionalTips(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    GroundFeatures();
    GroundSportCategory();
    GroundUserGuideLines();
    GroundFacilities();
    GroundAdditionalTips();
  }, []);

  const handleInputChange = (field: keyof GroundResult, value: string) => {
    setGroundDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (
    field: keyof GroundResult,
    value: number[]
  ) => {
    setGroundDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const [formDataImages, setFormdataImages] = useState<any>([]);

  const customMap = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    // for (let pair of formData.entries()) {
    //   console.log("-------->______________", pair[0] + ":", pair[1]);
    // }

    console.log("formData------------>", formData);
    try {
      const response = await uploadGroundImage(formData);
      console.log("response", response);

      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Image Upload successfully!",
          life: 3000,
        });
        console.log("data+", response);
        setGroundImg(response.files[0]);
        setGroundDetails((prev) => ({
          ...prev!,
          refGroundImage: response.filePath,
        }));
        handleUploadSuccessMap(response);
      } else {
        console.log("data-", response);
        handleUploadFailure(response);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setFormdataImages(response.filePath);
  };
  console.log(formDataImages);

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  console.log(groundDetails);

  const handleCreateNewGround = async () => {
    try {
      const response = await createNewGround(groundDetails);
      console.log("response", response);

      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Ground Created Successfully!",
          life: 3000,
        });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // const handleRemoveDate = async (addonAvailabilityId: number) => {
  //     const response = await removerAddonAvailability({ addOnsAvailabilityId: addonAvailabilityId });
  //     console.log("response", response);
  //     // if(response.success) {

  //     // }

  //     // setAddOns((prev) =>
  //     //   prev.map((addon, i) =>
  //     //     i === addonIndex
  //     //       ? {
  //     //           ...addon,
  //     //           data: addon.data.filter((_, j) => j !== dateIndex),
  //     //         }
  //     //       : addon
  //     //   )
  //     // );
  //   };

  //   const handleAddDates = async (refAddonId: number) => {
  //     const selected = selectedAddonDates.find(
  //       (item) => item.refAddonId === refAddonId
  //     );
  //     if (!selected || selected.dates.length === 0) return;

  //     try {
  //       const payloads = selected.dates.map((date) => ({
  //         unAvailabilityDate: date.toLocaleDateString("en-GB").split('/').join('-'),
  //         refAddOnsId: refAddonId,
  //         refGroundId: groundData.refGroundId,
  //       }));

  //       const responses = await Promise.all(
  //         payloads.map((payload) => addAddOnsAvailability(payload))
  //       );

  //       console.log("All responses:", responses);

  //       await GroundDetails(); // ensure GroundDetails handles latest data

  //       // Clear dates for that addon
  //       setSelectedAddonDates((prev) =>
  //         prev.map((item) =>
  //           item.refAddonId === refAddonId ? { ...item, dates: [] } : item
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Failed to add availability:", error);
  //     }
  //   };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateNewGround();
      }}
      className="m-3"
    >
      <h1 className="text-[20px] font-bold uppercase text-black">
        Add New Ground
      </h1>

      <TabView>
        <TabPanel header="Basic Details">
          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundName"
              >
                Ground Name:
              </label>
              <InputText
                id="groundName"
                className="w-full"
                placeholder="Ground Name"
                value={groundDetails?.refGroundName || ""}
                onChange={(e) =>
                  handleInputChange("refGroundName", e.target.value)
                }
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundprice"
              >
                Ground Per Day Price:
              </label>
              <InputText
                id="groundprice"
                className="w-full"
                placeholder="Ground Price"
                value={groundDetails?.refGroundPrice || ""}
                onChange={(e) =>
                  handleInputChange("refGroundPrice", e.target.value)
                }
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="refTournamentPrice"
              >
                Ground Tournment Price:
              </label>
              <InputText
                id="refTournamentPrice"
                className="w-full"
                placeholder="Ground Price"
                value={groundDetails?.refTournamentPrice || ""}
                onChange={(e) =>
                  handleInputChange("refTournamentPrice", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundlocation"
              >
                Area:
              </label>
              <InputText
                id="groundlocation"
                className="w-full flex-1"
                placeholder="Ground Location"
                value={groundDetails?.refGroundLocation || ""}
                onChange={(e) =>
                  handleInputChange("refGroundLocation", e.target.value)
                }
                required
              />
            </div>

            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundstate"
              >
                District:
              </label>
              <InputText
                id="groundstate"
                className="w-full flex-1"
                placeholder="Ground State"
                value={groundDetails?.refGroundState || ""}
                onChange={(e) =>
                  handleInputChange("refGroundState", e.target.value)
                }
                required
              />
            </div>

            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundpincode"
              >
                Ground Pincode:
              </label>
              <InputText
                id="groundpincode"
                className="w-full flex-1"
                placeholder="Ground Pincode"
                value={groundDetails?.refGroundPincode || ""}
                onChange={(e) =>
                  handleInputChange("refGroundPincode", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="grounddesc"
              >
                Ground Description:
              </label>
              <InputText
                id="grounddesc"
                className="w-full flex-1"
                placeholder="Description"
                value={groundDetails?.refDescription || ""}
                onChange={(e) =>
                  handleInputChange("refDescription", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="iFrameLink"
              >
                Location (Iframe Link):
              </label>
              <InputText
                id="iFrameLink"
                className="w-full"
                placeholder="Location IFrame Link"
                value={groundDetails?.IframeLink || ""}
                onChange={(e) =>
                  handleInputChange("IframeLink", e.target.value)
                }
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="locationcode"
              >
                Location (Code):
              </label>
              <InputText
                id="iFrameLink"
                className="w-full"
                placeholder="Location GPS Code"
                value={groundDetails?.groundLocationLink || ""}
                onChange={(e) =>
                  handleInputChange("groundLocationLink", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="groundFeatures"
              >
                Ground Features:
              </label>
              <MultiSelect
                value={groundDetails?.refFeaturesId || []}
                onChange={(e) =>
                  handleMultiSelectChange("refFeaturesId", e.value)
                }
                options={groundFeatures}
                optionLabel="label"
                id="groundFeatures"
                placeholder="Select Ground Features"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>

            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="SportCategory"
              >
                Sport Category:
              </label>
              <MultiSelect
                value={groundDetails?.refSportsCategoryId || []}
                onChange={(e) =>
                  handleMultiSelectChange("refSportsCategoryId", e.value)
                }
                options={sportOptions}
                optionLabel="label"
                id="SportCategory"
                placeholder="Sport Category"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="userGuideLines"
              >
                Guide Lines:
              </label>
              <MultiSelect
                value={groundDetails?.refUserGuidelinesId || []}
                onChange={(e) =>
                  handleMultiSelectChange("refUserGuidelinesId", e.value)
                }
                options={userGuidelines}
                optionLabel="label"
                id="userGuideLines"
                placeholder="Select User Guide Lines"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>

            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="facilities"
              >
                Facilities:
              </label>
              <MultiSelect
                value={groundDetails?.refFacilitiesId || []}
                onChange={(e) =>
                  handleMultiSelectChange("refFacilitiesId", e.value)
                }
                options={facilities}
                optionLabel="label"
                id="facilities"
                placeholder="Enter Facilities"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="additionalTips"
              >
                Additional Tips:
              </label>
              <MultiSelect
                value={groundDetails?.refAdditionalTipsId || []}
                onChange={(e) =>
                  handleMultiSelectChange("refAdditionalTipsId", e.value)
                }
                options={additionalTips}
                optionLabel="label"
                id="additionalTips"
                placeholder="Select Additional Tips"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>
          </div>
          {/* Image container */}
          <div
            className="flex flex-col items-center gap-2 m-4 p-2 rounded-xl shadow-inset"
            style={{
              background: "lightgrey",
            }}
          >
            <div className="flex gap-2 justify-between items-start duration-300 rounded-lg">
              {groundImg && (
                <img
                  src={
                    groundImg?.filename &&
                    `data:${groundImg.contentType};base64,${groundImg.content}`
                  }
                  alt={groundImg?.filename || "Preview"}
                  className="object-cover w-64 h-64 rounded-lg border-2"
                />
              )}

              <FileUpload
                name="logo"
                customUpload
                className="mt-3"
                uploadHandler={customMap}
                accept="image/*"
                maxFileSize={10000000}
                emptyTemplate={
                  <p className="m-0">
                    Drag and drop your Map here to upload in Kb.
                  </p>
                }
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Additional Details">
          <div className="flex items-center gap-2 mb-4">
            <span className="block font-medium text-black">
              Do you have Add-Ons?
            </span>
            <InputSwitch
              checked={groundDetails.isAddOnAvailable}
              onChange={(e) =>
                setGroundDetails((prev) => ({
                  ...prev!,
                  isAddOnAvailable: e.value,
                }))
              }
            />
          </div>

          <div>
            {groundDetails.isAddOnAvailable && (
              <>
                <div className="flex items-center justify-between mt-3">
                  <span className="block mb-1 font-medium text-black">
                    Add-Ons:
                  </span>
                  <Button
                    type="button"
                    label="Create New AddOn"
                    onClick={() => handleAddNew()}
                  />
                </div>

                <Divider />

                <div className="flex flex-col gap-4">
                  {groundDetails.refAddOns.map((addon, addonIndex) => {
                    // const selectedEntry = selectedAddonDates.find(
                    //   (entry) => entry.refAddonId === addon.refAddonId
                    // );
                    // const disabledDates = addon.data
                    //   .map((item: any) => new Date(item.unAvailabilityDate))
                    //   .filter((date) => !isNaN(date.getTime())); // Filter out invalid dates

                    return (
                      <Panel key={addonIndex} header={addon.name} toggleable>
                        {/* <p className="m-0 mb-2">Add-on ID: {addon.refAddonId}</p> */}
                        <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md">
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              className="p-0 mr-2"
                              label="Edit"
                              onClick={() => handleEditAddon(addon, addonIndex)}
                            />
                            <Button
                              type="button"
                              className="p-0"
                              severity="danger"
                              icon="pi pi-trash"
                              onClick={() => handleRemoveAddon(addonIndex)}
                            />
                          </div>

                          <table className="w-full table-auto border-separate border-spacing-y-2">
                            <tbody>
                              <tr>
                                <td className="font-semibold text-gray-700">
                                  Name
                                </td>
                                <td className="text-gray-900">{addon.name}</td>
                              </tr>
                              <tr>
                                <td className="font-semibold text-gray-700">
                                  Has Subcategories
                                </td>
                                <td className="text-gray-900">
                                  {addon.isSubaddonsAvailable ? "Yes" : "No"}
                                </td>
                              </tr>
                              {!addon.isSubaddonsAvailable && (
                                <tr>
                                  <td className="font-semibold text-gray-700">
                                    Price
                                  </td>
                                  <td className="text-gray-900">
                                    ₹ {addon.price}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Panel>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </TabPanel>
      </TabView>

      <div className="card flex justify-content-center mt-3">
        <Button type="submit" label="Create" />
      </div>

      <Sidebar
        visible={newAddonSidebar}
        onHide={() => setNewAddonSidebar(false)}
        position="right"
        style={{ width: "50%" }}
      >
        <CreateAddOns
          selectedAddon={editingAddon}
          onSave={(addonString: string) => {
            const addon = JSON.parse(addonString); // Convert back to object here
            console.log("addon", addon);
            const updatedAddons = [...groundDetails.refAddOns];
            if (isEditing && editingIndex !== null) {
              updatedAddons[editingIndex] = addon; // update
            } else {
              updatedAddons.push(addon); // create
            }
            setGroundDetails({ ...groundDetails, refAddOns: updatedAddons });
            setNewAddonSidebar(false);
          }}
        />
      </Sidebar>

      <Toast ref={toast} />
    </form>
  );
};

export default GroundSidebar;
