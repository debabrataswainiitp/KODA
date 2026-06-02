import React, { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

const VARIANTS = {
    primary:
        "text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 animate-gradient shadow-[0_8px_30px_-6px_rgba(139,92,246,0.6)] hover:shadow-[0_12px_44px_-6px_rgba(217,70,239,0.7)]",
    glass: "text-white glass-strong hover:bg-white/15",
    ghost: "text-zinc-200 border border-white/15 hover:border-white/30 hover:bg-white/5",
}

/**
 * MagneticButton — a button whose contents drift toward the cursor
 * (magnetic pull) with a glowing gradient surface and a sweeping shine.
 *
 * Variants:
 *  - "primary": violet→pink→cyan gradient fill
 *  - "glass":   frosted glass surface
 *  - "ghost":   subtle outline
 */
function MagneticButton({
    children,
    className = "",
    variant = "primary",
    strength = 0.4,
    ...props
}) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.3 })
    const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.3 })

    function handleMove(e) {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
    }
    function reset() {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ x: sx, y: sy }}
            whileTap={{ scale: 0.96 }}
            className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition-shadow duration-300 ${VARIANTS[variant]} ${className}`}
            {...props}
        >
            {/* sweeping shine */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
            </span>
            <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        </motion.button>
    )
}

export default MagneticButton
