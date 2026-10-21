import { create } from "zustand";
import { familyById } from "@/data/catalog";
import { serviceById, stylistById } from "@/data/salon";

const KEY = "hananeh-atelier-v1";

export type Tab = "home" | "services" | "looks" | "bookings" | "me";
export const TABS: Tab[] = ["home", "services", "looks", "bookings", "me"];

export type ThemePref = "system" | "light" | "dark";

export type BookingRequest = {
  id: string;
  services: string[];
  stylist: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  note: string;
  lookId: number | null;
  createdAt: number;
  sent: boolean;
};

export type Draft = {
  stylist: string;
  date: string;
  time: string;
  note: string;
  lookId: number | null;
};

const EMPTY_DRAFT: Draft = { stylist: "any", date: "", time: "", note: "", lookId: null };

type Persisted = {
  favs?: unknown;
  compare?: unknown;
  cart?: unknown;
  bookings?: unknown;
  theme?: unknown;
  profile?: unknown;
  welcomed?: unknown;
};

function ids(value: unknown, limit?: number) {
  if (!Array.isArray(value)) return [];
  const next = value.filter((id): id is number => Number.isInteger(id) && familyById.has(id));
  return typeof limit === "number" ? next.slice(0, limit) : next;
}

function serviceIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && serviceById.has(id));
}

function bookingList(value: unknown): BookingRequest[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is BookingRequest => {
    if (!item || typeof item !== "object") return false;
    const entry = item as Partial<BookingRequest>;
    return typeof entry.id === "string" && typeof entry.date === "string" && typeof entry.time === "string" && Array.isArray(entry.services);
  }).map((item) => ({
    ...item,
    services: serviceIds(item.services),
    stylist: stylistById.has(item.stylist) ? item.stylist : "any",
    lookId: typeof item.lookId === "number" && familyById.has(item.lookId) ? item.lookId : null,
    sent: Boolean(item.sent),
  }));
}

type SalonState = {
  tab: Tab;
  favs: number[];
  compare: number[];
  cart: string[];
  draft: Draft;
  bookings: BookingRequest[];
  theme: ThemePref;
  profile: { name: string; phone: string };
  welcomed: boolean;
  hydrated: boolean;
  filter: string;
  query: string;
  savedOnly: boolean;
  hydrate: () => void;
  setTab: (tab: Tab) => void;
  toggleFav: (id: number) => void;
  toggleCompare: (id: number) => "added" | "removed" | "limit";
  clearCompare: () => void;
  toggleCart: (id: string) => boolean;
  setCart: (ids: string[]) => void;
  setDraft: (patch: Partial<Draft>) => void;
  resetDraft: () => void;
  addBooking: (booking: BookingRequest) => void;
  markSent: (id: string) => void;
  removeBooking: (id: string) => void;
  /** Re-inserts a deleted booking without touching the cart or draft. */
  restoreBooking: (booking: BookingRequest) => void;
  setTheme: (theme: ThemePref) => void;
  setProfile: (profile: Partial<{ name: string; phone: string }>) => void;
  clearData: () => void;
  welcome: () => void;
  setFilter: (filter: string) => void;
  setQuery: (query: string) => void;
  toggleSaved: () => void;
  showSaved: () => void;
  clearAll: () => void;
};

export const useSalon = create<SalonState>((set, get) => {
  function save() {
    const { favs, compare, cart, bookings, theme, profile, welcomed } = get();
    try {
      localStorage.setItem(KEY, JSON.stringify({ favs, compare, cart, bookings, theme, profile, welcomed }));
    } catch {
      /* private mode / quota */
    }
  }

  function update(patch: Partial<SalonState>) {
    set(patch);
    save();
  }

  return {
    tab: "home",
    favs: [],
    compare: [],
    cart: [],
    draft: EMPTY_DRAFT,
    bookings: [],
    theme: "system",
    profile: { name: "", phone: "" },
    welcomed: false,
    hydrated: false,
    filter: "all",
    query: "",
    savedOnly: false,
    hydrate: () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return;
        set({ welcomed: true });
        const data = JSON.parse(raw) as Persisted;
        const profile = data.profile && typeof data.profile === "object" ? (data.profile as Record<string, unknown>) : {};
        set({
          favs: ids(data.favs),
          compare: ids(data.compare, 3),
          cart: serviceIds(data.cart),
          bookings: bookingList(data.bookings),
          theme: data.theme === "light" || data.theme === "dark" ? data.theme : "system",
          profile: {
            name: typeof profile.name === "string" ? profile.name : "",
            phone: typeof profile.phone === "string" ? profile.phone : "",
          },
          welcomed: data.welcomed !== false,
        });
      } catch {
        /* ignore broken storage */
      } finally {
        set({ hydrated: true });
      }
    },
    setTab: (tab) => set({ tab }),
    toggleFav: (id) => {
      const favs = get().favs.includes(id) ? get().favs.filter((item) => item !== id) : [...get().favs, id];
      update({ favs });
    },
    toggleCompare: (id) => {
      const current = get().compare;
      if (current.includes(id)) {
        update({ compare: current.filter((item) => item !== id) });
        return "removed";
      }
      if (current.length >= 3) return "limit";
      update({ compare: [...current, id] });
      return "added";
    },
    clearCompare: () => update({ compare: [] }),
    toggleCart: (id) => {
      const has = get().cart.includes(id);
      update({ cart: has ? get().cart.filter((item) => item !== id) : [...get().cart, id] });
      return !has;
    },
    setCart: (cart) => update({ cart }),
    setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
    resetDraft: () => set({ draft: EMPTY_DRAFT }),
    addBooking: (booking) => update({ bookings: [booking, ...get().bookings], cart: [], draft: EMPTY_DRAFT }),
    markSent: (id) => update({ bookings: get().bookings.map((item) => (item.id === id ? { ...item, sent: true } : item)) }),
    removeBooking: (id) => update({ bookings: get().bookings.filter((item) => item.id !== id) }),
    restoreBooking: (booking) => {
      if (!get().bookings.some((item) => item.id === booking.id)) update({ bookings: [booking, ...get().bookings] });
    },
    setTheme: (theme) => update({ theme }),
    setProfile: (profile) => update({ profile: { ...get().profile, ...profile } }),
    clearData: () => {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      set({ welcomed: false, favs: [], compare: [], cart: [], bookings: [], profile: { name: "", phone: "" }, theme: "system", draft: EMPTY_DRAFT });
    },
    welcome: () => update({ welcomed: true }),
    setFilter: (filter) => set({ filter, savedOnly: false }),
    setQuery: (query) => set({ query }),
    toggleSaved: () => set((state) => ({ savedOnly: !state.savedOnly, filter: "all" })),
    showSaved: () => set({ savedOnly: true, filter: "all", query: "" }),
    clearAll: () => set({ filter: "all", query: "", savedOnly: false }),
  };
});
