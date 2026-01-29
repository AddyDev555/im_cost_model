"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, LogOut, Lock } from "lucide-react"
import { api } from "@/utils/api"

export default function MagicLinkDialog() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginType, setLoginType] = useState("magic")

    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")
    const [storedEmail, setStoredEmail] = useState(null)
    const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {
        const userCred = localStorage.getItem("user_cred")
        if (userCred) {
            setStoredEmail(JSON.parse(userCred).email)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user_cred")
        setStoredEmail(null)
        setShowMenu(false)
    }

    async function sendMagicLink() {
        if (!email) return setError("Email is required")

        setLoading(true)
        setError("")

        try {
            await api.post("/api/auth/send-magic-link", { email })
            setSent(true)
        } catch (err) {
            setError(err?.response?.data?.detail || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    async function handleEmailLogin() {
        if (!email || !password) {
            return setError("Email and password are required")
        }

        setLoading(true)
        setError("")

        try {
            const res = await api.post("/api/auth/verify", {
                email,
                password,
            })

            localStorage.setItem(
                "user_cred",
                JSON.stringify({ email: res.email })
            )
            setStoredEmail(res.email)

            await api.post("/api/init/init-sheets", {
                mode: "init",
                email: res.email,
            });

        } catch (err) {
            setError(err?.response?.data?.detail || "Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    // Logged-in avatar
    if (storedEmail) {
        const initials = storedEmail.slice(0, 2).toUpperCase()
        return (
            <div className="relative">
                <div
                    className="w-10 h-10 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold cursor-pointer"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {initials}
                </div>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-28 bg-red-300 text-white rounded shadow z-10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-400"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>
                        Choose how you want to sign in
                    </DialogDescription>
                </DialogHeader>

                {/* 🔀 LOGIN TYPE TOGGLE */}
                <div className="flex gap-2 mb-4">
                    <Button
                        type="button"
                        variant={loginType === "magic" ? "default" : "outline"}
                        onClick={() => {
                            setLoginType("magic")
                            setError("")
                            setSent(false)
                        }}
                    >
                        Magic Link
                    </Button>

                    <Button
                        type="button"
                        variant={loginType === "password" ? "default" : "outline"}
                        onClick={() => {
                            setLoginType("password")
                            setError("")
                            setSent(false)
                        }}
                    >
                        Email & Password
                    </Button>
                </div>

                {/* MAGIC LINK */}
                {loginType === "magic" && (
                    <>
                        {sent ? (
                            <p className="text-sm text-green-600">
                                ✅ Magic link sent! Check your inbox.
                            </p>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    sendMagicLink()
                                }}
                                className="space-y-3"
                            >
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {error && (
                                    <p className="text-sm text-red-500">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-violet-500 hover:bg-violet-600"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Magic Link
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </>
                )}

                {/* EMAIL + PASSWORD */}
                {loginType === "password" && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleEmailLogin()
                        }}
                        className="space-y-3"
                    >
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-500 hover:bg-violet-600"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Login / Sign up
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
