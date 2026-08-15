import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Megaphone, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { finalPrice, tl, useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner Paneli — Dega Medya Grup" },
      {
        name: "description",
        content: "Partner paneli: müsaitlik takvimi, yönetim duyuruları ve resmi biyografi kartı.",
      },
      { property: "og:title", content: "Partner Paneli — Dega Medya Grup" },
      { property: "og:description", content: "Takviminizi yönetin, duyuruları takip edin." },
    ],
  }),
  component: TalentGate,
});

const BIO = `Official Mgmt: Dega Medya Grup
📧 contact@degamedyagrup.com
Merhaba, iş birliği, reklam ve rezervasyon talepleriniz için yönetim ajansımız Dega Medya Grup üzerinden bizimle iletişime geçebilirsiniz. Tüm süreçlerimiz profesyonel ekibimiz tarafından yürütülmektedir.
🌐 Web Portal: www.degamedyagrup.com
📱 Instagram: @degamedyagrup
📞 İletişim & WhatsApp: 0535 885 56 85
📧 E-posta: contact@degamedyagrup.com`;

function TalentGate() {
  const { currentAccount } = useDega();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAccount || currentAccount.role !== "talent") navigate({ to: "/partner-girisi" });
  }, [currentAccount, navigate]);

  if (!currentAccount || currentAccount.role !== "talent") return null;
  return <TalentDashboard />;
}

function TalentDashboard() {
  const { state, currentAccount, updateAccount } = useDega();
  const acc = currentAccount!;
  const [dates, setDates] = useState<Date[]>(acc.availability.map((d) => new Date(d)));

  return (
    <AppShell
      title={acc.name}
      subtitle="Resmi Dega Medya Grup partner paneliniz: takviminiz, kaşe bilgileriniz ve yönetim iletişim kartınız."
      actions={<Badge className="bg-accent text-accent-foreground">{acc.category}</Badge>}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Taban Kaşe</p>
          <p className="mt-2 font-display text-2xl font-bold text-imperial">{tl(acc.basePrice)}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Pazaryeri Nihai Fiyatı
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-accent">{tl(finalPrice(acc))}</p>
        </div>

        {/* UNCLOSABLE BIO CARD */}
        <div
          className="glass-panel p-6 lg:order-2 lg:col-span-1"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm uppercase tracking-[0.25em] text-accent">Resmi Biyografi</h2>
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(BIO);
                toast.success("Biyografi kopyalandı.");
              }}
            >
              <Copy /> Kopyala
            </Button>
          </div>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-muted-foreground">
            {BIO}
          </pre>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Bu kart zorunludur ve kapatılamaz.
          </p>
        </div>

        <div className="glass-panel p-6 lg:order-3">
          <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            <Megaphone className="size-4 text-accent" /> Yönetim Duyuruları
          </h2>
          <div className="mt-4 space-y-3">
            {state.announcements.map((a) => (
              <div key={a.id} className="rounded-lg border border-border/70 p-4">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 lg:order-1 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            <CalendarDays className="size-4 text-accent" /> Müsaitlik Takvimi
          </h2>
          <div className="mt-4 flex flex-wrap items-start gap-6">
            <Calendar
              mode="multiple"
              selected={dates}
              onSelect={(d) => setDates(d ?? [])}
              className="pointer-events-auto rounded-xl border border-border/70 p-3"
            />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Seçtiğiniz günler yönetim masasına müsait olarak iletilir. Rezervasyon önceliği güncel
                takvim tutan partnerlere verilir.
              </p>
              <Button
                variant="gold"
                className="mt-4"
                onClick={() => {
                  updateAccount(acc.id, { availability: dates.map((d) => d.toISOString()) });
                  toast.success("Takviminiz yönetime iletildi.");
                }}
              >
                Takvimi Kaydet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}