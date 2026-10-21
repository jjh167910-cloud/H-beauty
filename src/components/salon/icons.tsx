import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  CalendarCheck,
  CalendarPlus,
  CaretLeft,
  CaretUp,
  ChatCircleDots,
  Check,
  Clock,
  Copy,
  Crown,
  Diamond,
  FlowerLotus,
  HairDryer,
  Heart,
  House,
  IconContext,
  Info,
  MagnifyingGlass,
  MapPin,
  Monitor,
  Moon,
  NavigationArrow,
  PaintBrush,
  Palette,
  PaperPlaneTilt,
  Phone,
  Play,
  Plus,
  Scissors,
  ShareNetwork,
  ShieldCheck,
  Sparkle,
  SquareSplitHorizontal,
  SquaresFour,
  Sun,
  Swatches,
  Trash,
  User,
  UserFocus,
  Wallet,
  WhatsappLogo,
  X,
  type IconProps,
  type IconWeight,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

/**
 * Icon system — one curated Phosphor set addressed by semantic name.
 * Default weight is "light" to match the light typographic voice; active and
 * selected states switch to "fill", feature tiles use "duotone".
 */
const ICONS = {
  home: House,
  services: Sparkle,
  looks: SquaresFour,
  bookings: CalendarBlank,
  book: CalendarPlus,
  booked: CalendarCheck,
  profile: User,
  heart: Heart,
  search: MagnifyingGlass,
  close: X,
  /** Forward in RTL points left. */
  forward: ArrowLeft,
  back: ArrowRight,
  chevron: CaretLeft,
  up: CaretUp,
  compare: SquareSplitHorizontal,
  share: ShareNetwork,
  info: Info,
  play: Play,
  clock: Clock,
  pin: MapPin,
  directions: NavigationArrow,
  phone: Phone,
  finder: UserFocus,
  consult: ChatCircleDots,
  light: Sun,
  dark: Moon,
  auto: Monitor,
  privacy: ShieldCheck,
  trash: Trash,
  rebook: ArrowCounterClockwise,
  send: PaperPlaneTilt,
  copy: Copy,
  check: Check,
  plus: Plus,
  price: Wallet,
  diamond: Diamond,
  whatsapp: WhatsappLogo,
  palette: Swatches,
  /* Service categories */
  cut: Scissors,
  color: Palette,
  care: FlowerLotus,
  styling: HairDryer,
  bridal: Crown,
  beauty: PaintBrush,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Component = ICONS[name];
  return <Component aria-hidden="true" {...props} />;
}

export function IconProvider({ children }: { children: ReactNode }) {
  return <IconContext.Provider value={{ size: 22, weight: "light", mirrored: false }}>{children}</IconContext.Provider>;
}

export type { IconWeight };
