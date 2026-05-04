import React, { useEffect,useRef , useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'    //imported all required packages

function Home() {

    const highlights = [
        "AI Generated Code",
        "User Friendly Layouts",
        "Ready to Ship Output",
    ]
    const cardAccents = [
    'from-violet-600 to-violet-400',
    'from-pink-600 to-pink-400',
    'from-cyan-600 to-cyan-400',
  ]
    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const profileRef = useRef(null)//fix Close profile dropdown on outside click by claude
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
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

    // Close profile dropdown on outside click by claude
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
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>

            {/* Ambient background glows */}
      <div className='absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none' />
      <div className='absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none' />
      <div className='absolute top-[340px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/[0.08] blur-[100px] pointer-events-none' />

            {/* Navbar */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>

                    <div className='text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
                        KODA.AI
                    </div>

                    <div className='flex items-center gap-5'>
                        
                        <div className='hidden md:inline text-sm text-zinc-500 hover:text-white cursor-pointer' onClick={() => navigate("/pricing")}>
                            Pricing
                        </div>
                        
                        {userData && <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition' onClick={() => navigate("/pricing")}>
                            <Coins size={14} className='text-yellow-400' />
                            <span className='text-zinc-300'>Credits</span>
                            <span>{userData.credits}</span>
                            <span className='font-semibold text-violet-400'>+</span>
                        </div>}


                        {!userData ? (
                        <button className='px-4 py-2 rounded-lg border shadow-lg shadow-purple-500/30 hover:bg-purple-500/20 hover:border-purple-400/70 cursor-pointer hover:shadow-purple-400/50 transition-all duration-400 border-white/20 text-sm'
                            onClick={() => setOpenLogin(true)}// Added Glow & Hover effects
                        >
                            Get Started
                        </button>
                           ) : (
                            <div className='relative' ref={profileRef}>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} alt="" referrerPolicy='no-referrer' className='w-9 h-9 rounded-full border border-white/20 object-cover' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                                            >
                                                <div className='px-4 py-3 border-b border-white/10'>
                                                    <p className='text-sm font-medium truncate'>{userData.name}</p>
                                                    <p className='text-xs text-zinc-500 truncate'>{userData.email}</p>
                                                </div>

                                                <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                                                    <Coins size={14} className='text-yellow-400' />
                                                    <span className='text-zinc-300'>Credits</span>
                                                    <span>{userData.credits}</span>
                                                    <span className='font-semibold text-violet-400'>+</span>
                                                </button>

                                                <button className='w-full px-4 py-3 text-left text-sm cursor-pointer hover:bg-white/5' onClick={() => { navigate("/dashboard"); setOpenProfile(false) }}>Dashboard</button>
                                                <button className='w-full px-4 py-3 text-left text-sm cursor-pointer text-red-400 hover:bg-white/5' onClick={handleLogOut}>Logout</button>

                                            </motion.div>
                                        </>
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
                    transition={{duration:0.75}}
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                >
                    Unleash Your Creativity With<br />
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400'>KODA.AI</span> <br />
                    
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{duration:0.75}}
                    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                >
                    Your AI-Powered Creative Companion for building stunning websites, captivating content, and more.
                </motion.p>


                <motion.button 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{duration:0.75}}
                    className="'mt-10 px-8 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-lg font-semibold hover:from-violet-700 hover:to-pink-700 transition-all duration-400 shadow-lg shadow-violet-900/40 cursor-pointer" onClick={() =>userData? navigate("/dashboard"):setOpenLogin(true)}>{userData ? "Dashboard" : "Get Started"}</motion.button>

                
            {/* Highlights Section */}
            </section>
            {!userData && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {highlights.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{duration:0.75, delay: i * 0.1 }}
                            className="relative rounded-2xl bg-white/5 border border-white/10 p-8 overflow-hidden"
                        >
                            <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${cardAccents[i]}`} />
                            <h1 className='text-2xl font-semibold mb-4'>{h}</h1>
                            <p className='text-xl text-center text-zinc-400'> 
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
                        {websites.slice(0, 3).map((w, i) => (
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
                                    <p className='text-xs text-zinc-400'>Last Updated {""}
                                        {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>


                            </motion.div>
                        ))}

                    </div>
                </section>

            )}

            {/* Footer */}
            <footer className='relative text-center text-sm text-zinc-500 py-6 border-t border-white/10'>
                {/* divider glow */}
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent' />
                &copy; {new Date().getFullYear()} KODA.AI | All rights reserved.<br/>
                 <span className='bg-linear-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent '>Made with ❤️ by IITians</span>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home
