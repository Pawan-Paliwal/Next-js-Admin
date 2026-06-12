'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import {
  useGetProductByIdQuery,
  useSaveOrUpdateProductMutation,
  useGetSectionItemsQuery,
  useSaveOrUpdateSectionItemMutation,
  useDeleteSectionItemMutation
} from "@/store/backendSlice/productAPISlice";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useGetCategorysQuery } from "@/store/backendSlice/categoryAPISlice";
import Loader from "@/app/loading";
import { usePagePermission } from "../usePagePermission";

const PRODUCT_TYPES = [
  { value: "swasth-for-families", label: "Design 1 (Swasth for Families)" },
  { value: "swasthera", label: "Design 2 (Swasthera)" },
  { value: "swasth-for-hospitals", label: "Design 3 (Swasth for Hospitals)" },
  { value: "swasth-for-corporates", label: "Design 4 (Swasth for Corporates)" },
  { value: "procalyx-pharma", label: "Design 5 (Procalyx Pharma)" },
  { value: "procalyx-hospital", label: "Design 6 (Procalyx Hospital)" }
];



export default function AddUpdProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ProductId = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;
  const { data: productData } = useGetProductByIdQuery(ProductId, { skip: !ProductId, refetchOnMountOrArgChange: true });
  const { data: section3Data } = useGetSectionItemsQuery({ ProductId, SectionNumber: 3 }, { skip: !ProductId });
  const { data: section4Data } = useGetSectionItemsQuery({ ProductId, SectionNumber: 4 }, { skip: !ProductId });
  const { data: section5Data } = useGetSectionItemsQuery({ ProductId, SectionNumber: 5 }, { skip: !ProductId });
  const { data: categoryData = [] } = useGetCategorysQuery();

  const [saveOrUpdateProduct, { isLoading }] = useSaveOrUpdateProductMutation();
  const [categoryDisplayOrders, setCategoryDisplayOrders] = useState({});
  const [saveOrUpdateSectionItem] = useSaveOrUpdateSectionItemMutation();
  const [deleteSectionItem] = useDeleteSectionItemMutation();

  const [previewImages, setPreviewImages] = useState(["", "", "", ""]);
  const [productMediaPreview, setProductMediaPreview] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryTaglines, setCategoryTaglines] = useState({});
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    ProductType: "",
    ProductName: "",
    ProductNameURL: "",
    ProductHeaderListName: "",
    ProductSmallDescription: "",
    ProductListDescription: "",
    ProductMedia: null,
    Section1Title: "",
    Section1Subtitle: "",
    Section1Description: "",
    Section1MediaUrl: null,
    Section1ButtonText: "",
    Section2Title: "",
    Section2Subtitle: "",
    Section2Description: "",
    Section2MediaUrl: null,
    Section2ButtonText: "",
    Section3Title: "",
    Section3Subtitle: "",
    Section3Description: "",
    Section3MediaUrl: null,
    Section3ButtonText: "",
    Section4Title: "",
    Section4Subtitle: "",
    Section4Description: "",
    Section4MediaUrl: null,
    Section4ButtonText: "",
    Section5Title: "",
    Section5Subtitle: "",
    Section5ButtonText: "",
    Section6Title: "",
    Section6Subtitle: "",
    Section6Description: "",
    Section6FormHeading: "",
    ActiveStatus: false,
    DisplayOnHome: false,
    DisplayOnHeader: false,
    DisplayOnFooter: false,
    ComingSoon: false,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "",
  });

  const [section3Items, setSection3Items] = useState([{
    ItemId: "",
    ItemTitle: "",
    ItemDescription: "",
    ItemIconUrl: null,
    DisplayOrder: 0,
    ActiveStatus: false,
    previewImage: ""
  }]);

  const [section4Items, setSection4Items] = useState([{
    ItemId: "",
    ItemTitle: "",
    ItemDescription: "",
    ItemIconUrl: null,
    DisplayOrder: 0,
    ActiveStatus: false,
    previewImage: ""
  }]);

  const [section5Items, setSection5Items] = useState([{
    ItemId: "",
    ItemTitle: "",
    ItemDescription: "",
    DisplayOrder: 0,
    ActiveStatus: false,
  }]);

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);


  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = ProductId ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${ProductId ? 'edit' : 'add'} product`);
        router.push("/afford-admin/manage-product");
      }
    }
  }, [isPermissionsReady, pagePermission, ProductId, router]);

  useEffect(() => {
    if (productData?.success) {
      const data = productData.data;
      setFormData({
        ProductType: data.ProductType || "",
        ProductName: data.ProductName,
        ProductNameURL: data.ProductNameURL,
        ProductHeaderListName: data.ProductHeaderListName,
        ProductSmallDescription: data.ProductSmallDescription || "",
        ProductListDescription: data.ProductListDescription || "",
        ProductMedia: null,
        Section1Title: data.Section1Title || "",
        Section1Subtitle: data.Section1Subtitle || "",
        Section1Description: data.Section1Description || "",
        Section1MediaUrl: null,
        Section1ButtonText: data.Section1ButtonText || "",
        Section2Title: data.Section2Title || "",
        Section2Subtitle: data.Section2Subtitle || "",
        Section2Description: data.Section2Description || "",
        Section2MediaUrl: null,
        Section2ButtonText: data.Section2ButtonText || "",
        Section3Title: data.Section3Title || "",
        Section3Subtitle: data.Section3Subtitle || "",
        Section3Description: data.Section3Description || "",
        Section3MediaUrl: null,
        Section3ButtonText: data.Section3ButtonText || "",
        Section4Title: data.Section4Title || "",
        Section4Subtitle: data.Section4Subtitle || "",
        Section4Description: data.Section4Description || "",
        Section4MediaUrl: null,
        Section4ButtonText: data.Section4ButtonText || "",
        Section5Title: data.Section5Title || "",
        Section5Subtitle: data.Section5Subtitle || "",
        Section5ButtonText: data.Section5ButtonText || "",
        Section6Title: data.Section6Title || "",
        Section6Subtitle: data.Section6Subtitle || "",
        Section6Description: data.Section6Description || "",
        Section6FormHeading: data.Section6FormHeading || "",
        ActiveStatus: data.ActiveStatus,
        DisplayOnHome: data.DisplayOnHome,
        DisplayOnHeader: data.DisplayOnHeader,
        DisplayOnFooter: data.DisplayOnFooter || false,
        ComingSoon: data.ComingSoon || false,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "",
      });

      setProductMediaPreview(data.ProductMedia ? `/OnlineImages/ProductImages/${data.ProductMedia}` : "");
      setPreviewImages([
        data.Section1MediaUrl ? `/OnlineImages/ProductImages/${data.Section1MediaUrl}` : "",
        data.Section2MediaUrl ? `/OnlineImages/ProductImages/${data.Section2MediaUrl}` : "",
        data.Section3MediaUrl ? `/OnlineImages/ProductImages/${data.Section3MediaUrl}` : "",
        data.Section4MediaUrl ? `/OnlineImages/ProductImages/${data.Section4MediaUrl}` : "",
      ]);

      if (Array.isArray(data?.ProductCategories)) {
        setSelectedCategories(data.ProductCategories);
      }
      if (Array.isArray(data?.ProductCategoriesWithTaglines)) {
        const taglinesObj = {};
        const displayOrdersObj = {};
        data.ProductCategoriesWithTaglines.forEach(cat => {
          taglinesObj[cat.CategoryID] = cat.CategoryTagline || '';
          displayOrdersObj[cat.CategoryID] = cat.DisplayOrder || '';
        });
        setCategoryTaglines(taglinesObj);
        setCategoryDisplayOrders(displayOrdersObj);
      }
    }
  }, [productData]);

  const handleDisplayOrderChange = (categoryId, value) => {
    setCategoryDisplayOrders(prev => ({
      ...prev,
      [categoryId]: value === '' ? '' : parseInt(value) || ''
    }));
  };

  useEffect(() => {
    if (section3Data?.success && section3Data.data.length > 0) {
      setSection3Items(section3Data.data.map(item => ({
        ItemId: item.ItemId,
        ItemTitle: item.ItemTitle,
        ItemDescription: item.ItemDescription || "",
        ItemIconUrl: null,
        DisplayOrder: item.DisplayOrder,
        ActiveStatus: item.ActiveStatus,
        previewImage: item.ItemIconUrl ? `/OnlineImages/ProductImages/${item.ItemIconUrl}` : ""
      })));
    }
  }, [section3Data]);

  useEffect(() => {
    if (section4Data?.success && section4Data.data.length > 0) {
      setSection4Items(section4Data.data.map(item => ({
        ItemId: item.ItemId,
        ItemTitle: item.ItemTitle,
        ItemDescription: item.ItemDescription,
        ItemIconUrl: null,
        DisplayOrder: item.DisplayOrder,
        ActiveStatus: item.ActiveStatus,
        previewImage: item.ItemIconUrl ? `/OnlineImages/ProductImages/${item.ItemIconUrl}` : ""
      })));
    }
  }, [section4Data]);

  useEffect(() => {
    if (section5Data?.success && section5Data.data.length > 0) {
      setSection5Items(section5Data.data.map(item => ({
        ItemId: item.ItemId,
        ItemTitle: item.ItemTitle,
        ItemDescription: item.ItemDescription,
        DisplayOrder: item.DisplayOrder,
        ActiveStatus: item.ActiveStatus,
      })));
    }
  }, [section5Data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTaglineChange = (categoryId, value) => {
    setCategoryTaglines(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "ProductName" && !ProductId) {
      setFormData((prev) => ({ ...prev, MetaTitle: `${value} | AffordPlan` }));
    }
  };

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  const handleFileRename = (file, nameSuffix) => {
    if (!file || !file.name) return null;
    const ext = file.name.split('.').pop();
    const firstWord = file.name.split(/[\s._-]/)[0];
    const randomNum = Math.floor(10 + Math.random() * 90);
    const newFileName = `${firstWord}${nameSuffix}_${randomNum}.${ext}`;
    return new File([file], newFileName, { type: file.type });
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  const addSectionItem = (section) => {
    if (section === 3) {
      const lastItem = section3Items[section3Items.length - 1];
      const type = formData.ProductType;
      if (type === "swasth-for-hospitals" || type === "procalyx-hospital" || type === "procalyx-pharma") {
        if (!lastItem.ItemTitle?.trim() || !lastItem.ItemDescription?.trim() || (!lastItem.ItemIconUrl && !lastItem.previewImage)) {
          toast.error("Please fill all fields in the previous item before adding more.");
          return;
        }
      } else if (type === "swasthera") {
        if (!lastItem.ItemIconUrl && !lastItem.previewImage) {
          toast.error("Please upload an icon in the previous item before adding more.");
          return;
        }
      } else {
        if (!lastItem.ItemTitle?.trim() || (!lastItem.ItemIconUrl && !lastItem.previewImage)) {
          toast.error("Please fill Title and Icon in the previous item before adding more.");
          return;
        }
      }
      setSection3Items([...section3Items, {
        ItemId: "",
        ItemTitle: "",
        ItemDescription: "",
        ItemIconUrl: null,
        DisplayOrder: section3Items.length,
        ActiveStatus: false,
        previewImage: ""
      }]);
    } else if (section === 4) {
      const lastItem = section4Items[section4Items.length - 1];
      const type = formData.ProductType;

      if (type === "swasthera" || type === "swasth-for-hospitals" || type === "swasth-for-corporates" || type === "procalyx-hospital" || type === "procalyx-pharma") {
        if (!lastItem.ItemTitle?.trim() || !lastItem.ItemDescription?.trim() || (!lastItem.ItemIconUrl && !lastItem.previewImage)) {
          toast.error("Please fill all fields in the previous item before adding more.");
          return;
        }
      } else {
        if (!lastItem.ItemTitle?.trim() || !lastItem.ItemDescription?.trim()) {
          toast.error("Please fill all fields in the previous item before adding more.");
          return;
        }
      }
      setSection4Items([...section4Items, {
        ItemId: "",
        ItemTitle: "",
        ItemDescription: "",
        ItemIconUrl: null,
        DisplayOrder: section4Items.length,
        ActiveStatus: false,
        previewImage: ""
      }]);
    } else if (section === 5) {
      const lastItem = section5Items[section5Items.length - 1];
      if (!lastItem.ItemTitle?.trim() || !lastItem.ItemDescription?.trim()) {
        toast.error("Please fill all fields in the previous item before adding more.");
        return;
      }
      setSection5Items([...section5Items, {
        ItemId: "",
        ItemTitle: "",
        ItemDescription: "",
        DisplayOrder: section5Items.length,
        ActiveStatus: false,
      }]);
    }
  };

  const removeSectionItem = async (section, index) => {
    const items = section === 3 ? section3Items : section === 4 ? section4Items : section5Items;
    const item = items[index];
    if (item.ItemId) {
      const confirmed = confirm("Are you sure you want to delete this item?");
      if (!confirmed) return;
      try {
        const res = await deleteSectionItem(item.ItemId).unwrap();
        if (res.success) {
          toast.success("Item deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting item");
        return;
      }
    }
    if (section === 3) {
      setSection3Items(section3Items.filter((_, i) => i !== index));
    } else if (section === 4) {
      setSection4Items(section4Items.filter((_, i) => i !== index));
    } else if (section === 5) {
      setSection5Items(section5Items.filter((_, i) => i !== index));
    }
  };

  const updateSectionItem = (section, index, field, value) => {
    if (section === 3) {
      const updated = [...section3Items];
      updated[index][field] = value;
      if (field === "ItemIconUrl" && value instanceof File) {
        updated[index].previewImage = URL.createObjectURL(value);
      }
      setSection3Items(updated);
    } else if (section === 4) {
      const updated = [...section4Items];
      updated[index][field] = value;
      if (field === "ItemIconUrl" && value instanceof File) {
        updated[index].previewImage = URL.createObjectURL(value);
      }
      setSection4Items(updated);
    } else if (section === 5) {
      const updated = [...section5Items];
      updated[index][field] = value;
      setSection5Items(updated);
    }
  };

  const validateForm = () => {
    const errors = {};
    const type = formData.ProductType;
    if (!type) errors.ProductType = "Product type is required";
    if (selectedCategories.length === 0) errors.ProductCategory = "Please select at least one category";
    if (!formData.ProductName?.trim()) errors.ProductName = "Product name is required";
    if (!formData.ProductNameURL?.trim()) errors.ProductNameURL = "Product URL is required";
    if (!ProductId && !formData.ProductMedia) errors.ProductMedia = "Product media is required";
    if (ProductId && !formData.ProductMedia && !productMediaPreview) errors.ProductMedia = "Product media is required";
    if (!formData.ProductListDescription?.trim()) errors.ProductListDescription = "Product list description is required";
    if (!formData.Section1Title?.trim()) errors.Section1Title = "Section 1 title is required";
    if (!formData.Section1Subtitle?.trim()) errors.Section1Subtitle = "Section 1 subtitle is required";
    if (!formData.Section1Description?.trim()) errors.Section1Description = "Section 1 description is required";
    if (!ProductId && !formData.Section1MediaUrl) errors.Section1MediaUrl = "Section 1 media is required";
    if (ProductId && !formData.Section1MediaUrl && !previewImages[0]) errors.Section1MediaUrl = "Section 1 media is required";
    if (!formData.Section6Title?.trim()) errors.Section6Title = "Section 6 title is required";
    if (!formData.Section6Subtitle?.trim()) errors.Section6Subtitle = "Section 6 subtitle is required";
    if (!formData.Section6Description?.trim()) errors.Section6Description = "Section 6 description is required";
    if (!formData.Section6FormHeading?.trim()) errors.Section6FormHeading = "Section 6 form heading is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleItemIconRename = (file, suffix) => {
    const ext = file.name.split(".").pop();
    const firstWord = file.name.split(/[\s._-]/)[0];
    const randomNum = Math.floor(10 + Math.random() * 90);
    return new File([file], `${firstWord}${suffix}_${randomNum}.${ext}`, { type: file.type });
  };

  const categoriesWithTaglines = selectedCategories.map(catId => ({
    CategoryID: catId,
    CategoryTagline: categoryTaglines[catId] || '',
    DisplayOrder: categoryDisplayOrders[catId] || 0
  }));




  const handleSubmit = async () => {
    const requiredPermission = ProductId ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${ProductId ? 'edit' : 'add'} product`);
      return;
    }

    if (!validateForm()) {
      const firstError = Object.entries(formErrors).find(([_, value]) => value);
      if (firstError) {
        const [fieldKey, errorMsg] = firstError;
        const fieldName = fieldKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        toast.error(`${fieldName}: ${errorMsg}`);
      }
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if ((key.includes("MediaUrl") || key === "ProductMedia") && value instanceof File) {
        const suffix = key.replace("Section", "-section").replace("MediaUrl", "").replace("ProductMedia", "-product");
        data.append(key, handleFileRename(value, suffix));
      } else if (key === "ActiveStatus" || key === "DisplayOnHome" || key === "DisplayOnHeader" || key === "DisplayOnFooter" || key === "ComingSoon") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });
    data.append("ProductCategory", JSON.stringify(categoriesWithTaglines));
    if (ProductId) data.append("ProductId", ProductId);
    try {
      const res = await saveOrUpdateProduct(data).unwrap();
      if (res.success) {
        const finalProductId = res.ProductId || ProductId;
        let section3Success = true;
        for (const item of section3Items) {
          const shouldSave = formData.ProductType === "swasthera"
            ? (item.ItemIconUrl || item.previewImage)
            : item.ItemTitle?.trim();
          if (shouldSave) {
            const itemData = new FormData();
            if (item.ItemId) itemData.append("ItemId", item.ItemId);
            itemData.append("ProductId", finalProductId);
            itemData.append("ItemTitle", item.ItemTitle || "Logo");
            itemData.append("ItemDescription", item.ItemDescription || "");
            itemData.append("SectionNumber", "3");
            itemData.append("DisplayOrder", item.DisplayOrder.toString());
            itemData.append("ActiveStatus", "1");
            if (item.ItemIconUrl instanceof File) {
              itemData.append("ItemIconUrl", handleItemIconRename(item.ItemIconUrl, "-section3"));
            }
            try {
              await saveOrUpdateSectionItem(itemData).unwrap();
            } catch (error) {
              section3Success = false;
            }
          }
        }
        let section4Success = true;
        for (const item of section4Items) {
          if (item.ItemTitle?.trim() && item.ItemDescription?.trim()) {
            const itemData = new FormData();
            if (item.ItemId) itemData.append("ItemId", item.ItemId);
            itemData.append("ProductId", finalProductId);
            itemData.append("ItemTitle", item.ItemTitle);
            itemData.append("ItemDescription", item.ItemDescription);
            itemData.append("SectionNumber", "4");
            itemData.append("DisplayOrder", item.DisplayOrder.toString());
            itemData.append("ActiveStatus", "1");
            if (item.ItemIconUrl instanceof File) {
              itemData.append("ItemIconUrl", handleItemIconRename(item.ItemIconUrl, "-section4"));
            }
            try {
              await saveOrUpdateSectionItem(itemData).unwrap();
            } catch (error) {
              section4Success = false;
            }
          }
        }

        let section5Success = true;
        for (const item of section5Items) {
          if (item.ItemTitle?.trim() && item.ItemDescription?.trim()) {
            const itemData = new FormData();
            if (item.ItemId) itemData.append("ItemId", item.ItemId);
            itemData.append("ProductId", finalProductId);
            itemData.append("ItemTitle", item.ItemTitle);
            itemData.append("ItemDescription", item.ItemDescription);
            itemData.append("SectionNumber", "5");
            itemData.append("DisplayOrder", item.DisplayOrder.toString());
            itemData.append("ActiveStatus", "1");
            try {
              await saveOrUpdateSectionItem(itemData).unwrap();
            } catch (error) {
              section5Success = false;
            }
          }
        }
        if (section3Success && section4Success && section5Success) {
          toast.success("Product and all items saved successfully!");
          router.push("/afford-admin/manage-product");
        } else {
          toast.warning("Product saved but some items failed to save");
        }
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const getFileType = (fileUrl) => {
    const ext = fileUrl.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return 'image';
    return 'other';
  };



  const shouldShowSection = (section) => {
    const type = formData.ProductType;
    if (!type) return false;
    if (section === 1) return ["swasth-for-families", "swasthera", "swasth-for-hospitals", "swasth-for-corporates", "procalyx", "procalyx-hospital", "procalyx-pharma"].includes(type);
    if (section === 2) return ["swasth-for-families", "swasthera", "swasth-for-hospitals", "swasth-for-corporates", "procalyx", "procalyx-hospital", "procalyx-pharma"].includes(type);
    if (section === 3) return ["swasth-for-families", "swasthera", "swasth-for-hospitals", "swasth-for-corporates", "procalyx", "procalyx-hospital", "procalyx-pharma"].includes(type);
    if (section === 4) return ["swasth-for-families", "swasthera", "swasth-for-hospitals", "swasth-for-corporates", "procalyx-hospital", "procalyx-pharma"].includes(type);
    if (section === 5) return ["swasth-for-hospitals"].includes(type);
    return false;
  };



  const needsSection4Icon = () => {
    const type = formData.ProductType;
    return ["swasthera", "swasth-for-hospitals", "swasth-for-corporates", "procalyx-hospital", "procalyx-pharma"].includes(type);
  };



  const getHintText = (field) => {
    const type = formData.ProductType;
    const hints = {
      'ProductMedia': {
        'swasth-for-families': '(Image Size 644 × 479 px)',
        'swasthera': '(Image Size 966 × 719 px)',
        'swasth-for-hospitals': '(Image Size 966 × 719 px)',
        'swasth-for-corporates': '(Image Size 966 × 719 px)',
        'procalyx-pharma': '(Image Size 1758 × 1216 px)',
        'procalyx-hospital': '(Image Size 879 × 608 px)'
      },
      'Section1MediaUrl': {
        'swasth-for-families': '(Video Frame Width 1280 × Height 720)',
        'swasthera': '(Video Frame Width 1280 × Height 720)',
        'swasth-for-hospitals': '(Video Frame Width 1280 × Height 720)',
        'swasth-for-corporates': '(Video Frame Width 1280 × Height 720)',
        'procalyx-pharma': '(Image Size 879 × 608 px)',
        'procalyx-hospital': '(Image Size 879 × 608 px)'
      },
      'Section2MediaUrl': {
        'swasth-for-families': '(Image Size 948 × 593 px)',
        'swasthera': '(Image Size 501 × 386 px)',
        'swasth-for-hospitals': '(Image Size 501 × 386 px)',
        'swasth-for-corporates': '(Image Size 1040 × 638 px)',
        'procalyx-pharma': '(Image Size 342 × 340 px)',
        'procalyx-hospital': '(Image Size 524 × 383 px)'
      },
      'Section3MediaUrl': {
        'swasth-for-families': '(Image Size 948 × 593 px)',
        'swasth-for-hospitals': '(Image Size 328 × 627 px)',
        'swasth-for-corporates': '(Image Size 1040 × 638 px)',
        'procalyx': 'Upload image/video'
      },
      'Section3ItemIcon': {
        'swasth-for-families': '(Image Size 40 × 40 px)',
        'swasthera': '(Image Size 350 × 132 px)',
        'swasth-for-hospitals': '(Image Size 56 × 55 px)',
        'swasth-for-corporates': '(Image Size 40 × 40 px)',
        'procalyx-pharma': '(Image Size 1168 × 962 px)',
        'procalyx-hospital': '(Image Size 1168 × 962 px)'
      },
      'Section4MediaUrl': {
        'swasth-for-families': '(Video Frame Width 1280 × Height 720)',
        'swasthera': '(Image Size 525 × 234 px)',
        'swasth-for-hospitals': '(Image Size 1008 × 782 px)',
        'swasth-for-corporates': '(Image Size 1008 × 782 px)'
      },
      'Section4ItemIcon': {
        'swasthera': '(Image Size 48 × 48 px)',
        'swasth-for-hospitals': '(Image Size 48 × 48 px)',
        'swasth-for-corporates': '(Image Size 48 × 48 px)',
        'procalyx-pharma': '(Image Size 48 × 48 px)',
        'procalyx-hospital': '(Image Size 48 × 48 px)'
      }
    };
    return hints[field]?.[type] || '';
  };



  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Product</h1>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Basic Information</h2>
          <button className="submit-btn" onClick={handleSubmit} style={{ marginRight: "22px" }}>
            Submit
          </button>
        </div>
        <hr />
        <div className="form-group-row">
          <div className="form-group">
            <label>Product Type*</label>
            <select
              value={formData.ProductType}
              onChange={(e) => handleInput("ProductType", e.target.value)}
            >
              <option value="">Select Product Type</option>
              {PRODUCT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {formErrors.ProductType && <p className="error">{formErrors.ProductType}</p>}
          </div>
          <div className="selectCat form-group">
            <label>Category*</label>
            <div
              className="input_wrap placeholder"
              onClick={() => setOpenCategory((prev) => !prev)}
            >
              <input
                type="text"
                placeholder="Select Categories"
                value={
                  selectedCategories.length > 0
                    ? selectedCategories
                      .map((id) =>
                        categoryData.find((c) => c.CategoryID === id)?.CategoryName
                      )
                      .filter(Boolean)
                      .join(", ")
                    : ""
                }
                readOnly
              />
            </div>
            <div
              className={`dropdown__wrap ${openCategory ? "active" : ""}`}
              ref={dropdownRef}
            >
              <div className="dropdown_menu">
                {(categoryData || []).map((cat) => (
                  <div className="options" key={cat.CategoryID}>
                    <input
                      id={`cat-${cat.CategoryID}`}
                      type="checkbox"
                      name="category"
                      checked={selectedCategories.includes(cat.CategoryID)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...selectedCategories, cat.CategoryID]
                          : selectedCategories.filter((id) => id !== cat.CategoryID);
                        setSelectedCategories(newSelected);
                        if (!e.target.checked) {
                          setCategoryTaglines(prev => {
                            const updated = { ...prev };
                            delete updated[cat.CategoryID];
                            return updated;
                          });
                          setCategoryDisplayOrders(prev => {
                            const updated = { ...prev };
                            delete updated[cat.CategoryID];
                            return updated;
                          });
                        } else {
                          setCategoryDisplayOrders(prev => ({
                            ...prev,
                            [cat.CategoryID]: Object.keys(prev).length + 1
                          }));
                        }
                      }}
                    />
                    <div className="in-bx"></div>
                    <span>{cat.CategoryName}</span>
                  </div>
                ))}
              </div>
            </div>
            {formErrors.ProductCategory && <p className="error">{formErrors.ProductCategory}</p>}
          </div>
          <div className="form-group">
            <label>Product Name*</label>
            <input
              type="text"
              placeholder="e.g., Swasth Health Plan"
              value={formData.ProductName}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("ProductName", val);
                if (!ProductId) {
                  handleInput("ProductNameURL", generateSlug(val));
                }
              }}
            />
            {formErrors.ProductName && <p className="error">{formErrors.ProductName}</p>}
          </div>
          <div className="form-group">
            <label>Product URL*</label>
            <input
              type="text"
              placeholder="e.g., swasth-health-plan"
              value={formData.ProductNameURL}
              onChange={(e) => handleInput("ProductNameURL", e.target.value)}
            />
            {formErrors.ProductNameURL && <p className="error">{formErrors.ProductNameURL}</p>}
          </div>
          <div className="form-group">
            <label>Product Header / List Name</label>
            <input
              type="text"
              placeholder="e.g., swasth"
              value={formData.ProductHeaderListName}
              onChange={(e) => handleInput("ProductHeaderListName", e.target.value)}
            />
            {formErrors.ProductHeaderListName && <p className="error">{formErrors.ProductHeaderListName}</p>}
          </div>
        </div>
        {
          selectedCategories.length > 0 && (
            <>

              <div className="form-group-row" style={{ marginTop: "20px" }}>
                <div style={{ width: "100%" }}>
                  <h2 style={{ marginBottom: "12px" }}>
                    Category Taglines
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
                    gap: "15px"
                  }}>
                    {selectedCategories.map((categoryId) => {
                      const category = categoryData.find((c) => c.CategoryID === categoryId);
                      if (!category) return null;
                      return (
                        <div key={categoryId} className="form-group" style={{ margin: 0 }}>
                          <label>
                            {category.CategoryName} Tagline
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter tagline for ${category.CategoryName}`}
                            value={categoryTaglines[categoryId] || ''}
                            onChange={(e) => handleTaglineChange(categoryId, e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="form-group-row " style={{ marginTop: "20px" }}>
                <div style={{ width: "100%" }}>
                  <h2 style={{ marginBottom: "12px" }}>
                    Category Display Order
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "45px"
                  }}>
                    {selectedCategories.map((categoryId) => {
                      const category = categoryData.find((c) => c.CategoryID === categoryId);
                      if (!category) return null;
                      return (
                        <div key={categoryId} className="form-group displayorder" style={{ margin: 0 }}>
                          <label>
                            {category.CategoryName}
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={categoryDisplayOrders[categoryId]}
                            onChange={(e) => handleDisplayOrderChange(categoryId, e.target.value)}
                            style={{ width: "100%", }}
                            min="0"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )
        }
        <div className="form-group-row selected_group mb-0">
          <div className="selectCategoryWrap" style={{ marginTop: "22px" }}>
            {selectedCategories.length > 0 && (
              <div className="selectCategoryWrap">
                {selectedCategories.map((id) => {
                  const selected = categoryData.find((cat) => cat.CategoryID === id);
                  return (
                    selected && (
                      <div key={id} className="selected-item">
                        <span>{selected.CategoryName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(id)}
                          className="remove-btn"
                        >
                          X
                        </button>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="form-group-row" style={{ marginTop: "12px" }}>
          <div className="form-group" style={{ display: "none" }}>
            <label>Product Small Description*</label>
            <input
              type="text"
              placeholder="Empowering hospitals for exceptional patient care"
              value={formData.ProductSmallDescription}
              onChange={(e) => handleInput("ProductSmallDescription", e.target.value)}
            />
            {formErrors.ProductSmallDescription && <p className="error">{formErrors.ProductSmallDescription}</p>}
          </div>
          <div className="form-group">
            <label>Product Media*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInput("ProductMedia", file);
                if (file) setProductMediaPreview(URL.createObjectURL(file));
              }}
            />
            <span className="hint-text">{getHintText('ProductMedia')}</span>
            {formErrors.ProductMedia && <p className="error">{formErrors.ProductMedia}</p>}
          </div>
          {productMediaPreview && (
            <div style={{ display: "flex", alignItems: "center" }}>
              {getFileType(productMediaPreview) === 'video' ? (
                <video
                  src={productMediaPreview}
                  width={100}
                  height={100}
                  controls
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              ) : (
                <img src={productMediaPreview} alt="Product Media" width={80} />
              )}
            </div>
          )}
        </div>
        <div className="form-group-row" style={{ alignItems: "flex-start" }}>
          <div className="form-group" style={{ flex: 1, marginTop: "22px", marginBottom: "22px" }}>
            <label>Product List Description*</label>
            <SunEditor
              value={formData.ProductListDescription || ""}
              onChange={(val) => {
                handleInput("ProductListDescription", val);
                setFormErrors(prev => ({ ...prev, ProductListDescription: "" }));
              }}
              setOptions={{
                height: 200,
                buttonList: [
                  ["undo", "redo"],
                  ["bold", "underline", "italic"],
                  ["fontColor", "hiliteColor"],
                  ["align", "list"],
                  ["link"],
                  ["removeFormat"]
                ]
              }}
            />
            {formErrors.ProductListDescription && (
              <p className="error">{formErrors.ProductListDescription}</p>
            )}
          </div>
        </div>
        <div className="form-group-row" style={{ marginTop: "30px" }}>

          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={formData.ActiveStatus}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Active Status</label>
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkDisplayOnHome"
              checked={formData.DisplayOnHome}
              onChange={(e) => handleInput("DisplayOnHome", e.target.checked)}
            />
            <label htmlFor="chkDisplayOnHome">Display On Home</label>
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkDisplayOnHeader"
              checked={formData.DisplayOnHeader}
              onChange={(e) => handleInput("DisplayOnHeader", e.target.checked)}
            />
            <label htmlFor="chkDisplayOnHeader">Display On Header</label>
          </div>
          <div className="form-group-row statusac" >
            <input
              type="checkbox"
              id="chkComingSoon"
              checked={formData.ComingSoon}
              onChange={(e) => handleInput("ComingSoon", e.target.checked)}
            />
            <label htmlFor="chkComingSoon">Is Coming Soon</label>
          </div>

          <div className="form-group-row statusac" style={{ display: "none" }}>
            <input
              type="checkbox"
              id="chkDisplayOnFooter"
              checked={formData.DisplayOnFooter}
              onChange={(e) => handleInput("DisplayOnFooter", e.target.checked)}
            />
            <label htmlFor="chkDisplayOnFooter">Display On Footer</label>
          </div>

        </div>
        {shouldShowSection(1) && (
          <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
            <h2 style={{ marginTop: "30px" }}>Section 1</h2>
            <hr />
            <div className="form-group-row">
              {formData.ProductType !== "procalyx" && (
                <>
                  <div className="form-group">
                    <label>Title*</label>
                    <input
                      type="text"
                      placeholder="Empowering hospitals for"
                      value={formData.Section1Title}
                      onChange={(e) => handleInput("Section1Title", e.target.value)}
                    />
                    {formErrors.Section1Title && <p className="error">{formErrors.Section1Title}</p>}
                  </div>
                  <div className="form-group">
                    <label>Subtitle*</label>
                    <input
                      type="text"
                      placeholder="Exceptional Patient Care"
                      value={formData.Section1Subtitle}
                      onChange={(e) => handleInput("Section1Subtitle", e.target.value)}
                    />
                    {formErrors.Section1Subtitle && <p className="error">{formErrors.Section1Subtitle}</p>}
                  </div>
                  <div className="form-group">
                    <label>Button Text</label>
                    <input
                      type="text"
                      placeholder="Book a demo"
                      value={formData.Section1ButtonText}
                      onChange={(e) => handleInput("Section1ButtonText", e.target.value)}
                    />
                    {formErrors.Section1ButtonText && <p className="error">{formErrors.Section1ButtonText}</p>}
                  </div>
                </>
              )}
              {formData.ProductType === "procalyx" && (
                <div className="form-group">
                  <label>Title*</label>
                  <input
                    type="text"
                    placeholder="Enter section title"
                    value={formData.Section1Title}
                    onChange={(e) => handleInput("Section1Title", e.target.value)}
                  />
                  {formErrors.Section1Title && <p className="error">{formErrors.Section1Title}</p>}
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <label>Description*</label>
              <textarea
                rows={1}
                placeholder="Solutions built to streamline financial operations, allowing hospitals to prioritize patient care above all else."
                value={formData.Section1Description}
                onChange={(e) => handleInput("Section1Description", e.target.value)}
              />
              {formErrors.Section1Description && (
                <p className="error">{formErrors.Section1Description}</p>
              )}
            </div>
            <div className="form-group-row" style={{ alignItems: "flex-start", marginTop: "25px" }}>
              <div className="form-group" style={{ flex: 1, marginTop: "18px", marginBottom: "20px" }}>
                <label>Media*</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleInput("Section1MediaUrl", file);
                    if (file) {
                      const newPreviews = [...previewImages];
                      newPreviews[0] = URL.createObjectURL(file);
                    }
                  }}
                />
                <span className="hint-text">{getHintText('Section1MediaUrl')}</span>
                {formErrors.Section1MediaUrl && <p className="error">{formErrors.Section1MediaUrl}</p>}
              </div>
              {previewImages[0] && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {getFileType(previewImages[0]) === 'video' ? (
                    <video
                      src={previewImages[0]}
                      width={100}
                      height={100}
                      controls
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <img src={previewImages[0]} alt="Preview Section 1" width={80} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {shouldShowSection(2) && (
          <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
            <h2 style={{ marginTop: "30px" }}>Section 2</h2>
            <hr />
            <div className="form-group-row">
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  placeholder="Removing Financial Barriers to"
                  value={formData.Section2Title}
                  onChange={(e) => handleInput("Section2Title", e.target.value)}
                />
                {formErrors.Section2Title && <p className="error">{formErrors.Section2Title}</p>}
              </div>
              <div className="form-group">
                <label>Subtitle*</label>
                <input
                  type="text"
                  placeholder="Exceptional Care."
                  value={formData.Section2Subtitle}
                  onChange={(e) => handleInput("Section2Subtitle", e.target.value)}
                />
                {formErrors.Section2Subtitle && <p className="error">{formErrors.Section2Subtitle}</p>}
              </div>
              {["swasthera", "swasth-for-corporates", "swasth-for-families", "procalyx", "procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g., Get Started"
                    value={formData.Section2ButtonText}
                    onChange={(e) => handleInput("Section2ButtonText", e.target.value)}
                  />
                  {formErrors.Section2ButtonText && <p className="error">{formErrors.Section2ButtonText}</p>}
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginTop: "15px" }}>
              <label>Description*</label>
              <input
                type="text"
                placeholder="From managing financial cycles to funding next-generation facilities, complexity is removed to unlock vital resources. This strategic partnership simplifies patient enrollment, accelerates payment flow, and strengthens financial operations."
                value={formData.Section2Description}
                onChange={(e) => handleInput("Section2Description", e.target.value)}
              />
              {formErrors.Section2Description && <p className="error">{formErrors.Section2Description}</p>}
            </div>

            <div className="form-group-row" style={{ alignItems: "flex-start", marginTop: "15px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Media*</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleInput("Section2MediaUrl", file);
                    if (file) {
                      const newPreviews = [...previewImages];
                      newPreviews[1] = URL.createObjectURL(file);
                    }
                  }}
                />
                <span className="hint-text">{getHintText('Section2MediaUrl')}</span>
                {formErrors.Section2MediaUrl && <p className="error">{formErrors.Section2MediaUrl}</p>}
              </div>
              {previewImages[1] && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {getFileType(previewImages[1]) === 'video' ? (
                    <video
                      src={previewImages[1]}
                      width={100}
                      height={100}
                      controls
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <img src={previewImages[1]} alt="Preview Section 2" width={80} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {shouldShowSection(3) && (
          <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
            <h2 style={{ marginTop: "30px" }}>Section 3{!["procalyx", "procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && " - Items List"}</h2>
            <hr />
            <div className="form-group-row" style={{ alignItems: "flex-start" }}>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  placeholder="Streamlined"
                  value={formData.Section3Title}
                  onChange={(e) => handleInput("Section3Title", e.target.value)}
                />
                {formErrors.Section3Title && <p className="error">{formErrors.Section3Title}</p>}
              </div>
              {!["procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
                <div className="form-group">
                  <label>Subtitle*</label>
                  <input
                    type="text"
                    placeholder="Operational Flow"
                    value={formData.Section3Subtitle}
                    onChange={(e) => handleInput("Section3Subtitle", e.target.value)}
                  />
                  {formErrors.Section3Subtitle && <p className="error">{formErrors.Section3Subtitle}</p>}
                </div>
              )}
              {formData.ProductType === "procalyx" && (
                <>
                  <div className="form-group">
                    <label>Button Text*</label>
                    <input
                      type="text"
                      placeholder="e.g., View All"
                      value={formData.Section3ButtonText}
                      onChange={(e) => handleInput("Section3ButtonText", e.target.value)}
                    />
                    {formErrors.Section3ButtonText && <p className="error">{formErrors.Section3ButtonText}</p>}
                  </div>
                </>
              )}
              {!["procalyx", "procalyx-hospital", "procalyx-pharma", "swasthera"].includes(formData.ProductType) && (
                <>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Media*</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleInput("Section3MediaUrl", file);
                        if (file) {
                          const newPreviews = [...previewImages];
                          newPreviews[2] = URL.createObjectURL(file);
                        }
                      }}
                    />
                    <span className="hint-text">{getHintText('Section3MediaUrl')}</span>
                    {formErrors.Section3MediaUrl && <p className="error">{formErrors.Section3MediaUrl}</p>}
                  </div>
                  {previewImages[2] && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {getFileType(previewImages[2]) === 'video' ? (
                        <video
                          src={previewImages[2]}
                          width={100}
                          height={100}
                          controls
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <img src={previewImages[2]} alt="Preview Section 3" width={80} />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            {["procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label>Description*</label>
                <input
                  type="text"
                  placeholder="Enter section description"
                  value={formData.Section3Description}
                  onChange={(e) => handleInput("Section3Description", e.target.value)}
                />
                {formErrors.Section3Description && <p className="error">{formErrors.Section3Description}</p>}
              </div>
            )}
            {formData.ProductType === "procalyx" && (
              <>
                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label>Description*</label>
                  <input
                    type="text"
                    placeholder="Enter section description"
                    value={formData.Section3Description}
                    onChange={(e) => handleInput("Section3Description", e.target.value)}
                  />
                  {formErrors.Section3Description && <p className="error">{formErrors.Section3Description}</p>}
                </div>

                <div className="form-group-row" style={{ alignItems: "flex-start", marginTop: "15px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Media*</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleInput("Section3MediaUrl", file);
                        if (file) {
                          const newPreviews = [...previewImages];
                          newPreviews[2] = URL.createObjectURL(file);
                        }
                      }}
                    />
                    <span className="hint-text">{getHintText('Section3MediaUrl')}</span>
                    {formErrors.Section3MediaUrl && <p className="error">{formErrors.Section3MediaUrl}</p>}
                  </div>
                  {previewImages[2] && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {getFileType(previewImages[2]) === 'video' ? (
                        <video
                          src={previewImages[2]}
                          width={100}
                          height={100}
                          controls
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <img src={previewImages[2]} alt="Preview Section 3" width={80} />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {!["procalyx"].includes(formData.ProductType) && (
              <>
                <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>
                  Section 3 Sub Items*
                  {formData.ProductType === "swasth-for-families" && " (Exactly 6 items required)"}
                  {formData.ProductType === "swasth-for-corporates" && " (Exactly 4 items required)"}
                </h2>
                {formErrors.section3Items && <p className="error">{formErrors.section3Items}</p>}
                {section3Items.map((item, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                      {formData.ProductType !== "swasthera" && (
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Item Title {index + 1}*</label>
                          <input
                            type="text"
                            placeholder="Client Onboarding & Enrollment"
                            value={item.ItemTitle}
                            onChange={(e) => updateSectionItem(3, index, "ItemTitle", e.target.value)}
                          />
                        </div>
                      )}
                      {["swasth-for-hospitals", "procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Item Description*</label>
                          <input
                            type="text"
                            placeholder="Simplified patient enrollment via financial counselor or hospital staff."
                            value={item.ItemDescription}
                            onChange={(e) => updateSectionItem(3, index, "ItemDescription", e.target.value)}
                          />
                        </div>
                      )}
                      <div className={`form-group ${formData.ProductType === "swasthera" ? "only_img" : ""}`}>
                        <label>{formData.ProductType === "swasthera" ? "Logo*" : "Item Icon*"}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateSectionItem(3, index, "ItemIconUrl", e.target.files?.[0] || null)}
                        />
                        <span className="hint-text">{getHintText('Section3ItemIcon')}</span>
                      </div>
                      {item.previewImage && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={item.previewImage} alt={`Icon ${index + 1}`} width={60} height={60} style={{ objectFit: "cover", borderRadius: "4px" }} />
                        </div>
                      )}
                      <div className="form-group-row statusac" style={{ marginTop: "24px", display: "none" }}>
                        <input
                          type="checkbox"
                          id={`sec3-active-${index}`}
                          checked={item.ActiveStatus}
                          onChange={(e) => updateSectionItem(3, index, "ActiveStatus", e.target.checked)}
                        />
                        <label htmlFor={`sec3-active-${index}`}>Active</label>
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeSectionItem(3, index)}
                          className="submit-btn"
                          style={{ background: "#dc3545", marginTop: "24px" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {(() => {
                  const shouldShowAddButton = (() => {
                    if (formData.ProductType === "swasth-for-families") {
                      return section3Items.length < 6;
                    }
                    if (formData.ProductType === "swasth-for-hospitals") {
                      return section3Items.length < 5;
                    }
                    if (formData.ProductType === "swasth-for-corporates") {
                      return section3Items.length < 4;
                    }
                    return true;
                  })();

                  return shouldShowAddButton && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                      <button
                        type="button"
                        onClick={() => addSectionItem(3)}
                        className="submit-btn"
                      >
                        + Add More Items
                      </button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
        {shouldShowSection(4) && (
          <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
            <h2 style={{ marginTop: "30px" }}>Section 4 - Items List</h2>
            <hr />
            <div className="form-group-row" style={{ alignItems: "flex-start" }}>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  placeholder="Strategic Advantages for"
                  value={formData.Section4Title}
                  onChange={(e) => handleInput("Section4Title", e.target.value)}
                />
                {formErrors.Section4Title && <p className="error">{formErrors.Section4Title}</p>}
              </div>
              <div className="form-group">
                <label>Subtitle*</label>
                <input
                  type="text"
                  placeholder="Healthcare Institutions."
                  value={formData.Section4Subtitle}
                  onChange={(e) => handleInput("Section4Subtitle", e.target.value)}
                />
                {formErrors.Section4Subtitle && <p className="error">{formErrors.Section4Subtitle}</p>}
              </div>
              {!["swasthera", "swasth-for-corporates", "swasth-for-hospitals", "procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g., Contact Us"
                    value={formData.Section4ButtonText}
                    onChange={(e) => handleInput("Section4ButtonText", e.target.value)}
                  />
                  {formErrors.Section4ButtonText && <p className="error">{formErrors.Section4ButtonText}</p>}
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginTop: "15px" }}>
              <label>Description*</label>
              <input
                type="text"
                placeholder="Why Partner With the Swasth Ecosystem"
                value={formData.Section4Description}
                onChange={(e) => handleInput("Section4Description", e.target.value)}
              />
              {formErrors.Section4Description && <p className="error">{formErrors.Section4Description}</p>}
            </div>
            {/* , "swasth-for-hospitals" */}
            {!["procalyx-hospital", "procalyx-pharma"].includes(formData.ProductType) && (
              <div className="form-group-row" style={{ alignItems: "flex-start", marginTop: "15px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Media*</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleInput("Section4MediaUrl", file);
                      if (file) {
                        const newPreviews = [...previewImages];
                        newPreviews[3] = URL.createObjectURL(file);
                      }
                    }}
                  />
                  <span className="hint-text">{getHintText('Section4MediaUrl')}</span>
                  {formErrors.Section4MediaUrl && <p className="error">{formErrors.Section4MediaUrl}</p>}
                </div>
                {previewImages[3] && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {getFileType(previewImages[3]) === 'video' ? (
                      <video
                        src={previewImages[3]}
                        width={100}
                        height={100}
                        controls
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <img src={previewImages[3]} alt="Preview Section 4" width={80} />
                    )}
                  </div>
                )}
              </div>
            )}
            <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>Section 4 Sub Items*</h2>
            {formErrors.section4Items && <p className="error">{formErrors.section4Items}</p>}
            {section4Items.map((item, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Item Title {index + 1}*</label>
                    <input
                      type="text"
                      placeholder="Full spectrum of services"
                      value={item.ItemTitle}
                      onChange={(e) => updateSectionItem(4, index, "ItemTitle", e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Item Description</label>
                    <input
                      type="text"
                      placeholder="Extended access to OPD, IP, and ancillary care through a rewarding financial model and digital integration."
                      value={item.ItemDescription}
                      onChange={(e) => updateSectionItem(4, index, "ItemDescription", e.target.value)}
                    />
                  </div>
                  {needsSection4Icon() && (
                    <>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Item Icon*</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateSectionItem(4, index, "ItemIconUrl", e.target.files?.[0] || null)}
                        />
                        <span className="hint-text">{getHintText('Section4ItemIcon')}</span>
                      </div>
                      {item.previewImage && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={item.previewImage} alt={`Icon ${index + 1}`} width={60} height={60} style={{ objectFit: "cover", borderRadius: "4px" }} />
                        </div>
                      )}
                    </>
                  )}
                  <div className="form-group-row statusac" style={{ marginTop: "24px", display: "none" }}>
                    <input
                      type="checkbox"
                      id={`sec4-active-${index}`}
                      checked={item.ActiveStatus}
                      onChange={(e) => updateSectionItem(4, index, "ActiveStatus", e.target.checked)}
                    />
                    <label htmlFor={`sec4-active-${index}`}>Active</label>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSectionItem(4, index)}
                      className="submit-btn"
                      style={{ background: "#dc3545", marginTop: "24px" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => addSectionItem(4)}
                className="submit-btn"
              >
                + Add More Items
              </button>
            </div>
          </div>
        )}
        {shouldShowSection(5) && (
          <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
            <h2 style={{ marginTop: "30px" }}>Section 5 - Items List</h2>
            <hr />
            <div className="form-group-row">
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  placeholder="Value Addons"
                  value={formData.Section5Title}
                  onChange={(e) => handleInput("Section5Title", e.target.value)}
                />
                {formErrors.Section5Title && <p className="error">{formErrors.Section5Title}</p>}
              </div>
              <div className="form-group">
                <label>Subtitle*</label>
                <input
                  type="text"
                  placeholder="Products"
                  value={formData.Section5Subtitle}
                  onChange={(e) => handleInput("Section5Subtitle", e.target.value)}
                />
                {formErrors.Section5Subtitle && <p className="error">{formErrors.Section5Subtitle}</p>}
              </div>
              <div className="form-group">
                <label>Button Text*</label>
                <input
                  type="text"
                  placeholder="For more detail get in touch"
                  value={formData.Section5ButtonText}
                  onChange={(e) => handleInput("Section5ButtonText", e.target.value)}
                />
                {formErrors.Section5ButtonText && <p className="error">{formErrors.Section5ButtonText}</p>}
              </div>
            </div>
            <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>Section 5 Sub Items*</h2>
            {formErrors.section5Items && <p className="error">{formErrors.section5Items}</p>}
            {section5Items.map((item, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Item Title {index + 1}*</label>
                    <input
                      type="text"
                      placeholder="Corporates"
                      value={item.ItemTitle}
                      onChange={(e) => updateSectionItem(5, index, "ItemTitle", e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Item Description*</label>
                    <input
                      type="text"
                      placeholder="Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                      value={item.ItemDescription}
                      onChange={(e) => updateSectionItem(5, index, "ItemDescription", e.target.value)}
                    />
                  </div>

                  {/* Hide Active Status checkbox for Section 5 */}
                  <div className="form-group-row statusac" style={{ marginTop: "24px", display: "none" }}>
                    <input
                      type="checkbox"
                      id={`sec5-active-${index}`}
                      checked={item.ActiveStatus}
                      onChange={(e) => updateSectionItem(5, index, "ActiveStatus", e.target.checked)}
                    />
                    <label htmlFor={`sec5-active-${index}`}>Active</label>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSectionItem(5, index)}
                      className="submit-btn"
                      style={{ background: "#dc3545", marginTop: "24px" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => addSectionItem(5)}
                className="submit-btn"
              >
                + Add More Items
              </button>
            </div>
          </div>
        )}
        <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
          <h2 style={{ marginTop: "30px" }}>Form Section</h2>
          <hr />
          <div className="form-group-row">
            <div className="form-group">
              <label>Title*</label>
              <input
                type="text"
                placeholder="e.g., Get Started Today"
                value={formData.Section6Title}
                onChange={(e) => handleInput("Section6Title", e.target.value)}
              />
              {formErrors.Section6Title && <p className="error">{formErrors.Section6Title}</p>}
            </div>
            <div className="form-group">
              <label>Subtitle*</label>
              <input
                type="text"
                placeholder="e.g., Join thousands of satisfied customers"
                value={formData.Section6Subtitle}
                onChange={(e) => handleInput("Section6Subtitle", e.target.value)}
              />
              {formErrors.Section6Subtitle && <p className="error">{formErrors.Section6Subtitle}</p>}
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group" style={{ marginTop: "22px", marginBottom: "22px" }}>
              <label>Description*</label>
              <input
                type="text"
                placeholder="Enter form section description"
                value={formData.Section6Description}
                onChange={(e) => handleInput("Section6Description", e.target.value)}
              />
              {formErrors.Section6Description && <p className="error">{formErrors.Section6Description}</p>}
            </div>
            <div className="form-group" style={{ marginTop: "22px", marginBottom: "22px" }}>
              <label>Form Heading*</label>
              <input
                type="text"
                placeholder="e.g., Contact Us"
                value={formData.Section6FormHeading}
                onChange={(e) => handleInput("Section6FormHeading", e.target.value)}
              />
              {formErrors.Section6FormHeading && <p className="error">{formErrors.Section6FormHeading}</p>}
            </div>
          </div>
        </div>
        <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
          <h2 style={{ marginTop: "30px" }}>SEO</h2>
          <hr />
          <div className="form-group">
            <label>Meta Title</label>
            <input
              type="text"
              placeholder="Enter meta title for SEO"
              value={formData.MetaTitle}
              onChange={(e) => handleInput("MetaTitle", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Meta Keywords</label>
            <input
              type="text"
              placeholder="e.g., health, insurance, wellness"
              value={formData.MetaKeywords}
              onChange={(e) => handleInput("MetaKeywords", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Meta Descriptions</label>
            <input
              type="text"
              placeholder="Brief description for search engines"
              value={formData.MetaDescriptions}
              onChange={(e) => handleInput("MetaDescriptions", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Meta Schema</label>
            <input
              type="text"
              placeholder="Enter structured data schema"
              value={formData.MetaSchema}
              onChange={(e) => handleInput("MetaSchema", e.target.value)}
            />
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/afford-admin/manage-product" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
