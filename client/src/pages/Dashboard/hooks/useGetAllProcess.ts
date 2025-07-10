import axios from "axios"
import { useEffect, useState } from "react"

export const useGetAllProcess = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [reports, setReports] = useState<any[]>([])

    let token = ""
    try {
        const admin = JSON.parse(localStorage.getItem("admin") || "{}")
        if (admin?.token) {
            token = admin.token
        }
    } catch (error) {
        console.error("Error parsing admin token:", error)
    }

    const getAllProcess = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get("/admin/process", {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })
            setReports(response.data?.reports || [])
        } catch (err: any) {
            setError(err.response?.data?.message || "حدث خطأ في جلب البيانات")
            console.error("Error fetching process data:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProcess()
    }, [])

    return { loading, error, reports, refetch: getAllProcess }
}