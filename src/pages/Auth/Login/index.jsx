import { useContext } from "react";
import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

// components
import InputGroup from "../../../components/inputGroup";

// supabase
import { supabase } from "../../../supabaseClient";

// validationSchema
import validationSchema from "./validationSchema";

// context
import { mainStore } from "../../../context/MainContext";

const LoginPage = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const {} = useContext(mainStore);

  const navigateTo = useNavigate();

  const handleLogin = async (values, actions) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(`Invalid email or password`);
        return;
      }

      toast.success("login successful!");
      navigateTo("/home");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4 p-8 rounded-3xl text-Typography-primary border border-surface-border bg-surface-panel shadow-2xl">
      {/* header */}
      <div className="my-2 mb-8">
        <h1 className="text-center text-4xl font-bold tracking-tight">
          Welcome Back
        </h1>
      </div>

      {/* logging form */}
      <div className="my-2 mt-6">
        <Formik
          onSubmit={handleLogin}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ errors, isSubmitting, isValid, dirty }) => {
            return (
              <Form className="flex flex-col gap-5">
                <InputGroup
                  name="email"
                  placeholder="Email Address"
                  error={errors.email}
                />

                <InputGroup
                  name="password"
                  placeholder="••••••••"
                  error={errors.password}
                />

                {/* submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className={`w-full p-4 mt-2 rounded-xl font-bold text-white transition-all ${
                    isSubmitting || !(isValid && dirty)
                      ? "bg-surface-border cursor-not-allowed opacity-50"
                      : "bg-phase-break hover:bg-opacity-90 cursor-pointer shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                {/* footer */}
                <p className="text-center text-Typography-primary text-sm font-medium mt-4">
                  don't have an account? |{" "}
                  <Link
                    to={"/registration"}
                    className="text-brand-primary hover:text-brand-light transition-colors underline"
                  >
                    SignUp
                  </Link>
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
