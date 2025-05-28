import React, { useEffect, useState } from "react";
import { fetchAdditionalTips, fetchAddOnAvailability, fetchAddOns, fetchGoundFacilities, fetchGroundFeatures, fetchSpecificGround, fetchSportCategories, fetchUserGuidelines, updateGround, type GroundResult } from "./GroundUtlis";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect, type MultiSelectChangeEvent } from "primereact/multiselect";
import { TabView, TabPanel } from 'primereact/tabview';
import { label } from "framer-motion/client";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { ToggleButton } from "primereact/togglebutton";

interface EditGroundSidebarProps {
  groundData: any; // Or number, if your ID is a number. Or any other appropriate type.
}

const EditGroundSidebar: React.FC<EditGroundSidebarProps> = ({
  groundData,
}) => {

  const [groundDetails, setGroundDetails] = useState<GroundResult | null>(null);

  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);
  const [addOns, setAddOns] = useState([
      { name: '', available: false, unavailableDates: [] },
    ]);

  const GroundFeatures = async () => {
    try {
      const result = await fetchGroundFeatures();
      const options: any = result.map((data: any) => ({
        label: data.refFeaturesName,
        value: data.refFeaturesId,
      }));
      console.log("options", options);
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
      console.log("result", result);
      const options: any = result.map((item) => ({
        label: item.refAdditionalTipsName,
        value: item.refAdditionalTipsId,
      }));
      setAdditionalTips(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GroundAddOnAvailablity = async () => {
    try {
        const result = await fetchAddOnAvailability();
        // const options: any = result.map((item) => ({
        //   label: item.refAddOn,
        //   value: item.refAddOnsId,
        // }));
        // setAddons(options);
      } catch (error) {
        console.log("error", error);
      }
  }


  const GroundDetails = async () => {
    try {
      const t = { refGroundId: groundData.refGroundId };
      const result = await fetchSpecificGround(t);
      console.log("result", result);
      const rawData = result.getAddons[0].arraydata;

      const groupedAddOnsArray = Object.values(
        rawData.reduce((acc: any, item: any) => {
          const key = item.refGroundId ?? "null"; // Use 'null' as a string key for consistency

          if (!acc[key]) {
            acc[key] = {
              refGroundId: item.refGroundId,
              refAddOnName: item.refAddOn,
              data: [],
            };
          }

          acc[key].data.push(item);
          return acc;
        }, {})
      );

      console.log(groupedAddOnsArray);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    setGroundDetails(groundData);
    GroundFeatures();
    GroundSportCategory();
    GroundUserGuideLines();
    GroundFacilities();
    GroundAdditionalTips();
    GroundAddOnAvailablity();
    GroundDetails();
  }, []);

  const handeUpdateGround = async () => {
    try {
      if (groundDetails) {
      const payload = {
        refGroundId: groundDetails.refGroundId,
        refGroundName: groundDetails.refGroundName,
        isAddOnAvailable: groundDetails.isAddOnAvailable,
        refAddOnsId: groundDetails.AddOn.map(String),
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
        IframeLink: groundData.IframeLink,
        refStatus: groundDetails.refStatus,
      };
      console.log("payload", payload);
      const response = await updateGround(payload);
      console.log("response", response);
    }
    } catch (error) {
      console.log("error", error);
    }
  }

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

  console.log("groundDetails", groundDetails);

  
    const handleAddAddOn = () => {
      setAddOns([
        ...addOns,
        { name: '', available: false, unavailableDates: [] },
      ]);
    };
  
    const handleChange = (index: number, key: string, value: any) => {
      const updated = [...addOns];
      updated[index][key] = value;
      setAddOns(updated);
    };


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
        </TabPanel>

        <TabPanel header="Additional Details">
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
            <div className="card flex-1 justify-content-center mt-3">
              <label
                className="block mb-1 font-medium text-black"
                htmlFor="addOns"
              >
                Add-Ons:
              </label>
              <MultiSelect
                value={groundDetails?.AddOn || []}
                onChange={(e: MultiSelectChangeEvent) =>
                  handleMultiSelectChange("AddOn", e.value)
                }
                options={addOns}
                optionLabel="label"
                id="addOns"
                placeholder="Select Addons"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                display="chip"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="block mb-1 font-medium text-black">Add-Ons:</span>
            <Button type="button" onClick={handleAddAddOn}>
              Add
            </Button>
          </div>

          <div>
            <Accordion multiple>
              {addOns.map((addOn, index) => (
                <AccordionTab key={index} header={
                  <div className="flex gap-2">
                    <span>Add-On 1:</span>
                    <span></span>
                  </div>
                }>
                  <div className="flex gap-2">
                    <InputText
                      className="w-full"
                      placeholder="Enter Add-On Name"
                      value={addOn.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                    />
                    <ToggleButton
                      checked={addOn.available}
                      onChange={(e) =>
                        handleChange(index, "available", e.value)
                      }
                    />
                  </div>

                  <div className="mt-3">
                    <h3>Unavailable Dates</h3>
                    <Calendar
                      selectionMode="multiple"
                      readOnlyInput
                      style={{ width: "100%" }}
                      value={addOn.unavailableDates}
                      onChange={(e) =>
                        handleChange(index, "unavailableDates", e.value)
                      }
                    />
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </TabPanel>
      </TabView>
      <div className="card flex justify-content-center mt-3">
        <Button label="Update" />
      </div>
    </form>
  );

};

export default EditGroundSidebar;
