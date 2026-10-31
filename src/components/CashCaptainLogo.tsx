import React from 'react';

interface CashCaptainLogoProps {
  className?: string;
  size?: number;
}

export const CashCaptainLogo: React.FC<CashCaptainLogoProps> = ({
  className = 'w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`select-none overflow-visible transition-transform duration-300 hover:scale-105 shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cash Captain Logo"
    >
      <defs>
        {/* Silver Diamond Chrome Metallic Gradients */}
        <linearGradient id="silverDiamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#F1F5F9" />
          <stop offset="35%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="68%" stopColor="#E2E8F0" />
          <stop offset="85%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id="silverInnerBevel" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="25%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>

        {/* Steel Blade Specular Edge (Bright facet) */}
        <linearGradient id="bladeLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F1F5F9" />
          <stop offset="65%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Steel Blade Shadow Edge (Dark facet) */}
        <linearGradient id="bladeShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="35%" stopColor="#64748B" />
          <stop offset="75%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Crossguard & Pommel Cast Silver */}
        <linearGradient id="hiltSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Wire-wrapped Grip */}
        <linearGradient id="gripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="40%" stopColor="#334155" />
          <stop offset="70%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Neon Green Ornate Calligraphic C Gradient */}
        <linearGradient id="neonGreenCGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="20%" stopColor="#4ADE80" />
          <stop offset="55%" stopColor="#22C55E" />
          <stop offset="85%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Shading Filter for 3D Depth */}
        <filter id="silverDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.95" />
        </filter>

        {/* Electric Neon Green Glow Filter for the ornate C's */}
        <filter id="neonGreenGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="#39FF14" floodOpacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#22C55E" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ======================================================== */}
      {/* 1. SILVER DIAMOND WITH SOLID PITCH-BLACK INTERIOR        */}
      {/* ======================================================== */}
      {/* Outer ambient drop shadow */}
      <polygon
        points="50,2.8 97.2,50 50,97.2 2.8,50"
        fill="#000000"
        stroke="#000000"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />

      {/* Main Solid Black Diamond Body with Chrome Silver Rim */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        fill="#05070B"
        stroke="url(#silverDiamondGrad)"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Inner Delicate Silver Inset Chamfer Line */}
      <polygon
        points="50,7 93,50 50,93 7,50"
        fill="none"
        stroke="url(#silverInnerBevel)"
        strokeWidth="0.85"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Four Diamond Corner Studs / Chrome Glints */}
      <circle cx="50" cy="4" r="1.8" fill="#FFFFFF" />
      <circle cx="96" cy="50" r="1.8" fill="#CBD5E1" />
      <circle cx="50" cy="96" r="1.8" fill="#94A3B8" />
      <circle cx="4" cy="50" r="1.8" fill="#CBD5E1" />

      {/* Diamond Edge Accent Specular Sparkles */}
      <polygon points="50,1.5 50.8,3.5 52.8,4 50.8,4.5 50,6.5 49.2,4.5 47.2,4 49.2,3.5" fill="#FFFFFF" opacity="0.9" />

      {/* ======================================================== */}
      {/* 2. REALISTIC CROSSED SWORDS (STRICTLY INSIDE DIAMOND)    */}
      {/* Diamond bound: |x-50| + |y-50| <= 46.                    */}
      {/* Maximum extent of swords: |x-50| + |y-50| <= 44.         */}
      {/* ======================================================== */}

      {/* --- SWORD 1: Bottom-Left to Top-Right --- */}
      <g id="sword-bottom-left-to-top-right" filter="url(#silverDrop)">
        {/* Blade Upper Bevel (Bright Silver Specular) */}
        <polygon
          points="35.5,63.5 49.3,49.3 71,27.5 72.4,28.2 50.7,49.7 37,65"
          fill="url(#bladeLight)"
        />
        {/* Blade Lower Bevel (Dark Steel Shadow) */}
        <polygon
          points="37,65 50.7,49.7 72.4,28.2 71.8,29.6 50.3,51.1 36.5,65.5"
          fill="url(#bladeShadow)"
        />
        {/* Sharp Center Ridge / Fuller Line */}
        <line
          x1="36"
          y1="64.5"
          x2="72"
          y2="28.5"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* Sculpted Silver Crossguard (Ornate curved quillons) */}
        <path
          d="M 30,59.5 C 32,61 34.5,63.5 37,66 C 38.5,67.5 40.5,69.5 41,69 C 41.5,68.5 39.5,66.5 38,65 C 35.5,62.5 33,60 31,58.5 C 30.2,58 29.5,59 30,59.5 Z"
          fill="url(#hiltSilver)"
          stroke="#94A3B8"
          strokeWidth="0.35"
        />
        {/* Guard Finials / Rolled End Terminals */}
        <circle cx="30" cy="59" r="1.4" fill="url(#silverInnerBevel)" stroke="#475569" strokeWidth="0.35" />
        <circle cx="41" cy="69" r="1.4" fill="url(#silverInnerBevel)" stroke="#475569" strokeWidth="0.35" />

        {/* Grip (Wire wrapped) from (35.5, 65) to (29, 71.5) */}
        <line
          x1="35.5"
          y1="65"
          x2="29"
          y2="71.5"
          stroke="url(#gripGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Grip Silver Wire Ribs */}
        <line x1="34" y1="65.5" x2="35" y2="67.5" stroke="#E2E8F0" strokeWidth="0.45" />
        <line x1="31.8" y1="67.8" x2="32.8" y2="69.8" stroke="#E2E8F0" strokeWidth="0.45" />

        {/* Pommel (Faceted Silver Sphere strictly inside at 28, 72.5) */}
        <circle cx="28" cy="72.5" r="2.4" fill="url(#hiltSilver)" stroke="#475569" strokeWidth="0.4" />
        <circle cx="27.3" cy="71.8" r="0.9" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* --- SWORD 2: Bottom-Right to Top-Left --- */}
      <g id="sword-bottom-right-to-top-left" filter="url(#silverDrop)">
        {/* Blade Upper Bevel (Bright Silver Specular) */}
        <polygon
          points="64.5,63.5 50.7,49.3 29,27.5 27.6,28.2 49.3,49.7 63,65"
          fill="url(#bladeLight)"
        />
        {/* Blade Lower Bevel (Dark Steel Shadow) */}
        <polygon
          points="63,65 49.3,49.7 27.6,28.2 28.2,29.6 49.7,51.1 63.5,65.5"
          fill="url(#bladeShadow)"
        />
        {/* Sharp Center Ridge / Fuller Line */}
        <line
          x1="64"
          y1="64.5"
          x2="28"
          y2="28.5"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* Sculpted Silver Crossguard (Ornate curved quillons) */}
        <path
          d="M 70,59.5 C 68,61 65.5,63.5 63,66 C 61.5,67.5 59.5,69.5 59,69 C 58.5,68.5 60.5,66.5 62,65 C 64.5,62.5 67,60 69,58.5 C 69.8,58 70.5,59 70,59.5 Z"
          fill="url(#hiltSilver)"
          stroke="#94A3B8"
          strokeWidth="0.35"
        />
        {/* Guard Finials / Rolled End Terminals */}
        <circle cx="70" cy="59" r="1.4" fill="url(#silverInnerBevel)" stroke="#475569" strokeWidth="0.35" />
        <circle cx="59" cy="69" r="1.4" fill="url(#silverInnerBevel)" stroke="#475569" strokeWidth="0.35" />

        {/* Grip (Wire wrapped) from (64.5, 65) to (71, 71.5) */}
        <line
          x1="64.5"
          y1="65"
          x2="71"
          y2="71.5"
          stroke="url(#gripGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Grip Silver Wire Ribs */}
        <line x1="66" y1="65.5" x2="65" y2="67.5" stroke="#E2E8F0" strokeWidth="0.45" />
        <line x1="68.2" y1="67.8" x2="67.2" y2="69.8" stroke="#E2E8F0" strokeWidth="0.45" />

        {/* Pommel (Faceted Silver Sphere strictly inside at 72, 72.5) */}
        <circle cx="72" cy="72.5" r="2.4" fill="url(#hiltSilver)" stroke="#475569" strokeWidth="0.4" />
        <circle cx="71.3" cy="71.8" r="0.9" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* Center Intersection Silver Boss / Rosette Medallion */}
      <circle cx="50" cy="50" r="3.2" fill="url(#silverInnerBevel)" stroke="#0F172A" strokeWidth="0.7" />
      <polygon points="50,47.8 51.5,49.4 53.2,50 51.5,50.6 50,52.2 48.5,50.6 46.8,50 48.5,49.4" fill="#FFFFFF" />

      {/* ======================================================== */}
      {/* 3. CLASSY ORNATE NEON GREEN 'C' ABOVE SWORDS CROSSPOINT  */}
      {/* As specifically requested & annotated in the sketch!     */}
      {/* ======================================================== */}
      <g id="ornate-c-top" filter="url(#neonGreenGlow)">
        {/* Left Ornate Filigree Flourish Tendril */}
        <path
          d="M 42,23.5 C 38,22 36,22.8 35.5,24.5 C 35,26.2 37,27 39,26"
          stroke="#4ADE80"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Main Body of Classy Ornate 'C' (High arch and graceful curvature) */}
        <path
          d="M 58.5,15.8
             C 57.2,13.2 54.5,10.8 49.5,10.8
             C 41.5,10.8 36.5,17.2 36.5,24.8
             C 36.5,32.4 41.5,38.8 49.5,38.8
             C 55.2,38.8 58.2,35.8 59.2,32.8
             C 59.6,31.6 58.4,30.8 57.2,31.6
             C 55,33.2 52.4,34.4 49.2,34.4
             C 44.2,34.4 40.8,30.2 40.8,24.8
             C 40.8,19.4 44.2,15.2 49.2,15.2
             C 52.4,15.2 55,16.4 57,18
             C 58.2,18.8 59.4,17.6 58.5,15.8 Z"
          fill="url(#neonGreenCGrad)"
          stroke="#86EFAC"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* Top Serif Leaf / Teardrop Finial (Calligraphic Crown) */}
        <path
          d="M 58,15 C 60.5,13.2 62.4,14.6 61.2,16.8 C 60,18.5 57.8,17.6 58,15 Z"
          fill="#39FF14"
        />
        <circle cx="59.8" cy="15.5" r="1.1" fill="#DCFCE7" />

        {/* Bottom Serif Flourish Curl */}
        <path
          d="M 58.8,33.8 C 61.2,35.5 62.6,34 61.8,32 C 60.6,30.2 58.4,31.2 58.8,33.8 Z"
          fill="#39FF14"
        />
        <circle cx="60.4" cy="33.6" r="1.1" fill="#DCFCE7" />

        {/* Engraved Centerline Neon Highlight along the Spine */}
        <path
          d="M 46.5,16.5 C 42.5,20 42.5,29.8 46.5,33.2"
          stroke="#DCFCE7"
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
      </g>

      {/* ======================================================== */}
      {/* 4. CLASSY ORNATE NEON GREEN 'C' BELOW SWORDS CROSSPOINT  */}
      {/* As specifically requested & annotated in the sketch!     */}
      {/* ======================================================== */}
      <g id="ornate-c-bottom" filter="url(#neonGreenGlow)">
        {/* Left Ornate Filigree Flourish Tendril */}
        <path
          d="M 42,76.5 C 38,75 36,75.8 35.5,77.5 C 35,79.2 37,80 39,79"
          stroke="#4ADE80"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Main Body of Classy Ornate 'C' */}
        <path
          d="M 58.5,65.8
             C 57.2,63.2 54.5,60.8 49.5,60.8
             C 41.5,60.8 36.5,67.2 36.5,74.8
             C 36.5,82.4 41.5,88.8 49.5,88.8
             C 55.2,88.8 58.2,85.8 59.2,82.8
             C 59.6,81.6 58.4,80.8 57.2,81.6
             C 55,83.2 52.4,84.4 49.2,84.4
             C 44.2,84.4 40.8,80.2 40.8,74.8
             C 40.8,69.4 44.2,65.2 49.2,65.2
             C 52.4,65.2 55,66.4 57,68
             C 58.2,68.8 59.4,67.6 58.5,65.8 Z"
          fill="url(#neonGreenCGrad)"
          stroke="#86EFAC"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* Top Serif Leaf / Teardrop Finial */}
        <path
          d="M 58,65 C 60.5,63.2 62.4,64.6 61.2,66.8 C 60,68.5 57.8,67.6 58,65 Z"
          fill="#39FF14"
        />
        <circle cx="59.8" cy="65.5" r="1.1" fill="#DCFCE7" />

        {/* Bottom Serif Flourish Curl */}
        <path
          d="M 58.8,83.8 C 61.2,85.5 62.6,84 61.8,82 C 60.6,80.2 58.4,81.2 58.8,83.8 Z"
          fill="#39FF14"
        />
        <circle cx="60.4" cy="83.6" r="1.1" fill="#DCFCE7" />

        {/* Engraved Centerline Neon Highlight along the Spine */}
        <path
          d="M 46.5,66.5 C 42.5,70 42.5,79.8 46.5,83.2"
          stroke="#DCFCE7"
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
      </g>
    </svg>
  );
};
