'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetAllClientTypesQuery } from "@/store/backendSlice/clientTypeAPISlice";
import { useGetLogosByTypeQuery, useAssignLogosMutation } from "@/store/backendSlice/clientLogoMappingAPISlice";
import { useGetAllPartnerLogosQuery } from "@/store/backendSlice/partnerLogoAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";

export default function AssignClientLogos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initClientTypeID = searchParams.get("ClientTypeID");

  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });

  const { data: typesData = [] } = useGetAllClientTypesQuery();
  const { data: allLogosData = [], isLoading: isAllLogosLoading } = useGetAllPartnerLogosQuery();

  const [selectedType, setSelectedType] = useState(initClientTypeID || "");
  const { data: mappingData, isLoading: isMappingLoading, refetch } = useGetLogosByTypeQuery(selectedType, { skip: !selectedType });
  const [assignLogos, { isLoading: isSaving }] = useAssignLogosMutation();

  const [selectedLogos, setSelectedLogos] = useState([]);

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (mappingData?.success) {
      const assigned = mappingData.data.filter(l => l.IsAssigned === 1).map(l => l.PartnerLogoID);
      setSelectedLogos(assigned);
    } else if (!selectedType) {
      setSelectedLogos([]);
    }
  }, [mappingData, selectedType]);

  const handleToggleLogo = (id) => {
    setSelectedLogos(prev =>
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allLogoIDs = allLogosData?.map(l => l.PartnerLogoID) || [];
    if (selectedLogos.length === allLogoIDs.length) setSelectedLogos([]);
    else setSelectedLogos(allLogoIDs);
  }

  const handleSave = async () => {
    if (!selectedType) {
      toast.error("Select a Client Type first.");
      return;
    }
    try {
      const res = await assignLogos({ ClientTypeID: selectedType, PartnerLogoIDs: selectedLogos }).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-clienttype");
      } else {
        toast.error(res.message || "Failed to assign");
      }
    } catch (err) {
      toast.error("Error saving assignments");
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box" style={{ padding: "20px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #eaeaea", paddingBottom: "15px" }}>
          <h1 style={{ color: "#1c2f63", margin: 0, fontSize: "20px" }}>Assign Link for Client Type</h1>
          <Link href="/chanderpur-admin/manage-partnerlogo" className="back-btn" style={{ background: "#e8f0fe", color: "#0056b3", border: "1px solid #c8dcfc", textDecoration: "none" }}>
            <span style={{ fontSize: "16px", fontWeight: "bold", marginRight: "4px" }}>+</span> Manage Master Logos
          </Link>
        </div>

        {/* <div className="form-group-row">
          <div className="form-group displayorder" style={{ maxWidth: "400px" }}>
            <label style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>1. Choose Client Type*</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="form-control"
              style={{
                padding: "12px",
                fontSize: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}
            >
              <option value="">-- Click to Select Category --</option>
              {typesData.map(t => (
                <option key={t.ClientTypeID} value={t.ClientTypeID}>{t.TypeName}</option>
              ))}
            </select>
            {!selectedType && <p className="error" style={{ marginTop: "10px", fontSize: "14px" }}>⚠️ Please select a type to start assigning.</p>}
          </div>
        </div> */}

        <div style={{ marginTop: "5px" }}>
          {selectedType && (
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", padding: "8px 10px", borderRadius: "8px", border: "1px solid #eee" }}>
              <div style={{ fontSize: "15px", color: "#555" }}>
                <strong style={{ color: "#0056b3", fontSize: "18px" }}>{selectedLogos.length}</strong> Selected
              </div>
              <button
                onClick={handleSelectAll}
                className="back-btn"
                style={{ cursor: "pointer", background: "#fff", border: "1px solid #ddd", color: "#333", fontSize: "14px", padding: "6px 16px", borderRadius: "6px" }}
              >
                {selectedLogos.length === allLogosData?.length ? "Unselect All" : "Select All"}
              </button>
            </div>
          )}

          {(isAllLogosLoading || isMappingLoading) ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}><Loader /></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {allLogosData?.map(logo => (
                <div
                  key={logo.PartnerLogoID}
                  onClick={() => handleToggleLogo(logo.PartnerLogoID)}
                  style={{
                    border: selectedLogos.includes(logo.PartnerLogoID) ? "2px solid #0056b3" : "1px solid #e0e0e0",
                    padding: "15px",
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    background: selectedLogos.includes(logo.PartnerLogoID) ? "#f0f5ff" : "#fff",
                    borderRadius: "10px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: selectedLogos.includes(logo.PartnerLogoID) ? "0 4px 12px rgba(0,86,179,0.15)" : "0 2px 6px rgba(0,0,0,0.04)"
                  }}
                >
                  <img
                    src={`/OnlineImages/PartnerLogos/${logo.PartnerLogoImage}`}
                    alt="Logo"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: selectedLogos.includes(logo.PartnerLogoID) ? "none" : "grayscale(20%)" }}
                    onError={(e) => { e.target.src = "/assets/img/default-logo.png"; }}
                  />
                  {selectedLogos.includes(logo.PartnerLogoID) && (
                    <div style={{ position: "absolute", top: "-8px", right: "-8px", background: "#0056b3", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ paddingTop: "25px" }}>
            <button
              onClick={handleSave}
              disabled={isSaving || !selectedType}
              className="submit-btn"
            >
              {isSaving && <Loader />} Update Assignments
            </button>
            <Link href="/chanderpur-admin/manage-clienttype" className="back-btn">
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
