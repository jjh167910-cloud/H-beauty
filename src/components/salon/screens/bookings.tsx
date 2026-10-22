import { useMemo, useState } from "react";
import { toast } from "sonner";
import { familyById, lookThumb, persian } from "@/data/catalog";
import { dayOf, formatMinutes, isPast, longDate, monthOf, shortWeekday, stylistName, summarize, timeLabel } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon, type BookingRequest } from "@/lib/salon-store";
import { bookingMessage, shareText, whatsappLink } from "@/lib/share";
import { Icon } from "../icons";
import { Button, Chip, EmptyState, IconButton, Media, PageHead, useSalonActions } from "../ui";

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
      <PageHead eyebrow="نوبت‌ها" title="قرارهای" accent="زیبایی شما" lead="درخواست‌ها روی همین دستگاه نگه داشته می‌شوند و پس از ارسال، سالن زمان را تأیید می‌کند." />

      <div className="chip-row mt-5" role="tablist" aria-label="نمایش نوبت‌ها">
        <Chip active={view === "upcoming"} onClick={() => setView("upcoming")}>پیش رو{upcoming.length ? ` · ${persian(upcoming.length)}` : ""}</Chip>
        <Chip active={view === "past"} onClick={() => setView("past")}>گذشته{past.length ? ` · ${persian(past.length)}` : ""}</Chip>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="book"
          title={view === "upcoming" ? "نوبت پیش رویی ندارید" : "سابقه‌ای ثبت نشده"}
          text="خدمت، آرتیست و زمان دلخواه را انتخاب کنید؛ درخواست آماده ارسال برای سالن می‌شود."
          action={<Button variant="gold" icon="book" onClick={() => openBooking()}>رزرو نوبت</Button>}
        />
      ) : (
        <div className="mt-3 grid gap-4 px-gutter">
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
    if (result === "shared") {
      // A completed system share is not a confirmed booking.
      markSent(booking.id);
      toast("اشتراک‌گذاری انجام شد؛ تأیید زمان نوبت فقط با سالن است.");
    } else if (result === "copied") {
      // Copying text does NOT mean a request was delivered.
      toast("متن درخواست کپی شد. پس از ارسال به سالن، آن را در این صفحه علامت بزنید.");
    } else if (result === "failed") {
      toast("اشتراک‌گذاری ممکن نشد.");
    }
  }

  function remove() {
    removeBooking(booking.id);
    toast("درخواست حذف شد.", { action: { label: "بازگردانی", onClick: () => restoreBooking(booking) } });
  }

  return (
    <article className={cn("card rise", past && "opacity-70")}>
      <div className="flex gap-4">
        <span className="date-tile">
          <small>{shortWeekday(booking.date)}</small>
          <strong>{dayOf(booking.date)}</strong>
          <small>{monthOf(booking.date)}</small>
        </span>
        <div className="min-w-0 flex-1">
          <span className="status" data-tone={past ? undefined : booking.sent ? "gold" : "garnet"}>
            {past ? "گذشته" : booking.sent ? "ارسال‌شده · در انتظار تأیید" : "پیش‌نویس · ارسال نشده"}
          </span>
          <p className="t-headline mt-1 font-normal">{items.map((item) => item.title).join("، ") || "مشاوره"}</p>
          <p className="t-caption mt-1 flex flex-wrap gap-x-3 gap-y-1 text-ink-2">
            <span className="inline-flex items-center gap-1"><Icon name="clock" size={13} />{timeLabel(booking.time)} · {formatMinutes(minutes)}</span>
            <span className="inline-flex items-center gap-1"><Icon name="profile" size={13} />{stylistName(booking.stylist)}</span>
          </p>
        </div>
        {look ? <Media src={lookThumb(look.repId)} alt={look.name} className="arch h-16 w-12 shrink-0" /> : null}
      </div>
      <p className="sr-only">{longDate(booking.date)}</p>
      <div className="mt-5 flex gap-2 border-t border-line pt-4">
        {past ? (
          <Button variant="tonal" icon="rebook" className="flex-1" onClick={() => openBooking({ services: booking.services, stylist: booking.stylist })}>رزرو دوباره</Button>
        ) : wa ? (
          <a className="btn flex-1" href={wa} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} weight="regular" /> ارسال در واتساپ
          </a>
        ) : (
          <Button variant={booking.sent ? "tonal" : "primary"} icon="send" className="flex-1" onClick={send}>{booking.sent ? "ارسال دوباره" : "ارسال برای سالن"}</Button>
        )}
        <IconButton icon="trash" label="حذف درخواست" variant="tonal" onClick={remove} />
      </div>
      {!past && !booking.sent ? (
        <button type="button" className="mt-3 min-h-11 w-full text-start text-xs leading-7 text-gold-ink underline underline-offset-4" onClick={() => {
          markSent(booking.id);
          toast("وضعیت ارسال با اعلام شما ثبت شد؛ تأیید وقت همچنان با سالن است.");
        }}>
          درخواست را برای سالن فرستاده‌ام · ثبت وضعیت ارسال
        </button>
      ) : null}
    </article>
  );
}
