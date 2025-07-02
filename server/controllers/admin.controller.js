import Admin from "../models/Admin.schema.js";
import validator from "validator";
import { generateAdminToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs"
import mongoose from "mongoose";
import User from "../models/User.schema.js"
import Report from "../models/Report.schema.js";
export const singupAdmin = async (req, res) => {
  try {
    const { name, email, password, rule } = req.body;

    const checkName = String(name).split(" ").length >= 3;
    if (!checkName)
      return res
        .status(400)
        .json({ error: "الاسم يجب ان يكون علي الاقل ثلاثي" });

    const checkEmail = validator.isEmail(email);
    if (!checkEmail)
      return res.status(400).json({ error: "برجاء ادخال بريد الكتروني صالح" });

    const checkPassword = String(password).length > 8;
    if (!checkPassword) {
      return res
        .status(400)
        .json({ error: "الرقم السري يجب ان  يكون 8 احرف علي الاقل" });
    }

    const hash = bcrypt.hashSync(password, 10);

    if (rule == "manager" || rule == "committee" || rule == "reviewer") {
    } else {
      return res.status(400).json({ error: "من فضلك قم باختيار صلاحيه متاحه" });
    }
    const checkUserExists = await Admin.findOne({ email });
    if (checkUserExists) {
      return res.status(400).json({ error: "هذا الحساب موجود بالفعل" });
    }

    const createdUser = await Admin.create({
      name,
      email,
      password: hash,
      rule,
    });
    return res.status(200).json(createdUser);
  } catch (error) {
    console.log("error in get signup admin");
    console.log(error.message);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const currentAdmin = await Admin.findOne({ email });
    if (!currentAdmin) {
      return res.status(200).json({ error: "بيانات الادمن هذا غير موجوده" });
    }
    const checkPassword = bcrypt.compareSync(password,currentAdmin.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "الرقم السري غير صحيح " });
    }

    generateAdminToken(currentAdmin._id,req,res);

    res.status(200).json({
      success: true,
      admin: {
        ...currentAdmin._doc,
        password: undefined,
        token: req.token,
      },
    });

  } catch (error) {
    console.log("errro in login admin ");
    console.log(error.message);
  }
};
export const getCurrentAdmin = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin) {
      return res.status(401).json({ error: "بيانات هذا الادمن غير موجوده" });
    }
    return res.status(201).json({
      success:true,
      admin:{
        ...currentAdmin._doc,
        password:undefined
      }
    });
  } catch (error) {
    console.log("error in get current admin");
    console.log(error.message);
  }
};











export const currentAdminTask = async (req,res)=>{
  
  try {
    const currentAdmin = await Admin.findById(req.adminId)
    console.log(req.adminId)
 
    const currentAdminRule = currentAdmin?.rule
  
    if(currentAdminRule == "manager" || currentAdminRule  == "reviewer"|| currentAdminRule == "committee"){
      
    }else
     {
      return res.status(400).json({error:"هذه الصلاحيه غير موجوده"})
     }

     const rules = [
      ["reviewer","under_review"],
      ["committee","under_committee"],
      ["manager","under_manager"],
     ]
    const adminMap  = new Map(rules)
 
   const tasks = await Report.find({status:adminMap.get(currentAdminRule)}).populate("user","identityNumber idImagePath firstName secondName thirdName")
   return res.status(200).json({tasks})
  } catch (error) {
    console.log("error in current admin task")
    console.log(error.message)
  }
}


// reviewer abilities

export const confirmBeneficiary  =  async (req,res)=>{

  try { 
     const {reportId} = req.params
     const {comment} = req.body

     if(!mongoose.Types.ObjectId.isValid(reportId)){
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
     }




      const currentUserReport = await Report.findById(reportId)
      if(!currentUserReport){
        return res.status(400).json({error:"السمتخدم هذا ليس لديه تقرير مستفيد"})
      }



      const currentAdmin = await Admin.findById(req.adminId)
      if(!currentAdmin){
        return res.status(401).json({error:"بيانات الادمن هذا غير موجوده"})
      }


      if(currentAdmin.rule !== "reviewer"){
        return res.status(400).json({error:"المراجع فقط من يمكنه اعتماد الحساب"})
      }



      if(currentUserReport.status !== "under_review"){
        return res.status(400).json({error:"تم اعتماد هذا التقرير من قبل"})
      }
      
      if(comment){
         currentUserReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name
         currentUserReport.comments[`${currentAdmin.rule}`].comment = comment
      }
       currentUserReport.status = "under_committee"
       await currentUserReport.save()


       return res.status(200).json({success:true,message:"تم اعتماد الحساب"})

   } catch (error) {
    console.log("error in confirm beneficiary ")
    console.log(error.message)
  }
}




