import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "brand" | "talent";
export type Status = "pending" | "active" | "hold";
export type OrderStatus = "pending" | "preparing" | "completed";

export type TalentCategory =
  | "Influencer"
  | "Sayfa"
  | "TV"
  | "Model"
  | "Oyuncu"
  | "DJ"
  | "Sanatçı";

export type Metrics = {
  reels?: string;
  story?: string;
  engagement?: string;
  followers?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  shoeSize?: string;
  musicStyle?: string;
  rider?: string;
};

export type Account = {
  id: string;
  role: Exclude<Role, "admin">;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string | undefined;
  company?: string | undefined;
  city?: string | undefined;
  category?: TalentCategory | undefined;
  basePrice: number;
  margin: number;
  metrics: Metrics;
  socials: { instagram?: string; tiktok?: string; youtube?: string; x?: string };
  availability: string[];
  status: Status;
  createdAt: string;
};

export type Bundle = {
  id: string;
  title: string;
  description: string;
  items: string[];
  price: number;
  live: boolean;
};

export type Order = {
  id: string;
  brandId: string;
  brandName: string;
  brandEmail?: string;
  brandPhone?: string;
  company?: string;
  total: number;
  items: string[];
  status: OrderStatus;
  createdAt: string;
};

export type Announcement = { id: string; title: string; body: string; createdAt: string };

export type Expense = { id: string; label: string; amount: number; month: string };

type Session = { role: Role; id: string } | null;

type State = {
  accounts: Account[];
  bundles: Bundle[];
  orders: Order[];
  announcements: Announcement[];
  expenses: Expense[];
  session: Session;
};

export const ADMIN_EMAIL = "admin@degamedyagrup.com";
export const ADMIN_PASSWORD = "05398519585Mm..";

const KEY = "dega-v10-state";

const seedBundles: Bundle[] = [
  {
    id: "b-uni",
    title: "Üniversite Kampanyası",
    description:
      "Türkiye'nin 42 kampüsünde eş zamanlı yayın: 12 mikro influencer, 4 kampüs etkinliği, 1 dijital film.",
    items: ["12 Influencer Reels", "4 Kampüs Aktivasyonu", "Dijital Reklam Filmi", "Raporlama"],
    price: 1850000,
    live: true,
  },
  {
    id: "b-global",
    title: "Global Lansman 360",
    description:
      "3 kıtada senkronize lansman: TV, OOH, dijital ve prime-time sanatçı iş birliği paketi.",
    items: ["Ulusal TV Spotu", "OOH Ağı", "A-Sınıfı Sanatçı", "Prodüksiyon Ekibi"],
    price: 7400000,
    live: true,
  },
  {
    id: "b-ramazan",
    title: "Prime-Time Sezon Paketi",
    description: "Sezon boyunca 8 haftalık kesintisiz medya iktidarı ve içerik ekosistemi.",
    items: ["8 Hafta Yayın", "6 Yetenek", "Sosyal Yönetim", "Kriz İletişimi"],
    price: 3250000,
    live: true,
  },
];

const seedAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Q3 Global Marka Portföyü Açıklandı",
    body: "Yeni dönemde 14 küresel markanın kampanya takvimi partner ağımıza açılmıştır. Takvimlerinizi güncel tutmanız rezervasyon önceliği sağlar.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Kaşe Revizyon Dönemi",
    body: "Taban kaşe fiyat güncellemeleri her ayın ilk haftası yönetim onayına açılır.",
    createdAt: new Date().toISOString(),
  },
];

const seedExpenses: Expense[] = [
  { id: "e1", label: "Prodüksiyon", amount: 420000, month: "Oca" },
  { id: "e2", label: "Medya Alımı", amount: 680000, month: "Şub" },
  { id: "e3", label: "Operasyon", amount: 310000, month: "Mar" },
];

