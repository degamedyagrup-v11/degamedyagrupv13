import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { BackgroundLayer } from "./BackgroundLayer";
import { Button } from "./ui/button";
import { useDega } from "@/lib/dega-store";

export function Brandmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-[0.18em] text-imperial">
          DEGA
        </span>
        {!compact && (
          <span className="block text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Medya Grup
          </span>
        )}
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { logout } = useDega();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <BackgroundLayer intensity={0.35} />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4">
          <Brandmark />
          <div className="flex items-center gap-2">
            {actions}
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut /> Çıkış
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-5xl">
            <span className="text-imperial">{title}</span>
          </h1>
          {subtitle && <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}