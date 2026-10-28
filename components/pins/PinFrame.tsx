"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PIN_WIDTH, PIN_HEIGHT } from "@/lib/types";

/** Scales a native-size pin to fit the width of its container (keeps the 2:3 ratio). */
export function PinFrame({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PIN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: "100%", aspectRatio: `${PIN_WIDTH} / ${PIN_HEIGHT}`, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          width: PIN_WIDTH,
          height: PIN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
