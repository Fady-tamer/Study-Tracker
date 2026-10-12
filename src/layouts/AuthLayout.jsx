import { Outlet } from "react-router";
import { MdSchool } from "react-icons/md";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 bg-surface-bg selection:bg-brand-primary selection:text-white overflow-hidden">
      {/* Ambient background glow shapes */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Brand Header */}
      <div className="relative z-10 mb-6 flex items-center gap-2.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary via-brand-light to-indigo-400 text-white shadow-md shadow-brand-primary/25">
          <MdSchool className="text-2xl" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
          Study<span className="text-brand-primary">Tracker</span>
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>

      <footer className="relative z-10 mt-8 text-center text-xs text-Typography-muted">
        © {new Date().getFullYear()} Study Tracker. Elevating student success.
      </footer>
    </div>
  );
};

export default AuthLayout;
