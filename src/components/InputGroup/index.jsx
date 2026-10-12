import { ErrorMessage, Field } from "formik";
import { BiErrorCircle } from "react-icons/bi";

const InputGroup = ({ name, type = "text", placeholder, label, error }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={name} className="text-xs font-bold text-Typography-secondary capitalize">
          {label}
        </label>
      )}
      <Field
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        className={`w-full rounded-xl px-4 py-3 text-sm text-Typography-primary transition-all placeholder-Typography-muted focus:outline-none ${
          error
            ? "border border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            : "border border-surface-border bg-slate-50/80 hover:border-slate-300 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-xs"
        }`}
      />
      <ErrorMessage name={name}>
        {(msg) => (
          <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-rose-500 animate-in fade-in duration-150">
            <BiErrorCircle className="text-sm shrink-0" />
            <span>{msg}</span>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default InputGroup;
