import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

// components
import InputGroup from "../../../components/InputGroup";

// supabase
import { supabase } from "../../../supabaseClient";

// validationSchema
import validationSchema from "./validationSchema";

const RegistrationPage = () => {
  const navigateTo = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = async (values, actions) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          data: {
            display_name: values.username.trim(),
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.session) {
        toast.success("Account created successfully!");
        navigateTo("/home");
      } else {
        toast.success(
          "Registration successful! Please check your email to confirm your account.",
        );
        navigateTo("/");
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
          Create Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
          Join Study Tracker to track your courses and deadlines
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ errors, touched, isSubmitting, isValid, dirty }) => {
          const isButtonDisabled = isSubmitting || !dirty || !isValid;

          return (
            <Form className="flex flex-col gap-4">
              <InputGroup
                name="username"
                label="Full Name or Username"
                placeholder="Alex Johnson"
                error={touched.username && errors.username}
              />

              <InputGroup
                name="email"
                type="email"
                label="Email Address"
                placeholder="alex@example.com"
                error={touched.email && errors.email}
              />

              <InputGroup
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                error={touched.password && errors.password}
              />

              <InputGroup
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                error={touched.confirmPassword && errors.confirmPassword}
              />

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full py-3.5 px-4 mt-2 rounded-xl text-sm font-bold transition-all ${
                  isButtonDisabled
                    ? "text-slate-400 bg-slate-100 cursor-not-allowed opacity-70"
                    : "text-white bg-brand-primary hover:bg-brand-dark cursor-pointer shadow-sm shadow-brand-primary/25 active:scale-98"
                }`}
              >
                {isSubmitting ? "Creating Account..." : "Create Free Account"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-Typography-secondary">
                <span>Already have an account?</span>
                <Link
                  to="/"
                  className="font-bold text-brand-primary hover:text-brand-dark transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RegistrationPage;
