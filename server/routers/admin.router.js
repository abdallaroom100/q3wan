


import {Router} from "express"
import { protectedAdminRoute } from "../utils/protectedRoute.js"
import { confirmBeneficiary, currentAdminTask, decideIfBeneficiaryIsDeserve, editReportByManager, getCurrentAdmin, getCurrentReportData, getManagerTasks, loginAdmin, singupAdmin } from "../controllers/admin.controller.js"
const router =  Router()



router.get("/me",protectedAdminRoute,getCurrentAdmin)
router.post("/login",loginAdmin)
router.post("/signup",singupAdmin)



// admin tasks 

router.get("/tasks",protectedAdminRoute,currentAdminTask)
router.post("/confirm/:reportId",protectedAdminRoute,confirmBeneficiary)
router.post("/decide/:reportId",protectedAdminRoute,decideIfBeneficiaryIsDeserve)
router.get("/manageredit/:reportId",protectedAdminRoute,editReportByManager)
router.get("/manager",protectedAdminRoute,getManagerTasks)
router.get("/reportDetails/:reportId",protectedAdminRoute,getCurrentReportData)
export default router