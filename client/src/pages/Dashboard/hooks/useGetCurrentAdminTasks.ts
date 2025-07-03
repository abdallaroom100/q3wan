import axios from "axios"
import React, { SetStateAction, useEffect } from "react";
import { setupCache } from "axios-cache-interceptor";

const cacheAxios = setupCache(axios)

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
        await cacheAxios.get("/admin/tasks",{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${adminToken}`
            },
            cache:{
                ttl:1000 * 60 *5
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