import axios from "axios";
import decrypt from "../../common/helper";

export interface GroundAdd {
  refGroundName: string;
  isAddOnAvailable: boolean;
  refAddOnsId: string[];
  refFeaturesId: string[];
  refUserGuidelinesId: string[];
  refFacilitiesId: string[];
  refAdditionalTipsId: string[];
  refSportsCategoryId: string[];
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  IframeLink: string;
  refStatus: boolean;
}

export interface GroundResult {
  refGroundId: number;
  refGroundName: string;
  refGroundCustId: string;
  isRoomAvailable: boolean;
  isAddOnAvailable: boolean;
  AddOn: number[];
  refRoomImage: string;
  refFeaturesId: string; // stored as PostgreSQL array string, e.g. "{1,2}"
  refFeaturesIds: number[];
  refUserGuidelinesId: string;
  refUserGuidelinesIds: number[];
  refAdditionalTipsId: string;
  refAdditionalTipsIds: number[];
  refSportsCategoryId: string;
  refSportsCategoryIds: number[];
  refFacilitiesId: string;
  refFacilitiesIds: number[];
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  refStatus: boolean;
  refFeaturesName: string[];
  refFacilitiesName: string[];
  refUserGuidelinesName: string[];
  refAdditionalTipsName: string[];
  refSportsCategoryName: string[];
  IframeLink: string;
}

export interface UpdateGround {
  refGroundId: number;
  refGroundName: string;
  isAddOnAvailable: boolean;
  refAddOnsId: string[];
  refFeaturesId: string[];     
  refUserGuidelinesId: string[];
  refFacilitiesId: string[];
  refAdditionalTipsId: string[];
  refSportsCategoryId: string[];
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  IframeLink: string;
  refStatus: boolean;
}


export interface GroundFeaturesResult {
  refFacilitiesId: number;
  refFacilitiesName: string;
}

export interface SportCategoryResult {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

export interface UserGuidlines {
  refUserGuidelinesId: number;
  refUserGuidelinesName: string;
}

export interface FacilityResult {
  refFacilitiesId: number;
  refFacilitiesName: string;
}

export interface AdditionalTips {
  refAdditionalTipsId: number;
  refAdditionalTipsName: string;
}

export interface AddOns {
  refAddOnsId: number;
  refAddOn: string;
}

export const fetchGroundFeatures = async (): Promise<GroundFeaturesResult[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listFeatures`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
};


export const fetchSportCategories = async (): Promise<
  SportCategoryResult[]
> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listSportCategory`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );

  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
};

export const fetchUserGuidelines = async (): Promise<UserGuidlines[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listUserGuidelines`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );

  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
};

export const fetchGoundFacilities = async (): Promise<FacilityResult[]> => {
  
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listFacilities`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
}

export const fetchAdditionalTips = async (): Promise<AdditionalTips[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listAdditionalTips`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
}

export const fetchSpecificGround = async ( formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/getGround`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);
  console.log(decrypted)
  if (decrypted.success) {
    return decrypted;
  }
}

export const fetchAddOns = async (): Promise<AddOns[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/groundRoutes/listAddOns`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
}

export const fetchAddOnAvailability = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/groundRoutes/listAddonAvailability`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
}

export const createNewGround = async (formData: GroundAdd) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addGround`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  console.log(decrypted);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error("Failed to remove sport categories");
  }
}

export const updateGround = async (formData: UpdateGround) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/updateGround`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  console.log(decrypted);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error("Failed to remove sport categories");
  }
}

export const addAddOnsAvailability = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addAddonAvailability`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error("Failed to fetch sport categories");
  }
  
}

export const removerAddonAvailability = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/deleteAddonAvailability`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error("Failed to remove sport categories");
  }
}

export const uploadGroundImage = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/uploadGroundImage`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);
  console.log(decrypted)
  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error("Failed to update details");
  }
}

export const createNewAddons = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addAddons`,
    formData,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
        "Content-Type": "Application/json",
      },
    }
  );
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  localStorage.setItem("JWTtoken", decrypted.token);
}