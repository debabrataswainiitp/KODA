import React, { useRef } from "react"
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionTemplate,
} from "motion/react"

/**
 * TiltCard — interactive 3D card that rotates toward the cursor
 * and renders a moving light "glare" plus a soft spotlight glow.
 *
 * Children with the `.translate-z-10 / .translate-z-20` utilities will
 * appear to float above the card surface (parallax depth).
 *
 * Props:
 *  - intensity:  max tilt in degrees (default 10)
 *  - glare:      moving specular highlight (default true)
 *  - spotlight:  cursor-following radial glow (default true)
 */
function TiltCard({
    children,
    className = "",
    intensity = 10,
    glare = true,
    spotlight = true,
    ...props
}) {
    const ref = useRef(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const hover = useMotionValue(0)

    const mx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 })
    const my = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 })
    const fx = useSpring(hover, { stiffness: 120, damping: 20 })

    const rotateX = useTransform(my, [-0.5, 0.5], [intensity, -intensity])
    const rotateY = useTransform(mx, [-0.5, 0.5], [-intensity, intensity])

    // glare / spotlight position (percent across the card)
    const px = useTransform(mx, [-0.5, 0.5], ["0%", "100%"])
    const py = useTransform(my, [-0.5, 0.5], ["0%", "100%"])

    const glareBg = useMotionTemplate`radial-gradient(circle at ${px} ${py}, rgba(255,255,255,0.30), transparent 45%)`
    const spotBg = useMotionTemplate`radial-gradient(440px circle at ${px} ${py}, rgba(139,92,246,0.20), transparent 62%)`

    function handleMove(e) {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    function handleEnter() {
        hover.set(1)
    }

    function handleLeave() {
        x.set(0)
        y.set(0)
        hover.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1000,
            }}
            className={`relative ${className}`}
            {...props}
        >
            {/* cursor spotlight (behind content) */}
            {spotlight && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit]"
                    style={{ background: spotBg, opacity: fx }}
                />
            )}

            {children}

            {/* specular glare on top */}
            {glare && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
                    style={{ background: glareBg, opacity: fx }}
                />
            )}
        </motion.div>
    )
}

export default TiltCard
