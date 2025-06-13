import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import axios from "axios";

interface EditSidebarProps {
  groundData: string;
  onSuccess: () => void;
}
export interface GroundDetails {
  refGroundId: number;
  refGroundName: string;
  refGroundCustId: string;
  isAddOnAvailable: boolean;
  refAddOnsId: number | null;
  refFeaturesId: number[];
  refUserGuidelinesId: number[];
  refAdditionalTipsId: number[];
  refSportsCategoryId: number[];
  refFacilitiesId: number[];
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  refStatus: boolean;
  IframeLink: string;
  refTournamentPrice: string | null;
  approveGround: string;
  groundLocationLink: string | null;
  refFeaturesName: string[];
  refFacilitiesName: string[];
  refUserGuidelinesName: string[];
  refAdditionalTipsName: string[];
  refSportsCategoryName: string[];
  addOns: AddOn[];
}

interface SubAddOnItem {
  id: number;
  item: string;
  price: string;
}

interface SubAddOn {
  id: number;
  subAddOn: string;
  price: string;
  items: SubAddOnItem[];
}

interface AddOn {
  id: number;
  addOn: string;
  price: string;
  subAddOns: SubAddOn[];
}

export interface GroundAddOn {
  refAddOnsId: number;
  refAddOn: string;
  refGroundId: number;
  refStatus: boolean;
  refAddonPrice: string;
}
interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

