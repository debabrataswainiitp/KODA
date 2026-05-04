import { ArrowLeft, Check, Coins } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { motion } from "motion/react"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
const plans = [
    {
        key: "free",
        name: "Free",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore Koda.ai",
        features: [
            "AI website generation",
            "Responsive HTML output",
            "Basic animations",
            "Max 2 Website Generation"
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
        features: [
            "Everything in Free",
            "Faster generation",
            "Edit & regenerate",
            "Best in Class",
            "Prioritised Customer Support",
            "Max 10 Website Generation"
        ],
        popular: true,
        button: "Upgrade to Pro",
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "₹999",
        credits: 2200,
        description: "For teams & Enterprise users",
        features: [
            "Unlimited iterations",
            "Highest priority Available",
            "24/7 Dedicated support",
            "Enterprise Exclusive Benifits",
            "Access to Beta Version",
            "Max 44 Websites Generation"
        ],
        popular: false,
        button: "Upgrade to Enterprise",
    },
];
function Pricing() {
    const navigate = useNavigate()
  const {userData}=useSelector(state=>state.user)
  const [loading,setLoading]=useState(null)
    const handleBuy=async (planKey)=>{
if(!userData){
navigate("/")
return
}
if(planKey=="free"){
    navigate("/dashboard")
    return
}
setLoading(planKey)
try {
    const result=await axios.post(`${serverUrl}/api/billing`,{planType:planKey},{withCredentials:true})
    window.location.href=result.data.sessionUrl
} catch (error) {
    console.log(error)
    setLoading(null)
}

    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#000000] text-white px-6 pt-16 pb-24'>

            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/40 rounded-full blur-[120px]' />
                <div className='absolute bottom-0 right-0 w-100 h-100 bg-purple-600/30 rounded-full blur-[120px]' />
                
            </div>

            <button className='relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate("/")}>
                <ArrowLeft size={16} />
                Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-4xl mx-auto text-center mb-14"
                transition={{ duration: 0.5 }}
            >
                <h1 className='text-3xl md:text-3xl font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>Fuel your ideas with every credit.</h1>
                <p className='text-base font-medium tracking-widest text-white/60 [text-shadow:0_0_20px_rgba(139,92,246,0.5)]'>Buy credits once. Build anytime.</p>
            </motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {plans.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration:0, ease: "easeOut" }}
                        //transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -14, scale: 1.05, transition: { duration: 0.15, ease: "easeOut" }}}
                        
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
              ${p.popular
                                ? "border-purple-500 bg-linear-to-b from-indigo-500/30 to-transparent shadow-2xl shadow-purple-500/80 hover:bg-purple-400/10"
                                : "border-cyan-400/70 bg-linear-to-b from-sky-500/20 to-transparent  shadow-2xl shadow-cyan-500/30 hover:bg-cyan-400/10"
                            }`}
                    >
                        {p.popular && (
                            <span className='absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500'>Most Popular</span>
                        )}

                        <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                        <p className='text-zinc-400 text-sm mb-6'>{p.description}</p>
                        <div className='flex items-end gap-1 mb-4'>
                            <span className='text-4xl font-bold'>{p.price}</span>
                            <span className='text-sm text-zinc-400 mb-1'>/one-time</span>
                        </div>

                        <div className='flex items-center gap-2 mb-8'>
                            <Coins size={18} className='text-yellow-400' />
                            <span className='font-semibold'>{p.credits} Credits</span>
                        </div>

                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li
                                    key={f}
                                    className='flex items-center gap-2 text-sm text-zinc-300'
                                >
                                    <Check size={16} className='text-green-400' />
                                    {f}
                                </li>
                            ))}
                        </ul>


                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            disabled={loading}
                            onClick={()=>handleBuy(p.key)}
                            className={`w-full py-3 rounded-xl font-semibold transition
                              ${p.popular
                                    ? "bg-indigo-500 hover:bg-indigo-600"
                                    : "bg-cyan-500/60 hover:bg-cyan-600"
                                } disabled:opacity-60`}
                        >
                            {loading===p.key?"Redirecting...":p.button}


                        </motion.button>


                    </motion.div>
                ))}
            </div>


        </div>
    )
}

export default Pricing
