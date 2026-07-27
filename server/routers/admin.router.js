


import {Router} from "express"
import { protectedAdminRoute } from "../utils/protectedRoute.js"
import { acceptReportByCommittee, acceptReportByManager, confirmBeneficiary, currentAdminTask, decideIfBeneficiaryIsDeserve, deleteBeneficiary, deleteTemporary, editBeneficiaryData, editReportByManager, getCurrentAdmin, getCurrentReportData, getDeletedReports, getFinalAcceptedReports, getFinalReports, getManagerTasks, getProcess, loginAdmin, rejectReportByCommittee, rejectReportByManager, returnReportFromDeleted, searchForReport, singupAdmin } from "../controllers/admin.controller.js"
import Report from "../models/Report.schema.js"
import multer from "multer"
import path, { dirname } from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from "uuid"
const router =  Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseUploadPath = process.env.DEV_MODE === "true"
  ? path.join(__dirname, "../uploads")
  : "/home/ubuntu/gdrive/uploads";

const resolveBeneficiaryUser = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.reportId).select("user");
    if (!report) return res.status(404).json({ error: "التقرير غير موجود" });
    req.beneficiaryUserId = report.user.toString();
    next();
  } catch {
    return res.status(400).json({ error: "معرف التقرير غير صالح" });
  }
};

const attachmentFolders = {
  idImagePath: "identity",
  familyCardFile: "familyCard",
  ibanImage: "iban",
  rentContractFile: "rent",
};

const adminAttachmentStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let subFolder = attachmentFolders[file.fieldname];
      if (!subFolder) {
        const match = file.fieldname.match(/^incomeSources\[(\d+)\]\[sourceImage\]$/);
        subFolder = match ? path.join("incomeSources", `source-${match[1]}`) : null;
      }
      if (!subFolder) return cb(new Error("حقل المرفق غير مدعوم"));
      const destination = path.join(baseUploadPath, req.beneficiaryUserId, subFolder);
      await fs.mkdir(destination, { recursive: true });
      cb(null, destination);
    } catch (error) {
      cb(error);
    }
  },
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const adminAttachmentUpload = multer({
  storage: adminAttachmentStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"].includes(file.mimetype);
    cb(allowed ? null : new Error("فقط الصور (JPG, JPEG, PNG) وملفات PDF مسموح بها"), allowed);
  },
}).fields([
  { name: "idImagePath", maxCount: 1 },
  { name: "familyCardFile", maxCount: 1 },
  { name: "ibanImage", maxCount: 1 },
  { name: "rentContractFile", maxCount: 1 },
  { name: "incomeSources[0][sourceImage]", maxCount: 1 },
  { name: "incomeSources[1][sourceImage]", maxCount: 1 },
  { name: "incomeSources[2][sourceImage]", maxCount: 1 },
  { name: "incomeSources[3][sourceImage]", maxCount: 1 },
]);

const uploadAdminAttachments = (req, res, next) => {
  adminAttachmentUpload(req, res, (error) => {
    if (error) return res.status(400).json({ error: error.message });
    next();
  });
};


router.get("/me",protectedAdminRoute,getCurrentAdmin)
router.post("/login",loginAdmin)
router.post("/signup",singupAdmin)



// admin tasks 

router.get("/tasks",protectedAdminRoute,currentAdminTask)

router.post("/search",protectedAdminRoute,searchForReport)


router.post("/confirm/:userId",protectedAdminRoute,confirmBeneficiary)
router.delete("/delete/:userId",protectedAdminRoute,deleteBeneficiary)
router.post("/trash/:userId",protectedAdminRoute,deleteTemporary)
router.post("/back/:userId",protectedAdminRoute,returnReportFromDeleted)
router.get("/deleted",protectedAdminRoute,getDeletedReports)

router.post("/decide/:reportId",protectedAdminRoute,decideIfBeneficiaryIsDeserve)
router.get("/manager",protectedAdminRoute,getManagerTasks)

router.get("/reportDetails/:reportId",protectedAdminRoute,getCurrentReportData)
 

router.post("/rejectc/:userId",protectedAdminRoute,rejectReportByCommittee)
router.post("/acceptc/:userId",protectedAdminRoute,acceptReportByCommittee)

 

router.get("/manageredit/:reportId",protectedAdminRoute,editReportByManager)
router.post("/rejectm/:userId",protectedAdminRoute,rejectReportByManager)
router.post("/acceptm/:userId",protectedAdminRoute,acceptReportByManager)
router.get("/final",protectedAdminRoute,getFinalReports)
router.get("/archive",protectedAdminRoute,getFinalAcceptedReports)
router.get("/process",protectedAdminRoute,getProcess)

router.patch(
  "/edit/:reportId",
  protectedAdminRoute,
  resolveBeneficiaryUser,
  uploadAdminAttachments,
  editBeneficiaryData,
)
export default router
