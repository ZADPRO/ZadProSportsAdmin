import { Card } from "primereact/card";
import React, { useState } from "react";
// import SettingsSideBar from "./SettingsSideBar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import SportCategory from "./SportCategory";
import Features from "./Features";
import UserGuidelines from "./UserGuidlines";
import Facilities from "./Facilities";
import AdditionalTips from "./AdditionalTips";
// import FoodAndSnacks from "./FoodandSnacks";

const SettingsCard: React.FC = () => {
  const [sportvisibleRight, setsportvisibleRight] = useState<boolean>(false);
  const [featuresvisibleRight, setFeaturesVisibleRight] =
    useState<boolean>(false);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [facilitiesvisibleRight, setFacilitiesVisibleRight] =
    useState<boolean>(false);
  const [tipsvisibleRight, setTipsVisibleRight] = useState<boolean>(false);
  // const [foodvisibleRight, setFoodVisibleRight] = useState<boolean>(false);
  // const [combovisibleRight, setComboVisibleRight] = useState<boolean>(false);

  

  return (
    <div className="overall">
      <div className=" firstrow m-3 flex">
        <div className="m-3 flex-1">
          <div className="card ">
            <Card title="Sports Category" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setsportvisibleRight(true)}
                />
              </div>
            </Card>
            <Sidebar
              visible={sportvisibleRight}
              position="right"
              onHide={() => setsportvisibleRight(false)}
              style={{ width: "60%" }}
            >
              <h2 className="text-black text-xl  font-bold">Sport Category</h2>
              <SportCategory />
            </Sidebar>{" "}
          </div>
        </div>
        <div className="m-3 flex-1">
          <div className="card flex-1">
            {/* <Card title="Features" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setFeaturesVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={featuresvisibleRight}
                position="right"
                onHide={() => setFeaturesVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2 className="text-black text-xl font-bold">
                  Ground Features
                </h2>
                <Features />
              </Sidebar>{" "}
            </Card> */}
          </div>
        </div>
        <div className="m-3 flex-1">
          <div className="card flex-1 ">
            {/* <Card title="User Guidelines" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={visibleRight}
                position="right"
                onHide={() => setVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2 className="text-black text-xl  font-bold">
                  User Guidelines
                </h2>
                <UserGuidelines />
              </Sidebar>{" "}
            </Card> */}
          </div>
        </div>
        <div className="m-3 flex-1">
          <div className="card flex-1 ">
            {/* <Card title="Facilities" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setFacilitiesVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={facilitiesvisibleRight}
                position="right"
                onHide={() => setFacilitiesVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2 className="text-black text-xl  font-bold">
                  Ground Facilities
                </h2>
                <Facilities />
              </Sidebar>{" "}
            </Card> */}
          </div>
        </div>
      </div>
      <div className="secondrow m-3 flex">
        <div className="m-3 flex-1 ">
          <div className="card flex-1">
            {/* <Card title="Additional Tips" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setTipsVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={tipsvisibleRight}
                position="right"
                onHide={() => setTipsVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2 className="text-black text-xl  font-bold">
                  Additional Tips
                </h2>
                <AdditionalTips />
              </Sidebar>{" "}
            </Card> */}
          </div>
        </div>
        <div className="m-3 flex-1">
          {/* <div className="card flex-1 ">
            <Card title="Food And Snacks" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setFoodVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={foodvisibleRight}
                position="right"
                onHide={() => setFoodVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2  className="text-black text-xl  font-bold">Food And Snacks</h2>
                <FoodAndSnacks/>
              </Sidebar>{" "}
            </Card>
          </div> */}
        </div>
        <div className="m-3 flex-1">
          {/* <div className="card flex-1 ">
            <Card title="Food Combo" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // padding: "1rem",
                }}
              >
                <Button
                  // label=""
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => setComboVisibleRight(true)}
                />
              </div>
              <Sidebar
                visible={combovisibleRight}
                position="right"
                onHide={() => setComboVisibleRight(false)}
                style={{ width: "60%" }}
              >
                <h2  className="text-black text-xl  font-bold">Right Sidebar</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </Sidebar>{" "}
            </Card>
          </div> */}
        </div>
        <div className="m-3 flex-1"></div>
      </div>
    </div>
  );
};

export default SettingsCard;
