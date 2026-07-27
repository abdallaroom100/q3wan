import hotToast from "../../../common/hotToast";
import axios from "axios";
import { useState } from "react";
import { Beneficiary } from "../types";

type EditReportParams = {
  beneficiaryData: Beneficiary | null;
  reportId: string | undefined;
  attachments?: Record<string, File>;
};

export const useEditReportData = () => {
  let token = "";
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin?.token) token = admin.token;
  } catch (error) {
    console.log(error);
  }

  const [editedUser, setEditedUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const editReport = async ({
    beneficiaryData,
    reportId,
    attachments = {},
  }: EditReportParams) => {
    setLoading(true);
    setReportError(null);
    setEditedUser(null);

    if (!beneficiaryData || !reportId) {
      setReportError("بيانات المستفيد غير متاحة");
      setLoading(false);
      return null;
    }

    const formData = new FormData();
    Object.entries(beneficiaryData).forEach(([key, value]) => {
      if (key === "housemates" || key === "incomeSources") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    Object.entries(attachments).forEach(([field, file]) => {
      formData.append(field, file);
    });

    try {
      const response = await axios.patch(`/admin/edit/${reportId}`, formData, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) return null;

      hotToast({ type: "success", message: response.data.message });
      setEditedUser(response.data.user);
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.error || "تعذر حفظ التعديلات";
      setReportError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    reportLoading: loading,
    reportError,
    editedUser,
    editReport,
  };
};
