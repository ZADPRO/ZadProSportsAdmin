import axios from 'axios';
import decrypt from '../../common/helper';

export interface AddOnForm {
  name: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  refSubAddOns?: object[];
}

export interface GroundAdd {
  refGroundName: string;
  isAddOnAvailable: boolean;
  refAddOns: AddOnForm[];
  refFeaturesId: string[];
  refUserGuidelinesId: string[];
  refFacilitiesId: string[];
  refAdditionalTipsId: string[];
  refSportsCategoryId: string[];
  refTournamentPrice: string;
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  IframeLink: string;
  groundLocationLink:string;
  refStatus: boolean;
}

export interface GroundResult {
  refGroundId: number;
  refGroundName: string;
  refGroundCustId: string;
  isRoomAvailable: boolean;
  isAddOnAvailable: boolean;
  AddOn: number[];
  addOns: [];
  refRoomImage: string;
  refFeaturesId: number[]; // stored as PostgreSQL array string, e.g. "{1,2}"
  refFeaturesIds: number[];
  refUserGuidelinesId: number[];
  refUserGuidelinesIds: number[];
  refAdditionalTipsId: number[];
  refAdditionalTipsIds: number[];
  refSportsCategoryId: number[];
  refSportsCategoryIds: number[];
  refFacilitiesId: number[];
  refFacilitiesIds: number[];
  refTournamentPrice: string;
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
  groundLocationLink:String;
}

export interface UpdateGround {
  refGroundId: number;
  refGroundName: string;
  isAddOnAvailable: boolean;
  // refAddOnsId: string[];
  refFeaturesId: number[];
  refUserGuidelinesId: number[];
  refFacilitiesId: number[];
  refAdditionalTipsId: number[];
  refSportsCategoryId: number[];
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  IframeLink: string;
  groundLocationLink:string
  refStatus: boolean;
  refAddOns: [];
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

export const decryptData = (response: any) => {
  const decrypted = decrypt(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY,
  );
  decrypted.token && localStorage.setItem('JWTtoken', decrypted.token);
  return decrypted;
};

export const fetchGroundFeatures = async (): Promise<GroundFeaturesResult[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listFeatures`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);
  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch ground features');
  }
};

export const fetchSportCategories = async (): Promise<SportCategoryResult[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listSportCategory`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );

  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch sport categories');
  }
};

export const fetchUserGuidelines = async (): Promise<UserGuidlines[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listUserGuidelines`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );

  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch user guidelines');
  }
};

export const fetchGoundFacilities = async (): Promise<FacilityResult[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listFacilities`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch facilities');
  }
};

export const fetchAdditionalTips = async (): Promise<AdditionalTips[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/settingRoutes/listAdditionalTips`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch additional tips');
  }
};

export const fetchSpecificGround = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/getGround`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  console.log(decrypted);
  if (decrypted.success) {
    return decrypted;
  }
};

export const fetchAddOns = async (): Promise<AddOns[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/groundRoutes/listAddOns`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
      'Content-Type': 'Application/json',
    },
  });
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch addons');
  }
};

export const fetchAddOnAvailability = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/groundRoutes/listAddonAvailability`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted.result;
  } else {
    throw new Error('Failed to fetch addon unavailability dates');
  }
};

export const createNewGround = async (formData: GroundAdd) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addGround`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to create new ground');
  }
};

export const updateGround = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/updateGround`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  console.log(decrypted);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to update ground');
  }
};

export const addAddOnsAvailability = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addAddonAvailability`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to add addon unavailability date');
  }
};

export const removerAddonAvailability = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/deleteAddonAvailability`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to remove unavailability date');
  }
};

export const uploadGroundImage = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/uploadGroundImage`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);

  console.log(decrypted);
  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to update details');
  }
};

export const createNewAddons = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/addAddons`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);
  return decrypted;
};

export const deleteAddon = async (formData: any) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/groundRoutes/deleteAddons`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTtoken'),
        'Content-Type': 'Application/json',
      },
    },
  );
  const decrypted = decryptData(response);
  console.log(decrypted);
  if (decrypted.success) {
    return decrypted;
  } else {
    throw new Error('Failed to update details');
  }
};
