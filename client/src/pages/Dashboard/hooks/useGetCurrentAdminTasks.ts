import axios from "axios"
import React, { SetStateAction, useEffect } from "react";



 export const useGetCurrentAdminTasks =  ({setCurrentAdminTasks,setLoading} :{setCurrentAdminTasks:React.Dispatch<SetStateAction<any[]>>,setLoading:React.Dispatch<SetStateAction<boolean>>}) =>{


     let adminToken:string ;
     try {
        if(JSON.parse(localStorage.getItem("admin") || "")?.token){
            adminToken = JSON.parse(localStorage.getItem("admin") || "").token
        }
        
     } catch (error) {
        console.log(error)
     }
     const getCurrentTasks = async () =>{
          setLoading(true)
        await axios.get("http://localhost:5000/admin/tasks",{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${adminToken}`
            }
        }).then((res)=>{
          
            setCurrentAdminTasks(res.data.tasks)
        }).catch(err => {
            console.log(err.response.data.error)
        }).finally(()=>setLoading(false))
    }
    
    useEffect(() => {
        getCurrentTasks()
    }, []);
  
 }