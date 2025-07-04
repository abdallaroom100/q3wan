 

 import hotToast from "../../../common/hotToast";
import axios from "axios";
import {  useState } from "react";
import { Beneficiary } from "../types";


 export const useEditReportData = () =>{
   
    let token = ""
     try {
        const admin = JSON.parse(localStorage.getItem("admin") || "")
        if(admin?.token){
            token = admin.token 
        }
     } catch (error) {
        console.log(error)
     }
   
    const [editedUser ,setEditedUser] = useState<Record<string,any>|null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [reportError,setReportError] = useState<string | null>(null)
    const editReport = async ({beneficiaryData,reportId}:{beneficiaryData:(Beneficiary |null),reportId:(string |undefined)})=>{
        setLoading(true)
        await axios.patch(`/admin/edit/${reportId}`,beneficiaryData,{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            }
        }).then((res)=>{
            if(res.data?.success){
           hotToast({type:'success',message:res.data.message})
           setEditedUser(res.data?.user)
            }

        }).catch(err=>{
            if(err.response.data.error){
           setReportError(err.response.data.error)
            }
        }).finally(()=>setLoading(false))
    }

    return {reportLoading:loading,reportError,editedUser,editReport}
  
 }