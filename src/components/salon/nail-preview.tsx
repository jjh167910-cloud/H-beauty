import type { NailStyle, NailShape } from "@/data/nail-styles";

/**
 * Offline vector reference swatches: intentionally NOT photoreal salon results.
 * The uncluttered art is a color/shape guide; the real finish may differ.
 */
const SHAPES: Record<NailShape, string> = {
  almond: "M -18 37 C -19 17 -17 -9 -13 -22 C -8 -35 -3 -40 0 -41 C 3 -40 8 -35 13 -22 C 17 -9 19 17 18 37 Q 0 45 -18 37 Z",
  oval: "M -18 37 L -18 -20 Q -18 -39 0 -39 Q 18 -39 18 -20 L 18 37 Q 0 46 -18 37 Z",
  square: "M -18 37 L -18 -35 Q 0 -39 18 -35 L 18 37 Q 0 44 -18 37 Z",
  coffin: "M -18 37 L -13 -34 L 13 -34 L 18 37 Q 0 46 -18 37 Z",
};

const NAILS = [
  { x: 47, y: 130, r: -17, scale: 0.80 },
  { x: 91, y: 105, r: -8, scale: 1.02 },
  { x: 142, y: 94, r: 0, scale: 1.14 },
  { x: 194, y: 106, r: 9, scale: 1.00 },
  { x: 238, y: 137, r: 19, scale: 0.79 },
];

export function NailPreview({ style, className = "" }: { style: NailStyle; className?: string }) {
  const grad = `nail-${style.id}`;
  const chrome = style.finish === "chrome";
  const french = style.finish === "french";
  const ombre = style.finish === "ombre";
  const sparkle = style.finish === "glitter";
  const art = style.finish === "art";

  return (
    <svg viewBox="0 0 290 255" className={className} role="img"
      aria-label={`پیش‌نمایش تصویری طرح ${style.title}، نمونهٔ شماتیک رنگ و فرم ناخن`}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2={chrome ? "1" : "0.52"} y2="1">
          <stop offset="0%" stopColor={ombre ? style.accent : style.base} />
          <stop offset="47%" stopColor={chrome ? style.accent : ombre ? style.base : style.base} />
          <stop offset="73%" stopColor={chrome ? style.base : style.base} />
          <stop offset="100%" stopColor={chrome ? style.accent : style.base} />
        </linearGradient>
        <radialGradient id={`${grad}-glow`}>
          <stop offset="0%" stopColor={style.accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={style.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="145" cy="132" rx="137" ry="106" fill={`url(#${grad}-glow)`} />
      <ellipse cx="145" cy="206" rx="94" ry="11" fill="#372124" opacity="0.065" />
      {NAILS.map((nail,i) => (
        <g key={i} transform={`translate(${nail.x} ${nail.y}) rotate(${nail.r}) scale(${nail.scale * (style.length === "long" ? 1.16 : style.length === "short" ? 0.92 : 1)})`}>
          <path d={SHAPES[style.shape]} transform="translate(1 5)" fill="#352224" opacity=".10" />
          <path d={SHAPES[style.shape]} fill={`url(#${grad})`} stroke={style.accent} strokeOpacity=".40" strokeWidth="0.8" />
          {french ? (
            <path d="M -13 -22 Q 0 -33 13 -22 L 12 -29 Q 0 -41 -12 -29 Z" fill={style.accent} opacity=".97" />
          ) : null}
          {sparkle ? Array.from({ length: 8 }, (_,dot) => (
            <circle key={dot} cx={((dot*11+i*7)%26)-13} cy={((dot*19+i*11)%55)-24}
              r={dot%3===0?1.8:0.85} fill={style.accent} opacity=".75" />
          )) : null}
          {art ? (
            <>
              <path d="M -8 21 Q 4 10 -6 -2 T 8 -29" stroke={style.accent} strokeWidth="2.1" fill="none" strokeLinecap="round" opacity=".9" />
              {i%2===0 ? <circle cx="8" cy="-18" r="3.8" fill={style.accent} opacity=".7" /> : null}
              {i%3===0 ? <circle cx="-7" cy="10" r="2.3" fill={style.accent} opacity=".6" /> : null}
            </>
          ) : null}
          {chrome ? <path d="M -9 26 C -15 6 -13 -18 -6 -31" stroke="#FFFFFF" strokeOpacity=".67" strokeWidth="3" fill="none" strokeLinecap="round" /> : null}
          <path d="M -11 25 C -13 8 -12 -12 -7 -22" stroke="#FFFFFF" strokeOpacity={chrome?".36":".42"} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M -9 38 Q 0 40 9 38" stroke="#7F655A" strokeOpacity=".17" strokeWidth=".7" fill="none" />
        </g>
      ))}
      <path d="M 54 239 H 236" stroke={style.accent} opacity=".28" strokeWidth=".75"/>
    </svg>
  );
}
