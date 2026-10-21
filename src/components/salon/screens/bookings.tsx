import { useMemo, useState } from "react";
import { CalendarPlus, Clock3, RotateCcw, Send, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { familyById, lookThumb, persian } from "@/data/catalog";
import { dayOf, formatMinutes, isPast, longDate, monthOf, shortWeekday, stylistName, summarize, timeLabel } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon, type BookingRequest } from "@/lib/salon-store";
import { bookingMessage, shareText, whatsappLink } from "@/lib/share";
import { Button, Chip, EmptyState, useSalonActions } from "../ui";

export function BookingsScreen() {
  const { openBooking } = useSalonActions();
  const bookings = useSalon((state) => state.bookings);
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  const [upcoming, past] = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
    return [sorted.filter((item) => !isPast(item.date, item.time)), sorted.filter((item) => isPast(item.date, item.time)).reverse()];
  }, [bookings]);
  const list = view === "upcoming" ? upcoming : past;

  return (
    <div className="pt-2">
      <section className="px-6 pt-2">
        <p className="reveal font-brand text-[0.7rem] tracking-[0.3em] text-accent-deep" dir="ltr">YOUR APPOINTMENTS</p>
        <h1 className="reveal mt-3 text-[2.2rem] leading-[1.35] font-extralight tracking-tight" style={{ animationDelay: "80ms" }}>
          نوبت‌های
          <br />
          <span className="font-display text-[2.4rem] text-accent-deep">شما</span>
        </h1>
        <p className="reveal mt-3 max-w-xs text-[0.82rem] leading-7 text-muted" style={{ animationDelay: "140ms" }}>درخواست‌ها روی همین دستگاه نگه داشته می‌شوند و پس از ارسال، سالن زمان را تأیید می‌کند.</p>
      </section>

      <div className="chip-bar no-scrollbar">
        <Chip active={view === "upcoming"} onClick={() => setView("upcoming")}>پیش رو {upcoming.length ? `· ${persian(upcoming.length)}` : ""}</Chip>
        <Chip active={view === "past"} onClick={() => setView("past")}>گذشته {past.length ? `· ${persian(past.length)}` : ""}</Chip>
      </div>

      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<CalendarPlus className="size-6" />}
            title={view === "upcoming" ? "نوبت پیش رویی ندارید" : "سابقه‌ای ثبت نشده"}
            text="خدمت، آرتیست و زمان دلخواه را انتخاب کنید؛ درخواست آماده ارسال برای سالن می‌شود."
            action={<Button tone="solid" onClick={() => openBooking()}><CalendarPlus className="size-4" /> رزرو نوبت</Button>}
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 px-6">
          {list.map((booking) => <BookingCard key={booking.id} booking={booking} past={view === "past"} />)}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, past }: { booking: BookingRequest; past: boolean }) {
  const { openBooking } = useSalonActions();
  const markSent = useSalon((state) => state.markSent);
  const removeBooking = useSalon((state) => state.removeBooking);
  const restoreBooking = useSalon((state) => state.restoreBooking);
  const { items, minutes } = summarize(booking.services);
  const look = booking.lookId != null ? familyById.get(booking.lookId) : null;
  const wa = whatsappLink(bookingMessage(booking));

  async function send() {
    const result = await shareText(bookingMessage(booking), "درخواست نوبت");
    if (result === "shared" || result === "copied") {
      markSent(booking.id);
      toast(result === "copied" ? "متن درخواست کپی شد؛ آن را برای سالن بفرستید." : "درخواست برای ارسال آماده شد.");
    } else if (result === "failed") {
      toast("اشتراک‌گذاری ممکن نشد.");
    }
  }

  function remove() {
    removeBooking(booking.id);
    toast("درخواست حذف شد.", { action: { label: "بازگردانی", onClick: () => restoreBooking(booking) } });
  }

  return (
    <article className={cn("rise rounded-[1.75rem] bg-surface p-5 shadow-card", past && "opacity-75")}>
      <div className="flex gap-3.5">
        <span className="date-tile">
          <small>{shortWeekday(booking.date)}</small>
          <strong>{dayOf(booking.date)}</strong>
          <small>{monthOf(booking.date)}</small>
        </span>
        <div className="min-w-0 flex-1">
          <span className={cn("state-pill", booking.sent ? "state-pill-sent" : "state-pill-draft")}>
            {past ? "گذشته" : booking.sent ? "ارسال‌شده · در انتظار تأیید" : "پیش‌نویس · ارسال نشده"}
          </span>
          <p className="mt-1.5 text-[0.95rem] leading-6">{items.map((item) => item.title).join("، ") || "مشاوره"}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{timeLabel(booking.time)} · {formatMinutes(minutes)}</span>
            <span className="inline-flex items-center gap-1"><UserRound className="size-3" />{stylistName(booking.stylist)}</span>
          </p>
        </div>
        {look ? <img src={lookThumb(look.repId)} alt={look.name} className="arch h-16 w-12 shrink-0 object-cover" /> : null}
      </div>
      <p className="sr-only">{longDate(booking.date)}</p>
      <div className="mt-5 flex gap-2 border-t border-foreground/10 pt-4">
        {past ? (
          <Button tone="soft" className="min-h-11 flex-1" onClick={() => openBooking({ services: booking.services, stylist: booking.stylist })}>
            <RotateCcw className="size-4" /> رزرو دوباره
          </Button>
        ) : wa ? (
          <a className="press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm text-on-ink" href={wa} target="_blank" rel="noreferrer" onClick={() => markSent(booking.id)}>
            <Send className="size-4" /> ارسال در واتساپ
          </a>
        ) : (
          <Button tone={booking.sent ? "soft" : "solid"} className="min-h-11 flex-1" onClick={send}>
            <Send className="size-4" /> {booking.sent ? "ارسال دوباره" : "ارسال برای سالن"}
          </Button>
        )}
        <button type="button" className="icon-btn press !size-11 text-muted" onClick={remove} aria-label="حذف درخواست">
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}
