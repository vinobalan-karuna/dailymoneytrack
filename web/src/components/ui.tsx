import type { ReactNode } from "react";
import { X } from "lucide-react";
import { formatInr } from "../lib/format";
import { useStore } from "../state/store";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Money({
  value,
  sign,
  tone,
  className,
}: {
  value: number;
  sign?: boolean;
  tone?: "in" | "out" | "attention";
  className?: string;
}) {
  const { state } = useStore();
  const hidden = state.hideBalances;
  const colored =
    !hidden && ((tone === "in" && value > 0) || tone === "out" || tone === "attention");
  return (
    <span className={cx("num", colored && tone, className)}>
      {formatInr(value, { sign, hidden })}
    </span>
  );
}

export function Progress({ value, tone }: { value: number; tone?: "teal" | "in" }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("progress", tone)} aria-hidden>
      <span style={{ width: `${width}%` }} />
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="sheet-back" role="presentation" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close sheet" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button type="button" className={cx("toggle", on && "on")} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}
