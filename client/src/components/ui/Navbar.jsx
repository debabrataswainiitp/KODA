import React, { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Coins, LayoutDashboard, LogOut, Zap } from "lucide-react"
import Logo from "./Logo"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../../App"
import { setUserData } from "../../redux/userSlice"
import MagneticButton from "./MagneticButton"

const MODELS = [
    { id: "openrouter/auto", label: "Auto Free", tag: "default", free: true },
    { id: "deepseek/deepseek-chat", label: "DeepSeek V3", tag: "pro", free: false },
]

/**
 * Glassmorphic floating navbar with a 3D logo mark, animated credits pill,
 * and a profile menu containing the AI model switcher.
 */
function Navbar({ onGetStarted }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profileRef = useRef(null)
    const [openProfile, setOpenProfile] = useState(false)
    const [selectedModel, setSelectedModel] = useState(
        () => localStorage.getItem("kodaai_model") || "openrouter/auto"
    )

    const handleModelSwitch = (modelId) => {
        const model = MODELS.find((m) => m.id === modelId)
        if (!model) return
        if (!model.free && userData?.plan === "free") return
        setSelectedModel(modelId)
        localStorage.setItem("kodaai_model", modelId)
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
            setSelectedModel("openrouter/auto")
            localStorage.setItem("kodaai_model", "openrouter/auto")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const onClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
        >
            <nav className="glass-dark mx-auto flex w-full items-center justify-between rounded-2xl px-5 py-3">
                {/* Logo */}
                <button
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-2.5"
                >
                    <Logo size={34} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6" />
                    <span className="text-lg font-bold tracking-tight font-[var(--font-display)]">
                        <span className="text-gradient-violet">KODA AI</span>
                    </span>
                </button>

                {/* Right cluster */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/pricing")}
                        className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white md:inline-block"
                    >
                        Pricing
                    </button>

                    {userData && (
                        <button
                            onClick={() => navigate("/pricing")}
                            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition hover:bg-white/10 md:flex"
                        >
                            <Coins size={14} className="text-amber-400" />
                            <span className="text-zinc-300">{userData.credits}</span>
                            <span className="font-semibold text-violet-400">+</span>
                        </button>
                    )}

                    {!userData ? (
                        <MagneticButton
                            onClick={onGetStarted}
                            className="px-5 py-2 text-sm"
                        >
                            <Zap size={14} /> Get Started
                        </MagneticButton>
                    ) : (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setOpenProfile((v) => !v)}
                                className="flex items-center rounded-full p-0.5 ring-1 ring-white/15 transition hover:ring-violet-400/60"
                            >
                                <img
                                    src={
                                        userData?.avatar ||
                                        `https://ui-avatars.com/api/?name=${userData.name}`
                                    }
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </button>

                            <AnimatePresence>
                                {openProfile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                        transition={{ duration: 0.2 }}
                                        className="glass-dark absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl"
                                    >
                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="truncate text-sm font-medium">{userData.name}</p>
                                            <p className="truncate text-xs text-zinc-500">{userData.email}</p>
                                        </div>

                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
                                                AI Model
                                            </p>
                                            {MODELS.map((m) => {
                                                const locked = !m.free && userData?.plan === "free"
                                                const active = selectedModel === m.id
                                                return (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => handleModelSwitch(m.id)}
                                                        disabled={locked}
                                                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition
                                                            ${active ? "border border-violet-500/40 bg-violet-600/20" : "border border-transparent hover:bg-white/5"}
                                                            ${locked ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-2 w-2 rounded-full ${active ? "bg-violet-400 shadow-[0_0_8px_2px_rgba(139,92,246,0.8)]" : "bg-zinc-600"}`} />
                                                            <span className={active ? "text-white" : "text-zinc-400"}>{m.label}</span>
                                                        </span>
                                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${m.free ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400"}`}>
                                                            {locked ? "🔒 Pro" : m.tag}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <button
                                            onClick={() => { navigate("/dashboard"); setOpenProfile(false) }}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/5"
                                        >
                                            <LayoutDashboard size={15} className="text-violet-400" /> Dashboard
                                        </button>
                                        <button
                                            onClick={handleLogOut}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-white/5"
                                        >
                                            <LogOut size={15} /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </nav>
        </motion.header>
    )
}

export default Navbar
