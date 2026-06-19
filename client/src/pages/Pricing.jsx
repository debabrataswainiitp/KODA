import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeft, Check, Coins, Sparkles } from "lucide-react"
import { useSelector } from "react-redux"
import axios from "axios"
import { serverUrl } from "../App"
import Aurora from "../components/ui/Aurora"
import TiltCard from "../components/ui/TiltCard"
import MagneticButton from "../components/ui/MagneticButton"

const plans = [
    {
        key: "free",
        name: "Free",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore Koda.ai",
        glowColor: 'hover:shadow-cyan-500/10',
        features: [
            "AI website generation",
            "Responsive HTML output",
            "Basic animations",
            "Upto 2 Projects",
        ],
        popular: false,
        button: "Get Started",
    },
    {
        key: "pro",
        name: "Pro",
        price: "₹249",
        credits: 500,
        description: "For serious creators & freelancers",
        glowColor: 'hover:shadow-violet-500/20',
        features: [
            "Everything in Free",
            "Faster generation",
            "Edit & regenerate",
            "Best-in-class models",
            "Prioritised support",
            "Max 10 website generations",
        ],
        popular: true,
        button: "Upgrade to Pro",
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "₹999",
        credits: 2200,
        description: "For teams & enterprise users",
        glowColor: 'hover:shadow-amber-500/10',
        features: [
            "Unlimited iterations",
            "Highest priority access",
            "24/7 dedicated support",
            "Enterprise-exclusive benefits",
            "Access to beta features",
            "Max 44 website generations",
        ],
        popular: false,
        button: "Upgrade to Enterprise",
    },
]

function Pricing() {
    const navigate = useNavigate()
    const { userData } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(null)

    const handleBuy = async (planKey) => {
        if (!userData) {
            navigate("/")
            return
        }
        if (planKey === "free") {
            navigate("/dashboard")
            return
        }
        setLoading(planKey)
        try {
            const result = await axios.post(
                `${serverUrl}/api/billing`,
                { planType: planKey },
                { withCredentials: true }
            )
            window.location.assign(result.data.sessionUrl)
        } catch (error) {
            console.log(error)
            setLoading(null)
        }
    }
// 
    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden px-4 sm:px-6 pt-8 pb-24'>
            <Aurora />
          {/* ambient */}
          <div className='absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-[140px] pointer-events-none' />
          <div className='absolute top-[50vh] -right-20 w-[600px] h-[600px] rounded-full bg-pink-600/6 blur-[160px] pointer-events-none' />
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none' />
          {/* grid */}
          <div className='absolute inset-0 opacity-[0.025] pointer-events-none'
            style={{ backgroundImage: 'linear-gradient(to right, #a78bfa 1px, transparent 1px), linear-gradient(to bottom, #a78bfa 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <button
                className="relative z-10 mb-10 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                onClick={() => navigate("/")}
            >
                <ArrowLeft size={16} /> Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mx-auto mb-16 max-w-3xl text-center"
            >
                <span className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-violet-300">
                    <Sparkles size={13} /> Simple, credit-based pricing
                </span>
                <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight md:text-5xl">
                    Fuel Your Ideas,<br />
                    <span className='bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent'>
                        With Every Credit.
                    </span>
                </h1>
                <p className="mt-4 text-zinc-400">Buy credits once. Build anytime.</p>
            </motion.div>

            <div className="perspective-2000 relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                {plans.map((p, i) => (
                    <motion.div
                        key={p.key}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={p.popular ? "md:-mt-4 md:mb-4" : ""}
                    >
                        <TiltCard
                            intensity={9}
                            className={`flex h-full flex-col rounded-3xl p-8 ${
                                p.popular
                                    ? "gradient-border glow-violet"
                                    : "glass"
                            }`}
                        >
                            {p.popular && (
                                <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg">
                                    <Sparkles size={11} /> Popular
                                </span>
                            )}

                            <h3 className="text-xl font-semibold">{p.name}</h3>
                            <p className="mb-6 mt-1 text-sm text-zinc-400">{p.description}</p>

                            <div className="mb-4 flex items-end gap-1">
                                <span className="font-[var(--font-display)] text-5xl font-bold">{p.price}</span>
                                <span className="mb-2 text-sm text-zinc-500">/one-time</span>
                            </div>

                            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                                <Coins size={16} className="text-amber-400" />
                                <span className="text-sm font-semibold">{p.credits} Credits</span>
                            </div>

                            <ul className="mb-10 space-y-3">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-emerald-500/15">
                                            <Check size={12} className="text-emerald-400" />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <MagneticButton
                                onClick={() => handleBuy(p.key)}
                                disabled={loading === p.key}
                                variant={p.popular ? "primary" : "glass"}
                                strength={0.25}
                                className="mt-auto w-full py-3.5 text-sm"
                            >
                                {loading === p.key ? "Redirecting…" : p.button}
                            </MagneticButton>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='relative z-10 max-w-lg mx-auto mt-16 text-center'
                              >
                <p className='text-zinc-700 text-sm'>
                  One-time purchase · Credits never expire · Instant access after payment
                </p>
                <div className='flex items-center justify-center gap-8 mt-6'>
                  {['Secure Payment', 'No Subscription', 'Instant Access'].map((t) => (
                    <div key={t} className='flex items-center gap-1.5 text-[12px] text-zinc-600'>
                      <Check size={12} className='text-emerald-500' />
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
        </div>
    )
}

export default Pricing
