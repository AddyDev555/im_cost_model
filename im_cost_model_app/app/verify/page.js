"use client"
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/utils/api"

export default function VerifyPage() {
    const params = useSearchParams()
    const router = useRouter()
    const token = params.get("token")
    const [status, setStatus] = useState("verifying")
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            return
        }

        const verify = async () => {
            try {
                const res = await api.post("/api/auth/verify", { token })

                // assuming backend returns { email: "user@example.com" }
                setEmail(res.email)
                setStatus("success")

                // store in localStorage
                localStorage.setItem("user_cred", JSON.stringify({ email: res.email }))

                try {
                    await api.post("/api/init/init-sheets", {
                        mode: "init",
                        email: res.email
                    });
                } catch (initErr) {
                    console.error("Init sheets failed:", initErr);
                }

                // optional redirect after 1.5s
                setTimeout(() => {
                    router.push("/")
                }, 1500)

            } catch (err) {
                console.error(err)
                setStatus("error")
            }
        }

        verify()
    }, [token, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            {status === "verifying" && (
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Verifying magic link…</h2>
                </div>
            )}

            {status === "error" && (
                <div className="text-center bg-red-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">❌ Invalid or expired link</h2>
                    <p className="text-red-500">Please request a new magic link.</p>
                </div>
            )}

            {status === "success" && (
                <div className="text-center bg-green-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">✅ Logged in successfully</h2>
                    <p className="text-green-600">Welcome, {email}</p>
                    <p className="text-white font-bold text-lg">Wait till the process is completed...</p>
                </div>
            )}
        </div>
    )
}