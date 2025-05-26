import axios from "axios";
// import { AppleIcon } from "lucide-react";
// import {
//   InputSwitch,
//   type InputSwitchChangeEvent,
// } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import { Button } from "primereact/button";

interface FeatureResult {
  refFeaturesId: number;
  refFeaturesName: string;
}
interface option {
  label: string;
  value: number;
}

interface SportCategoryResult {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

interface sportoption {
  label: string;
  value: number;
}

const GroundSidebar: React.FC = () => {
  // ground features
  const [
    ,
    // getGroundFeatures
    setgetGroundFeatures,
  ] = useState<FeatureResult[] | []>([]);

  // const [checked, setChecked] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>();

  const [option, setOption] = useState<option[]>([]);
  const GroundFeatures = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listFeatures`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "Application/json",
        },
      })
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        if (data.success) {
          console.log(data);
          localStorage.setItem("JWTtoken", data.token);

          setgetGroundFeatures(data.result);
          const datas: option[] = data.result.map((data: any) => ({
            label: data.refFeaturesName,
            value: data.refFeaturesId,
          }));
          setOption(datas);
        }
      });
  };

  useEffect(() => {
    GroundFeatures();
  }, []);
  // sport category

  const [
    ,
    // getsportCategory
    setgetsportCategory,
  ] = useState<SportCategoryResult[] | []>([]);

  // const [checked, setChecked] = useState<boolean>(false);
  const [selectedsportOption, setSelectedsportOption] = useState<number>();

  const [sportOptionoption, setSportOptionoption] = useState<sportoption[]>([]);
  const GroundSportCategory = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/settingRoutes/listSportCategory`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
          "Content-Type": "Application/json",
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

          setgetsportCategory(data.result);
          const datas: option[] = data.result.map((data: any) => ({
            label: data.refSportsCategoryName,
            value: data.refSportsCategoryId,
          }));
          setSportOptionoption(datas);
        }
      });
  };

  useEffect(() => {
    GroundSportCategory();
  }, []);

  return (
    <div className="m-3">
      <h1 className="text-[20px] font-bold uppercase text-black">Ground</h1>

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
          />{" "}
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
          />{" "}
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="groundlocation"
          >
            Ground Location:
          </label>
          <InputText
            id="groundlocation"
            className="w-full flex-1 "
            placeholder="Ground Location"
          />{" "}
        </div>

        <div className="flex-1">
          {" "}
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="groundstate"
          >
            Ground State:
          </label>{" "}
          <InputText
            id="groundstate"
            className="w-full flex-1"
            placeholder="Ground State"
          />{" "}
        </div>
        <div className="flex-1">
          {" "}
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="groundpincode"
          >
            Ground Pincode:
          </label>{" "}
          <InputText
            id="groundpincode"
            className="w-full flex-1"
            placeholder="Ground Pincode"
          />{" "}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          {" "}
          <label
            className="block mb-1 font-medium text-black"
            htmlFor="grounddesc"
          >
            Ground Description:
          </label>{" "}
          <InputText
            id="grounddesc"
            className="w-full flex-1 "
            placeholder="Description"
          />{" "}
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
            value={selectedOption}
            onChange={(e: MultiSelectChangeEvent) => {
              setSelectedOption(e.value);
              console.log("e.value", e.value);
            }}
            options={option}
            optionLabel="label"
            id="groundFeatures"
            placeholder="Select Ground Features"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
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
            value={selectedsportOption}
            onChange={(e: MultiSelectChangeEvent) => {
              setSelectedsportOption(e.value);
              console.log("e.value", e.value);
            }}
            options={sportOptionoption}
            optionLabel="label"
            id="SportCategory"
            placeholder="Sport Category"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
        </div>
      </div>

      <div className="card flex justify-content-center mt-3">
        <Button
          label="Submit"
          // onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default GroundSidebar;
