import axios from "axios"
import React, { SetStateAction, useEffect } from "react";

export const useGetDeletedReports =  ({setDeletedReports,setLoading} :{setDeletedReports:React.Dispatch<SetStateAction<any[]>>,setLoading:React.Dispatch<SetStateAction<boolean>>}) =>{

    let adminToken:string ;
    try {
       if(JSON.parse(localStorage.getItem("admin") || "")?.token){
           adminToken = JSON.parse(localStorage.getItem("admin") || "").token
       }
       
    } catch (error) {
       console.log(error)
    }
    const getDeletedReports = async () =>{
         setLoading(true)
       await axios.get("/admin/deleted",{
           headers:{
               "Content-Type":"application/json",
               "authorization":`Bearer ${adminToken}`
           },
           
       }).then((res)=>{
         
           setDeletedReports(res.data.reports)
       }).catch(err => {
           console.log(err.response.data.error)
       }).finally(()=>setLoading(false))
   }
   
   useEffect(() => {
       getDeletedReports()
   }, []);
 
} 