const GroundView: React.FC<EditSidebarProps> = ({ groundData }) => {
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [groundDetails, setGroundDetails] = useState<GroundDetails>();
  //   const [listOfAddOns, setListOfAddOns] = useState<GroundAddOn[]>([]);
  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  useEffect(() => {
    fetchGroundDetails();
  }, []);

  const fetchGroundDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/groundRoutes/getGround`,

        { refGroundId: groundData },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("running");

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("JWTtoken", data.token);

      if (data.success) {
        // localStorage.setItem("JWTtoken", data.token);
        setGroundDetails(data.result);
        console.log("refGroundName", data.result.refGroundName);
        // setListOfAddOns(data.listOfAddones);
        setGroundImg(data.imgResult[0].refGroundImage);
        console.log("data.imgResult", data.imgResult);
      } else {
        setError("Failed to fetch ground details.");
      }
    } catch (err) {
      setError("Error fetching ground details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-3 ">
      <b className="text-4xl font-bold flex m-3">
        Ground Id : {groundDetails?.refGroundCustId}{" "}
      </b>

      {groundImg?.content && groundImg?.contentType && (
        <div className=" p-2 w-fit shadow-md mb-3 ">
          <img
            src={`data:${groundImg.contentType};base64,${groundImg.content}`}
            alt={groundImg.filename || "Ground Preview"}
            className="object-cover w-64 h-64 rounded "
          />
          <div className="text-center text-sm mt-2 text-gray-600">
            {groundImg.filename}
          </div>
        </div>
      )}
      <div className="flex">
        <div className="flex-1">
          <b>Ground Name : </b>
          {groundDetails?.refGroundName}{" "}
        </div>
        <div className="flex-1">
          <b>Ground Price (Day wise) : </b>
          {groundDetails?.refGroundPrice}{" "}
        </div>
        <div className="flex-1">
          <b>Ground Price (Tournament wise) : </b>
          {groundDetails?.refTournamentPrice ?? "  -"}{" "}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <b>Ground Location : </b>
          {groundDetails?.refGroundLocation}{" "}
        </div>
        <div className="flex-1">
          <b>Ground District : </b>
          {groundDetails?.refGroundState}{" "}
        </div>
        <div className="flex-1">
          <b>Ground District : </b>
          {groundDetails?.refGroundPincode}{" "}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1 ">
          <b>Ground Location (IframeLink): </b>
          {groundDetails?.IframeLink ? (
            <a
              href={groundDetails.IframeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Map
            </a>
          ) : (
            "-"
          )}
        </div>
        <div className="flex-1">
          <b>Ground Location(GPS code) : </b>
          {groundDetails?.groundLocationLink ?? "  -"}{" "}
        </div>
        <div className="flex-1">
          <b>Ground Description : </b>
          {groundDetails?.refDescription ?? "  -"}{" "}
        </div>
      </div>

      {/* <div className="flex gap-3 mt-3">
  <div className="flex-1">
    <b>Sports Category: </b>
    {Array.isArray(groundDetails?.refSportsCategoryName) && groundDetails.refSportsCategoryName.length > 0 ? (
      <ul className="list-disc list-inside ml-5 mt-1">
        {groundDetails.refSportsCategoryName.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    ) : (
      <span> - </span>
    )}
  </div>

  <div className="flex-1">
    <b>Features Name: </b>
    {Array.isArray(groundDetails?.refFeaturesName) && groundDetails.refSportsCategoryName.length > 0 ? (
      <ul className="list-disc list-inside ml-5 mt-1">
        {groundDetails.refFeaturesName.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    ) : (
      <span> - </span>
    )}
  </div>
  <div className="flex-1">
    <b>Additional Tips: </b>
    {Array.isArray(groundDetails?.refAdditionalTipsName) && groundDetails.refSportsCategoryName.length > 0 ? (
      <ul className="list-disc list-inside ml-5 mt-1">
        {groundDetails.refAdditionalTipsName.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    ) : (
      <span> - </span>
    )}
  </div>
</div> */}

      <div className="shadow p-4 rounded-md mt-3">
        <div className="flex gap-3">
          <div className="flex-1 shadow">
            <b>Sports Category: </b>
            {Array.isArray(groundDetails?.refSportsCategoryName) &&
            groundDetails.refSportsCategoryName.length > 0 ? (
              <ul className="list-disc list-inside ml-5 mt-1">
                {groundDetails.refSportsCategoryName.map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            ) : (
              <span> - </span>
            )}
          </div>

          <div className="flex-1 shadow">
            <b>Features Name: </b>
            {Array.isArray(groundDetails?.refFeaturesName) &&
            groundDetails.refFeaturesName.length > 0 ? (
              <ul className="list-disc list-inside ml-5 mt-1">
                {groundDetails.refFeaturesName.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            ) : (
              <span> - </span>
            )}
          </div>

          <div className="flex-1">
            <b>Additional Tips: </b>
            {Array.isArray(groundDetails?.refAdditionalTipsName) &&
            groundDetails.refAdditionalTipsName.length > 0 ? (
              <ul className="list-disc list-inside ml-5 mt-1">
                {groundDetails.refAdditionalTipsName.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            ) : (
              <span> - </span>
            )}
          </div>
        </div>

        <div className="w-full flex flex-row justify-around my-3">
          <div className="w-[35%] shadow flex flex-col justify-center align-items">
            <div>
              <b>User Guidelines</b>
            </div>
            <div className="flex flex-row">
              <ul className="list-disc list-inside ml-5 mt-1">
                {groundDetails?.refUserGuidelinesName.map((data, index) => {
                  return (
                    <>
                      <li key={index}>{data}</li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="w-[35%] shadow flex flex-col justify-center align-items">
            <div>
              <b>Facilities</b>
            </div>
            <div className="flex flex-row">
              <ul className="list-disc list-inside ml-5 mt-1">
                {groundDetails?.refFacilitiesName.map((data, index) => {
                  return (
                    <>
                      <li key={index}>{data}</li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-6 space-y-6">
      {groundDetails?.addOns?.map((addon, index) => (
        <div key={index} className="p-5 border rounded-md bg-gray-50 shadow-md">
          <div className="text-lg font-bold">Add-on:</div>
          <div className="ml-6 text-base font-medium">{addon.addOn} - ₹{addon.price}</div>

          {addon.subAddOns?.length > 0 && (
            <div className="mt-4">
              <div className="text-md font-semibold">Sub Add-ons:</div>
              {addon.subAddOns.map((sub, subIndex) => (
                <div key={subIndex} className="ml-6 mt-2">
                  <div className="font-medium">{sub.subAddOn} (₹{sub.price})</div>

                  {sub.items?.length > 0 && (
                    <div className="ml-6 mt-1">
                      <div className="text-sm font-medium">Items:</div>
                      <ul className="ml-4 list-none">
                        {sub.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm ml-4">
                            {item.item} - ₹{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div> */}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-6">
        {groundDetails?.addOns?.map((addon, index) => (
          <div
            key={index}
            className="p-5 border rounded-md bg-gray-50 shadow-md w-64 flex flex-col"
          >
            <div className="text-lg font-bold mb-2">Add-on:</div>
            <ul className="ml-4 list-disc list-inside text-base font-medium mb-4">
              <li>
                {addon.addOn} - ₹{addon.price}
              </li>
            </ul>

            {addon.subAddOns?.length > 0 && (
              <div>
                <div className="text-md font-semibold mb-2">Sub Add-ons:</div>
                <ul className="ml-4 list-disc list-inside">
                  {addon.subAddOns.map((sub, subIndex) => (
                    <li key={subIndex} className="mb-3">
                      <div className="font-medium mb-1">
                        {sub.subAddOn} (₹{sub.price})
                      </div>

                      {sub.items?.length > 0 && (
                        <div className="ml-6">
                          <div className="text-sm font-medium mb-1">Items:</div>
                          <ul className="ml-4 list-disc list-inside">
                            {sub.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm">
                                {item.item} - ₹{item.price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroundView;
