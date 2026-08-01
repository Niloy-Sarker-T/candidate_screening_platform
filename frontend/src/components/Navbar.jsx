import { BriefcaseBusiness, ClipboardList, LayoutDashboard, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-brand"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-white">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Candidate Screening
            </p>
            <p className="text-lg font-bold text-ink">Hiring Workspace</p>
          </div>
        </NavLink>
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/" className={linkClass}>
            <Search className="h-4 w-4" />
            Open Jobs
          </NavLink>
          <NavLink to="/track" className={linkClass}>
            <ClipboardList className="h-4 w-4" />
            Track
          </NavLink>
          <NavLink to="/recruiter" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Recruiter
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
