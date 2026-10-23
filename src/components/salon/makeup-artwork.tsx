import { useId } from "react";
import type { MakeupLook } from "@/data/makeup";

/** Locally rendered editorial illustration, NOT a customer photograph or virtual try-on.
 * Every color is controlled by the catalog entry; no network or face data. */
export function MakeupArtwork({look}: {look:MakeupLook}) {
  const id=useId().replace(/:/g,"");
  const bg=`hb-m-bg-${id}`, skin=`hb-m-skin-${id}`, veil=`hb-m-veil-${id}`;
  return <svg className="makeup-art" viewBox="0 0 320 428" preserveAspectRatio="xMidYMid slice" role="img"
    aria-label={`تصویرسازی مفهومی ${look.name}، رنگ لب و چشم و گونه`}>
    <defs>
      <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f7eee9"/><stop offset=".56" stopColor={look.scarf}/><stop offset="1" stopColor="#684c50"/></linearGradient>
      <linearGradient id={skin} x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#fff2e3"/><stop offset=".36" stopColor={look.skin}/><stop offset="1" stopColor="#a37461"/></linearGradient>
      <linearGradient id={veil} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f5e4db"/><stop offset=".55" stopColor={look.scarf}/><stop offset="1" stopColor="#5b4747"/></linearGradient>
      <radialGradient id={`glow-${id}`}><stop stopColor="#fffaf2" stopOpacity=".58"/><stop offset="1" stopColor="#fffaf2" stopOpacity="0"/></radialGradient>
      <filter id={`soft-${id}`}><feGaussianBlur stdDeviation="11"/></filter>
    </defs>
    <rect width="320" height="428" fill={`url(#${bg})`}/>
    <ellipse cx="70" cy="44" rx="133" ry="170" fill={`url(#glow-${id})`}/>
    <path d="M-21 428 Q-6 288 86 292 Q148 323 176 310 Q249 287 335 428Z" fill="#4b3742"/>
    <path d="M-14 428 Q-2 300 112 278 Q154 292 207 278 Q297 298 340 428Z" fill={`url(#${veil})`}/>
    <path d="M51 109Q57 35 154 29Q273 36 286 159L276 300Q260 358 217 384L86 391Q37 354 39 262Z" fill="#46383c"/>
    <path d="M81 74 Q143 16 223 69 Q259 121 249 211 Q243 267 214 299 Q171 347 134 311 Q79 273 74 194Z" fill={`url(#${skin})`}/>
    <ellipse cx="115" cy="224" rx="27" ry="16" fill={look.blush} opacity=".20" filter={`url(#soft-${id})`}/>
    <ellipse cx="226" cy="221" rx="25" ry="16" fill={look.blush} opacity=".23" filter={`url(#soft-${id})`}/>
    <path d="M93 168 Q113 152 143 168" fill="none" stroke="#61413c" strokeWidth="5" strokeLinecap="round"/>
    <path d="M185 167 Q212 151 240 165" fill="none" stroke="#61413c" strokeWidth="5" strokeLinecap="round"/>
    <path d="M94 188 Q115 176 145 190 Q117 203 94 188Z" fill="#fff0e1" stroke="#53382f" strokeWidth="2"/>
    <path d="M184 189 Q210 177 239 185 Q215 203 184 189Z" fill="#fff0e1" stroke="#53382f" strokeWidth="2"/>
    <path d="M93 188 Q114 172 145 188M184 188 Q214 171 241 183" fill="none" stroke={look.lid} strokeWidth="8" strokeLinecap="round" opacity=".62"/>
    <ellipse cx="121" cy="189" rx="8.7" ry="9.5" fill="#634334"/><ellipse cx="215" cy="188" rx="8.7" ry="9.5" fill="#634334"/>
    <circle cx="123" cy="186" r="2.6" fill="#fff8e8"/><circle cx="217" cy="185" r="2.6" fill="#fff8e8"/>
    <path d="M90 189 Q114 176 148 189 M180 189 Q209 176 242 186" fill="none" stroke="#42332f" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M102 181l-5-8M112 178l-3-9M138 181l4-7M192 180l-2-8M222 177l4-8M236 178l5-7" stroke="#42332f" strokeWidth="1.9" strokeLinecap="round"/>
    <path d="M170 197 Q161 231 155 247 Q165 253 177 247" fill="none" stroke="#a77865" strokeWidth="3" strokeLinecap="round" opacity=".7"/>
    <path d="M131 274 Q148 268 159 270 Q168 277 177 270 Q190 266 203 275 Q174 304 157 302 Q142 296 131 274Z" fill={look.pigment}/>
    <path d="M133 277 Q168 287 201 277" fill="none" stroke="#f1c7b7" strokeWidth="1.5" opacity=".8"/>
    <path d="M152 292 Q171 298 188 291" fill="none" stroke="#f8ddd0" strokeWidth="2" opacity=".43"/>
    <path d="M66 171 Q75 103 123 80 Q167 47 227 94Q246 126 252 164 Q268 133 257 75 Q240 30 173 25Q99 20 62 73Q31 113 46 209Z" fill="#392f35"/>
    <path d="M51 153Q50 64 146 34Q233 22 276 91L294 197Q287 106 241 83Q196 59 153 76Q91 98 73 155Z" fill={`url(#${veil})`}/>
    <path d="M273 80Q299 127 285 233Q278 305 320 428L264 428Q249 361 255 317Q278 237 273 80Z" fill={`url(#${veil})`}/>
    <path d="M57 151Q39 227 59 310L38 428L-14 428Q2 258 57 151Z" fill={`url(#${veil})`}/>
    <path d="M54 284Q93 344 154 353Q205 363 260 301" fill="none" stroke="#f6e4d6" strokeWidth="16" opacity=".57"/>
    <path d="M59 328Q159 388 258 327" fill="none" stroke="#8b6763" strokeWidth="2.5" opacity=".6"/>
    <path d="M24 26h64" stroke="#fff8f1" strokeWidth="1" opacity=".6"/>
    <text x="26" y="45" fontFamily="Georgia,serif" letterSpacing="3" fontSize="10" fill="#fff9f2">HANANEH · MAKEUP</text>
    <text x="294" y="405" textAnchor="end" letterSpacing="2" fontFamily="Georgia,serif" fontSize="10" fill="#fff4ea">{look.code}</text>
  </svg>;
}
