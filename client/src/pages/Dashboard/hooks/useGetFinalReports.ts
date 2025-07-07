import axios from "axios"
import React, { SetStateAction, useEffect } from "react";




 export const useGetCurrentAdminTasks =  ({setFinalReports,setLoading} :{setFinalReports:React.Dispatch<SetStateAction<any[]>>,setLoading:React.Dispatch<SetStateAction<boolean>>}) =>{

     let adminToken:string ;
     try {
        if(JSON.parse(localStorage.getItem("admin") || "")?.token){
            adminToken = JSON.parse(localStorage.getItem("admin") || "").token
        }
        
     } catch (error) {
        console.log(error)
     }
     const getFinalReports = async () =>{
          setLoading(true)
        await axios.get("/admin/final",{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${adminToken}`
            },
            
        }).then((res)=>{
          
            setFinalReports(res.data.reports)
        }).catch(err => {
            console.log(err.response.data.error)
        }).finally(()=>setLoading(false))
    }
    
    useEffect(() => {
        getFinalReports()
    }, []);
  
 }