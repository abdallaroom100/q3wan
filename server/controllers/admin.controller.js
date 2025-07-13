import Admin from "../models/Admin.schema.js";
import validator from "validator";
import { generateAdminToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.schema.js";
import Report from "../models/Report.schema.js";
import fs from "fs";
import path from "path";

export const singupAdmin = async (req, res) => {
  try {
    const { name, email, password,identityNumber,phone, rule } = req.body;
   console.log(req.body)

     if(!identityNumber && !phone && !email ) {
      return res.status(400).json({error:"يحب علي الاقل اعطاء واحد من  بيانات التعريف"})
     }
   
    const checkName = String(name).split(" ").length >= 3;
    if (!checkName)
      return res
        .status(400)
        .json({ error: "الاسم يجب ان يكون علي الاقل ثلاثي" });
   if(email){
       const checkEmail = validator.isEmail(email);
    if (!checkEmail)
      return res.status(400).json({ error: "برجاء ادخال بريد الكتروني صالح" });
   }
   
   if(identityNumber){
      if(String(identityNumber).length !== 10){
        return res.status(400).json({error:"رقم الهويه يجب ان يكون  10 ارقام"})
      }
   }
   if(phone){
      if(String(phone).length !== 10){
        return res.status(400).json({error:"رقم الجوال يجب ان يكون 10 ارقام"})
      }
   }

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
    const checkUserExists = await Admin.findOne({
      $or: [
        email ? { email } : null,
        identityNumber ? { identityNumber } : null,
        phone ? { phone } : null
      ].filter(Boolean) // يشيل العناصر اللي قيمتها null
    });
 console.log(checkUserExists) 
    if (checkUserExists) { 
      return res.status(400).json({ error: "هذا الحساب موجود بالفعل" }); 
    }

    const createdUser = await Admin.create({
      name,
      email,
      password: hash,
      rule,
      identityNumber,
      phone
    });
    return res.status(200).json(createdUser);
  } catch (error) {
    console.log("error in get signup admin");
    console.log(error.message);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const currentAdmin = await Admin.findOne({$or:[
      {email:identifier},
      {identityNumber:identifier},
      {phone:identifier},
    ]});
    if (!currentAdmin) {
      return res.status(400).json({ error: "بيانات الادمن هذا غير موجوده" });
    }
    const checkPassword = bcrypt.compareSync(password, currentAdmin.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "الرقم السري غير صحيح " });
    }

    generateAdminToken(currentAdmin._id, req, res);

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
      success: true,
      admin: {
        ...currentAdmin._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in get current admin");
    console.log(error.message);
  }
};

export const currentAdminTask = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    console.log(req.adminId);

    const currentAdminRule = currentAdmin?.rule;

    if (
      currentAdminRule == "manager" ||
      currentAdminRule == "reviewer" ||
      currentAdminRule == "committee"
    ) {
    } else {
      return res.status(400).json({ error: "هذه الصلاحيه غير موجوده" });
    }

    const rules = [
      ["reviewer", "under_review"],
      ["committee", "under_committee"],
      ["manager", "under_manager"],
    ];
    const adminMap = new Map(rules);

    const tasks = await Report.find({
      status: adminMap.get(currentAdminRule),
    }).populate(
      "user",
      "identityNumber idImagePath firstName secondName thirdName"
    );
    return res.status(200).json({ tasks });
  } catch (error) {
    console.log("error in current admin task");
    console.log(error.message);
  }
};

// reviewer abilities

