import useGetCurrentAdmin from '../hooks/admin/useGetCurrentAdmin'
import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
  
const AdminLayout = () => {
 
   const navigate = useNavigate()
     const {isLoading,error,admin} = useGetCurrentAdmin()

     if(isLoading){
        return <div className='w-full h-screen flex justify-center items-center'>
            <MoonLoader />
        </div>
     }
    return <Outlet />
}

export default AdminLayout