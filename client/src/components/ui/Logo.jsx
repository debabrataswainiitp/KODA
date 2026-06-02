import React from "react"

/**
 * KODA.AI logo — uses the project's bundled vite.svg mark (served from /public).
 * Swap the `src` here to change the logo everywhere it's used.
 */
function Logo({ size = 36, className = "" }) {
    return (
        <img
            src="/vite.svg"
            alt="KODA.AI"
            width={size}
            height={size}
            draggable={false}
            className={className}
        />
    )
}

export default Logo