export const confirmBeneficiary = async (req, res) => {
  try {
    const { userId } = req.params;
   const {comment } = req.body
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "رقم المعرف هذا غير صالح" });
    }
  
    const currentUserReport = await Report.findOne({user:userId});
    if (!currentUserReport) {
      return res
        .status(400)
        .json({ error: "هذا التقرير غير موجود" });
    }

    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin) {
      return res.status(401).json({ error: "بيانات الادمن هذا غير موجوده" });
    }

    if (currentAdmin.rule !== "reviewer") {
      return res
        .status(400)
        .json({ error: "المراجع فقط من يمكنه اعتماد الحساب" });
    }

    if (currentUserReport.status !== "under_review") {
      return res.status(400).json({ error: "تم اعتماد هذا التقرير من قبل" });
    }

    if (comment) {
      currentUserReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentUserReport.comments[`${currentAdmin.rule}`].comment = comment;
    }

    currentUserReport.status = "under_committee";
    await currentUserReport.save();

    return res.status(200).json({ success: true, message: "تم اعتماد الحساب" });
  } catch (error) {
    console.log("error in confirm beneficiary ");
    console.log(error.message);
  }
};

export const deleteBeneficiary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "رقم المعرف هذا غير صالح" });

    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin)
      return res.status(400).json({ error: "بيانات الادمن غير موجوده" });
    const currentReport = await Report.findOne({user:userId});
    if (!currentReport) {
      return res.status(401).json({ error: "التقرير هذا غير موجود" });
    }

    // حذف مجلد الملفات المرفوعة للمستخدم
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const userFolderPath = path.join(uploadsDir, userId);
    
    if (fs.existsSync(userFolderPath)) {
      fs.rmSync(userFolderPath, { recursive: true, force: true });
      console.log(`تم حذف مجلد المستخدم: ${userFolderPath}`);
    }

    await User.findByIdAndDelete(userId);
    await Report.deleteOne({user:userId});
    res.status(200).json({ success: true, message: "تم حذف بيانات المستفيد" });
  } catch (error) {
    console.log(error.message);
    console.log("error in reject beneficiary");
  }
};

export const deleteTemporary = async (req,res) =>{

  try {
    
    const {userId} = req.params
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "رقم المعرف هذا غير صالح" });
    }
  
     const currentAdmin = await Admin.findById(req.adminId)
     if(currentAdmin.rule !== "reviewer"){
      return res.status(400).json({error:"المستفيد فقط من يمكنه حذف المستفيد مؤقتا"})
     }
     const currentReport = await Report.findOne({user:userId})
     currentReport.status = "deleted_temp"
     if(!currentReport){
      return res.status(400).json({error:"التقرير هذا غير موجود"})
     }
     await currentReport.save()
     return res.status(200).json({success:true,message:"تم حذف المستفيد مؤقتا"})
  } catch (error) {
    console.log("error in delete  temporary ");
    console.log(error.message);
  }
}
export const returnReportFromDeleted = async (req,res) =>{

  try {
    
    const {userId} = req.params
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "رقم المعرف هذا غير صالح" });
    }
  
     const currentAdmin = await Admin.findById(req.adminId)
     if(currentAdmin.rule !== "reviewer"){
      return res.status(400).json({error:"المستفيد فقط من يمكنه ارجاع المستفيد "})
     }
     const currentReport = await Report.findOne({user:userId})
     currentReport.status = "under_review"
     if(!currentReport){
      return res.status(400).json({error:"التقرير هذا غير موجود"})
     }
     await currentReport.save()
     return res.status(200).json({success:true,message:"تم ارجاع المستفيد"})
  } catch (error) {
    console.log("error in delete  temporary ");
    console.log(error.message);
  }
}

export const getDeletedReports = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin) {
      return res.status(404).json({ error: "الادمن غير موجود" });
    }

    if (currentAdmin.rule !== "reviewer") {
      return res.status(403).json({ error: "المراجع فقط من يمكنه رؤية بيانات المحذوفين" });
    }

    const reports = await Report.find({ status: "deleted_temp" }).populate("user");
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};


