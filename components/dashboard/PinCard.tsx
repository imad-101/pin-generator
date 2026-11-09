"use client";

import { useState } from "react";
import type { PinConfig } from "@/lib/types";
import { getTemplate } from "@/lib/templates";
import { PinFrame } from "@/components/pins/PinFrame";
import { PinRenderer } from "@/components/pins/PinRenderer";
import { Icon } from "./icons";

export function PinCard({
  pin,
  onEdit,
  onShuffle,
  onDownload,
}: {
  pin: PinConfig;
  onEdit: () => void;
  onShuffle: () => void;
  onDownload: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const template = getTemplate(pin.template);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onDownload();
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        <PinFrame>
          <PinRenderer config={pin} />
        </PinFrame>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-3 opacity-0 transition group-hover:opacity-100">
          <div className="pointer-events-auto flex items-center justify-center gap-1.5">
            <ActionButton label="Edit" onClick={onEdit}>
              <Icon.Edit width={16} height={16} />
            </ActionButton>
            <ActionButton label="Swap photo" onClick={onShuffle}>
              <Icon.Shuffle width={16} height={16} />
            </ActionButton>
            <button
              onClick={download}
              disabled={busy}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-3.5 text-xs font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-70"
            >
              {busy ? <Icon.Spinner width={14} height={14} /> : done ? <Icon.Check width={14} height={14} /> : <Icon.Download width={14} height={14} />}
              {busy ? "Rendering" : done ? "Saved" : "Download"}
            </button>
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <div className="truncate text-xs font-semibold text-gray-800">{template?.name ?? pin.template}</div>
        <div className="truncate text-[11px] text-gray-400">{pin.headline}</div>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
    >
      {children}
    </button>
  );
}
