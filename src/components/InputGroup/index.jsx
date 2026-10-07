import { ErrorMessage, Field } from "formik";

const InputGroup = ({ name, placeholder, error }) => {
  return (
    <div className="flex flex-col gap-2">
      <Field
        name={name}
        placeholder={placeholder}
        type={name.toLowerCase().includes("password") ? "password" : "text"}
        className={`w-full rounded-xl p-3 px-4 text-Typography-primary transition-all placeholder-white/30 focus:outline-none focus:ring-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
                      ${error ? "bg-phase-focus/10 border border-phase-focus/50 focus:ring-phase-focus backdrop-blur-md" : "bg-gray-300 backdrop-blur-md border border-surface-border focus:bg-white/10 focus:border-white/20 focus:ring-brand-primary/50"}`}
      />
      <div className="px-4 text-phase-focus text-sm font-medium">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};

export default InputGroup;
