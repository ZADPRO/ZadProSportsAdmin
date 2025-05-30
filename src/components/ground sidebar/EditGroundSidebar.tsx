import React, { useEffect, useRef, useState } from "react";
import {
  addAddOnsAvailability,
  fetchAdditionalTips,
  fetchGoundFacilities,
  fetchGroundFeatures,
  fetchSpecificGround,
  fetchSportCategories,
  fetchUserGuidelines,
  removerAddonAvailability,
  updateGround,
  uploadGroundImage,
  type GroundResult,
} from "./GroundUtlis";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  MultiSelect,
} from "primereact/multiselect";
import { TabView, TabPanel } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";
import { Chip } from "primereact/chip";
import { FileUpload } from "primereact/fileupload";
import { Divider } from "primereact/divider";
// import type { OverlayPanel as OverlayPanelType } from 'primereact/overlaypanel';
import { Toast } from "primereact/toast";


interface EditGroundSidebarProps {
  groundData: any;
  onSuccess: () => void;
}

interface AddOnItem {
  refGroundId: number;
  refAddonId: number;
  refAddOnName: string;
  data: any[]; // You can define a more specific type if known
}

type SelectedAddonDates = {
  refAddonId: number;
  dates: Date[];
};

interface GroundImage {
  content: string;        // base64 image data
  contentType: string;    // MIME type, e.g., "image/jpeg"
  filename: string;       // original filename
};

