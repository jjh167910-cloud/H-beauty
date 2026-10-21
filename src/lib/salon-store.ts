import { create } from "zustand";
import { familyById } from "@/data/catalog";

const KEY = "hananeh-atelier-v1";

type Persisted = { favs?: unknown; compare?: unknown };

function ids(value: unknown, limit?: number) {
  if (!Array.isArray(value)) return [];
  const next = value.filter((id): id is number => Number.isInteger(id) && familyById.has(id));
  return typeof limit === "number" ? next.slice(0, limit) : next;
}

function persist(favs: number[], compare: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ favs, compare }));
  } catch {
    /* private mode / quota */
  }
}

type SalonState = {
  favs: number[];
  compare: number[];
  filter: string;
  query: string;
  savedOnly: boolean;
  page: number;
  hydrate: () => void;
  toggleFav: (id: number) => void;
  toggleCompare: (id: number) => "added" | "removed" | "limit";
  clearCompare: () => void;
  setFilter: (filter: string) => void;
  setQuery: (query: string) => void;
  toggleSaved: () => void;
  showSaved: () => void;
  clearAll: () => void;
  setPage: (page: number) => void;
};

export const useSalon = create<SalonState>((set, get) => ({
  favs: [],
  compare: [],
  filter: "all",
  query: "",
  savedOnly: false,
  page: 1,
  hydrate: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Persisted;
      set({ favs: ids(data.favs), compare: ids(data.compare, 3) });
    } catch {
      /* ignore broken storage */
    }
  },
  toggleFav: (id) => {
    const favs = get().favs.includes(id) ? get().favs.filter((item) => item !== id) : [...get().favs, id];
    set({ favs });
    persist(favs, get().compare);
  },
  toggleCompare: (id) => {
    const current = get().compare;
    if (current.includes(id)) {
      const compare = current.filter((item) => item !== id);
      set({ compare });
      persist(get().favs, compare);
      return "removed";
    }
    if (current.length >= 3) return "limit";
    const compare = [...current, id];
    set({ compare });
    persist(get().favs, compare);
    return "added";
  },
  clearCompare: () => {
    set({ compare: [] });
    persist(get().favs, []);
  },
  setFilter: (filter) => set({ filter, savedOnly: false, page: 1 }),
  setQuery: (query) => set({ query, page: 1 }),
  toggleSaved: () => set((state) => ({ savedOnly: !state.savedOnly, filter: "all", page: 1 })),
  showSaved: () => set({ savedOnly: true, filter: "all", query: "", page: 1 }),
  clearAll: () => set({ filter: "all", query: "", savedOnly: false, page: 1 }),
  setPage: (page) => set({ page }),
}));
