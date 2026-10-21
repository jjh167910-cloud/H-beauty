import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { familyById } from "@/data/catalog";
import { useSalon } from "@/lib/salon-store";
import { Catalog } from "./catalog";
import { Header } from "./header";
import { Footer, Services, Stage } from "./home-sections";
import { Overlays, type DialogMode } from "./overlays";
import { SalonProvider, type SalonActions } from "./ui";

export function SalonApp() {
  const hydrate = useSalon((state) => state.hydrate);
  const setFilter = useSalon((state) => state.setFilter);
  const [mode, setMode] = useState<DialogMode>(null);
  const [lookId, setLookId] = useState<number | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [section, setSection] = useState("top");
  const look = lookId != null ? familyById.get(lookId) ?? null : null;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const nodes = ["collections", "services", "catalog", "about"]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setSection(visible.target.id);
        else if (window.scrollY < 240) setSection("top");
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const actions = useMemo<SalonActions>(
    () => ({
      openLook: (id) => {
        setLookId(id);
        setVariantIndex(0);
        setMode("look");
      },
      openCompare: () => setMode("compare"),
      openConsult: () => setMode("consult"),
      openBooking: () => setMode("booking"),
      openAnalyzer: () => setMode("analyzer"),
      go: (anchor) => {
        setMode(null);
        setSection(anchor);
        if (anchor === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      applyFilter: (key) => {
        setFilter(key);
        setMode(null);
        setSection("catalog");
        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }),
    [setFilter],
  );

  return (
    <SalonProvider value={actions}>
      <Header section={section} />
      <main>
        <Stage />
        <Services />
        <Catalog />
      </main>
      <Footer />
      <Overlays
        mode={mode}
        look={look}
        variantIndex={variantIndex}
        onVariant={setVariantIndex}
        onClose={() => setMode(null)}
      />
      <Toaster
        dir="rtl"
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </SalonProvider>
  );
}
