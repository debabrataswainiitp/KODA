import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { serverUrl } from "../App"
import {
    ArrowLeft,
    Code2,
    Loader2,
    MessageSquare,
    Minimize2,
    MonitorPlay,
    Rocket,
    Send,
    Sparkles,
    X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Editor from "@monaco-editor/react"
import Logo from "../components/ui/Logo"

const THINKING_STEPS = [
    "Understanding your request…",
    "Planning layout changes…",
    "Working with F1 Code Engine…",
    "Conversing with Koda Intelligence…",
    "Getting trial response…",
    "Improving responsiveness…",
    "Applying animations…",
    "Finalizing update…",
]

/* Header used by both the desktop sidebar and the mobile chat overlay. */
function EditorHeader({ title, onClose, onBack }) {
    return (
        <div className="flex h-14 items-center justify-between gap-2 border-b border-white/10 px-4">
            <div className="flex min-w-0 items-center gap-2.5">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                    >
                        <ArrowLeft size={15} />
                    </button>
                )}
                <Logo size={28} className="flex-shrink-0" />
                <span className="truncate font-semibold" title={title}>{title}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg transition hover:bg-white/10"
                >
                    <X size={17} className="text-red-400" />
                </button>
            )}
        </div>
    )
}

/* Chat transcript + composer, shared by sidebar and mobile overlay. */
function ChatBody({ messages, updateLoading, thinkingIndex, prompt, setPrompt, handleUpdate }) {
    return (
        <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                    >
                        <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                m.role === "user"
                                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/30"
                                    : "glass text-zinc-200"
                            }`}
                        >
                            {m.content}
                        </div>
                    </motion.div>
                ))}

                {updateLoading && (
                    <div className="mr-auto max-w-[85%]">
                        <div className="flex items-center gap-2 rounded-2xl glass px-4 py-2.5 text-xs italic text-zinc-400">
                            <Sparkles size={12} className="animate-pulse text-violet-400" />
                            {THINKING_STEPS[thinkingIndex]}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-white/10 p-3">
                <div className="flex items-center gap-2 rounded-2xl glass p-1.5 pl-3 focus-within:ring-2 focus-within:ring-violet-500/30">
                    <input
                        placeholder="Describe changes…"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                    />
                    <button
                        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white transition hover:scale-105 disabled:opacity-50"
                        disabled={updateLoading}
                        onClick={handleUpdate}
                    >
                        {updateLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                </div>
            </div>
        </>
    )
}

function WebsiteEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const handleUpdate = async () => {
        if (!prompt) return
        setUpdateLoading(true)
        const text = prompt
        setPrompt("")
        setMessages((m) => [...m, { role: "user", content: text }])
        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                { prompt: text },
                { withCredentials: true }
            )
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
            // Keep the header title in sync with each iteration when the API returns one.
            if (result.data.title) {
                setWebsite((w) => (w ? { ...w, title: result.data.title } : w))
            }
        } catch (error) {
            setUpdateLoading(false)
            console.log(error)
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, {
                withCredentials: true,
            })
            window.open(`${result.data.url}`, "_blank")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!updateLoading) return
        const i = setInterval(() => {
            setThinkingIndex((idx) => (idx + 1) % THINKING_STEPS.length)
        }, 1200)
        return () => clearInterval(i)
    }, [updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, {
                    withCredentials: true,
                })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error?.response?.data?.message || "Something went wrong")
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-koda-bg text-red-400">
                {error}
            </div>
        )
    }
    if (!website) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3 bg-koda-bg text-white">
                <Loader2 className="animate-spin text-violet-400" />
                <span className="text-sm text-zinc-400">Loading your workspace…</span>
            </div>
        )
    }

    const chatProps = {
        messages,
        updateLoading,
        thinkingIndex,
        prompt,
        setPrompt,
        handleUpdate,
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-koda-bg text-white">
            {/* Desktop sidebar */}
            <aside className="hidden w-96 flex-col border-r border-white/10 glass-dark lg:flex">
                <EditorHeader title={website.title} onBack={() => navigate("/dashboard")} />
                <ChatBody {...chatProps} />
            </aside>

            {/* Main preview */}
            <div className="flex flex-1 flex-col">
                <div className="flex h-14 items-center justify-between border-b border-white/10 glass-dark px-4">
                    <span className="flex items-center gap-2 text-xs text-zinc-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
                        Live Preview
                    </span>
                    <div className="flex items-center gap-2">
                        {!website.deployed && (
                            <button
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 py-1.5 text-sm font-semibold shadow-lg shadow-violet-900/30 transition hover:scale-105"
                                onClick={handleDeploy}
                            >
                                <Rocket size={14} /> Deploy
                            </button>
                        )}
                        <button
                            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10 lg:hidden"
                            onClick={() => setShowChat(true)}
                        >
                            <MessageSquare size={17} />
                        </button>
                        <button
                            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                            onClick={() => setShowCode(true)}
                            title="View code"
                        >
                            <Code2 size={18} className="text-violet-400" />
                        </button>
                        <button
                            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                            onClick={() => setShowFullPreview(true)}
                            title="Full preview"
                        >
                            <MonitorPlay size={18} className="text-violet-400" />
                        </button>
                    </div>
                </div>

                <iframe
                    ref={iframeRef}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className="w-full flex-1 bg-white"
                    title="preview"
                />
            </div>

            {/* Mobile chat */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        className="fixed inset-0 z-[9999] flex flex-col bg-koda-bg"
                    >
                        <EditorHeader title={website.title} onClose={() => setShowChat(false)} />
                        <ChatBody {...chatProps} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code drawer */}
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 34 }}
                        className="fixed inset-y-0 right-0 z-[9999] flex w-full flex-col bg-[#1e1e1e] lg:w-[45%]"
                    >
                        <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#181818] px-4">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <Code2 size={15} className="text-violet-400" /> index.html
                            </span>
                            <button
                                className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-white/10"
                                onClick={() => setShowCode(false)}
                            >
                                <Minimize2 size={17} />
                            </button>
                        </div>
                        <Editor theme="vs-dark" value={code} language="html" onChange={(v) => setCode(v)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full preview */}
            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black"
                    >
                        <iframe
                            className="h-full w-full bg-white"
                            srcDoc={code}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            title="full-preview"
                        />
                        <button
                            onClick={() => setShowFullPreview(false)}
                            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl glass-dark text-white transition hover:bg-white/10"
                        >
                            <Minimize2 size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default WebsiteEditor
