'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "../../../../components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetTeamMemberByIdQuery, useSaveOrUpdateTeamMemberMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/teamAPISlice";
import { validateFields } from "@/utils/validateFields";
import Loader from "@/app/loading";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdTeamMemberData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TeamID = searchParams.get("ID");

  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = TeamID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${TeamID ? 'edit' : 'add'} team member`);
        router.push("/afford-admin/manage-team-member");
      }
    }
  }, [isPermissionsReady, pagePermission, TeamID, router]);

  const { data: teamData, error } = useGetTeamMemberByIdQuery(TeamID, {
    skip: !TeamID,
    refetchOnMountOrArgChange: true,
  });

  const { data: maxOrderData, isLoading: isMaxOrderLoading } = useGetMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateTeamMember, { isLoading }] = useSaveOrUpdateTeamMemberMutation();

  const [formData, setFormData] = useState({
    TeamName: "",
    TeamDesignation: "",
    TeamBio: "",
    TeamImage: null,
    TeamType: "",
    ActiveStatus: false,
    DisplayOrder: 1,
  });

  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (teamData?.success) {
      const data = teamData.data;
      setFormData((prev) => ({
        ...prev,
        TeamName: data.TeamName,
        TeamDesignation: data.TeamDesignation,
        TeamBio: data.TeamBio,
        TeamImage: data.TeamImage,
        TeamType: data.TeamType,
        DisplayOrder: data.DisplayOrder,
        ActiveStatus: data.ActiveStatus,
      }));
      setPreviewImage(data.TeamImage ? `/OnlineImages/TeamImages/${data.TeamImage}` : "");
    } else if (!TeamID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => {
        if (prev.DisplayOrder !== maxOrderData.maxOrder + 1) {
          return { ...prev, DisplayOrder: maxOrderData.maxOrder + 1 };
        }
        return prev;
      });
    }
  }, [teamData, maxOrderData, TeamID]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileRename = (file) => {
    const ext = file.name.split(".").pop();
    const slug = formData.TeamName?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "team";
    const randomNum = Math.floor(Math.random() * 90) + 10;
    const newName = `${slug}-${randomNum}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    TeamType: {
      required: true,
      requiredMessage: "Please select team type."
    },
    TeamName: {
      required: true,
      requiredMessage: "Please enter team member name."
    },
    TeamDesignation: {
      required: true,
      requiredMessage: "Please enter designation."
    },
    TeamImage: {
      required: !TeamID,
      requiredMessage: "Please upload team member image."
    }
  };

  const handleSubmit = async () => {
    const requiredPermission = TeamID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${TeamID ? 'edit' : 'add'} team member`);
      return;
    }

    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "TeamImage" && value instanceof File) {
        data.append(key, handleFileRename(value));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (TeamID) data.append("TeamID", TeamID);
    try {
      const res = await saveOrUpdateTeamMember(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/afford-admin/manage-team-member");
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Team Member Data</h1>
        <div className="form-group-row">
          <div className="form-group displayorder mb-0" style={{ height: "62px" }}>
            <label>Team Type*</label>
            <select
              value={formData.TeamType || ""}
              onChange={(e) => {
                handleInput("TeamType", e.target.value);
                setFormErrors(prev => ({ ...prev, TeamType: "" }));
              }}
            >
              <option value="">Select Team Type</option>
              <option value="Core Leadership">Core Leadership</option>
              <option value="Team Member">Team Member</option>
              <option value="Advisory Board">Advisory Board</option>
            </select>
            {formErrors.TeamType && <p className="error">{formErrors.TeamType}</p>}
          </div>
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.TeamName || ""}
              onChange={(e) => {
                handleInput("TeamName", e.target.value);
                setFormErrors(prev => ({ ...prev, TeamName: "" }));
              }}
            />
            {formErrors.TeamName && <p className="error">{formErrors.TeamName}</p>}
          </div>
          <div className="form-group">
            <label>Designation*</label>
            <input
              type="text"
              placeholder="Chief Executive Officer"
              value={formData.TeamDesignation || ""}
              onChange={(e) => {
                handleInput("TeamDesignation", e.target.value);
                setFormErrors(prev => ({ ...prev, TeamDesignation: "" }));
              }}
            />
            {formErrors.TeamDesignation && <p className="error">{formErrors.TeamDesignation}</p>}
          </div>
          <div className="form-group">
            <label>Team Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInput("TeamImage", file);
                if (file) {
                  setPreviewImage(URL.createObjectURL(file));
                }
                setFormErrors(prev => ({ ...prev, TeamImage: "" }));
              }}
            />
            <span className="hint-text">(Image Size 642 × 708 px)</span>
            {formErrors.TeamImage && <p className="error">{formErrors.TeamImage}</p>}
          </div>
          {previewImage && <img src={previewImage} alt="Team Member" height={80} style={{ marginTop: "10px" }} />}
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label style={{ marginTop: "22px" }}>Bio</label>
            <SunEditor
              value={formData.TeamBio || ""}
              onChange={(val) => {
                handleInput("TeamBio", val);
                setFormErrors(prev => ({ ...prev, TeamBio: "" }));
              }}
            />
            {formErrors.TeamBio && <p className="error">{formErrors.TeamBio}</p>}
          </div>
        </div>
        <div className="form-group-row">
          <div className="form-group displayorder">
            <label style={{ marginTop: "22px" }}>Display Order</label>
            <input
              type="number"
              placeholder="0"
              value={formData.DisplayOrder || ""}
              onChange={(e) => handleInput("DisplayOrder", Number(e.target.value))}
            />
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={formData.ActiveStatus || false}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
          </div>
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/afford-admin/manage-team-member" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}