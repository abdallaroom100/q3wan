


import {Router} from "express"
import { protectedAdminRoute } from "../utils/protectedRoute.js"
import { acceptReportByCommittee, acceptReportByManager, confirmBeneficiary, currentAdminTask, decideIfBeneficiaryIsDeserve, deleteBeneficiary, editBeneficiaryData, editReportByManager, getCurrentAdmin, getCurrentReportData, getManagerTasks, loginAdmin, rejectReportByCommittee, rejectReportByManager, searchForReport, singupAdmin } from "../controllers/admin.controller.js"
const router =  Router()



router.get("/me",protectedAdminRoute,getCurrentAdmin)
router.post("/login",loginAdmin)
router.post("/signup",singupAdmin)



// admin tasks 

router.get("/tasks",protectedAdminRoute,currentAdminTask)

router.post("/search",protectedAdminRoute,searchForReport)


router.post("/confirm/:userId",protectedAdminRoute,confirmBeneficiary)
router.delete("/delete/:userId",protectedAdminRoute,deleteBeneficiary)



router.post("/decide/:reportId",protectedAdminRoute,decideIfBeneficiaryIsDeserve)
router.get("/manager",protectedAdminRoute,getManagerTasks)

router.get("/reportDetails/:reportId",protectedAdminRoute,getCurrentReportData)


router.post("/rejectc/:userId",protectedAdminRoute,rejectReportByCommittee)
router.post("/acceptc/:userId",protectedAdminRoute,acceptReportByCommittee)



router.get("/manageredit/:reportId",protectedAdminRoute,editReportByManager)
router.post("/rejectm/:userId",protectedAdminRoute,rejectReportByManager)
router.post("/acceptm/:userId",protectedAdminRoute,acceptReportByManager)




router.patch("/edit/:reportId",protectedAdminRoute,editBeneficiaryData)
export default router