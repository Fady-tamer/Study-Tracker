import { useNavigate } from "react-router";
const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen w-full bg-surface-bg flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg bg-white border border-surface-border rounded-2xl p-8 md:p-12 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
        {/* Error Code / Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 mb-6">
          Error 404 • Missing Syllabus
        </span>

        {/* Large Number Accent */}
        <h1 className="text-8xl font-black bg-gradient-to-r from-brand-primary via-indigo-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter mb-2 font-['Outfit']">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-Typography-primary mb-2 font-['Outfit']">
          Page Not Found
        </h2>

        {/* Subtitle / Description */}
        <p className="text-Typography-secondary text-sm md:text-base mb-8 max-w-sm">
          Sorry, we couldn’t find the page or course module you’re looking for.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-surface-border bg-white text-Typography-secondary hover:text-Typography-primary hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs sm:text-sm transition-all shadow-sm shadow-brand-primary/25 cursor-pointer"
          >
            Dashboard Home
          </button>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
