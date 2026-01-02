"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

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

                setEmail(res.email);
                setStatus("success");

                localStorage.setItem(
                    "user_cred",
                    JSON.stringify({ email: res.email })
                );

                await api.post("/api/init/init-sheets", {
                    mode: "init",
                    email: res.email,
                });

                setTimeout(() => router.push("/"), 1500);
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            {status === "verifying" && <p>Verifying magic link…</p>}
            {status === "error" && <p>❌ Invalid or expired link</p>}
            {status === "success" && <p>✅ Welcome {email}</p>}
        </div>
    );
}
