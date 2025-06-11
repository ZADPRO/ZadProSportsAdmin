import React, { useEffect, useRef, useState } from "react";
import {
  addAddOnsAvailability,
  deleteAddon,
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
import { MultiSelect } from "primereact/multiselect";
import { TabView, TabPanel } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";
import { Chip } from "primereact/chip";
import { FileUpload } from "primereact/fileupload";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import CreateAddOns from "./CreateAddOns";
import EditAddOns from "./EditAddOns";

interface EditGroundSidebarProps {
  groundData: any;
  onSuccess: () => void;
}

interface AddOnItem {
  id: number;
  addOn: string;
  price: number;
  unAvailabilityDates: AddOnAvailability[];
  subAddOns: any[]; // You can define a more specific type if known
}

type AddOnAvailability = {
  addOnsAvailabilityId: number;
  unAvailabilityDate: string;
  [key: string]: any; // optional: if you have more properties
};

type SelectedAddonDates = {
  refAddonId: number;
  dates: Date[];
};

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

const EditGroundSidebar: React.FC<EditGroundSidebarProps> = ({
  groundData,
  onSuccess,
}) => {
  const [groundDetails, setGroundDetails] = useState<GroundResult | null>(null);

  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const [addOns, setAddOns] = useState<AddOnItem[]>([]);

  const [newAddonSidebar, setNewAddonSidebar] = useState(false);
  const [editAddonSidebar, setEditAddonSidebar] = useState(false);

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
    const res = addOns.find((item: any) => item.id === addon.id);
    setEditingAddon(JSON.stringify(res));
    setEditingIndex(index);
    setIsEditing(true);
    setEditAddonSidebar(true);
  };

  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  const [selectedAddonDates, setSelectedAddonDates] = useState<
    SelectedAddonDates[]
  >([]);

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
      const response = await fetchSpecificGround(t);
      console.log("result", response);

      setGroundDetails(response.result);
      setGroundImg(response.imgResult?.[0].refGroundImage || "");

      const rawAddOns = response.result?.addOns || [];
      const availabilityData = response.getAddons?.[0]?.arraydata || [];

      // Step 1: Create map of refAddOnsId → unavailability objects
      const unavailabilityMap = new Map<number, any[]>();

      availabilityData.forEach((entry: any) => {
        const id = entry.refAddOnsId;
        if (!unavailabilityMap.has(id)) {
          unavailabilityMap.set(id, []);
        }
        unavailabilityMap.get(id)?.push(entry); // push whole object
      });

      // Step 2: Build final addOns with matching unavailability
      const groupedAddOns = rawAddOns.reduce((acc: any, curr: any) => {
        const { id, addOn, price, subAddOns } = curr;

        if (!acc[id]) {
          acc[id] = {
            id,
            addOn,
            price,
            subAddOns: subAddOns || [],
            unAvailabilityDates: unavailabilityMap.get(id) || [],
          };
        }

        return acc;
      }, {});

      const groupedAddOnsArray = Object.values(groupedAddOns);
      setAddOns(groupedAddOnsArray as AddOnItem[]);
    } catch (error) {
      console.error("Error in GroundDetails:", error);
    }
  };

  useEffect(() => {
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
          refFeaturesId: groundDetails.refFeaturesId,
          refUserGuidelinesId: groundDetails.refUserGuidelinesId,
          refFacilitiesId: groundDetails.refFacilitiesId,
          refAdditionalTipsId: groundDetails.refAdditionalTipsId,
          refSportsCategoryId: groundDetails.refSportsCategoryId,
          refTournamentPrice: groundDetails.refTournamentPrice,
          refGroundPrice: groundDetails.refGroundPrice,
          refGroundImage: groundDetails.refGroundImage,
          refGroundLocation: groundDetails.refGroundLocation,
          refGroundPincode: groundDetails.refGroundPincode,
          refGroundState: groundDetails.refGroundState,
          refDescription: groundDetails.refDescription,
          IframeLink: groundDetails.IframeLink,
          refStatus: groundDetails.refStatus,
          refAddOns: addOns.map((addon) => ({
            ...(addon.id && { refAddOnsId: addon.id }),
            name: addon.addOn,
            price: addon.price,
            isSubaddonsAvailable: !!addon.subAddOns?.length,
            refSubAddOns:
              addon.subAddOns?.map((sub) => ({
                ...(sub.id && { refSubAddOnsId: sub.id }),
                name: sub.subAddOn || sub.name, // <-- here
                price: sub.price,
                isItemsAvailable: !!sub.items?.length,
                refItems:
                  sub.items?.map((item: any) => ({
                    ...(item.id && { refItemsId: item.id }),
                    name: item.item, // <-- here
                    price: item.price,
                  })) || [],
              })) || [],
          })),
        };

        console.log("payload", payload);
        const response = await updateGround(payload);
        if (response.success) {
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

  console.log(addOns);

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

  const handleRemoveAddon = async (addon: any, indexToRemove: number) => {
    try {
      // If addon has an ID, call delete API
      if (addon?.id) {
        await handleDeleteAddOn(addon.id);
      }

      // Remove addon from the local state
      const updatedAddOns = addon?.id
        ? addOns.filter((a) => a.id !== addon.id)
        : [...addOns].filter((_, index) => index !== indexToRemove);

      setAddOns(updatedAddOns);
    } catch (error) {
      console.error("Failed to remove addon:", error);
    }
  };

  const handleDeleteAddOn = async (addonId: number) => {
    try {
      const response = await deleteAddon({ refAddOnsId: addonId });
      console.log("response", response);
    } catch (error) {
      console.error("Error deleting add-on:", error);
    }
  };

  const handleRemoveDate = async (addonAvailabilityId: number) => {
    const response = await removerAddonAvailability({
      addOnsAvailabilityId: addonAvailabilityId,
    });
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
        unAvailabilityDate: date
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-"),
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
  console.log(formDataImages);

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
    console.log(dateStr);
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
      <h1 className="text-[20px] font-bold uppercase text-black">
        Edit Ground
      </h1>
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
        </TabPanel>

        <TabPanel header="Additional Details">
          <div className="flex items-center justify-between mt-3">
            <span className="block mb-1 font-medium text-black">Add-Ons:</span>
            <Button
              type="button"
              label="Create New AddOn"
              onClick={() => handleAddNew()}
            />
            {/* <OverlayPanel ref={op}>
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
                <Button type="button" label="Add" />
              </div>
            </OverlayPanel> */}
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            {addOns.map((addon, addonIndex) => {
              const selectedEntry = selectedAddonDates.find(
                (entry) => entry.refAddonId === addon.id
              );
              console.log(addon);
              // Convert unAvailabilityDate strings to Date objects
              const disabledDates = addon.unAvailabilityDates
                .map((entry) => {
                  const parsedDate = parseDDMMYYYY(entry.unAvailabilityDate);
                  return isNaN(parsedDate.getTime()) ? null : parsedDate;
                })
                .filter((date): date is Date => date !== null);

              return (
                <Panel key={addonIndex} header={addon.addOn} toggleable>
                  <div className="flex flex-col gap-2 mt-2 justify-between">
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
                        onClick={() => handleRemoveAddon(addon, addonIndex)}
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <Calendar
                        value={selectedEntry?.dates || []}
                        onChange={(e) =>
                          handleDateChange(addon.id, e.value as Date[] | null)
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
                        onClick={() => handleAddDates(addon.id)}
                        className="mb-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {addon.unAvailabilityDates
                      .slice()
                      .sort(
                        (a, b) =>
                          parseDDMMYYYY(a.unAvailabilityDate).getTime() -
                          parseDDMMYYYY(b.unAvailabilityDate).getTime()
                      )
                      .map((entry, dateIndex) => (
                        <Chip
                          key={entry.addOnsAvailabilityId || dateIndex}
                          label={entry.unAvailabilityDate}
                          removable
                          onRemove={() => {
                            console.log(addon);
                            handleRemoveDate(entry.addOnsAvailabilityId); // <-- optionally pass ID
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
      <div className="card flex justify-content-center mt-3">
        <Button label="Update" />
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
            try {
              const parsed = JSON.parse(addonString);

              // Normalize the AddOn structure
              const normalizeAddon = (addon: any) => ({
                ...addon,
                price: typeof addon.price === "number" ? addon.price : 0,
                addOn: addon.name,
                unAvailabilityDates: Array.isArray(addon.unAvailabilityDates)
                  ? addon.unAvailabilityDates
                  : [],
                subAddOns: (addon.refSubAddOns || []).map((sub: any) => ({
                  ...sub,
                  price: typeof sub.price === "number" ? sub.price : null,
                  name: sub.name,
                  refItems: (sub.refItems || []).map((item: any) => ({
                    ...item,
                    price: typeof item.price === "number" ? item.price : null,
                    name: item.name,
                  })),
                })),
              });

              const addon = normalizeAddon(parsed);

              const updatedAddons = [...addOns];

              if (isEditing && editingIndex !== null) {
                updatedAddons[editingIndex] = addon;
              } else {
                updatedAddons.push(addon);
              }

              setAddOns(updatedAddons);
            } catch (error) {
              console.error("Invalid AddOn JSON:", error);
            }

            setNewAddonSidebar(false);
          }}
        />
      </Sidebar>

      <Sidebar
        visible={editAddonSidebar}
        onHide={() => setEditAddonSidebar(false)}
        position="right"
        style={{ width: "50%" }}
      >
        <EditAddOns
          selectedAddon={editingAddon}
          onSave={(addonString: string) => {
            const updatedAddon = JSON.parse(addonString); // Convert back to object
            console.log("addon", updatedAddon);

            if (editingIndex !== null) {
              const updatedAddons = [...addOns];
              const existingAddon = updatedAddons[editingIndex];

              // Preserve unAvailabilityDates from the original addon
              updatedAddons[editingIndex] = {
                ...updatedAddon,
                unAvailabilityDates: existingAddon.unAvailabilityDates || [],
              };

              console.log("updatedAddons", updatedAddons);
              setAddOns(updatedAddons);
            }

            setEditAddonSidebar(false);
          }}
        />
      </Sidebar>

      <Toast ref={toast} />
    </form>
  );
};

export default EditGroundSidebar;