export const editBeneficiaryData = async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const {
      firstName,
      secondName,
      thirdName,
      lastName,
      identityNumber,
      phone,
      gender,
      birthDate,
      maritalStatus,
      nationality,
      cityOfResidence,
      jobStatus,
      healthStatus,
      disabilityType,
      district,
      rentAmount,
      housingType,
      bankName,
      housemates,
    } = req.body;

    if (
      !firstName ||
      !secondName ||
      !thirdName ||
      !lastName ||
      !identityNumber ||
      !phone ||
      !gender ||
      !birthDate ||
      !maritalStatus ||
      !nationality ||
      !cityOfResidence ||
      !jobStatus ||
      !healthStatus ||
      !district ||
      !housingType ||
      !bankName
    ) {
      return res
        .status(400)
        .json({ error: "برجاء ادخال جميع البيانات المطلوبه " });
    }
    
    if (String(identityNumber).length !== 10 && isNaN(Number(identityNumber))) {
      return res.status(400).json({ error: "رقم المعرق غير صالح" });
    }
    if (String(phone).length !== 9 && isNaN(Number(identityNumber))) {
      return res.status(400).json({ error: "برجاء ادخال رقم هاتف صالح" });
    }
    if (gender == "ذكر" || gender == "مؤنث") {
    } else {
      return res.status(400).json({ error: "برجاء ادخال قيمة صالح للجنس" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return res.status(400).json({ error: "برجاء ادخال تاريخ ميلاد صالح" });
    }
    if (jobStatus == "موظف" || jobStatus == "عاطل") {
    } else
      return res
        .status(400)
        .json({ error: "برجاء ادخال حاله العمل من الاختيارات المتاحه" });

    if (housingType == "إيجار" && !rentAmount) {
      return res.status(400).json({ error: "يجب ادخال قيمه لمبلغ الايجار " });
    }
    if (housingType == "إيجار" && rentAmount <= 0) {
      return res
        .status(400)
        .json({ error: "يجب ادخال قيمه صالحه لمبلغ الايجار " });
    }
    if (healthStatus == "غير سليم" && !disabilityType) {
      return res.status(400).json({ error: "برجاء ادخال نوع الاعاقة" });
    }

    
    console.log(!Array.isArray(housemates))
    if (!Array.isArray(housemates)) {
      return res
      .status(400)
      .json({ error: "برجاء ادخال قيمة صالحة لحقول بيانات المرافقين" });
    }
    const currentReport = await Report.findById(reportId)
    const reportOwner = await User.findById(currentReport.user._id)
    if(!currentReport){
      return res.status(401).json({error:"التقرير غير موجود"})
    }
    if(housemates?.length !== reportOwner.facilitiesInfo?.length){
      return res.status(400).json({error:"عدد المرافقين غير متطابق"})
    }

    reportOwner.firstName = firstName;
    reportOwner.secondName = secondName;
    reportOwner.thirdName = thirdName;
    reportOwner.lastName = lastName;
    reportOwner.identityNumber = identityNumber;
    reportOwner.phone = phone;
    reportOwner.gender = gender;
    reportOwner.birthDate = birthDate;
    reportOwner.maritalStatus = maritalStatus;
    reportOwner.nationality = nationality;
    reportOwner.cityOfResidence = cityOfResidence;
    reportOwner.jobStatus = jobStatus;
    reportOwner.healthStatus = healthStatus;
    reportOwner.disabilityType = disabilityType;
    reportOwner.district = district;
    reportOwner.rentAmount = rentAmount;
    reportOwner.housingType = housingType;
    reportOwner.bankName = bankName;
    reportOwner.facilitiesInfo = housemates
    await reportOwner.save();
  return res.status(200).json({success:true,message:"تم تحديث بيانات بنجاح",user:reportOwner})
  } catch (error) {
    console.log("error in edit beneficiary data");
    console.log(error.message);
  }
};
// committee abilities