const seedAccounts: Account[] = [
  {
    id: "t-1",
    role: "talent",
    name: "Selin Aydar",
    email: "selin@partner.com",
    password: "partner123",
    phone: "0535 000 00 01",
    category: "Influencer",
    basePrice: 85000,
    margin: 35,
    metrics: { reels: "2.400.000", story: "310.000", engagement: "7.4", followers: "1.280.000" },
    socials: { instagram: "https://instagram.com/selinaydar" },
    availability: [],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-2",
    role: "talent",
    name: "Mert Kavas",
    email: "mert@partner.com",
    password: "partner123",
    phone: "0535 000 00 02",
    category: "DJ",
    basePrice: 120000,
    margin: 30,
    metrics: { musicStyle: "Melodic Techno / Afro House", rider: "Pioneer CDJ-3000 x2, DJM-A9" },
    socials: { instagram: "https://instagram.com/mertkavas" },
    availability: [],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-3",
    role: "talent",
    name: "Deniz Ergün",
    email: "deniz@partner.com",
    password: "partner123",
    phone: "0535 000 00 03",
    category: "Model",
    basePrice: 60000,
    margin: 40,
    metrics: {
      height: "182",
      weight: "74",
      eyeColor: "Yeşil",
      hairColor: "Kahve",
      shoeSize: "43",
    },
    socials: { instagram: "https://instagram.com/denizergun" },
    availability: [],
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "br-1",
    role: "brand",
    name: "Kaan Yücel",
    email: "marka@holding.com",
    password: "marka123",
    phone: "0535 111 11 11",
    company: "Atlas Global Holding",
    basePrice: 0,
    margin: 0,
    metrics: {},
    socials: {},
    availability: [],
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

const initialState: State = {
  accounts: seedAccounts,
  bundles: seedBundles,
  orders: [],
  announcements: seedAnnouncements,
  expenses: seedExpenses,
  session: null,
};

type Ctx = {
  state: State;
  currentAccount: Account | null;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  login: (role: "brand" | "talent", email: string, password: string) => "ok" | "pending" | "fail";
  logout: () => void;
  register: (data: Omit<Account, "id" | "createdAt" | "status">) => Account;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  setStatus: (id: string, status: Status) => void;
  removeAccount: (id: string) => void;
  addBundle: (b: Omit<Bundle, "id">) => void;
  removeBundle: (id: string) => void;
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export const finalPrice = (a: Account) => Math.round(a.basePrice * (1 + a.margin / 100));

export const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })
    .format(n)
    .replace("₺", "₺ ");

export function DegaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => {
    const currentAccount =
      state.session && state.session.role !== "admin"
        ? state.accounts.find((a) => a.id === state.session!.id) ?? null
        : null;

    return {
      state,
      currentAccount,
      isAdmin: state.session?.role === "admin",
      loginAdmin: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          setState((s) => ({ ...s, session: { role: "admin", id: "god" } }));
          return true;
        }
        return false;
      },
      login: (role, email, password) => {
        const acc = state.accounts.find(
          (a) => a.role === role && a.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!acc || acc.password !== password) return "fail";
        if (acc.status !== "active") return "pending";
        setState((s) => ({ ...s, session: { role, id: acc.id } }));
        return "ok";
      },
      logout: () => setState((s) => ({ ...s, session: null })),
      register: (data) => {
        const acc: Account = {
          ...data,
          id: `${data.role}-${Date.now()}`,
          status: data.role === "brand" ? "active" : "pending",
          createdAt: new Date().toISOString(),
        };
        setState((s) => ({
          ...s,
          accounts: [acc, ...s.accounts],
          session: acc.status === "active" ? { role: acc.role, id: acc.id } : s.session,
        }));
        return acc;
      },
      updateAccount: (id, patch) =>
        setState((s) => ({
          ...s,
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      setStatus: (id, status) =>
        setState((s) => ({
          ...s,
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, status } : a)),
        })),
      removeAccount: (id) =>
        setState((s) => ({ ...s, accounts: s.accounts.filter((a) => a.id !== id) })),
      addBundle: (b) => setState((s) => ({ ...s, bundles: [{ ...b, id: `b-${Date.now()}` }, ...s.bundles] })),
      removeBundle: (id) => setState((s) => ({ ...s, bundles: s.bundles.filter((b) => b.id !== id) })),
      addOrder: (o) =>
        setState((s) => ({
          ...s,
          orders: [
            {
              ...o,
              id: `o-${Date.now()}`,
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...s.orders,
          ],
        })),
      updateOrderStatus: (id, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((ord) => (ord.id === id ? { ...ord, status } : ord)),
        })),
      removeOrder: (id) =>
        setState((s) => ({
          ...s,
          orders: s.orders.filter((ord) => ord.id !== id),
        })),
      addAnnouncement: (a) =>
        setState((s) => ({
          ...s,
          announcements: [
            { ...a, id: `a-${Date.now()}`, createdAt: new Date().toISOString() },
            ...s.announcements,
          ],
        })),
      addExpense: (e) => setState((s) => ({ ...s, expenses: [...s.expenses, { ...e, id: `e-${Date.now()}` }] })),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDega() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useDega must be used inside DegaProvider");
  return ctx;
}