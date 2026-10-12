import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

// components
import InputGroup from "../../../components/InputGroup";

// supabase
import { supabase } from "../../../supabaseClient";

// validationSchema
import validationSchema from "./validationSchema";

const LoginPage = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const navigateTo = useNavigate();

  const handleLogin = async (values, actions) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful!");
      navigateTo("/home");
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
          Welcome Back
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <Formik
        onSubmit={handleLogin}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting, isValid, dirty }) => (
          <Form className="flex flex-col gap-4">
            <InputGroup
              name="email"
              type="email"
              label="Email Address"
              placeholder="student@example.com"
              error={touched.email && errors.email}
            />

            <InputGroup
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              error={touched.password && errors.password}
            />

            <button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className={`w-full py-3.5 px-4 mt-2 rounded-xl text-sm font-bold transition-all ${
                isSubmitting || !(isValid && dirty)
                  ? "text-slate-400 bg-slate-100 cursor-not-allowed opacity-70"
                  : "text-white bg-brand-primary hover:bg-brand-dark cursor-pointer shadow-sm shadow-brand-primary/25 active:scale-98"
              }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In to Dashboard"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-Typography-secondary">
              <span>Don't have an account?</span>
              <Link
                to="/registration"
                className="font-bold text-brand-primary hover:text-brand-dark transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
