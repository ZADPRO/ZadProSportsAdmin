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
import {
  MultiSelect,
} from "primereact/multiselect";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

interface AddGroundSidebarProps {
  onSuccess: () => void;
}

// interface AddOnItem {
//   refGroundId: number;
//   refAddonId: number;
//   refAddOnName: string;
//   data: any[]; // You can define a more specific type if known
// }

// type SelectedAddonDates = {
//   refAddonId: number;
//   dates: Date[];
// };

interface GroundImage {
  content: string;        // base64 image data
  contentType: string;    // MIME type, e.g., "image/jpeg"
  filename: string;       // original filename
};


const GroundSidebar: React.FC<AddGroundSidebarProps> = ({ onSuccess }) => {
const [groundDetails, setGroundDetails] = useState<GroundAdd>({
  refGroundName: "",
  isAddOnAvailable: true,
  refAddOnsId: [],
  refFeaturesId: [],
  refUserGuidelinesId: [],
  refFacilitiesId: [],
  refAdditionalTipsId: [],
  refSportsCategoryId: [],
  refGroundPrice: "",
  refGroundImage: "",
  refGroundLocation: "",
  refGroundPincode: "",
  refGroundState: "",
  refDescription: "",
  IframeLink: "",
  refStatus: true,
});
const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  
const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  // const [selectedAddonDates, setSelectedAddonDates] = useState<
  //   SelectedAddonDates[]
  // >([]);

// const op = useRef<OverlayPanelType>(null);

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
      console.log(formDataImages)
     
     const handleUploadFailure = (error: any) => {
        console.error("Upload Failed:", error);
        // Add your failure handling logic here
      };
     
    
    console.log(groundDetails);



    const handleCreateNewGround = async () => {
      try {
        const response = await createNewGround(groundDetails);
        console.log("response", response);

         if(response.success){
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
    }
    
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        handleCreateNewGround();
      }} className="m-3">
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
                Ground Price:
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
          <div className="card flex justify-content-center mt-3">
            <Button type="submit" label="Create" />
          </div>
        </TabPanel>

        {/* <TabPanel header="Additional Details">
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
                onClick={(e) => op.current?.toggle(e)}
              />
              <OverlayPanel ref={op}>
                <div className="flex-1 gap-2 flex flex-col">
                  <label
                    className="block mb-1 font-medium text-black"
                    htmlFor="newAddOn"
                  >
                    Add On Name:
                  </label>
                  <InputText
                    id="newAddOn"
                    className="w-full flex-1"
                    placeholder="Enter Addon Name"
                    value={newAddOnName}
                    onChange={(e) => setNewAddOnName(e.target.value)}
                  />
                  <Button
                    type="button"
                    label="Add"
                    onClick={handleAddNewAddon}
                  />
                </div>
              </OverlayPanel>
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              {addOns.map((addon, addonIndex) => {
                const selectedEntry = selectedAddonDates.find(
                  (entry) => entry.refAddonId === addon.refAddonId
                );
                const disabledDates = addon.data
                  .map((item: any) => new Date(item.unAvailabilityDate))
                  .filter((date) => !isNaN(date.getTime())); // Filter out invalid dates

                return (
                  <Panel
                    key={addonIndex}
                    header={addon.refAddOnName}
                    toggleable
                  >
                    {/* <p className="m-0 mb-2">Add-on ID: {addon.refAddonId}</p> */} {/*

                    <div className="flex gap-2 mt-2 justify-between">
                      <Calendar
                        value={selectedEntry?.dates || []}
                        onChange={(e) =>
                          handleDateChange(
                            addon.refAddonId,
                            e.value as Date[] | null
                          )
                        }
                        selectionMode="multiple"
                        placeholder="Enter Your Unavailable Dates"
                        disabledDates={disabledDates}
                        minDate={new Date()}
                        className="mb-2 w-full"
                      />

                      <Button
                        type="button"
                        label="Add"
                        icon="pi pi-plus"
                        onClick={() => handleAddDates(addon.refAddonId)}
                        className="mb-3"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {addon.data
                        .slice()
                        .sort(
                          (a: any, b: any) =>
                            new Date(a.unAvailabilityDate).getTime() -
                            new Date(b.unAvailabilityDate).getTime()
                        )
                        .map((item: any, dateIndex: number) => (
                          <Chip
                            key={dateIndex}
                            label={item.unAvailabilityDate}
                            removable
                            onRemove={() => {
                              handleRemoveDate(item.addOnsAvailabilityId);
                              return true;
                            }}
                          />
                        ))}
                    </div>
                  </Panel>
                );
              })}
            </div>
            </>
            )}
          </div>
        </TabPanel> */}
      </TabView>
      <Toast ref={toast} />
    </form>
  );
};

export default GroundSidebar;
