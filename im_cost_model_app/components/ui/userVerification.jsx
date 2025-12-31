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
import { Loader2, Mail, LogOut } from "lucide-react"
import { api } from "@/utils/api"

export default function MagicLinkDialog() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")
    const [storedEmail, setStoredEmail] = useState(null)
    const [showMenu, setShowMenu] = useState(false)

    // Check localStorage on mount
    useEffect(() => {
        const userCred = localStorage.getItem("user_cred")
        if (userCred) {
            setStoredEmail(JSON.parse(userCred).email)
        }
    }, [storedEmail])

    const handleLogout = () => {
        localStorage.removeItem("user_cred")
        setStoredEmail(null)
        setShowMenu(false)
    }

    async function sendMagicLink() {
        if (!email) {
            setError("Email is required")
            return
        }

        setLoading(true)
        setError("")

        try {
            const payload = { email }
            await api.post("/api/auth/send-magic-link", payload)
            setSent(true)
        } catch (err) {
            setError(
                err?.response?.data?.detail || "Something went wrong. Try again."
            )
        } finally {
            setLoading(false)
        }
    }

    // If user is already logged in, show avatar
    if (storedEmail) {
        const initials = storedEmail.slice(0, 2).toUpperCase()
        return (
            <div className="relative">
                <div
                    className="relative top-3 w-10 h-10 rounded-full text-sm bg-violet-500 text-white flex items-center justify-center font-bold cursor-pointer"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {initials}
                </div>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-24 bg-red-300 border text-white rounded shadow-md z-10">
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-400"
                        >
                            <LogOut/> 
                            <p className="text-sm font-semibold">Logout</p>
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // Otherwise, show the login dialog
    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer rounded" asChild>
                <Button variant="outline">Login</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login with Magic Link</DialogTitle>
                    <DialogDescription>
                        Enter your email and we’ll send you a secure login link.
                    </DialogDescription>
                </DialogHeader>

                {sent ? (
                    <div className="text-sm text-green-600">
                        ✅ Magic link sent! Check your inbox.
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>

                        <Button
                            onClick={sendMagicLink}
                            disabled={loading}
                            className="w-full mt-4 bg-violet-500 hover:bg-violet-600 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Magic Link
                                </>
                            )}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}