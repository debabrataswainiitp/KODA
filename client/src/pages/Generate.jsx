import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react"
import axios from "axios"
import { useSelector } from "react-redux"
import { serverUrl } from "../App"
import Aurora from "../components/ui/Aurora"
import MagneticButton from "../components/ui/MagneticButton"
import Logo from "../components/ui/Logo"

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
]

const MODELS = [
    { id: "openrouter/auto", label: "Auto Free", tag: "default", free: true },
    { id: "deepseek/deepseek-chat", label: "DeepSeek V3", tag: "pro", free: false },
]

const SUGGESTIONS = [
    "A sleek SaaS landing page for an AI note-taking app",
    "A dark portfolio for a 3D motion designer",
    "A modern pricing page with a FAQ section",
    "A glassmorphic crypto dashboard hero",
]

function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const { userData } = useSelector((state) => state.user)

    const [selectedModel, setSelectedModel] = useState(
        () => localStorage.getItem("kodaai_model") || "openrouter/auto"
    )

    const handleGenerateWebsite = async () => {
        setError("")
        setProgress(0)
        setPhaseIndex(0)
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt, model: selectedModel },
                { withCredentials: true }
            )
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error?.response?.data?.message || "Something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        if (!loading) return
        let value = 0
        const interval = setInterval(() => {
            const increment =
                value < 20 ? Math.random() * 1.5 : value < 60 ? Math.random() * 1.2 : Math.random() * 0.6
            value += increment
            if (value >= 93) value = 93
            const phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)
        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className="relative min-h-screen bg-koda-bg text-white">
            <Aurora />

            {/* Top bar */}
            <header className="sticky top-0 z-40 px-4 pt-4">
                <div className="glass-dark mx-auto flex max-w-5xl items-center gap-3 rounded-2xl px-4 py-3">
                    <button
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <Logo size={28} />
                    <h1 className="font-[var(--font-display)] text-lg font-bold">
                        <span className="text-gradient-violet">KODA.AI</span>
                    </h1>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-3xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-violet-300">
                        <Sparkles size={13} /> AI Website Generator
                    </span>
                    <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight md:text-5xl">
                        Craft your website with{" "}
                        <span className="text-gradient">KODA.AI</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-zinc-400">
                        Describe your vision and our AI will craft a unique, responsive,
                        deploy-ready site. Sit back and watch it come to life.
                    </p>
                </motion.div>

                {/* Prompt console */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="gradient-border rounded-3xl p-px"
                >
                    <div className="rounded-3xl glass-dark p-5">
                        {/* Model switcher */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-xs text-zinc-500">Model</span>
                            {MODELS.map((m) => {
                                const locked = !m.free && userData?.plan === "free"
                                const active = selectedModel === m.id
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            if (locked) return
                                            setSelectedModel(m.id)
                                            localStorage.setItem("kodaai_model", m.id)
                                        }}
                                        disabled={locked}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition
                                            ${active ? "border-violet-500/60 bg-violet-600/20 text-white" : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"}
                                            ${locked ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-violet-400 shadow-[0_0_6px_2px_rgba(139,92,246,0.8)]" : "bg-zinc-600"}`} />
                                        {m.label}
                                        <span className={`rounded px-1.5 py-0.5 text-[9px] ${m.free ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400"}`}>
                                            {locked ? "🔒 Pro" : m.tag}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <textarea
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            placeholder="Describe your website idea in detail… e.g. ‘A modern landing page for a productivity app with a hero, features grid, pricing and testimonials.’"
                            className="h-48 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/30"
                        />

                        {/* Suggestion chips */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setPrompt(s)}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

                {/* Generate button */}
                <div className="mt-8 flex justify-center">
                    <MagneticButton
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() || loading}
                        className={`px-12 py-4 text-base ${
                            !prompt.trim() || loading ? "pointer-events-none opacity-50 grayscale" : ""
                        }`}
                    >
                        <Wand2 size={18} />
                        {loading ? "Generating…" : "Generate Website"}
                    </MagneticButton>
                </div>

                {/* Progress */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mx-auto mt-12 max-w-xl rounded-2xl glass p-6"
                        >
                            <div className="mb-2 flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-2">
                                    <Sparkles size={12} className="animate-pulse text-violet-400" />
                                    {PHASES[phaseIndex]}
                                </span>
                                <span className="font-semibold text-white">{progress}%</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 animate-gradient"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.8 }}
                                />
                            </div>
                            <div className="mt-4 text-center text-xs text-zinc-500">
                                Estimated time remaining:{" "}
                                <span className="font-medium text-white">~8–12 minutes</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

export default Generate
