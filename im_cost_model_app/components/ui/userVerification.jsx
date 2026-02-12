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
import { Loader2, LogOut, Lock } from "lucide-react"
import { api } from "@/utils/api"

export default function LoginDialog() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
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

    async function handleLogin() {
        if (!email || !password) {
            return setError("Username and password are required")
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
            })
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
                        Enter your username and password
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleLogin()
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <label htmlFor="username" className="text-xs font-medium text-gray-700">Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="eg: JohnDoe"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="text-xs font-medium text-gray-700">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

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
                                Login
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
