import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../common/helper";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// import pdfFile from "../../assets/MEDPREDIT COMMERCIAL APPLICATION.pdf"

interface EditSidebarProps {
  ownerData: string;
  onSuccess: () => void;
}

export interface OwnerSportsMapping {
  refOwnerSportsMappingId: number;
  refSportsCategoryId: number;
  groundAddress: string;
  refSportsCategoryName: string;
  isOwnGround: boolean;
  refGroundDescription: string;
}

interface GroundImage {
  content: string;
  contentType: string;
  filename: string;
}

export interface OwnerDetails {
  refOwnerId: number;
  refOwnerCustId: string;
  refOwnerFname: string;
  refOwnerLname: string;
  refEmailId: string;
  refMobileId: string;
  refCustHashedPassword: string;
  refAadharId: string;
  refPANId: string;
  refGSTnumber: string;
  isOwnGround: boolean;
  refGroundImage: GroundImage | null;
  refGroundDescription: string;
  refBankName: string;
  refBankBranch: string;
  refAcHolderName: string;
  refAccountNumber: string;
  refIFSCcode: string;
  refDocument1Path: string;
  refDocument2Path: string;
  refUserTypeId: number;
  refStatus: string;
  isDefaultAddress: boolean;
  ownersportsmappings: OwnerSportsMapping[];
}

const EditOwner: React.FC<EditSidebarProps> = ({ ownerData }) => {
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails[]>([]);
  const [bankDetails, setBankDetails] = useState<OwnerDetails[]>([]);
  const [groundMappings, setGroundMappings] = useState<OwnerSportsMapping[]>([]);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    fetchOwnerDetails();
  }, []);

  const fetchOwnerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ownerRoutes/getOwners`,
        { refOwnerId: ownerData },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("JWTtoken", data.token);

      if (data.success) {
        const owner = data.result;
        setOwnerDetails(owner);
        setBankDetails(owner);
        setGroundMappings(owner[0]?.ownersportsmappings || []);
        setGroundImg(owner[0]?.refGroundImage || null);
      } else {
        setError("Failed to fetch owner details.");
      }
    } catch (err) {
      setError("Error fetching owner details.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (docUrl: string | undefined) => {
    if (docUrl) {
      setPdfUrl(docUrl);
      setShowPDFViewer(true);
    }
  };

  return (
    <div className="overall">
      {groundImg?.content && groundImg?.contentType && (
        <div className="w-full flex justify-center">
          <div className="p-2 w-fit shadow-md mb-3">
            <img
              src={`data:${groundImg.contentType};base64,${groundImg.content}`}
              alt={groundImg.filename || "Ground Preview"}
              className="object-cover w-64 h-64 rounded"
            />
            <div className="text-center text-sm mt-2 text-gray-600">
              {groundImg.filename}
            </div>
          </div>
        </div>
      )}

      <h1 className="text-[20px] px-3 font-bold uppercase text-black">
        Owner Details :
      </h1>

      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={ownerDetails}
        tableStyle={{ margin: "10px" }}
      >
        <Column field="sno" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="refOwnerFname" header="First Name" frozen style={{ minWidth: "14rem" }} />
        <Column field="refOwnerLname" header="Last Name" style={{ minWidth: "10rem" }} />
        <Column field="refEmailId" header="Email" style={{ minWidth: "10rem" }} />
        <Column field="refMobileId" header="Mobile Number" style={{ minWidth: "14rem" }} />
        <Column field="refAadharId" header="Aadhar Number" style={{ minWidth: "14rem" }} />
        <Column field="refPANId" header="PAN Number" style={{ minWidth: "14rem" }} />
        <Column field="refGSTnumber" header="GST Number" style={{ minWidth: "14rem" }} />
      </DataTable>

      <h1 className="text-[20px] mt-5 px-3 font-bold uppercase text-black">Bank Details :</h1>
      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={bankDetails}
        tableStyle={{ margin: "10px" }}
      >
        <Column field="sno" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="refBankName" header="Bank Name" style={{ minWidth: "14rem" }} />
        <Column field="refAccountNumber" header="Account Number" style={{ minWidth: "10rem" }} />
        <Column field="refAcHolderName" header="Account Holder Name" style={{ minWidth: "10rem" }} />
        <Column field="refBankBranch" header="Bank Branch" style={{ minWidth: "14rem" }} />
      </DataTable>

      <h1 className="text-[20px] mt-5 px-3 font-bold uppercase text-black">Ground Details :</h1>
      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={groundMappings}
        tableStyle={{ margin: "10px" }}
      >
        <Column field="sno" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="isOwnGround" header="Ground Owner" body={(rowData) => (rowData.isOwnGround ? "Yes" : "No")} style={{ minWidth: "14rem" }} />
        <Column field="refGroundDescription" header="Ground Description" style={{ minWidth: "10rem" }} />
        <Column field="refSportsCategoryName" header="Sport name" style={{ minWidth: "10rem" }} />
        <Column field="groundAddress" header="Ground Address" style={{ minWidth: "10rem" }} />
        <Column
          header="Document 1"
          body={() => (
            <button
              className="text-blue-600 underline"
              onClick={() => handleViewDocument(ownerDetails[0]?.refDocument1Path)}
            >
              View
            </button>
          )}
          style={{ minWidth: "10rem" }}
        />
        <Column
          header="Document 2"
          body={() => (
            <button
              className="text-blue-600 underline"
              onClick={() => handleViewDocument(ownerDetails[0]?.refDocument2Path)}
            >
              View
            </button>
          )}
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {showPDFViewer && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-[80vw] h-[90vh] relative shadow-lg rounded">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold"
              onClick={() => setShowPDFViewer(false)}
            >
              ✕
            </button>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOwner;
