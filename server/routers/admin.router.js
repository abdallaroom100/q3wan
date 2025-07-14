


import {Router} from "express"
import { protectedAdminRoute } from "../utils/protectedRoute.js"
import { acceptReportByCommittee, acceptReportByManager, confirmBeneficiary, currentAdminTask, decideIfBeneficiaryIsDeserve, deleteBeneficiary, deleteTemporary, editBeneficiaryData, editReportByManager, getCurrentAdmin, getCurrentReportData, getDeletedReports, getFinalAcceptedReports, getFinalReports, getManagerTasks, getProcess, loginAdmin, rejectReportByCommittee, rejectReportByManager, returnReportFromDeleted, searchForReport, singupAdmin } from "../controllers/admin.controller.js"
const router =  Router()



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

router.patch("/edit/:reportId",protectedAdminRoute,editBeneficiaryData)
export default router   