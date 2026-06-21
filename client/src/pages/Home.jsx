import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
    ArrowRight,
    Code2,
    Gauge,
    LayoutTemplate,
    MousePointerClick,
    Palette,
    Rocket,
    Sparkles,
    Wand2,
    Zap,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import LoginModal from "../components/LoginModal"
import Aurora from "../components/ui/Aurora"
import Navbar from "../components/ui/Navbar"
import TiltCard from "../components/ui/TiltCard"
import MagneticButton from "../components/ui/MagneticButton"
import Logo from "../components/ui/Logo"
import { TextHoverEffect } from "../components/ui/text-hover-effect"

const ROTATING = ["websites", "landing pages", "portfolios", "dashboards"]

const FEATURES = [
    {
        icon: Wand2,
        title: "AI-Powered Code",
        desc: "Describe an idea in plain English and watch KODA generate clean, production-ready HTML, CSS & JS in seconds.",
        accent: "from-violet-500 to-purple-500",
    },
    {
        icon: LayoutTemplate,
        title: "Intuitive Interface",
        desc: "A buttery-smooth editor with live preview, in-context chat edits and a code view — design and ship without friction.",
        accent: "from-fuchsia-500 to-pink-500",
    },
    {
        icon: Gauge,
        title: "Responsive Layouts",
        desc: "Every site is fully responsive out of the box, pixel-perfect from mobile to ultra-wide, and deploy-ready instantly.",
        accent: "from-cyan-500 to-blue-500",
    },
]

const STEPS = [
    { icon: MousePointerClick, title: "Describe", desc: "Type your vision in a single prompt." },
    { icon: Sparkles, title: "Generate", desc: "KODA's AI crafts a complete site." },
    { icon: Rocket, title: "Deploy", desc: "Publish to a live URL in one click." },
]

const STATS = [
    { value: "10k+", label: "Sites generated" },
    { value: "60s", label: "Avg. build time" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "Creator rating" },
]

