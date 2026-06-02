import React from "react"

/**
 * Aurora — the signature KODA.AI ambient background.
 * Layers: animated mesh-gradient blobs + perspective grid + film grain.
 * Purely decorative & pointer-events-none, so it never blocks interaction.
 */
function Aurora({ grid = true, className = "" }) {
    return (
        <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
            {/* Deep base wash */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#15102e_0%,#070710_45%,#050507_100%)]" />

            {/* Floating aurora blobs */}
            <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[130px] animate-aurora" />
            <div
                className="absolute -top-24 right-[-10%] h-[460px] w-[460px] rounded-full bg-fuchsia-600/20 blur-[120px] animate-aurora"
                style={{ animationDelay: "-6s" }}
            />
            <div
                className="absolute top-[38%] left-1/2 h-[560px] w-[680px] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px] animate-aurora"
                style={{ animationDelay: "-11s" }}
            />
            <div
                className="absolute bottom-[-12%] left-[12%] h-[420px] w-[420px] rounded-full bg-blue-600/14 blur-[120px] animate-float-slow"
            />

            {/* Perspective grid */}
            {grid && (
                <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />
            )}

            {/* Film grain */}
            <div className="absolute inset-0 noise opacity-[0.035] mix-blend-overlay" />

            {/* Top vignette for nav legibility */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
    )
}

export default Aurora