// committee abilities

export const decideIfBeneficiaryIsDeserve = async (req,res) =>{
  try {
    const {reportId} = req.params
    const {state,comment}  = req.body

    if(!mongoose.Types.ObjectId.isValid(reportId))
    {
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
    }

     const currentAdmin = await Admin.findById(req.adminId)
     if(!currentAdmin){
    return res.status(200).json({error:"بيانات هذا الادمن غير موجوده"})
     }
     if(currentAdmin.rule !== "committee"){
      return res.status(400).json({error:"اللجنه فقط تحدد رفض او قبول المستفيد"})
     }

     const currentReport = await Report.findById(reportId)
     if(!currentReport) {
      return res.status(400).json({error:"هذا التقرير غير موجود"})
     }
       
  
      if(state !== "rejected" || state !== "accepted"){
      } else {
        return res.status(400).json({error:"برجاء ادخال بيانات صالحه لتحديد قبول المستخدم"})
      }
    
       currentReport.reportStatus = state
       if(comment){
         currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name
         currentReport.comments[`${currentAdmin.rule}`].comment = comment
       }
       currentReport.status = "under_manager"
       await currentReport.save()
       return res.status(200).json({success:true,message:`${state == "rejected" ? "تم رفض المستفيد ":"تم قبول المستفيد"}`})
       
  } catch (error) {
    console.log("error in decide if beneficiary is deserve ")
    console.log(error)
  }
}





// manager 


export const getManagerTasks = async (req,res) =>{

  try {

     const currentAdmin = await Admin.findById(req.adminId)
     if(currentAdmin.rule != "manager"){
      return res.status(400).json({error:"المدير فقط من لديه صلاحيه الوصول لتعديل التقارير"})
     }  

    const beneficiaries = await Report.find({reportStatus:{$in:["rejected","accepted"]}})

    return res.status(200).json(beneficiaries)

  } catch (error) {
    console.log("error in  get manager tasks")
    console.log(error.message)
  }
}


export const editReportByManager = async (req,res) =>{

  try {
    
    const {reportId} = req.params
    const {comment,state} = req.body
    
    if(!state){
      return res.status(200).json({error:"برجاء اختيار حاله قبول المستفيد"})
    }
    if(state !== "rejected" || state !== "accepted"){
    }else {
      return res.status(400).json({error:"برجاء ادخال حاله صالحه"})
    }
    
    const currentAdmin = await Admin.findById(req.adminId)
    if(currentAdmin.rule !== "manager"){
      return res.status(400).json({error:"المدير فقط من يمكنه تعدير حاله التقرير"})
    }
    const currentReport = await Report.findById(reportId)
    if(!currentReport){
      return res.status(400).json({error:"بينات التقرير هذه غير موجوده"})
    } 
   
    
     currentReport.reportStatus = state
     if(comment){
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name
      currentReport.comments[`${currentAdmin.rule}`].comment = comment
    }

  } catch (error) {
    console.log("error in edit report by manager")
    console.log(error.message)
  }
}



 export const getCurrentReportData = async ( req,res) =>{

  try {
    const {reportId} = req.params 
    if(!mongoose.Types.ObjectId.isValid(reportId)){
      return res.status(400).json({error:"المعرف هذه غير صالح"})
    }

    const currentReport = await Report.findById(reportId).populate("user")
    if(!currentReport){
      return res.status(400).json({error:"بيانات هذا التقرير غير موجوده"})
    }

     res.status(200).json(currentReport)
  } catch (error) {
    console.log(error.message)
    console.log("error in get current report data")
  }
 }