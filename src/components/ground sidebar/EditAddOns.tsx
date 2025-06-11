import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

interface EditAddOnsProps {
  selectedAddon: string | null;
  onSave: (addon: string) => void;
}

interface NestedSubcategory {
  id: number | null;
  item: string;
  price: number | null;
}

interface Subcategory {
  id: number | null;
  subAddOn: string;
  price?: number | null;
  isItemsAvailable: boolean;
  items?: NestedSubcategory[];
  [key: string]: any;
}

interface EditAddOnForm {
  id: number;
  addOn: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  subAddOns?: Subcategory[];
}

const EditAddOns: React.FC<EditAddOnsProps> = ({ selectedAddon, onSave }) => {
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState<EditAddOnForm>({
    id: 0,
    addOn: "",
    isSubaddonsAvailable: false,
    price: null,
    subAddOns: [],
  });

  useEffect(() => {
    if (selectedAddon) {
      const data = JSON.parse(selectedAddon);

      const subAddons = (data.subAddOns || []).map((sub: any) => ({
        ...sub,
        isItemsAvailable: sub.items ? sub.items.length > 0 : (sub.refItems && sub.refItems.length > 0),
      }));

      const res: EditAddOnForm = {
        id: data.id,
        addOn: data.addOn,
        isSubaddonsAvailable: subAddons.length > 0 ? true : (subAddons.length == undefined && false),
        price: data.price,
        subAddOns: subAddons,
      };

      setForm(res);
    }
  }, [selectedAddon]);


  const handleSubmit = () => {
    try {
      validateForm();
      const addonString = JSON.stringify(form);
      onSave(addonString);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
      console.error(error.message);
    }
  };

  const validateForm = () => {
    if (!form.addOn) {
      throw new Error("Add-On Title and Price are required.");
    }
    if(!form.isSubaddonsAvailable && form.price === null) {
        throw new Error("Add-On Price is required.");
    }
    if (form.isSubaddonsAvailable) {
        if (!form.subAddOns || form.subAddOns.length === 0) {
          throw new Error("Enter atleast one subcategory and price.");
        }
      for (const sub of form.subAddOns || []) {
        if (!sub.subAddOn && !sub.name) {
          throw new Error("Subcategory Title is required.");
        }
         if (!sub.isItemsAvailable && sub.price === null) {
           throw new Error(`Subcategory "${sub.subAddOn}" Price is required.`);
         }
        if (sub.isItemsAvailable) {
          for (const item of sub.items || []) {
            if (!item.item || item.price === null) {
              throw new Error("Item Name and Price are required.");
            }
          }
        } else if (sub.price === null) {
          throw new Error("Subcategory Price is required when items are not available.");
        }
      }
    }
  };

  console.log(form);

  const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: any) => {
    const updated = [...(form.subAddOns || [])];
    if (field === "isItemsAvailable") {
      updated[index][field] = value;
      if (value && !updated[index].items) {
        updated[index].items = [{ id: 0, item: "", price: null }];
      }
      if (!value) {
        delete updated[index].items;
      }
    } else {
      updated[index][field] = value;
    }
    setForm({ ...form, subAddOns: updated });
  };

  const handleNestedChange = (subIndex: number, nestedIndex: number, field: keyof NestedSubcategory, value: any) => {
    const updated = [...(form.subAddOns || [])];
    const nested = updated[subIndex].items || [];
    nested[nestedIndex] = { ...nested[nestedIndex], [field]: value };
    updated[subIndex].items = nested;
    setForm({ ...form, subAddOns: updated });
  };

  const addSubcategory = () => {
    setForm({
      ...form,
      subAddOns: [...(form.subAddOns || []), { id: null, subAddOn: "", isItemsAvailable: false, price: null, items: [] }],
    });
  };

  const removeSubcategory = (index: number) => {
    const updated = [...(form.subAddOns || [])];
    updated.splice(index, 1);
    setForm({ ...form, subAddOns: updated });
  };

  const addNestedSub = (subIndex: number) => {
    const updated = [...(form.subAddOns || [])];
    const nested = updated[subIndex].items || [];
    nested.push({ id: null, item: "", price: null });
    updated[subIndex].items = nested;
    setForm({ ...form, subAddOns: updated });
  };

  const removeNestedSub = (subIndex: number, nestedIndex: number) => {
    const updated = [...(form.subAddOns || [])];
    updated[subIndex].items = updated[subIndex].items?.filter((_, i) => i !== nestedIndex);
    setForm({ ...form, subAddOns: updated });
  };

  return (
    <div className="p-1 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-black mb-4">Edit Add-On</h2>
      <div className="flex gap-3">
        <div className="w-8/12">
          <label className="block text-sm font-medium mb-1">Add-On Title</label>
          <InputText
            value={form.addOn}
            onChange={(e) => setForm({ ...form, addOn: e.target.value })}
            className="w-full p-inputtext-sm"
          />
        </div>

        <div className="flex flex-col items-start w-4/12">
          <label className="text-sm font-medium mb-1">Has Subcategories?</label>
          <ToggleButton
            checked={form.isSubaddonsAvailable}
            onChange={(e) => setForm({ ...form, isSubaddonsAvailable: e.value })}
            onLabel="Yes"
            offLabel="No"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            className="w-[80px] text-xs"
          />
        </div>
      </div>

      <Divider className="my-2" />

      {form.isSubaddonsAvailable ? (
        <div className="space-y-4">
          {form.subAddOns?.map((sub, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-base">Subcategory {index + 1}</span>
                <Button icon="pi pi-trash" severity="danger" text size="small" onClick={() => removeSubcategory(index)} />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <InputText
                  value={sub.subAddOn ? sub.subAddOn : sub.name}
                  onChange={(e) => handleSubcategoryChange(index, `${sub.subAddOn ? "subAddOn" : "name"}`, e.target.value)}
                  placeholder="Subcategory Title"
                  className="flex-grow min-w-[150px] p-inputtext-sm"
                />

                <div className="flex items-center gap-2 min-w-[100px]">
                  <label className="text-xs whitespace-nowrap">Has Items?</label>
                  <ToggleButton
                    checked={sub.isItemsAvailable}
                    onChange={(e) => handleSubcategoryChange(index, "isItemsAvailable", e.value)}
                    onLabel="Yes"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    className="w-[80px] text-xs"
                  />
                </div>
              </div>

              <div className="mt-1">
                {!sub.isItemsAvailable && (
                  <InputNumber
                    value={sub.price || null}
                    onValueChange={(e) => handleSubcategoryChange(index, "price", e.value)}
                    placeholder="Price"
                    mode="currency"
                    currency="inr"
                    locale="en-US"
                    className="w-[120px] p-inputtext-sm"
                  />
                )}
              </div>

              {sub.isItemsAvailable && (
                <div className="mt-3 space-y-2">
                  {sub.items?.map((nested, nIndex) => (
                    <div key={nIndex} className="flex items-center gap-2">
                      <InputText
                        value={nested.item}
                        onChange={(e) => handleNestedChange(index, nIndex, "item", e.target.value)}
                        placeholder={`Item ${nIndex + 1}`}
                        className="min-w-[150px] p-inputtext-sm"
                      />
                      <InputNumber
                        value={nested.price}
                        onValueChange={(e) => handleNestedChange(index, nIndex, "price", e.value)}
                        placeholder="Price"
                        mode="currency"
                        currency="inr"
                        locale="en-US"
                        className="p-inputtext-sm"
                      />
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        size="small"
                        onClick={() => removeNestedSub(index, nIndex)}
                      />
                    </div>
                  ))}
                  <Button label="Add Nested" icon="pi pi-plus" size="small" text onClick={() => addNestedSub(index)} className="text-primary" />
                </div>
              )}
            </div>
          ))}
          <Button label="Add Subcategory" icon="pi pi-plus" size="small" text onClick={addSubcategory} className="text-primary" />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price</label>
          <InputNumber
            value={form.price || null}
            onValueChange={(e) => setForm({ ...form, price: e.value })}
            mode="currency"
            currency="inr"
            locale="en-US"
            className="w-[150px] p-inputtext-sm"
            placeholder="Price"
          />
        </div>
      )}

      <Divider className="my-5" />
      <Button label="Save Add-On" icon="pi pi-save" className="w-full p-button-sm" onClick={handleSubmit} />
      <Toast ref={toast} />
    </div>
  );
};

export default EditAddOns;