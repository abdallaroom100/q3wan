import axios from "axios"
import React, { SetStateAction, useEffect } from "react";




 export const useGetAllFinalAccepted =  ({setFinalAcceptedReports,setLoading} :{setFinalAcceptedReports:React.Dispatch<SetStateAction<any[]>>,setLoading:React.Dispatch<SetStateAction<boolean>>}) =>{

     let adminToken:string ;
     try {
        if(JSON.parse(localStorage.getItem("admin") || "")?.token){
            adminToken = JSON.parse(localStorage.getItem("admin") || "").token
        }
        
     } catch (error) {
        console.log(error)
     }
     const getFinalAcceptedReports = async () =>{
          setLoading(true)
        await axios.get("/admin/archive",{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${adminToken}`
            },
            
        }).then((res)=>{
          
            setFinalAcceptedReports(res.data.reports)
        }).catch(err => {
            console.log(err.response.data.error)
        }).finally(()=>setLoading(false))
    }
    
    useEffect(() => {
        getFinalAcceptedReports()
    }, []);
  
 }