export const decideIfBeneficiaryIsDeserve = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { state, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: "رقم المعرف هذا غير صالح" });
    }

    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin) {
      return res.status(200).json({ error: "بيانات هذا الادمن غير موجوده" });
    }
    if (currentAdmin.rule !== "committee") {
      return res
        .status(400)
        .json({ error: "اللجنه فقط تحدد رفض او قبول المستفيد" });
    }

    const currentReport = await Report.findById(reportId);
    if (!currentReport) {
      return res.status(400).json({ error: "هذا التقرير غير موجود" });
    }

    if (state !== "rejected" || state !== "accepted") {
    } else {
      return res
        .status(400)
        .json({ error: "برجاء ادخال بيانات صالحه لتحديد قبول المستخدم" });
    }

    currentReport.reportStatus = state;
    if (comment) {
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;
    }
    currentReport.status = "under_manager";
    await currentReport.save();
    return res.status(200).json({
      success: true,
      message: `${
        state == "rejected" ? "تم رفض المستفيد " : "تم قبول المستفيد"
      }`,
    });
  } catch (error) {
    console.log("error in decide if beneficiary is deserve ");
    console.log(error);
  }
};

export const rejectReportByCommittee = async (req,res)=>{

  try {
    const {userId} = req.params

     const {comment} = req.body
     if(!comment){
      return res.status(400).json({error:"يجب ان يكون هناك سبب علي رفض المستفيد"})
     }


     if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
     }

     const currentReport = await Report.findOne({user:userId})
     if(!currentReport){
      return res.status(400).json({error:"هذا التقرير غير موجود"})
     }
     const currentAdmin = await Admin.findById(req.adminId)
     if(!currentAdmin){
      return res.status(400).json({error:"بيانات الامن هذا غير موجوده"})
     }
     if(currentAdmin.rule !== "committee"){
      return res.status(400).json({error:"اللجنة فقط من يمكنها الرفض"})
     }

      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;



      currentReport.status = "under_manager"
      currentReport.reportStatus = "rejected"
      await currentReport.save()
      
      return res.status(200).json({message:"تم رفض التقرير"})

  } catch (error) {
    console.log('error in reject report by commiteee')
    console.log(error.message)
  }
}
export const acceptReportByCommittee = async (req,res)=>{

  try {
    const {userId} = req.params

     const {comment} = req.body

     if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
     }

     const currentReport = await Report.findOne({user:userId})
     if(!currentReport){
      return res.status(400).json({error:"هذا التقرير غير موجود"})
     }
     const currentAdmin = await Admin.findById(req.adminId)
     if(!currentAdmin){
      return res.status(400).json({error:"بيانات الامن هذا غير موجوده"})
     }
     if(currentAdmin.rule !== "committee"){
      return res.status(400).json({error:"اللجنة فقط من يمكنها الرفض"})
     }

     if (comment) {
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;
    }


      currentReport.status = "under_manager"
      currentReport.reportStatus = "accepted"
      await currentReport.save()
      
      return res.status(200).json({message:"تم قبول التقرير"})

  } catch (error) {
    console.log('error in accept report by commiteee')
    console.log(error.message)
  }
}


// manager

export const getManagerTasks = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.rule != "manager") {
      return res
        .status(400)
        .json({ error: "المدير فقط من لديه صلاحيه الوصول لتعديل التقارير" });
    }

    const beneficiaries = await Report.find({
      reportStatus: { $in: ["rejected", "accepted"] },
    });

    return res.status(200).json(beneficiaries);
  } catch (error) {
    console.log("error in  get manager tasks");
    console.log(error.message);
  }
};

export const editReportByManager = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { comment, state } = req.body;

    if (!state) {
      return res.status(200).json({ error: "برجاء اختيار حاله قبول المستفيد" });
    }
    if (state !== "rejected" || state !== "accepted") {
    } else {
      return res.status(400).json({ error: "برجاء ادخال حاله صالحه" });
    }

    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.rule !== "manager") {
      return res
        .status(400)
        .json({ error: "المدير فقط من يمكنه تعدير حاله التقرير" });
    }
    const currentReport = await Report.findById(reportId);
    if (!currentReport) {
      return res.status(400).json({ error: "بينات التقرير هذه غير موجوده" });
    }

    currentReport.reportStatus = state;
    if (comment) {
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;
    }
  } catch (error) {
    console.log("error in edit report by manager");
    console.log(error.message);
  }
};

