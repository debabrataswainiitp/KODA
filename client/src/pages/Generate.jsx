import { ArrowLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
];

const MODELS = [
    { id: "openrouter/auto",        label: "Auto Free",   tag: "default", free: true },
    { id: "deepseek/deepseek-chat", label: "DeepSeek V3", tag: "pro",     free: false },
]

function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")

    const { userData } = useSelector(state => state.user)

    const [selectedModel, setSelectedModel] = useState(
        () => localStorage.getItem("kodaai_model") || "openrouter/auto"
    )

    const handleGenerateWebsite = async () => {
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt, model: selectedModel },
                { withCredentials: true }
            )
            console.log(result)
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error.response.data.message || "something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                    ? Math.random() * 1.2
                    : Math.random() * 0.6;
            value += increment
            if (value >= 93) value = 93;
            phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>

            <div className='absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none' />
            <div className='absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none' />
            <div className='absolute top-[340px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/[0.08] blur-[100px] pointer-events-none' />

            {/* Navbar */}
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center'>
                    <div className='flex items-center gap-3'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>KODA.AI</h1>
                    </div>
                </div>
            </div>

            <div className='relative z-10 max-w-6xl mx-auto px-6 py-16'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
                        Craft Your Website with&nbsp;
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400'>KODA.AI</span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mb-20 mx-auto'>
                        This process may take a few moments as our AI crafts your unique digital masterpiece. Sit back, relax, and watch your vision come to life with KODA.AI.
                    </p>
                </motion.div>

                {/* Prompt input */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className='mb-14'
                >
                    <h2 className='px-3 text-xl font-semibold mb-4'>Describe your website:</h2>

                    {/* Model switcher */}
                    <div className='flex items-center gap-2 px-1 mb-3'>
                        <span className='text-xs text-zinc-500 mr-1'>Model:</span>
                        {MODELS.map(m => {
                            const locked = !m.free && userData?.plan === "free"
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        if (locked) return
                                        setSelectedModel(m.id)
                                        localStorage.setItem("kodaai_model", m.id)
                                    }}
                                    disabled={locked}
                                    title={locked ? "Upgrade to Pro to unlock this model" : `Use ${m.label}`}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition
                                        ${selectedModel === m.id
                                            ? "border-violet-500/60 bg-violet-600/20 text-white"
                                            : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"}
                                        ${locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedModel === m.id ? "bg-violet-400" : "bg-zinc-600"}`} />
                                    {m.label}
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded
                                        ${m.free ? "bg-green-500/20 text-green-400" : "bg-violet-500/20 text-violet-400"}`}>
                                        {locked ? "🔒 Pro" : m.tag}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className='relative'>
                        <textarea
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            placeholder='Describe your website idea in detail...'
                            className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all'
                        />
                    </div>
                    {error && <p className='mt-4 text-sm text-red-400'>{error}</p>}
                </motion.div>

                {/* Generate button */}
                <div className='flex justify-center'>
                    <motion.button
                        whileHover={{ scale: prompt.trim() && !loading ? 1.05 : 1 }}
                        whileTap={{ scale: prompt.trim() && !loading ? 0.95 : 1 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() || loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg ${prompt.trim() && !loading
                            ? "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg shadow-violet-900/40"
                            : "bg-white/10 text-zinc-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Generating..." : "Generate Website"}
                    </motion.button>
                </div>

                {/* Progress bar */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-xl mx-auto mt-12"
                    >
                        <div className='flex justify-between mb-2 text-xs text-zinc-400'>
                            <span>{PHASES[phaseIndex]}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                            <motion.div
                                className="h-full bg-linear-to-r from-violet-500 to-pink-500"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                            />
                        </div>
                        <div className='text-center text-xs text-zinc-400 mt-4'>
                            Estimated time remaining:{" "}
                            <span className="text-white font-medium">~8–12 minutes</span>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    )
}

export default Generate
