import { useNavigate } from "react-router";
const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-surface-bg flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-surface-panel border border-surface-border rounded-2xl p-8 md:p-10 shadow-sm flex flex-col items-center text-center">
        {/* Error Code / Badge */}
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-phase-focus/10 text-phase-focus mb-4">
          Error 404
        </span>

        {/* Large Number Accent */}
        <h1 className="text-7xl font-extrabold text-brand-primary tracking-tight mb-2">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-Typography-primary mb-2">
          Page Not Found
        </h2>

        {/* Subtitle / Description */}
        <p className="text-Typography-secondary text-sm md:text-base mb-8 max-w-sm">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved or doesn’t exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-surface-border text-Typography-secondary hover:text-Typography-primary hover:bg-surface-bg font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-brand-light hover:bg-brand-primary text-white font-medium text-sm transition-all duration-200 shadow-sm cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
