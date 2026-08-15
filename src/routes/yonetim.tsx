import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Clock, Trash2, Megaphone, Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { finalPrice, tl, useDega, type Account, type Metrics } from "@/lib/dega-store";

export const Route = createFileRoute("/yonetim")({
  head: () => ({
    meta: [
      { title: "Holding Komuta Merkezi — Dega Medya Grup" },
      {
        name: "description",
        content: "Dega Medya Grup yönetim ERP: onay kuyruğu, finans, marj motoru ve kampanya inşası.",
      },
      { property: "og:title", content: "Holding Komuta Merkezi — Dega Medya Grup" },
      { property: "og:description", content: "Holding ERP komuta merkezi." },
    ],
  }),
  component: AdminERP,
});

function AdminERP() {
  const { isAdmin } = useDega();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate({ to: "/yonetim-girisi" });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  return <ERPBody />;
}

function ERPBody() {
  const {
    state,
    setStatus,
    removeAccount,
    updateAccount,
    addBundle,
    removeBundle,
    addAnnouncement,
    addExpense,
    updateOrderStatus,
    removeOrder,
  } = useDega();

  const talents = (state.accounts || []).filter((a) => a.role === "talent");
  const pending = talents.filter((a) => a.status !== "active");
  const brands = (state.accounts || []).filter((a) => a.role === "brand");

  const revenue = useMemo(() => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];
    const orderTotal = (state.orders || []).reduce((s, o) => s + o.total, 0);
    return months.map((m, i) => {
      const kazanc = 4200000 + i * 640000 + (i === months.length - 1 ? orderTotal : 0);
      const gider = 1800000 + i * 240000;
      return { m, kazanc, gider, net: kazanc - gider };
    });
  }, [state.orders]);

  const totals = revenue.reduce(
    (acc, r) => ({
      kazanc: acc.kazanc + r.kazanc,
      gider: acc.gider + r.gider,
      net: acc.net + r.net,
    }),
    { kazanc: 0, gider: 0, net: 0 }
  );

  return (
    <AppShell
      title="Holding Komuta Merkezi"
      subtitle="Tüm ekosistem tek ekranda: partner onayları, finansal egemenlik, kâr marjı motoru ve küresel kampanya inşası."
      actions={<Badge className="bg-accent text-accent-foreground">GOD-MODE</Badge>}
    >
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Kpi label="Toplam Kazanç" value={tl(totals.kazanc)} />
        <Kpi label="Toplam Gider" value={tl(totals.gider)} />
        <Kpi label="Net Kâr" value={tl(totals.net)} accent />
        <Kpi label="Onay Bekleyen Partner" value={String(pending.length)} />
      </div>

      <Tabs defaultValue="queue">
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          {[
            { v: "queue", l: "Onay Kuyruğu" },
            { v: "finance", l: "Finans & İstatistik" },
            { v: "margin", l: "Kâr Marjı Motoru" },
            { v: "campaign", l: "Kampanya Oluşturucu" },
            { v: "omni", l: "Omni-Edit" },
            { v: "comms", l: "Duyurular & Siparişler" },
          ].map(({ v, l }) => (
            <TabsTrigger
              key={v}
              value={v}
              className="glass-panel px-4 py-2 text-xs uppercase tracking-[0.15em] data-[state=active]:border-accent/70 data-[state=active]:bg-primary/25"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* APPROVAL QUEUE */}
        <TabsContent value="queue" className="mt-6 space-y-4">
          {pending.length === 0 && (
            <div className="glass-panel p-8 text-center text-sm text-muted-foreground">
              Kuyruk temiz. Tüm partnerler pazaryerinde yayında.
            </div>
          )}
          {pending.map((a) => (
            <div key={a.id} className="glass-panel flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
              <Avatar acc={a} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{a.name}</h3>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {a.category}
                  </Badge>
                  <Badge variant="outline" className={a.status === "hold" ? "text-muted-foreground" : ""}>
                    {a.status === "hold" ? "Beklemede" : "Yeni Başvuru"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.email} · {a.phone} · Taban Kaşe: {tl(a.basePrice)} · Nihai Fiyat:{" "}
                  {tl(finalPrice(a))}
                </p>
                <MetricList metrics={a.metrics} />
              </div>
              <div className="flex flex-col gap-2 lg:w-64">
                <Button
                  variant="gold"
                  onClick={() => {
                    setStatus(a.id, "active");
                    toast.success(`${a.name} pazaryerine eklendi.`);
                  }}
                >
                  <Check /> Pazaryerine Ekle (ONAYLA)
                </Button>
                <Button
                  variant="titan"
                  onClick={() => {
                    setStatus(a.id, "hold");
                    toast("Başvuru beklemeye alındı.");
                  }}
                >
                  <Clock /> Beklemede Bırak (BEKLET)
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    removeAccount(a.id);
                    toast.error("Kayıt sistemden silindi.");
                  }}
                >
                  <Trash2 /> Sistemden Sil (SİL)
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* FINANCE */}
        <TabsContent value="finance" className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard title="Aylık Kazanç">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => tl(v)} />
                <Area dataKey="kazanc" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Giderler">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenue}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => tl(v)} />
                <Bar dataKey="gider" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Net Kâr Trendi" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenue}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => tl(v)} />
                <Legend />
                <Line dataKey="net" name="Net Kâr" stroke="var(--color-chart-2)" strokeWidth={3} dot={false} />
                <Line dataKey="kazanc" name="Kazanç" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Gider Kalemi Ekle">
            <ExpenseForm onAdd={addExpense} />
            <div className="mt-4 space-y-2">
              {(state.expenses || []).map((e) => (
                <div key={e.id} className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {e.month} · {e.label}
                  </span>
                  <span className="text-foreground">{tl(e.amount)}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        {/* MARGIN ENGINE */}
        <TabsContent value="margin" className="mt-6 space-y-4">
          {talents.map((a) => (
            <div key={a.id} className="glass-panel grid gap-5 p-6 md:grid-cols-[1fr_320px]">
              <div>
                <h3 className="font-semibold">
                  {a.name} <span className="text-xs text-muted-foreground">· {a.category}</span>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Taban Kaşe: {tl(a.basePrice)} · Marj: {a.margin}% · Pazaryeri Nihai Fiyatı:{" "}
                  <span className="text-accent">{tl(finalPrice(a))}</span>
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-[0.2em]">Dega Grup Kâr Marjı (%)</Label>
                <Slider
                  value={[a.margin]}
                  max={200}
                  step={1}
                  onValueChange={([v]) => updateAccount(a.id, { margin: v ?? 0 })}
                />
                <Input
                  type="number"
                  value={a.basePrice}
                  onChange={(e) => updateAccount(a.id, { basePrice: Number(e.target.value) })}
                />
              </div>
            </div>
          ))}
        </TabsContent>

        {/* CAMPAIGN BUILDER */}
        <TabsContent value="campaign" className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
          <BundleForm onAdd={addBundle} />
          <div className="space-y-4">
            {(state.bundles || []).map((b) => (
              <div key={b.id} className="glass-panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.items.map((i) => (
                        <Badge key={i} variant="outline" className="border-accent/40 text-accent">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-imperial">{tl(b.price)}</p>
                    <Badge className="mt-2 bg-primary/30">{b.live ? "Pazaryerinde" : "Taslak"}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive"
                      onClick={() => removeBundle(b.id)}
                    >
                      <Trash2 /> Kaldır
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* OMNI EDIT */}
        <TabsContent value="omni" className="mt-6 space-y-4">
          {[...talents, ...brands].map((a) => (
            <OmniRow key={a.id} acc={a} onSave={updateAccount} />
          ))}
        </TabsContent>

        {/* COMMS */}
        <TabsContent value="comms" className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Megaphone className="size-5 text-accent" /> Partner Duyurusu Yayınla
            </h3>
            <AnnouncementForm onAdd={addAnnouncement} />
            <div className="mt-6 space-y-3">
              {(state.announcements || []).map((an) => (
                <div key={an.id} className="rounded-lg border border-border/70 p-4">
                  <p className="font-semibold">{an.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{an.body}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* ORDERS AREA */}
          <div className="glass-panel flex h-full flex-col p-6">
            <h3 className="text-lg font-semibold">Kampanya Siparişleri</h3>
            {state.orders?.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Henüz başlatılmış kampanya yok.</p>
            ) : (
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
                {(state.orders || []).map((o) => {
                  const isPrep = o.status === "preparing";
                  const isComp = o.status === "completed";

                  return (
                    <div
                      key={o.id}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        isPrep ? "border-yellow-500/50 bg-yellow-500/5" :
                        isComp ? "border-green-500/50 bg-green-500/5" :
                        "border-border/70 bg-background/50"
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-foreground">{o.brandName}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] tracking-widest",
                                isPrep && "border-yellow-500/50 text-yellow-500",
                                isComp && "border-green-500/50 text-green-500",
                                !isPrep && !isComp && "border-border/70 text-muted-foreground"
                              )}
                            >
                              {isPrep ? "HAZIRLANIYOR" : isComp ? "TAMAMLANDI" : "BEKLİYOR"}
                            </Badge>
                          </div>
                          
                          {/* İletişim & Kurum Bilgileri */}
                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {o.company && <p><span className="font-medium text-foreground/70">Kurum:</span> {o.company}</p>}
                            {(o.brandEmail || o.brandPhone) && (
                              <p>
                                {o.brandEmail} {o.brandEmail && o.brandPhone && " · "} {o.brandPhone}
                              </p>
                            )}
                          </div>
                          
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {(o.items || []).join(" · ")}
                          </p>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-3 border-t border-border/50 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                          <p className="font-display text-lg font-bold text-accent">{tl(o.total)}</p>
                          <div className="flex items-center gap-2">
                            {o.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-yellow-500/30 text-xs text-yellow-500 hover:bg-yellow-500/10"
                                onClick={() => {
                                  updateOrderStatus(o.id, "preparing");
                                  toast.success("Sipariş durumu güncellendi: Hazırlanıyor");
                                }}
                              >
                                Hazırlanıyor Yap
                              </Button>
                            )}
                            {o.status === "preparing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-green-500/30 text-xs text-green-500 hover:bg-green-500/10"
                                onClick={() => {
                                  updateOrderStatus(o.id, "completed");
                                  toast.success("Sipariş başarıyla tamamlandı!");
                                }}
                              >
                                <Check className="mr-1 size-3" /> Tamamlandı Yap
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                removeOrder(o.id);
                                toast.error("Sipariş kalıcı olarak silindi.");
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  color: "var(--color-popover-foreground)",
  fontSize: 12,
};

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass-panel p-5">
      <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-display mt-2 text-2xl font-bold",
          accent ? "text-accent" : "text-imperial"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel p-6", className)}>
      <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Avatar({ acc }: { acc: Account }) {
  return (
    <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-accent/40 bg-primary/20">
      {acc.avatar ? (
        <img src={acc.avatar} alt={acc.name || "Avatar"} className="size-full object-cover" />
      ) : (
        <span className="font-display text-xl text-accent">
          {acc.name ? acc.name.slice(0, 2).toUpperCase() : "??"}
        </span>
      )}
    </div>
  );
}

const METRIC_LABELS: Record<keyof Metrics, string> = {
  followers: "Takipçi",
  reels: "Reels İzlenme",
  story: "Story Görüntülenme",
  engagement: "Etkileşim (%)",
  height: "Boy",
  weight: "Kilo",
  eyeColor: "Göz Rengi",
  hairColor: "Saç Rengi",
  shoeSize: "Ayak No",
  musicStyle: "Müzik Tarzı",
  rider: "Teknik Rider",
};

function MetricList({ metrics }: { metrics: Metrics }) {
  const entries = Object.entries(metrics || {}).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!entries.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {entries.map(([k, v]) => (
        <span key={k} className="rounded-md border border-border/70 px-2 py-1 text-[11px] text-muted-foreground">
          {METRIC_LABELS[k as keyof Metrics]}: <span className="text-foreground">{String(v)}</span>
        </span>
      ))}
    </div>
  );
}

function OmniRow({
  acc,
  onSave,
}: {
  acc: Account;
  onSave: (id: string, patch: Partial<Account>) => void;
}) {
  const [draft, setDraft] = useState(acc);
  const [dates, setDates] = useState<Date[]>((acc.availability || []).map((d) => new Date(d)));

  return (
    <div className="glass-panel flex flex-wrap items-center gap-5 p-6">
      <Avatar acc={acc} />
      <div className="flex-1">
        <h3 className="font-semibold">
          {acc.name}{" "}
          <span className="text-xs text-muted-foreground">
            · {acc.role === "brand" ? acc.company ?? "Marka" : acc.category}
          </span>
        </h3>
        <p className="text-xs text-muted-foreground">{acc.email}</p>
        <MetricList metrics={acc.metrics} />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="glass">Omni-Edit</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{acc.name} — Derin Düzenleme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Row label="Ad Soyad">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Row>
            <Row label="E-posta">
              <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </Row>
            <Row label="Telefon">
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Row>
            <Row label="Avatar URL / Data">
              <Input
                value={draft.avatar ?? ""}
                onChange={(e) => setDraft({ ...draft, avatar: e.target.value })}
              />
            </Row>
            <Row label="Taban Kaşe (₺)">
              <Input
                type="number"
                value={draft.basePrice}
                onChange={(e) => setDraft({ ...draft, basePrice: Number(e.target.value) })}
              />
            </Row>
            <Row label="Kâr Marjı (%)">
              <Input
                type="number"
                value={draft.margin}
                onChange={(e) => setDraft({ ...draft, margin: Number(e.target.value) })}
              />
            </Row>
            {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((k) => (
              <Row key={k} label={METRIC_LABELS[k]}>
                <Input
                  value={draft.metrics?.[k] ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, metrics: { ...draft.metrics, [k]: e.target.value } })
                  }
                />
              </Row>
            ))}
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-[0.2em]">Müsaitlik Takvimi</Label>
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={(d) => setDates(d ?? [])}
                className="pointer-events-auto mt-2 rounded-xl border border-border/70"
              />
            </div>
          </div>
          <Button
            variant="gold"
            className="mt-4 w-full"
            onClick={() => {
              onSave(acc.id, { ...draft, availability: dates.map((d) => d.toISOString()) });
              toast.success("Kayıt güncellendi.");
            }}
          >
            Değişiklikleri Kaydet
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function BundleForm({
  onAdd,
}: {
  onAdd: (b: { title: string; description: string; items: string[]; price: number; live: boolean }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState("");
  const [price, setPrice] = useState("");

  return (
    <form
      className="glass-panel h-fit space-y-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({
          title,
          description,
          items: items.split(",").map((i) => i.trim()).filter(Boolean),
          price: Number(price) || 0,
          live: true,
        });
        toast.success("Kampanya pazaryerine gönderildi.");
        setTitle("");
        setDescription("");
        setItems("");
        setPrice("");
      }}
    >
      <h3 className="text-lg font-semibold">Kampanya Oluşturucu</h3>
      <Row label="Kampanya Adı">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Row>
      <Row label="Açıklama">
        <Textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} />
      </Row>
      <Row label="Paket İçeriği (virgülle ayırın)">
        <Input required value={items} onChange={(e) => setItems(e.target.value)} />
      </Row>
      <Row label="Paket Fiyatı (₺)">
        <Input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
      </Row>
      <Button type="submit" variant="gold" className="w-full">
        <Plus /> Pazaryerine Gönder
      </Button>
    </form>
  );
}

function AnnouncementForm({ onAdd }: { onAdd: (a: { title: string; body: string }) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ title, body });
        toast.success("Duyuru tüm partnerlere iletildi.");
        setTitle("");
        setBody("");
      }}
    >
      <Input required placeholder="Başlık" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea required rows={3} placeholder="Duyuru metni" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button type="submit" variant="titan" className="w-full">
        Yayınla
      </Button>
    </form>
  );
}

function ExpenseForm({
  onAdd,
}: {
  onAdd: (e: { label: string; amount: number; month: string }) => void;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  return (
    <form
      className="grid gap-3 md:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ label, amount: Number(amount) || 0, month });
        setLabel("");
        setAmount("");
        setMonth("");
        toast.success("Gider kaydedildi.");
      }}
    >
      <Input required placeholder="Kalem" value={label} onChange={(e) => setLabel(e.target.value)} />
      <Input required placeholder="Tutar" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Input required placeholder="Ay" value={month} onChange={(e) => setMonth(e.target.value)} />
      <Button type="submit" variant="glass" className="md:col-span-3">
        Gider Ekle
      </Button>
    </form>
  );
}