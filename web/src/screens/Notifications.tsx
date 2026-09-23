import { ChevronLeft } from "lucide-react";
import { formatInr } from "../lib/format";
import { TODAY } from "../lib/format";
import { useStore } from "../state/store";

export function NotificationsScreen({
  onBack,
  onOpenTx,
  onPlan,
}: {
  onBack: () => void;
  onOpenTx: (id: string) => void;
  onPlan: () => void;
}) {
  const { state, markNotificationRead } = useStore();
  const hidden = state.hideBalances;
  const money = (amount: number) => (hidden ? "Amount hidden" : formatInr(amount));
  const notes: { id: string; title: string; body: string; go: () => void }[] = [];
  if (state.notifBills) {
    const rent = state.bills.find((bill) => bill.id === "bill-rent");
    if (rent && !rent.paid) {
      notes.push({
        id: "n-rent",
        title: "House rent is in 2 days",
        body: `${money(rent.amount)} · 24 Sep. Already reserved.`,
        go: onPlan,
      });
    }
    for (const bill of state.bills) {
      if (!bill.paid && bill.due < TODAY) {
        notes.push({ id: `n-${bill.id}`, title: `${bill.name} is overdue`, body: money(bill.amount), go: onPlan });
      }
    }
  }
  if (state.notifAttention) {
    for (const tx of state.transactions) {
      if (tx.included && tx.needsConfirm) {
        notes.push({
          id: `n-${tx.id}`,
          title: "Please confirm a payment",
          body: `${tx.title} · ${money(tx.amount)}`,
          go: () => onOpenTx(tx.id),
        });
      }
    }
  }
  if (state.notifInsights) {
    notes.push({
      id: "n-sip",
      title: "SIP went through",
      body: hidden ? "Nippon India Nifty 50 · 5 Sep" : "Nippon India Nifty 50 · ₹10,000 on 5 Sep",
      go: () => onOpenTx("tx-sip-nifty"),
    });
  }

  return (
    <div>
      <div className="backbar">
        <button type="button" aria-label="Back" onClick={onBack}>
          <ChevronLeft />
        </button>
        <strong>Notifications</strong>
      </div>
      {notes.length === 0 ? (
        <p className="empty">Nothing new. Quiet hours keep the rest for the morning.</p>
      ) : (
        <div className="card">
          {notes.map((note) => {
            const read = state.readNotificationIds.includes(note.id);
            return (
              <button
                key={note.id}
                type="button"
                className="row"
                onClick={() => {
                  markNotificationRead(note.id);
                  note.go();
                }}
              >
                <span className="copy">
                  <strong style={{ opacity: read ? 0.6 : 1 }}>{note.title}</strong>
                  <small>{note.body}</small>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
