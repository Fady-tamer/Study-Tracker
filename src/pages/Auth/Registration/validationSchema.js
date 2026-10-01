import * as yup from "yup";

const validationSchema = yup.object().shape({
  userName: yup
    .string()
    .min(3, "username must be at least 3 chars")
    .required("username is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

export default validationSchema;
