import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {

    const highlights = [
        "AI Powered Code",
        "Intuitive User Interface",
        "Fully Responsive Layouts",
    ]
    const cardAccents = [
        'from-violet-600 to-violet-400',
        'from-pink-600 to-pink-400',
        'from-cyan-600 to-cyan-400',
    ]

    const MODELS = [
        { id: "openrouter/auto",        label: "Auto Free",   tag: "default", free: true },
        { id: "deepseek/deepseek-chat", label: "DeepSeek V3", tag: "pro",     free: false },
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const [dismissBanner, setDismissBanner] = useState(false)
    const profileRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [selectedModel, setSelectedModel] = useState(
        () => localStorage.getItem("kodaai_model") || "openrouter/auto"
    )

    const handleModelSwitch = (modelId) => {
        const model = MODELS.find(m => m.id === modelId)
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
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-x-hidden'>

            <div className='absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none' />
            <div className='absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none' />
            <div className='absolute top-[340px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/[0.08] blur-[100px] pointer-events-none' />

            {/* Navbar */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>

                    <div className='text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
                        KODA.AI
                    </div>

                    <div className='flex items-center gap-5'>

                        <div className='hidden md:inline text-sm text-zinc-500 hover:text-white cursor-pointer' onClick={() => navigate("/pricing")}>
                            Pricing
                        </div>

                        {userData && (
                            <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition' onClick={() => navigate("/pricing")}>
                                <Coins size={14} className='text-yellow-400' />
                                <span className='text-zinc-300'>Credits</span>
                                <span>{userData.credits}</span>
                                <span className='font-semibold text-violet-400'>+</span>
                            </div>
                        )}

                        {!userData ? (
                            <button
                                className='px-4 py-2 rounded-lg border shadow-lg shadow-purple-500/30 hover:bg-purple-500/20 hover:border-purple-400/70 cursor-pointer hover:shadow-purple-400/50 transition-all duration-400 border-white/20 text-sm'
                                onClick={() => setOpenLogin(true)}
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className='relative' ref={profileRef}>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img
                                        src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}`}
                                        alt=""
                                        referrerPolicy='no-referrer'
                                        className='w-9 h-9 rounded-full border border-white/20 object-cover'
                                    />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-64 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                                        >
                                            {/* User info */}
                                            <div className='px-4 py-3 border-b border-white/10'>
                                                <p className='text-sm font-medium truncate'>{userData.name}</p>
                                                <p className='text-xs text-zinc-500 truncate'>{userData.email}</p>
                                            </div>

                                            {/* Mobile credits */}
                                            <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                                                <Coins size={14} className='text-yellow-400' />
                                                <span className='text-zinc-300'>Credits</span>
                                                <span>{userData.credits}</span>
                                                <span className='font-semibold text-violet-400'>+</span>
                                            </button>

                                            {/* AI Model switcher */}
                                            <div className='px-4 py-3 border-b border-white/10'>
                                                <p className='text-xs text-zinc-500 mb-2 uppercase tracking-wide'>AI Model</p>
                                                {MODELS.map(m => {
                                                    const locked = !m.free && userData?.plan === "free"
                                                    return (
                                                        <button
                                                            key={m.id}
                                                            onClick={() => handleModelSwitch(m.id)}
                                                            disabled={locked}
                                                            title={locked ? "Upgrade to Pro to unlock this model" : `Switch to ${m.label}`}
                                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 text-sm transition
                                                                ${selectedModel === m.id ? "bg-violet-600/20 border border-violet-500/40" : "hover:bg-white/5 border border-transparent"}
                                                                ${locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                                        >
                                                            <div className='flex items-center gap-2'>
                                                                <span className={`w-2 h-2 rounded-full ${selectedModel === m.id ? "bg-violet-400" : "bg-zinc-600"}`} />
                                                                <span className={selectedModel === m.id ? "text-white" : "text-zinc-400"}>{m.label}</span>
                                                            </div>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                                                                ${m.free ? "bg-green-500/20 text-green-400" : "bg-violet-500/20 text-violet-400"}`}>
                                                                {locked ? "🔒 Pro" : m.tag}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                                {userData?.plan === "free" && (
                                                    <p className='text-[10px] text-zinc-600 mt-1 px-1'>
                                                        Upgrade to Pro to unlock DeepSeek V3
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                className='w-full px-4 py-3 text-left text-sm cursor-pointer hover:bg-white/5'
                                                onClick={() => { navigate("/dashboard"); setOpenProfile(false) }}
                                            >
                                                Dashboard
                                            </button>
                                            <button
                                                className='w-full px-4 py-3 text-left text-sm cursor-pointer text-red-400 hover:bg-white/5'
                                                onClick={handleLogOut}
                                            >
                                                Logout
                                            </button>

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <section className='pt-44 pb-32 px-6 text-center'>
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                >
                    Unleash Your Creativity with<br />
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400'>KODA.AI</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75 }}
                    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                >
                    Your AI-Powered Creative Companion for building stunning websites, captivating content, and more.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75 }}
                    className="mt-10 px-8 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-lg font-semibold hover:from-violet-700 hover:to-pink-700 transition-all duration-400 shadow-lg shadow-violet-900/40 cursor-pointer"
                    onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
                >
                    {userData ? "Dashboard" : "Get Started"}
                </motion.button>
            </section>

            {/* Highlights Section */}
            {!userData && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.75, delay: i * 0.1 }}
                                className="relative rounded-2xl bg-white/5 border border-white/10 p-8 overflow-hidden"
                            >
                                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${cardAccents[i]}`} />
                                <h1 className='text-xl font-semibold mb-3'>{h}</h1>
                                <p className='text-sm text-zinc-600 leading-relaxed'>
                                    Koda.AI harnesses the power of artificial intelligence to generate website designs and layouts. Whether you're a developer looking for coding assistance or a designer seeking inspiration, Koda.AI has got you covered.
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Websites Section */}
            {userData && websites?.length > 0 && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <h3 className='text-2xl font-semibold mb-6'>Your Websites</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {websites.slice(0, 3).map((w) => (
                            <motion.div
                                key={w._id}
                                whileHover={{ y: -6 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
                            >
                                <div className='h-40 bg-black'>
                                    <iframe
                                        srcDoc={w.latestCode}
                                        className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                    />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-zinc-400'>Last Updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className='relative text-center text-sm text-zinc-500 py-6 border-t border-white/10'>
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent' />
                &copy; {new Date().getFullYear()} KODA.AI | All rights reserved.<br />
                <span className='bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Made with ❤️ by IITians</span>
            </footer>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px 2px rgba(139,92,246,0.35), 0 0 60px 10px rgba(236,72,153,0.15); }
                    50% { box-shadow: 0 0 30px 6px rgba(139,92,246,0.55), 0 0 80px 20px rgba(236,72,153,0.25); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(22px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
                }
                .model-switcher { animation: pulse-glow 3s ease-in-out infinite; }
                .shimmer-btn {
                    background: linear-gradient(110deg, #7c3aed 0%, #a855f7 30%, #f0abfc 50%, #a855f7 70%, #7c3aed 100%);
                    background-size: 200% auto;
                    animation: shimmer 2.5s linear infinite;
                }
                .shimmer-btn:hover { filter: brightness(1.15) saturate(1.2); }
                .dot-pulse { animation: pulse-glow 2s ease-in-out infinite; }
            `}</style>

            <AnimatePresence>
                {!dismissBanner && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="model-switcher fixed bottom-7 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-2 py-2 pr-3 rounded-2xl whitespace-nowrap"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderTop: '1px solid rgba(255,255,255,0.22)',
                        }}
                    >
                        <div
                            className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 0 16px 4px rgba(139,92,246,0.5)' }}
                        >
                            <span className="text-base">🤖</span>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-medium text-white/50 hidden sm:block tracking-wide uppercase">New</span>
                            <span className="text-sm font-semibold text-white hidden sm:block">Try Another Model</span>
                        </div>
                        <button
                            onClick={() => window.open("https://koda-ai-client.onrender.com/", "_blank")}
                            className="shimmer-btn text-xs font-bold px-4 py-2 rounded-xl text-white cursor-pointer tracking-wide"
                        >
                            Switch Now ⚡
                        </button>
                        <button
                            onClick={() => setDismissBanner(true)}
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer text-xs"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home
