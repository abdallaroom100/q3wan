import React from "react";
import styles from "../SignFamily.module.css";

interface CompanionsFormProps {
  companions: any[];
  setCompanions: (cb: (prev: any[]) => any[]) => void;
}

const CompanionsForm: React.FC<CompanionsFormProps> = ({ companions, setCompanions }) => {
  const handleChange = (idx: number, field: string, value: any) => {
    setCompanions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };
  const handleAdd = () => {
    setCompanions(prev => [...prev, { name: "", identityNumber: "", birthDate: "", gender: "ذكر", kinship: "" }]);
  };
  const handleRemove = (idx: number) => {
    setCompanions(prev => prev.filter((_, i) => i !== idx));
  };
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>بيانات المرافقين</h2>
      {companions.map((companion, idx) => (
        <div key={idx} className={styles.formGroup} style={{ border: "1px solid #eee", marginBottom: 10, padding: 10 }}>
          <label>الاسم</label>
          <input type="text" value={companion.name} onChange={e => handleChange(idx, "name", e.target.value)} />
          <label>رقم الهوية</label>
          <input type="text" value={companion.identityNumber} onChange={e => handleChange(idx, "identityNumber", e.target.value)} />
          <label>تاريخ الميلاد</label>
          <input type="date" value={companion.birthDate} onChange={e => handleChange(idx, "birthDate", e.target.value)} />
          <label>الجنس</label>
          <select value={companion.gender} onChange={e => handleChange(idx, "gender", e.target.value)}>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
          <label>صلة القرابة</label>
          <input type="text" value={companion.kinship} onChange={e => handleChange(idx, "kinship", e.target.value)} />
          <button type="button" onClick={() => handleRemove(idx)} style={{ color: "red", marginTop: 5 }}>حذف</button>
        </div>
      ))}
      <button type="button" onClick={handleAdd}>إضافة مرافق</button>
    </div>
  );
};

export default CompanionsForm; 