import { Suspense, lazy, useEffect, useState } from "react";

const CyberBackground = lazy(() => import("./CyberBackground"));

export function BackgroundLayer({ intensity = 1 }: { intensity?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-20 bg-background" />
      {mounted ? (
        <Suspense fallback={null}>
          <CyberBackground intensity={intensity} />
        </Suspense>
      ) : null}
    </>
  );
}