export default function Alert({ type = "info", children }) {
  if (!children) return null;

  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}
