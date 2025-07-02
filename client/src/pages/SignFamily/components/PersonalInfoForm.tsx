import React from "react";
import styles from "../SignFamily.module.css";

interface PersonalInfoFormProps {
  formData: any;
  setFormData: (cb: (prev: any) => any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, setFormData }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>البيانات الأساسية</h2>
      <div className={styles.formGroup}>
        <label>الاسم الأول</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>الاسم الثاني</label>
        <input
          type="text"
          name="secondName"
          value={formData.secondName}
          onChange={e => setFormData(prev => ({ ...prev, secondName: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>الاسم الثالث</label>
        <input
          type="text"
          name="thirdName"
          value={formData.thirdName}
          onChange={e => setFormData(prev => ({ ...prev, thirdName: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>اسم العائلة</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>رقم الهوية</label>
        <input
          type="text"
          name="identityNumber"
          value={formData.identityNumber}
          onChange={e => setFormData(prev => ({ ...prev, identityNumber: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>الجنس</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
        >
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>تاريخ الميلاد</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>رقم الجوال</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label>البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm; 