const EditGroundSidebar: React.FC<EditGroundSidebarProps> = ({ groundData, onSuccess }) => {

  const [groundDetails, setGroundDetails] = useState<GroundResult | null>(null);

  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const [addOns, setAddOns] = useState<AddOnItem[]>([]);
  // const [newAddOnName, setNewAddOnName] = useState("");
  
const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  const [selectedAddonDates, setSelectedAddonDates] = useState<
    SelectedAddonDates[]
  >([]);

// const op = useRef<OverlayPanelType>(null);

  const toast = useRef<Toast>(null);

  const GroundFeatures = async () => {
    try {
      const result = await fetchGroundFeatures();
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
      const result = await fetchSportCategories();
      const options: any = result.map((item) => ({
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
      const result = await fetchUserGuidelines();
      const options: any = result.map((item) => ({
        label: item.refUserGuidelinesName,
        value: item.refUserGuidelinesId,
      }));
      setUserGuidelines(options);
    } catch (error) {}
  };

  const GroundFacilities = async () => {
    try {
      const result = await fetchGoundFacilities();
      const options: any = result.map((item) => ({
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
      const result = await fetchAdditionalTips();
      const options: any = result.map((item) => ({
        label: item.refAdditionalTipsName,
        value: item.refAdditionalTipsId,
      }));
      setAdditionalTips(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GroundDetails = async () => {
  try {
    const t = { refGroundId: groundData.refGroundId };
    const result = await fetchSpecificGround(t);
    console.log("result", result);

    const rawData = result.getAddons?.[0]?.arraydata || [];
    const listAddons = result.listOfAddones || [];

    setGroundImg(result.imgResult?.[0].refGroundImage || "");

    // Get today's date (zeroed time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group based on listAddons and filter out past dates
    const groupedAddOnsArray: AddOnItem[] = listAddons.map((addon: any) => {
      const matchingData = rawData
        .filter((item: any) => item.refAddOnsId === addon.refAddOnsId)
        .filter((item: any) => {
          if (!item.unAvailabilityDate) return false;

          const itemDate = parseDDMMYYYY(item.unAvailabilityDate);
          if (isNaN(itemDate.getTime())) return false;

          itemDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return itemDate >= today;
        });

      return {
        refGroundId: groundData.refGroundId,
        refAddonId: addon.refAddOnsId,
        refAddOnName: addon.refAddOn,
        data: matchingData,
      };
    });

    setAddOns(groupedAddOnsArray);
    console.log(groupedAddOnsArray);
  } catch (error) {
    console.error("Error in GroundDetails:", error);
  }
};


  useEffect(() => {
    setGroundDetails(groundData);
    GroundFeatures();
    GroundSportCategory();
    GroundUserGuideLines();
    GroundFacilities();
    GroundAdditionalTips();
    GroundDetails();
  }, []);

  const handeUpdateGround = async () => {
    try {
      if (groundDetails) {
        console.log("groundDetails", groundDetails);
        console.log("addons", addOns);

        const payload = {
          refGroundId: groundDetails.refGroundId,
          refGroundName: groundDetails.refGroundName,
          isAddOnAvailable: groundDetails.isAddOnAvailable,
          refAddOnsId: addOns.map((item) => String(item.refAddonId)),
          refFeaturesId: groundDetails.refFeaturesIds.map(String),
          refUserGuidelinesId: groundDetails.refUserGuidelinesIds.map(String),
          refFacilitiesId: groundDetails.refFacilitiesIds.map(String),
          refAdditionalTipsId: groundDetails.refAdditionalTipsIds.map(String),
          refSportsCategoryId: groundDetails.refSportsCategoryIds.map(String),
          refGroundPrice: groundDetails.refGroundPrice,
          refGroundImage: groundDetails.refGroundImage,
          refGroundLocation: groundDetails.refGroundLocation,
          refGroundPincode: groundDetails.refGroundPincode,
          refGroundState: groundDetails.refGroundState,
          refDescription: groundDetails.refDescription,
          IframeLink: groundDetails.IframeLink,
          refStatus: groundDetails.refStatus,
        };
        console.log("payload", payload);
        const response = await updateGround(payload);
        if(response.success){
          toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Updated successfully!",
          life: 3000,
        });
        setTimeout(() => {
          onSuccess();
        }, 1500);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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

  const handleRemoveDate = async (addonAvailabilityId: number) => {
    const response = await removerAddonAvailability({ addOnsAvailabilityId: addonAvailabilityId });
    console.log("response", response);
    // if(response.success) {

    // }

    // setAddOns((prev) =>
    //   prev.map((addon, i) =>
    //     i === addonIndex
    //       ? {
    //           ...addon,
    //           data: addon.data.filter((_, j) => j !== dateIndex),
    //         }
    //       : addon
    //   )
    // );
  };

  const handleAddDates = async (refAddonId: number) => {
    const selected = selectedAddonDates.find(
      (item) => item.refAddonId === refAddonId
    );
    if (!selected || selected.dates.length === 0) return;

    try {
      const payloads = selected.dates.map((date) => ({
        unAvailabilityDate: date.toLocaleDateString("en-GB").split('/').join('-'),
        refAddOnsId: refAddonId,
        refGroundId: groundData.refGroundId,
      }));

      const responses = await Promise.all(
        payloads.map((payload) => addAddOnsAvailability(payload))
      );

      console.log("All responses:", responses);

      await GroundDetails(); // ensure GroundDetails handles latest data

      // Clear dates for that addon
      setSelectedAddonDates((prev) =>
        prev.map((item) =>
          item.refAddonId === refAddonId ? { ...item, dates: [] } : item
        )
      );
    } catch (error) {
      console.error("Failed to add availability:", error);
    }
  };

  const handleDateChange = (
    refAddonId: number,
    value: Date[] | null | undefined
  ) => {
    setSelectedAddonDates((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.refAddonId === refAddonId);

      if (index > -1) {
        updated[index].dates = value ?? [];
      } else {
        updated.push({ refAddonId, dates: value ?? [] });
      }

      return updated;
    });
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
          detail: "Image uploaded successfully!",
          life: 3000,
        });
        // console.log("data+", response);
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
 

//   const handleAddNewAddon = async () => {
//   if (!newAddOnName) return;

//   try {
//     const payload = {
//       addOns: newAddOnName,
//       refGroundId: groundData.refGroundId,
//       refStatus: true,
//     };

//     const response = await createNewAddons(payload);
//     console.log("response", response);

//     // Optional: handle success (e.g., clear input or show message)
//   } catch (error) {
//     console.error("Error adding new add-on:", error);
//     // Optional: show error to the user
//   }
// };

const parseDDMMYYYY = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

  
  console.log(groundDetails);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handeUpdateGround();
      }}
      className="m-3"
    >
      <h1 className="text-[20px] font-bold uppercase text-black">Ground</h1>
      <TabView>
        <TabPanel header="Basic Details">
          <div
            className="flex flex-col items-center gap-2 m-4 p-2 rounded-xl shadow-inset"
            style={{
              background: "lightgrey",
            }}
          >
            {/* Image container */}
            <div className="flex gap-2 justify-between items-start duration-300 rounded-lg">
              {groundImg?.filename ? (
                <img
                  src={`data:${groundImg.contentType};base64,${groundImg.content}`}
                  alt={groundImg.filename}
                  className="object-cover w-64 h-64 rounded-lg border-2"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center border-2 rounded-lg text-gray-500 bg-gray-100">
                  No image available
                </div>
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
                value={groundDetails?.refFeaturesIds || []}
                onChange={(e) =>
                  handleMultiSelectChange("refFeaturesIds", e.value)
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
                value={groundDetails?.refSportsCategoryIds || []}
                onChange={(e) =>
                  handleMultiSelectChange("refSportsCategoryIds", e.value)
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
                value={groundDetails?.refUserGuidelinesIds || []}
                onChange={(e) =>
                  handleMultiSelectChange("refUserGuidelinesIds", e.value)
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
                value={groundDetails?.refFacilitiesIds || []}
                onChange={(e) =>
                  handleMultiSelectChange("refFacilitiesIds", e.value)
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
                value={groundDetails?.refAdditionalTipsIds || []}
                onChange={(e) =>
                  handleMultiSelectChange("refAdditionalTipsIds", e.value)
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

          <div className="card flex justify-content-center mt-3">
            <Button label="Update" />
          </div>
        </TabPanel>

        <TabPanel header="Additional Details">
          <div className="flex items-center justify-between mt-3">
            <span className="block mb-1 font-medium text-black">Add-Ons:</span>
            {/* <Button
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
                <Button type="button" label="Add" onClick={handleAddNewAddon}/>
              </div>
            </OverlayPanel> */}
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            {addOns.map((addon, addonIndex) => {
              const selectedEntry = selectedAddonDates.find(
                (entry) => entry.refAddonId === addon.refAddonId
              );
              const disabledDates = addon.data
                .map((item: any) => {
                  if (!item.unAvailabilityDate) return null;

                  const parsedDate = parseDDMMYYYY(item.unAvailabilityDate);
                  return isNaN(parsedDate.getTime()) ? null : parsedDate;
                })
                .filter((date) => date !== null);

              return (
                <Panel key={addonIndex} header={addon.refAddOnName} toggleable>
                  {/* <p className="m-0 mb-2">Add-on ID: {addon.refAddonId}</p> */}

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
                          parseDDMMYYYY(a.unAvailabilityDate).getTime() -
                          parseDDMMYYYY(b.unAvailabilityDate).getTime()
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
        </TabPanel>
      </TabView>
      <Toast ref={toast} />
    </form>
  );
};

export default EditGroundSidebar;
