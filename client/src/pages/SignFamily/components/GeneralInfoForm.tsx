import React from "react";
import styles from "../SignFamily.module.css";

interface GeneralInfoFormProps {
  formData: any;
  setFormData: (cb: (prev: any) => any) => void;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ formData, setFormData }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>البيانات العامة</h2>
      <div className={styles.formGroup}>
        <label>الحالة الاجتماعية</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={e => setFormData(prev => ({ ...prev, maritalStatus: e.target.value }))}
        >
          <option value="">اختر</option>
          <option value="أعزب">أعزب</option>
          <option value="متزوج">متزوج</option>
          <option value="مطلق">مطلق</option>
          <option value="أرمل">أرمل</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>الجنسية</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>مدينة السكن</label>
        <input
          type="text"
          name="cityOfResidence"
          value={formData.cityOfResidence}
          onChange={e => setFormData(prev => ({ ...prev, cityOfResidence: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>المهنة</label>
        <select
          name="jobStatus"
          value={formData.jobStatus || ""}
          onChange={e => setFormData(prev => ({ ...prev, jobStatus: e.target.value }))}
        >
          <option value="">اختر</option>
          <option value="عاطل">عاطل</option>
          <option value="موظف">موظف</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>الحالة الصحية</label>
        <select
          name="healthStatus"
          value={formData.healthStatus || ""}
          onChange={e => setFormData(prev => ({ ...prev, healthStatus: e.target.value }))}
        >
          <option value="">اختر</option>
          <option value="سليم">سليم</option>
          <option value="غير سليم">غير سليم</option>
        </select>
      </div>
      {formData.healthStatus === "غير سليم" && (
        <div className={styles.formGroup}>
          <label>نوع الإعاقة</label>
          <input
            type="text"
            name="disabilityType"
            value={formData.disabilityType || ""}
            onChange={e => setFormData(prev => ({ ...prev, disabilityType: e.target.value }))}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <label>الحي</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>نوع السكن</label>
        <select
          name="housingType"
          value={formData.housingType || ""}
          onChange={e => setFormData(prev => ({ ...prev, housingType: e.target.value }))}
        >
          <option value="">اختر</option>
          <option value="ملك">ملك</option>
          <option value="إيجار">إيجار</option>
        </select>
      </div>
      {formData.housingType === "إيجار" && (
        <div className={styles.formGroup}>
          <label>مبلغ الإيجار</label>
          <input
            type="text"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={e => setFormData(prev => ({ ...prev, rentAmount: e.target.value }))}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <label>البنك</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={e => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>صورة الآيبان</label>
        <input
          type="file"
          name="ibanImage"
          onChange={e => setFormData(prev => ({ ...prev, ibanImage: e.target.files?.[0] || null }))}
        />
      </div>
    </div>
  );
};

export default GeneralInfoForm; 