const styles = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-300",
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  Screening: "bg-amber-50 text-amber-700 ring-amber-200",
  Interview: "bg-violet-50 text-violet-700 ring-violet-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Hired: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[value] || styles.OPEN}`}>
      {value}
    </span>
  );
}