function Home() {
    const [openLogin, setOpenLogin] = useState(false)
    const [wordIndex, setWordIndex] = useState(0)
    const [websites, setWebsites] = useState(null)
    const { userData } = useSelector((state) => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        const id = setInterval(
            () => setWordIndex((i) => (i + 1) % ROTATING.length),
            2200
        )
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (!userData) return
        const getWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, {
                    withCredentials: true,
                })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        getWebsites()
    }, [userData])

    const handleCTA = () => (userData ? navigate("/dashboard") : setOpenLogin(true))

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-koda-bg text-white">
            <Aurora />
            <Navbar onGetStarted={() => setOpenLogin(true)} />

            {/* ============================= HERO ============================= */}
            <section className="relative mx-auto max-w-6xl px-6 pt-40 pb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="group relative mx-auto inline-flex items-center gap-2 overflow-hidden rounded-full glass px-4 py-1.5 text-xs text-zinc-300"
                >
                    <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                    <Sparkles size={13} className="text-violet-400" />
                    AI-powered website builder
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.05 }}
                    className="mt-7 w-full max-w-3xl mx-auto"
                >
                    <TextHoverEffect text="KODA.AI" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mx-auto mt-2 max-w-5xl font-[var(--font-display)] text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
                >
                    <span className="block lg:whitespace-nowrap">
                        Build stunning{" "}
                        <span className="relative inline-grid text-left align-baseline">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIndex}
                                    initial={{ y: "0.6em", opacity: 0, rotateX: -40 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    exit={{ y: "-0.6em", opacity: 0, rotateX: 40 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-gradient [grid-area:1/1] pb-[0.12em]"
                                >
                                    {ROTATING[wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </span>
                    <span className="block">with just a prompt</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400"
                >
                    KODA.AI is your creative companion for turning ideas into beautiful,
                    responsive, deploy-ready websites — no code required.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <MagneticButton onClick={handleCTA} className="px-8 py-4 text-base">
                        {userData ? "Open Dashboard" : "Start building free"}
                        <ArrowRight size={18} />
                    </MagneticButton>
                    <MagneticButton
                        variant="glass"
                        onClick={() => navigate("/pricing")}
                        className="px-8 py-4 text-base"
                    >
                        View pricing
                    </MagneticButton>
                </motion.div>

                {/* 3D floating app-window visual */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="perspective-2000 mt-20"
                >
                    <TiltCard
                        intensity={8}
                        className="group mx-auto max-w-4xl rounded-2xl glass-strong p-2 shadow-[0_40px_120px_-30px_rgba(124,58,237,0.55)]"
                    >
                        {/* browser chrome */}
                        <div className="flex items-center gap-2 px-3 py-2.5">
                            <span className="h-3 w-3 rounded-full bg-red-400/80" />
                            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                            <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-zinc-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                koda.ai/preview
                            </div>
                        </div>

                        {/* faux generated site */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0c0c16] to-[#0a0a12] p-8">
                            <div className="absolute -top-16 left-1/4 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />
                            <div className="absolute -bottom-16 right-1/4 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

                            <div className="relative translate-z-10">
                                <div className="mx-auto mb-4 h-2.5 w-28 rounded-full bg-white/15" />
                                <div className="mx-auto mb-3 h-8 w-3/4 rounded-lg bg-gradient-to-r from-violet-400/70 to-pink-400/70" />
                                <div className="mx-auto mb-6 h-8 w-1/2 rounded-lg bg-white/10" />
                                <div className="mx-auto flex w-fit gap-3">
                                    <div className="h-9 w-32 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-900/40" />
                                    <div className="h-9 w-24 rounded-lg border border-white/15 bg-white/5" />
                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-3">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="h-20 rounded-xl border border-white/10 bg-white/5"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* floating depth chips */}
                        <div className="pointer-events-none absolute -left-5 top-1/3 translate-z-20 animate-float rounded-xl glass px-3 py-2 text-xs font-medium text-zinc-200 shadow-xl">
                            <Code2 size={13} className="mr-1 inline text-violet-400" /> Clean code
                        </div>
                        <div
                            className="pointer-events-none absolute -right-5 top-16 translate-z-20 animate-float rounded-xl glass px-3 py-2 text-xs font-medium text-zinc-200 shadow-xl"
                            style={{ animationDelay: "-3s" }}
                        >
                            <Zap size={13} className="mr-1 inline text-amber-400" /> Deployed
                        </div>
                        <div
                            className="pointer-events-none absolute -bottom-4 right-1/4 translate-z-20 animate-float rounded-xl glass px-3 py-2 text-xs font-medium text-zinc-200 shadow-xl"
                            style={{ animationDelay: "-5s" }}
                        >
                            <Palette size={13} className="mr-1 inline text-cyan-400" /> On-brand
                        </div>
                    </TiltCard>
                </motion.div>
            </section>

            {/* ============================= STATS ============================= */}
            <section className="mx-auto max-w-5xl px-6 pb-24">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="rounded-2xl glass px-4 py-6 text-center"
                        >
                            <div className="font-[var(--font-display)] text-3xl font-bold text-gradient">
                                {s.value}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ============================= FEATURES ============================= */}
            <section className="mx-auto max-w-6xl px-6 pb-28">
                <SectionHeading
                    eyebrow="Why KODA"
                    title="Everything you need to ship"
                    subtitle="A complete AI design studio — from idea to live website, beautifully."
                />
                <div className="perspective-2000 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <TiltCard
                                intensity={12}
                                className="group h-full overflow-hidden rounded-3xl glass p-8"
                            >
                                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${f.accent}`} />
                                <div
                                    className={`mb-5 grid h-12 w-12 translate-z-10 place-items-center rounded-2xl bg-gradient-to-br ${f.accent} shadow-lg`}
                                >
                                    <f.icon size={22} className="text-white" />
                                </div>
                                <h3 className="mb-2 translate-z-10 text-xl font-semibold">{f.title}</h3>
                                <p className="translate-z-10 text-sm leading-relaxed text-zinc-400">
                                    {f.desc}
                                </p>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ============================= HOW IT WORKS ============================= */}
            <section className="mx-auto max-w-5xl px-6 pb-28">
                <SectionHeading
                    eyebrow="How it works"
                    title="From prompt to production in 3 steps"
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="relative rounded-3xl glass p-7"
                        >
                            <span className="absolute right-6 top-5 font-[var(--font-display)] text-5xl font-bold text-white/5">
                                0{i + 1}
                            </span>
                            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5">
                                <s.icon size={20} className="text-violet-400" />
                            </div>
                            <h3 className="mb-1.5 text-lg font-semibold">{s.title}</h3>
                            <p className="text-sm text-zinc-400">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ============================= YOUR WEBSITES ============================= */}
            {userData && websites?.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 pb-28">
                    <div className="mb-8 flex items-end justify-between">
                        <h2 className="font-[var(--font-display)] text-2xl font-bold">Your websites</h2>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-sm text-violet-400 transition hover:text-violet-300"
                        >
                            View all →
                        </button>
                    </div>
                    <div className="perspective-2000 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {websites.slice(0, 3).map((w) => (
                            <TiltCard
                                key={w._id}
                                intensity={9}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="group cursor-pointer overflow-hidden rounded-2xl glass"
                            >
                                <div className="h-40 overflow-hidden bg-black">
                                    <iframe
                                        srcDoc={w.latestCode}
                                        title={w.title}
                                        className="pointer-events-none h-[140%] w-[140%] origin-top-left scale-[0.72] bg-white"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="line-clamp-1 text-base font-semibold">{w.title}</h3>
                                    <p className="text-xs text-zinc-500">
                                        Updated {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </section>
            )}

            {/* ============================= CTA BAND ============================= */}
            <section className="mx-auto max-w-5xl px-6 pb-28">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-[2rem] glass-strong px-8 py-16 text-center"
                >
                    <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[100px]" />
                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl font-[var(--font-display)] text-3xl font-bold md:text-4xl">
                            Ready to build something{" "}
                            <span className="text-gradient">extraordinary</span>?
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
                            Join thousands of creators turning prompts into production websites.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <MagneticButton onClick={handleCTA} className="px-9 py-4 text-base">
                                {userData ? "Go to Dashboard" : "Get started — it's free"}
                                <ArrowRight size={18} />
                            </MagneticButton>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ============================= FOOTER ============================= */}
            <footer className="relative border-t border-white/10 py-10 text-center text-sm text-zinc-500">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <div className="mb-2 flex items-center justify-center gap-2">
                    <Logo size={22} />
                    <span className="font-[var(--font-display)] text-base font-bold text-gradient-violet">KODA.AI</span>
                </div>
                © {new Date().getFullYear()} KODA.AI — All rights reserved.
                <br />
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

function SectionHeading({ eyebrow, title, subtitle }) {
    return (
        <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-block rounded-full glass px-3 py-1 text-xs uppercase tracking-widest text-violet-300">
                {eyebrow}
            </span>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold md:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-zinc-400">{subtitle}</p>}
        </div>
    )
}

export default Home