export const getCurrentReportData = async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: "المعرف هذه غير صالح" });
    }

    const currentReport = await Report.findById(reportId).populate("user");
    if (!currentReport) {
      return res.status(400).json({ error: "بيانات هذا التقرير غير موجوده" });
    }

    res.status(200).json(currentReport);
  } catch (error) {
    console.log(error.message);
    console.log("error in get current report data");
  }
};


export const rejectReportByManager = async (req,res)=>{

  try {
    const {userId} = req.params

     const {comment} = req.body
   


     if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
     }

     const currentReport = await Report.findOne({user:userId})
     if(!currentReport){
      return res.status(400).json({error:"هذا التقرير غير موجود"})
     }
     const currentAdmin = await Admin.findById(req.adminId)
     if(!currentAdmin){
      return res.status(400).json({error:"بيانات الامن هذا غير موجوده"})
     }
     if(currentAdmin.rule !== "manager"){
      return res.status(400).json({error:"المدير فقط من يمكنه الرفض"})
     }

     if (comment) {
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;
    }


      currentReport.status = "done"
      currentReport.reportStatus = "rejected_manager"
      await currentReport.save()
      const currentUser = await User.findById(userId)
      if(!currentUser){
        return res.status(400).json({error:"المستفيد هذا  غير موجود"})
      }
    
       const fullName = `${currentUser.firstName} ${currentUser.secondName} ${currentUser.thirdName} ${currentUser.lastName}`
       const response = await fetch(
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLSes3YzeohGIQgi4BgdlTC0M8hC5Jmerw_AN6VnYTTKhZ1FUNA/formResponse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0', // مهم جداً
          },
          body: new URLSearchParams({
            'entry.632883458': fullName,
            'entry.1521491824': currentUser.identityNumber,
            'entry.769005645': currentUser.email,
            'entry.454562335': currentUser.phone,
            'entry.329154882': currentUser.gender,
            'entry.1264741513': currentUser.birthDate,
            'entry.1411876552': currentUser.healthStatus,
            'entry.1814924951': currentUser.maritalStatus,
            'entry.591200882': currentUser.disabilityType,
            'entry.1115239241': currentUser.nationality,
            'entry.1403970143': currentUser.cityOfResidence,
            'entry.1340897065': currentUser.district,
            'entry.1124638915': currentUser.bankName,
          }),
        }
      );
      if (!response.ok) {
        console.log("Google Form may be closed or unavailable");
        return res.status(500).json({error: "لم يتم إرسال البيانات إلى Google Form، قد يكون النموذج مغلقاً."});
      }
      return res.status(200).json({message:"تم رفض التقرير"})

  } catch (error) {
    
    console.log('error in reject report by manager')
    console.log(error.message)
  }
}
export const acceptReportByManager = async (req,res)=>{

  try {
    const {userId} = req.params

     const {comment} = req.body



     if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({error:"رقم المعرف هذا غير صالح"})
     }

     const currentReport = await Report.findOne({user:userId})
     if(!currentReport){
      return res.status(400).json({error:"هذا التقرير غير موجود"})
     }
     const currentAdmin = await Admin.findById(req.adminId)
     if(!currentAdmin){
      return res.status(400).json({error:"بيانات الامن هذا غير موجوده"})
     }
     if(currentAdmin.rule !== "manager"){
      return res.status(400).json({error:"المدير فقط من يمكنه الرفض"})
     }

     if (comment) {
      currentReport.comments[`${currentAdmin.rule}`].name = currentAdmin.name;
      currentReport.comments[`${currentAdmin.rule}`].comment = comment;
    }

      currentReport.status = "done"
      currentReport.reportStatus = "accepted_manager"
      await currentReport.save()
      const currentUser = await User.findById(userId)
      if(!currentUser){
        return res.status(400).json({error:"المستفيد هذا  غير موجود"})
      }
  
       const fullName = `${currentUser.firstName} ${currentUser.secondName} ${currentUser.thirdName} ${currentUser.lastName}`
      await fetch(
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLScZENQrc4KaduzNxyXQPV8x8V9kKCwpHSfi6RoNgQs4Q7xwGg/formResponse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'entry.1331431955': fullName,
            'entry.397517812': currentUser.identityNumber,
            'entry.203280853': currentUser.email,
            'entry.542114087': currentUser.phone,
            'entry.578281773': currentUser.gender,
            'entry.1421137157': currentUser.birthDate,
            'entry.1336825014': currentUser.healthStatus,
            'entry.1259049428': currentUser.maritalStatus,
            'entry.405675625': currentUser.disabilityType,
            'entry.247957862': currentUser.nationality,
            'entry.1206000277': currentUser.cityOfResidence,
            'entry.193983254': currentUser.district,
            'entry.340266036': currentUser.bankName,
          })
        }
      );
      return res.status(200).json({message:"تم قبول التقرير"})

  } catch (error) {
    console.log('error in reject report by manager')
    console.log(error.message)
  }
}



 export const searchForReport = async (req,res) =>{

  try {
     const {identifier} = req.body
     if(!identifier) {
      return res.status(400).json({error:"برجاء قم بادخال بيانات للعثور علي التقرير "})
    }
      
      let beneficiary = await User.findOne({$or:[
        {email:identifier},
        {identityNumber:identifier},
      ]})
      if(!beneficiary){
        return res.status(400).json({error:"لم يتم العثور علي مستفيد بالبيانات المقدمه"})
      }
      const beneficiaryReport = await Report.findOne({user:beneficiary?._id}).populate("user")
      if(!beneficiaryReport){
        return res.status(400).json({error:"المستفيد لم يقم بتسجيل تقرير"})
      }
      return res.status(200).json({success:true,report:beneficiaryReport})
      
  } catch (error) {
    console.log(error.message)
    console.log("error in search for report")
  }
 }
  
 
 
 export const  getFinalReports = async (req,res) =>{

  try { 
    const reports = await Report.find({status:"done"}).sort({createdAt:-1}).populate("user")
   
    const currentAdmin = await Admin.findById(req.adminId)
    if(currentAdmin.rule !== "manager"){
      return res.status(400).json({error:"المدير فقط من يمكنه مراجعه تعديل التقارير"})
    }
 
     return res.status(200).json({success:true,reports})
    
  } catch (error) {
    
  }
 }
 export const  getFinalAcceptedReports = async (req,res) =>{

  try {
    const reports = await Report.find({reportStatus:{$in:["accepted_manager","rejected_manager"]}}).sort({createdAt:-1}).populate("user")
   
    const currentAdmin = await Admin.findById(req.adminId)
  
 
     return res.status(200).json({success:true,reports})
    
  } catch (error) {
    
  }
 }



  export const getProcess = async (req,res) =>{


    try {
      
      const currentAdmin = await Admin.findById(req.adminId)
      if(!currentAdmin){
        return res.status(400).json({error:"بيانات الادمن الحالي غير موجوده"})
      }
      if(currentAdmin.rule !== "manager"){
        return res.status(400).json({error:"المدير فقط القادر علي رؤية سير العمليات"})
      }
      const reports = await Report.find({status:{$nin:["done"]}}).populate("user")
      
       return res.status(200).json({success:true,reports})
    } catch (error) {
      console.log("error in get process")
      console.log(error.message)
    }
  }