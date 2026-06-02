import React, { useId } from "react"

/**
 * KODA.AI logo mark — three crisp, vector concepts.
 *
 * Change DEFAULT_LOGO to switch the mark everywhere it is used
 * (navbar, editor, login, footer):
 *   "monogram" — gradient tile with a bold white "K"
 *   "cube"     — isometric 3D cube (violet/cyan faces)
 *   "spark"    — gradient tile with a sharp 4-point AI spark
 */
export const DEFAULT_LOGO = "monogram"

function Logo({ variant = DEFAULT_LOGO, size = 36, className = "" }) {
    const raw = useId().replace(/[:]/g, "")
    const g = `kg-${raw}`

    if (variant === "cube") {
        return (
            <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-label="KODA.AI">
                <defs>
                    <linearGradient id={`${g}t`} x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="#c4b5fd" /><stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id={`${g}l`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6d28d9" />
                    </linearGradient>
                    <linearGradient id={`${g}r`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#22d3ee" /><stop offset="1" stopColor="#0e7490" />
                    </linearGradient>
                </defs>
                <path d="M24 4 42 14 24 24 6 14Z" fill={`url(#${g}t)`} />
                <path d="M6 14 24 24 24 44 6 34Z" fill={`url(#${g}l)`} />
                <path d="M42 14 24 24 24 44 42 34Z" fill={`url(#${g}r)`} />
                <path d="M24 24 24 44" stroke="#000" strokeOpacity=".15" strokeWidth="1" />
            </svg>
        )
    }

    if (variant === "spark") {
        return (
            <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-label="KODA.AI">
                <defs>
                    <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="#8b5cf6" /><stop offset=".5" stopColor="#d946ef" /><stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
                <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${g})`} />
                <rect x="2" y="2" width="44" height="44" rx="13" fill="#fff" fillOpacity=".08" />
                <path d="M24 9c1.6 9.7 5 13.4 15 15-10 1.6-13.4 5.3-15 15-1.6-9.7-5-13.4-15-15 10-1.6 13.4-5.3 15-15Z" fill="#fff" />
            </svg>
        )
    }

    // monogram (default)
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-label="KODA.AI">
            <defs>
                <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#8b5cf6" /><stop offset=".5" stopColor="#d946ef" /><stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${g})`} />
            <rect x="2" y="2" width="44" height="44" rx="13" fill="#fff" fillOpacity=".08" />
            <g stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13.5V34.5" />
                <path d="M18 25 29.5 13.5" />
                <path d="M22.5 22.5 30.5 34.5" />
            </g>
        </svg>
    )
}

export default Logo
