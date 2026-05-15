'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetClientTypeByIdQuery, useSaveOrUpdateClientTypeMutation, useGetClientTypeMaxDisplayOrderQuery } from "@/store/backendSlice/clientTypeAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdClientType() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ClientTypeID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetClientTypeMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: typeData } = useGetClientTypeByIdQuery(ClientTypeID, { skip: !ClientTypeID, refetchOnMountOrArgChange: true });

  const [saveOrUpdate, { isLoading }] = useSaveOrUpdateClientTypeMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    TypeName: "",
    ActiveStatus: true,
    DisplayOrder: 1
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = ClientTypeID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${ClientTypeID ? 'edit' : 'add'} client type`);
        router.push("/chanderpur-admin/manage-clienttype");
      }
    }
  }, [isPermissionsReady, pagePermission, ClientTypeID, router]);

  useEffect(() => {
    if (typeData?.success) {
      const d = typeData.data;
      setFormData({
        TypeName: d.TypeName || "",
        ActiveStatus: d.ActiveStatus === 1,
        DisplayOrder: d.DisplayOrder ?? 1
      });
    } else if (!ClientTypeID && maxOrderData?.maxOrder !== undefined) {
      setFormData(prev => ({ ...prev, DisplayOrder: maxOrderData.maxOrder + 1 }));
    }
  }, [typeData, maxOrderData, ClientTypeID]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationRules = {
    TypeName: { required: true, requiredMessage: "Please enter type name." }
  };

  const handleSubmit = async () => {
    const requiredPermission = ClientTypeID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error("No permission");
      return;
    }
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const payload = {
        ...formData,
        ActiveStatus: formData.ActiveStatus ? 1 : 0,
        UpdatedBy: "Admin Panel",
        ClientTypeID
      };
      const res = await saveOrUpdate(payload).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-clienttype");
      } else {
        toast.error(res.message || "Process failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{ClientTypeID ? "Update" : "Add"} Client Type</h1>

        <div className="form-group-row">
          <div className="form-group displayorder" >
            <label>Type Name*</label>
            <input
              type="text"
              placeholder="e.g. Corporate"
              value={formData.TypeName ?? ""}
              onChange={e => handleInput("TypeName", e.target.value)}
            />
            {formErrors.TypeName && <p className="error">{formErrors.TypeName}</p>}
          </div>
          <div className="form-group displayorder">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.DisplayOrder ?? ""}
              onChange={e => handleInput("DisplayOrder", e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={formData.ActiveStatus}
              onChange={e => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader />} Submit
          </button>
          <Link href="/chanderpur-admin/manage-clienttype" className="back-btn" style={{ marginLeft: "10px" }}>
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
