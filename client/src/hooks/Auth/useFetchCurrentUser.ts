import axios from "axios"
import { useState, useEffect } from "react"

interface UserData {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  nationality: string;
  gender: "ذكر" | "أنثى";
  phone: string;
  birthDate: string;
  maritalStatus: string;
  idImagePath: string;
  cityOfResidence: string;
  home: {
    homeNickname: string;
    city: string;
    district: string;
    housemates: Array<{
      name: string;
      birthDate: string;
      identityNumber: string;
      gender: "ذكر" | "أنثى";
      kinship: string;
    }>;
    addtionalHomes?: Array<{
      homeNickname: string;
      city: string;
      district: string;
      housemates: Array<{
        name: string;
        birthDate: string;
        identityNumber: string;
        gender: "ذكر" | "أنثى";
        kinship: string;
      }>;
    }>;
  };
  token?: string;
}

const useFetchCurrentUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<UserData>()
  const [error, setError] = useState()
  
  let currentUserToken = localStorage.getItem("user")
  
  if(currentUserToken){
    try {
      const parsedToken = JSON.parse(currentUserToken)
      currentUserToken  = parsedToken?.token
    } catch (error) {
      currentUserToken = ""
    }
  }

  const fetchCurrentUser = async () =>{
    setIsLoading(true)
    setError(undefined)
    try {
      // const response = axios.get(`${import.meta.env.VITE_NODE_ENV == 'development' ? "http://localhost:5000":"https://children-khaki.vercel.app"}/user/me`,{
      const response = axios.get("/user/me",{
        headers:{
          "Authorization":`Bearer ${currentUserToken}`
        }
      })
      setUserData((await response).data)
    } catch (error :any) {
      const errorMessage = error?.response?.data?.error || "حدث خطأ ما"
      setError(errorMessage)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchCurrentUser()
  },[])
  return {
    isLoading,error,userData
  }
}

export default useFetchCurrentUser