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
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const navigateTo = useNavigate();

  const handleRegister = async (values, actions) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.userName,
          },
        },
      });

      if (error) {
        toast.error(`${error.message}`);
        return;
      }

      toast.success("Registration successful!");
      navigateTo("/login");
    } catch (err) {
      toast.error("Unexpected error:", err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4 p-8 rounded-3xl text-Typography-primary border border-surface-border bg-surface-bg shadow-2xl">
      {/* header */}
      <div className="my-2 mb-8">
        <h1 className="text-center text-4xl font-bold tracking-tight">
          Create Account
        </h1>
      </div>

      {/* Registration form */}
      <div className="my-2 mt-6">
        <Formik
          onSubmit={handleRegister}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {/* Properly destructured Formik props */}
          {({ errors, isSubmitting, isValid, dirty }) => {
            return (
              <Form className="flex flex-col gap-5">
                <InputGroup
                  name="userName"
                  placeholder="Username"
                  error={errors.userName}
                />

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

                <InputGroup
                  name="confirmPassword"
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                />

                {/* submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className={`w-full p-4 mt-2 rounded-xl font-bold transition-all ${
                    isSubmitting || !(isValid && dirty)
                      ? "text-Typography-muted bg-surface-border cursor-not-allowed opacity-50"
                      : "text-white bg-brand-light hover:bg-opacity-90 cursor-pointer shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                {/* footer */}
                <div className="flex justify-center gap-1 text-Typography-primary font-semibold mt-4">
                  <p>Already have an account |</p>
                  <Link
                    to={"/"}
                    className="text-brand-primary hover:text-brand-light transition-colors underline"
                  >
                    Login
                  </Link>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationPage;
