import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
    ArrowLeft,
    CheckCircle,
    FolderPlus,
    Loader2,
    Plus,
    Rocket,
    Share2,
    Trash2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import Aurora from "../components/ui/Aurora"
import TiltCard from "../components/ui/TiltCard"
import MagneticButton from "../components/ui/MagneticButton"

function Dashboard() {
    const { userData } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, {
                withCredentials: true,
            })
            window.open(`${result.data.url}`, "_blank")
            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getWebsites = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, {
                    withCredentials: true,
                })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
                setError(error?.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        getWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            await axios.delete(`${serverUrl}/api/website/delete/${id}`, { withCredentials: true })
            setWebsites((prev) => prev.filter((w) => w._id !== id))
            setConfirmId(null)
        } catch (error) {
            console.log(error)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="relative min-h-screen bg-koda-bg text-white">
            <Aurora />

            {/* Top bar */}
            <header className="sticky top-0 z-40 px-4 pt-4">
                <div className="glass-dark mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="font-[var(--font-display)] text-lg font-bold">Dashboard</h1>
                    </div>
                    <MagneticButton onClick={() => navigate("/generate")} className="px-4 py-2 text-sm">
                        <Plus size={16} /> New Project
                    </MagneticButton>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <p className="text-sm text-zinc-400">Welcome back</p>
                    <h1 className="font-[var(--font-display)] text-4xl font-bold">
                        {userData?.name}
                    </h1>
                </motion.div>

                {loading && (
                    <div className="mt-24 flex flex-col items-center text-zinc-400">
                        <Loader2 className="mb-3 animate-spin text-violet-400" />
                        Loading your websites...
                    </div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-red-400">{error}</div>
                )}

                {!loading && !error && websites?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto mt-20 max-w-md rounded-3xl glass p-12 text-center"
                    >
                        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 shadow-lg">
                            <FolderPlus size={26} className="text-white" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
                        <p className="mb-6 text-sm text-zinc-400">
                            Click “New Project” to create your first AI-generated website.
                        </p>
                        <MagneticButton onClick={() => navigate("/generate")} className="px-6 py-3 text-sm">
                            <Plus size={16} /> Create your first site
                        </MagneticButton>
                    </motion.div>
                )}

                {!loading && !error && websites?.length > 0 && (
                    <div className="perspective-2000 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id
                            return (
                                <motion.div
                                    key={w._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                >
                                    <TiltCard
                                        intensity={8}
                                        className="flex h-full flex-col overflow-hidden rounded-3xl glass"
                                    >
                                        <div
                                            className="relative h-44 cursor-pointer overflow-hidden bg-black"
                                            onClick={() => navigate(`/editor/${w._id}`)}
                                        >
                                            <iframe
                                                srcDoc={w.latestCode}
                                                title={w.title}
                                                className="pointer-events-none absolute inset-0 h-[140%] w-[140%] origin-top-left scale-[0.72] bg-white"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfirmId(w._id) }}
                                                title="Delete site"
                                                className="absolute left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-zinc-200 backdrop-blur transition hover:bg-red-500/80 hover:text-white"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                            {w.deployed && (
                                                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-300 backdrop-blur">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col gap-4 p-5">
                                            <div>
                                                <h3 className="line-clamp-1 text-base font-semibold">{w.title}</h3>
                                                <p className="text-xs text-zinc-500">
                                                    Updated {new Date(w.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {!w.deployed ? (
                                                <MagneticButton
                                                    onClick={() => handleDeploy(w._id)}
                                                    strength={0.2}
                                                    className="mt-auto px-4 py-2.5 text-sm"
                                                >
                                                    <Rocket size={16} /> Deploy
                                                </MagneticButton>
                                            ) : (
                                                <motion.button
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => handleCopy(w)}
                                                    className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                                        copied
                                                            ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                                                            : "glass hover:bg-white/10"
                                                    }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <CheckCircle size={15} /> Link copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Share2 size={15} /> Share link
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {confirmId === w._id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-black/80 px-6 text-center backdrop-blur-sm"
                                                >
                                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15">
                                                        <Trash2 size={22} className="text-red-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Delete this site?</p>
                                                        <p className="mt-1 text-xs text-zinc-400">This action can’t be undone.</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setConfirmId(null)}
                                                            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(w._id)}
                                                            disabled={deletingId === w._id}
                                                            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                                                        >
                                                            {deletingId === w._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </TiltCard>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard
