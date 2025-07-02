import { useState } from "react";
import styles from "../Dashboard.module.css";
import { AdminData } from "../types";

const Settings = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    fullName: "محمد المدير",
    phone: "05XXXXXXXX",
    email: "admin@email.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: keyof AdminData, value: string) => {
    setAdminData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمات المرور
    if (adminData.newPassword !== adminData.confirmPassword) {
      alert("كلمات المرور الجديدة غير متطابقة");
      return;
    }

    // التحقق من طول كلمة المرور الجديدة
    if (adminData.newPassword && adminData.newPassword.length < 6) {
      alert("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    // هنا يمكن إضافة منطق حفظ البيانات
    console.log("Saving admin data:", adminData);
    alert("تم حفظ التغييرات بنجاح");
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.detailsTitle}>تحديث بيانات المدير</h1>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div style={{ gridColumn: "span 2" }}>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              الاسم الكامل
            </span>
            <input
              type="text"
              className={styles.searchInput}
              value={adminData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="محمد المدير"
            />
          </label>
        </div>

        <div>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              رقم الجوال
            </span>
            <input
              type="tel"
              className={styles.searchInput}
              value={adminData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="05XXXXXXXX"
            />
          </label>
        </div>

        <div>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              البريد الإلكتروني
            </span>
            <input
              type="email"
              className={styles.searchInput}
              value={adminData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="admin@email.com"
            />
          </label>
        </div>

        <div>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              كلمة المرور الحالية
            </span>
            <input
              type="password"
              className={styles.searchInput}
              value={adminData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              placeholder="••••••••"
            />
          </label>
        </div>

        <div>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              كلمة المرور الجديدة
            </span>
            <input
              type="password"
              className={styles.searchInput}
              value={adminData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="••••••••"
            />
          </label>
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <label className={styles.inputGroup}>
            <span style={{ color: "#4a5a7a", fontSize: "15px", fontWeight: "500", marginBottom: "2px" }}>
              تأكيد كلمة المرور الجديدة
            </span>
            <input
              type="password"
              className={styles.searchInput}
              value={adminData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
            />
          </label>
        </div>

        <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "2rem" }}>
          <button type="submit" className={styles.printButton}>
            💾 حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 