/** Editorial makeup concepts. NOT photographs of performed salon services.
 * Real client/model photography must be approved before swapping these illustrations. */
import { CURATED_MAKEUP_40 } from "./makeup-curated-40";

export type MakeupCategory = "natural" | "soft" | "evening" | "bridal" | "eyes" | "lips";
export type MakeupLook = {
  id: string; code: string; name: string; category: MakeupCategory;
  description: string; serviceId: string; finish: string;
  pigment: string; lid: string; blush: string; scarf: string; skin: string;
  image?: string; thumb?: string; nameEn?: string;
};
export const MAKEUP_CATEGORIES: ReadonlyArray<{
  key: MakeupCategory; label: string; english: string; description: string; serviceId: string;
}> = [
  {key:"natural", label:"نچرال", english:"NATURAL",description:"سبک، لطیف و شفاف",serviceId:"natural-makeup"},
  {key:"soft",label:"سافت گلم",english:"SOFT GLAM",description:"درخشش ملایم و متعادل",serviceId:"soft-glam-makeup"},
  {key:"evening",label:"مجلسی",english:"EVENING",description:"جذاب و مناسب مهمانی",serviceId:"event-makeup"},
  {key:"bridal",label:"عروس",english:"BRIDAL",description:"ظریف و ماندگار",serviceId:"bridal-makeup"},
  {key:"eyes",label:"آرایش چشم",english:"EYES",description:"تأکید بر نگاه",serviceId:"eye-makeup"},
  {key:"lips",label:"آرایش لب",english:"LIPS",description:"رنگ و جلوه لب",serviceId:"lip-makeup"},
];
const NAMES: Record<MakeupCategory, string[]> = {
  natural:["نچرال رز روشن","نچرال هلویی","نچرال پوست شفاف","نچرال برنزی سبک","نچرال صورتی ملایم","نچرال کرم و بژ","نچرال گرم روزانه","نچرال مخملی"],
  soft:["سافت گلم رزگلد","سافت گلم شامپاینی","سافت گلم برنزی","سافت گلم صورتی","سافت گلم موکا","سافت گلم هلویی","سافت گلم طلایی","سافت گلم بژ"],
  evening:["مجلسی اسموکی قهوه‌ای","مجلسی زرشکی","مجلسی شامپاینی تیره","مجلسی برنزی","مجلسی شکلاتی","مجلسی مسی","مجلسی رزگلد","مجلسی آلویی"],
  bridal:["عروس کلاسیک روشن","عروس هلویی","عروس رز لطیف","عروس شامپاینی","عروس بژ مات","عروس برنزی لطیف","عروس صورتی صدفی","عروس کلاسیک گرم"],
  eyes:["چشم اسموکی قهوه‌ای","چشم خطی ظریف","چشم طلایی نرم","چشم موکا","چشم مسی روشن","چشم رزگلد","چشم آلویی لطیف","چشم شاین شامپاینی"],
  lips:["لب نود صورتی","لب رز گرم","لب مرجانی","لب قرمز مخملی","لب قهوه‌ای رز","لب صورتی براق","لب آلویی","لب نود کاراملی"],
};
const PIGMENTS=[
  ["#b66e70","#92634e","#c98683","#a48c8b"],
  ["#b66b58","#b57e53","#db9a81","#b6a38f"],
  ["#a55b6b","#786350","#c48c97","#d6c4b6"],
  ["#8c4e58","#a1724d","#b67d77","#b2a09b"],
  ["#8d5459","#84634d","#b78480","#8a7980"],
  ["#cc8977","#a26c65","#dc9b8f","#c8a5a1"],
  ["#ac5877","#a97c59","#c67c97","#9e8b86"],
  ["#95654f","#79604b","#c28e77","#b8a7a0"],
] as const;
const SKINS=["#efd0bb","#dfb59c","#d4a286","#c88f70","#dbaf95","#edc6ac","#ba8065","#dfb99f"] as const;
const LEGACY_MAKEUP_LOOKS: MakeupLook[] = MAKEUP_CATEGORIES.flatMap((cat, ci) =>
  NAMES[cat.key].map((name,i) => {
    const p=PIGMENTS[(i+ci*2)%PIGMENTS.length];
    return {
      id:`mk-${cat.key}-${String(i+1).padStart(2,"0")}`,
      code:`HM-${String(ci*8+i+1).padStart(3,"0")}`,
      name, category:cat.key, serviceId:cat.serviceId,
      description:`${cat.description}؛ ایده‌ای برای هماهنگی با رنگ پوست، پوشش و سلیقه شما. اجرای نهایی پس از مشاوره با میکاپ‌آرتیست تعیین می‌شود.`,
      finish:i%3===0?"مات":i%3===1?"درخشان":"طبیعی",
      pigment:p[0],lid:p[1],blush:p[2],scarf:p[3],skin:SKINS[(i+ci)%SKINS.length],
    };
  })
);
/** The curated 40-photo edition is opt-in until all portrait files are imported. */
export const MAKEUP_LOOKS: MakeupLook[] = import.meta.env.VITE_MAKEUP_CURATED_40 === "true"
  ? CURATED_MAKEUP_40
  : LEGACY_MAKEUP_LOOKS;
export const makeupById=new Map(MAKEUP_LOOKS.map((look)=>[look.id,look]));
export function matchesMakeup(look:MakeupLook,query:string,category:MakeupCategory|"all",savedOnly:boolean,saved:ReadonlySet<string>) {
  const q=query.trim().toLocaleLowerCase("fa-IR");
  return (category==="all"||category===look.category) && (!savedOnly||saved.has(look.id)) &&
    (!q||[look.name,look.nameEn??"",look.code,look.description,look.finish,...MAKEUP_CATEGORIES.filter(c=>c.key===look.category).map(c=>c.label)].join(" ").toLocaleLowerCase("fa-IR").includes(q));
}
