import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Rocket, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, SERVICES } from "@/lib/catalog";
import { finalPrice, tl, useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/marka")({
  head: () => ({
    meta: [
      { title: "Marka Komuta Paneli — Dega Medya Grup" },
      {
        name: "description",
        content:
          "Omni-pazaryeri: hazır kampanyalar, yetenek ağı, geleneksel medya ve prodüksiyon hizmetlerini sepete ekleyin.",
      },
      { property: "og:title", content: "Marka Komuta Paneli — Dega Medya Grup" },
      { property: "og:description", content: "360 derece medya pazaryeri ve kampanya sepeti." },
    ],
  }),
  component: BrandGate,
});

type CartItem = { id: string; title: string; price: number };

function BrandGate() {
  const { currentAccount } = useDega();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAccount || currentAccount.role !== "brand") navigate({ to: "/marka-girisi" });
  }, [currentAccount, navigate]);

  if (!currentAccount || currentAccount.role !== "brand") return null;
  return <BrandDashboard />;
}

function BrandDashboard() {
  const { state, currentAccount, addOrder } = useDega();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [q, setQ] = useState("");

  const talents = state.accounts.filter((a) => a.role === "talent" && a.status === "active");
  const total = cart.reduce((s, i) => s + i.price, 0);

  const add = (item: CartItem) => {
    setCart((c) => [...c, item]);
    toast.success(`${item.title} sepete eklendi.`);
  };

  const filtered = useMemo(
    () => (s: string) => s.toLowerCase().includes(q.toLowerCase()),
    [q],
  );

  return (
    <AppShell
      title={`Hoş geldiniz, ${currentAccount?.company ?? currentAccount?.name}`}
      subtitle="Omni-Pazaryeri: küresel medya iktidarınızı kurmak için ihtiyacınız olan her varlık tek katalogda."
      actions={
        <Badge className="bg-primary/30">
          <ShoppingCart className="mr-1 size-3" /> {cart.length}
        </Badge>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="glass-panel mb-6 flex items-center gap-3 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hizmet, yetenek veya kampanya ara"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <Tabs defaultValue={CATEGORIES[0]}>
            <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
              {CATEGORIES.map((c) => (
                <TabsTrigger
                  key={c}
                  value={c}
                  className="glass-panel px-4 py-2 text-xs uppercase tracking-[0.15em] data-[state=active]:border-accent/70 data-[state=active]:bg-primary/25"
                >
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="Hazır Kampanyalar" className="mt-6 grid gap-5 md:grid-cols-2">
              {state.bundles
                .filter((b) => b.live && filtered(b.title + b.description))
                .map((b) => (
                  <Card
                    key={b.id}
                    title={b.title}
                    description={b.description}
                    tags={b.items}
                    price={b.price}
                    onAdd={() => add({ id: b.id, title: b.title, price: b.price })}
                  />
                ))}
            </TabsContent>

            <TabsContent value="Yetenek Ağı" className="mt-6 grid gap-5 md:grid-cols-2">
              {talents
                .filter((t) => filtered(`${t.name} ${t.category}`))
                .map((t) => (
                  <Card
                    key={t.id}
                    title={t.name}
                    description={`${t.category} · ${t.city ?? "Global"} — Dega Medya Grup resmi yönetim portföyü.`}
                    tags={Object.entries(t.metrics)
                      .filter(([, v]) => v)
                      .slice(0, 4)
                      .map(([k, v]) => `${k}: ${v}`)}
                    price={finalPrice(t)}
                    image={t.avatar}
                    onAdd={() => add({ id: t.id, title: t.name, price: finalPrice(t) })}
                  />
                ))}
            </TabsContent>

            {CATEGORIES.filter((c) => c !== "Hazır Kampanyalar" && c !== "Yetenek Ağı").map((c) => (
              <TabsContent key={c} value={c} className="mt-6 grid gap-5 md:grid-cols-2">
                {SERVICES.filter((s) => s.category === c && filtered(s.title + s.description)).map(
                  (s) => (
                    <Card
                      key={s.id}
                      title={s.title}
                      description={s.description}
                      tags={[c]}
                      price={s.price}
                      onAdd={() => add({ id: s.id, title: s.title, price: s.price })}
                    />
                  ),
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <aside className="glass-panel h-fit p-6 lg:sticky lg:top-28">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-5 text-accent" /> Kampanya Sepeti
          </h2>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Sepetiniz boş. Pazaryerinden varlık ekleyerek kampanyanızı inşa edin.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {cart.map((i, idx) => (
                <div key={`${i.id}-${idx}`} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <p className="text-sm font-medium">{i.title}</p>
                    <p className="text-xs text-accent">{tl(i.price)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setCart((c) => c.filter((_, n) => n !== idx))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Toplam</span>
            <span className="font-display text-2xl font-bold text-imperial">{tl(total)}</span>
          </div>
          <Button
            variant="gold"
            size="titan"
            className="mt-5 w-full"
            disabled={cart.length === 0}
            onClick={() => {
              addOrder({
                brandId: currentAccount!.id,
                brandName: currentAccount!.company ?? currentAccount!.name,
                total,
                items: cart.map((c) => c.title),
              });
              setCart([]);
              toast.success("Kampanyanız holding operasyon masasına iletildi.");
            }}
          >
            <Rocket /> Kampanyayı Başlat
          </Button>
        </aside>
      </div>
    </AppShell>
  );
}

function Card({
  title,
  description,
  tags,
  price,
  image,
  onAdd,
}: {
  title: string;
  description: string;
  tags: string[];
  price: number;
  image?: string | undefined;
  onAdd: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-panel flex flex-col p-6">
      {image && (
        <img src={image} alt={title} className="mb-4 h-40 w-full rounded-xl object-cover" loading="lazy" />
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t} variant="outline" className="border-accent/40 text-[10px] text-accent">
            {t}
          </Badge>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="font-display text-xl font-bold text-imperial">{tl(price)}</span>
        <Button variant="titan" size="sm" onClick={onAdd}>
          Sepete Ekle
        </Button>
      </div>
    </motion.div>
  );
}