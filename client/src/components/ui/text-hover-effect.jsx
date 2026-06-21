"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
  automatic = false,
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  const updateMask = (x, y) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        setCursor({ x: e.clientX, y: e.clientY });
        updateMask(e.clientX, e.clientY);
      }}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {(hovered || automatic) && (
            <>
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="25%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="75%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Base gray stroke text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-[var(--font-display)] text-7xl font-bold"
        style={{ fontFamily: "Space Grotesk, Inter, sans-serif", fontSize: "3rem", fontWeight: 700 }}
        stroke="rgba(255,255,255,0.15)"
      >
        {text}
      </text>

      {/* Animated gradient stroke text (revealed on hover) */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent"
        style={{ fontFamily: "Space Grotesk, Inter, sans-serif", fontSize: "3rem", fontWeight: 700 }}
        stroke="url(#textGradient)"
        strokeDasharray="300"
        strokeDashoffset="300"
        animate={{
          strokeDashoffset: hovered || automatic ? 0 : 300,
        }}
        transition={{
          duration: duration ?? 1.5,
          ease: "easeInOut",
        }}
        mask="url(#textMask)"
      >
        {text}
      </motion.text>
    </svg>
  );
};
