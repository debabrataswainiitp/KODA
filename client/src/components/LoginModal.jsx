import React from "react"
import { AnimatePresence, motion } from "motion/react"
import { signInWithPopup } from "firebase/auth"
import { X } from "lucide-react"
import Logo from "./ui/Logo"
import { auth, provider } from "../firebase"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

function LoginModal({ open, onClose }) {
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(
                `${serverUrl}/api/auth/google`,
                {
                    name: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL,
                },
                { withCredentials: true }
            )
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: -12 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 30 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformPerspective: 1200 }}
                        className="gradient-border relative w-full max-w-md rounded-3xl p-px"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative overflow-hidden rounded-3xl glass-dark">
                            {/* ambient glows */}
                            <motion.div
                                animate={{ opacity: [0.25, 0.45, 0.25] }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/50 blur-[120px]"
                            />
                            <motion.div
                                animate={{ opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                                className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/50 blur-[120px]"
                            />

                            <button
                                className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
                                onClick={onClose}
                            >
                                <X size={16} />
                            </button>

                            <div className="relative px-8 pb-10 pt-12 text-center">
                                <div className="mx-auto mb-6 flex w-fit justify-center drop-shadow-[0_8px_24px_rgba(139,92,246,0.6)]">
                                    <Logo size={60} />
                                </div>

                                <span className="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
                                    AI-powered website builder by IITians
                                </span>

                                <h2 className="mb-2 font-[var(--font-display)] text-3xl font-bold leading-tight">
                                    Welcome to <span className="text-gradient-violet">KODA.AI</span>
                                </h2>
                                <p className="mb-7 text-sm text-zinc-400">
                                    Sign in to start building stunning websites with AI.
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleGoogleAuth}
                                    className="relative flex h-13 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white py-3.5 font-semibold text-black shadow-xl"
                                >
                                    <img
                                        src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                                        alt=""
                                        className="h-5 w-5"
                                    />
                                    Continue with Google
                                </motion.button>

                                <div className="my-8 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <span className="text-xs tracking-wide text-zinc-500">Secured by Google</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>

                                <p className="text-xs leading-relaxed text-zinc-500">
                                    By continuing, you agree to our{" "}
                                    <span className="cursor-pointer text-violet-400 underline transition hover:text-violet-300">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="cursor-pointer text-violet-400 underline transition hover:text-violet-300">
                                        Privacy Policy
                                    </span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LoginModal
