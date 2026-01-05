"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

export default function VerifyClient() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get("token");

    const [status, setStatus] = useState("verifying");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                const res = await api.post("/api/auth/verify", { token });

                if(!res.success) {
                    toast.error(res.message  || "Server Issue Verification Failed");
                    setStatus("error");
                    return;
                }

                setEmail(res.email);

                localStorage.setItem(
                    "user_cred",
                    JSON.stringify({ email: res.email })
                );

                await api.post("/api/init/init-sheets", {
                    mode: "init",
                    email: res.email,
                });

                if(!api.success) {
                    toast.error(api.message  || "Server Issue Sheet Loading Failed");
                    setStatus("error");
                    return;
                }

                setStatus("success");

                setTimeout(() => router.push("/"), 1500);
            } catch (err) {
                toast.error("Invalid or expired verification link");
                setStatus("error");
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            {status === "verifying" && (
                <>
                    {/* Loader */}
                    <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />

                    {/* Message */}
                    <p className="text-lg font-medium">Verifying your account…</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Please don’t close this tab or window.
                    </p>
                </>
            )}

            {status === "error" && (
                <p className="text-red-600 text-lg">
                    ❌ Invalid or expired link
                </p>
            )}

            {status === "success" && (
                <>
                    <p className="text-lg font-medium">
                        ✅ Welcome {email}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Setting things up for you…
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Please don’t close this tab or window.
                    </p>
                </>
            )}
        </div>
    );
}
